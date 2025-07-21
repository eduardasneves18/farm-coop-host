const NextFederationPlugin = require('@module-federation/nextjs-mf');

module.exports = {
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'about',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './AboutComponent': './components/AboutComponent.tsx',
        },
        // shared: ['react', 'react-dom', 'next'],
         shared: {
          react: {
            singleton: true,
            requiredVersion: false,
            eager: true,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: false,
            eager: true,
          },
          next: {
            singleton: true,
            requiredVersion: false,
            eager: true,
          },
        },
        extraOptions: {
          exposePages: true,
        },
      }),
    );

    return config;
  },
};
