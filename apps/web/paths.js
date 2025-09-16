const path = require('path');

const extraNodeModules = {
  '@': path.resolve(__dirname, '.'),
  '@/components': path.resolve(__dirname, 'components'),
  '@/lib': path.resolve(__dirname, 'lib'),
  '@/contexts': path.resolve(__dirname, 'contexts'),
  '@/types': path.resolve(__dirname, 'types'),
};

const watchFolders = [
  path.resolve(__dirname, '..', '..', 'node_modules'),
  ...Object.values(extraNodeModules),
];

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    extraNodeModules,
  },
  watchFolders,
};
