const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    overrides: [
      {
        files: ['*.tsx', '*.jsx'], // uniquement pour les fichiers JSX/TSX
        rules: {
          'jsx-quotes': 'off', // ignore les ' dans JSX
        },
      },
    ],
  },
]);
