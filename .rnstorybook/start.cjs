const { spawnSync } = require('node:child_process');

// Cross-platform opt-in; keep the ordinary app start and release exports independent.
const result = spawnSync(
  process.execPath,
  [require.resolve('expo/bin/cli'), 'start', '--dev-client', '--clear', ...process.argv.slice(2)],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'development',
      EXPO_PUBLIC_ENABLE_DEV_SCREENS: 'true',
      EXPO_PUBLIC_STORYBOOK_ENABLED: 'true',
    },
  },
);

if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
