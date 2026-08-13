const path = require('path');

module.exports = {
  packagerConfig: {
    name: 'Inner Margins',
    executableName: 'Inner Margins',
    appBundleId: 'com.innermargins.app',
    icon: path.join(__dirname, 'public', 'icon'), // forge adds .icns for mac automatically
    ignore: (file) => {
      if (file === '') return false; // Include the root
      if (file === '/package.json') return false;
      if (file.startsWith('/.next')) {
        if (file === '/.next' || file.startsWith('/.next/standalone')) return false;
        return true;
      }
      if (file.startsWith('/.electron-build')) return false;
      return true; // Ignore everything else
    }
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      config: {
        format: 'ULFO'
      }
    }
  ],
};
