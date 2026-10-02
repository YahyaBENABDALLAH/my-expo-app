const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('lottie');

module.exports = withStorybook(config, { enabled: process.env.NODE_ENV !== 'production' });
