interface InitialsAvatarOptions {
  background?: string;
  bold?: boolean;
  color?: string;
}

function normalizeHexColor(color: string) {
  return color.trim().replace(/^#/, "");
}

export function getInitialsAvatarUrl(
  name: string | null | undefined,
  {
    background = "006fee",
    bold = true,
    color = "fff",
  }: InitialsAvatarOptions = {},
) {
  const normalizedName = name?.trim();

  if (!normalizedName) {
    return null;
  }

  const params = [
    `name=${encodeURIComponent(normalizedName)}`,
    `background=${encodeURIComponent(normalizeHexColor(background))}`,
    `color=${encodeURIComponent(normalizeHexColor(color))}`,
    `bold=${String(bold)}`,
  ];

  return `https://ui-avatars.com/api/?${params.join("&")}`;
}
