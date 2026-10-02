import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const sourceDirectories = [
  "app",
  "components",
  "constants",
  "context",
  "features",
  "guards",
  "hooks",
  "lib",
  "resolvers",
  "services",
  "types",
];
const extensions = [".ts", ".tsx"];

function collectFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectFiles(target);
    return extensions.includes(path.extname(entry.name)) ? [target] : [];
  });
}

const files = sourceDirectories.flatMap((directory) =>
  collectFiles(path.join(root, directory)),
);
const fileSet = new Set(files.map((file) => path.normalize(file)));

function resolveImport(fromFile, specifier) {
  if (!specifier.startsWith("@/") && !specifier.startsWith(".")) return null;
  const base = specifier.startsWith("@/")
    ? path.join(root, specifier.slice(2))
    : path.resolve(path.dirname(fromFile), specifier);
  const candidates = [
    ...extensions.map((extension) => `${base}${extension}`),
    ...extensions.map((extension) => path.join(base, `index${extension}`)),
  ];
  return candidates.find((candidate) => fileSet.has(path.normalize(candidate))) ?? null;
}

const graph = new Map(
  files.map((file) => {
    const content = fs
      .readFileSync(file, "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    const specifiers = [
      ...content.matchAll(/\bfrom\s+["']([^"']+)["']/g),
      ...content.matchAll(/\bimport\s+["']([^"']+)["']/g),
    ].map((match) => match[1]);
    return [file, specifiers.map((specifier) => resolveImport(file, specifier)).filter(Boolean)];
  }),
);

const visiting = new Set();
const visited = new Set();
const stack = [];
const cycles = [];

function visit(file) {
  if (visiting.has(file)) {
    const cycleStart = stack.indexOf(file);
    cycles.push([...stack.slice(cycleStart), file]);
    return;
  }
  if (visited.has(file)) return;

  visiting.add(file);
  stack.push(file);
  for (const dependency of graph.get(file) ?? []) visit(dependency);
  stack.pop();
  visiting.delete(file);
  visited.add(file);
}

for (const file of files) visit(file);

if (cycles.length > 0) {
  for (const cycle of cycles) {
    console.error(cycle.map((file) => path.relative(root, file)).join(" -> "));
  }
  process.exitCode = 1;
} else {
  console.log(`No local import cycles found across ${files.length} source files.`);
}
