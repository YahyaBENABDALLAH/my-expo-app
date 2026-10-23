const { resolveBrand } = require('./config/brand');
const assets = require('./config/brand-assets.json');

module.exports = ({ config }) => {
  const { brand, variant } = resolveBrand();
  const headingFont = assets.headingFonts[brand.presentation.headingFont];
  const androidMapsApiKey = process.env.GOOGLE_MAPS_ANDROID_API_KEY?.trim();

  return {
    ...config,
    name: brand.name,
    slug: brand.slug,
    scheme: brand.scheme,
    icon: brand.icon,
    owner: brand.eas?.owner,
    ios: {
      ...config.ios,
      icon: brand.icon,
      bundleIdentifier: brand.ios.bundleIdentifier,
    },
    android: {
      ...config.android,
      icon: brand.icon,
      package: brand.android.package,
      adaptiveIcon: brand.android.adaptiveIcon,
      googleServicesFile: brand.android.googleServicesFile,
    },
    extra: {
      ...config.extra,
      eas: brand.eas ? { projectId: brand.eas.projectId } : undefined,
      brand: { id: brand.id, name: brand.name, variant, presentation: brand.presentation },
    },
    plugins: [
      ...(config.plugins ?? []),
      ['expo-font', { fonts: headingFont.file ? [headingFont.file] : [] }],
      [
        'expo-splash-screen',
        {
          image: brand.splash.image,
          backgroundColor: brand.splash.backgroundColor,
          dark: { backgroundColor: brand.splash.darkBackgroundColor },
          imageWidth: 200,
          resizeMode: 'contain',
        },
      ],
      ...(androidMapsApiKey
        ? [['react-native-maps', { androidGoogleMapsApiKey: androidMapsApiKey }]]
        : []),
    ],
  };
};
