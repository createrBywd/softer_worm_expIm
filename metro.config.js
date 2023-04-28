// Learn more https://docs.expo.io/guides/customizing-metro
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig(__dirname);

  return {
    resolver: {
      // 配置路径别名
      alias: {
        '~': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@assets': path.resolve(__dirname, 'assets'),
      },
      // 配置文件后缀名
      sourceExts: [...sourceExts, 'jsx', 'tsx'],
      assetExts: [...assetExts, 'db', 'bin'],
    },
  };
})();
