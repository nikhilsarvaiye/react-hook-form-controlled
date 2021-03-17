const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackBar = require('webpackbar');
const CracoAlias = require('craco-alias');
const resolveUrlLoader = require('craco-resolve-url-loader');

// Don't open the browser during development
// process.env.BROWSER = "none";

module.exports = {
    webpack: {
        plugins: [
            new WebpackBar({ profile: true }),
            ...(process.env.NODE_ENV === 'development'
                ? [new BundleAnalyzerPlugin({ openAnalyzer: false })]
                : []),
        ],
    },
    plugins: [
        {
            plugin: CracoAlias,
            options: {
                debug: false,
                source: 'tsconfig',
                // baseUrl SHOULD be specified
                // plugin does not take it from tsconfig
                baseUrl: './src',
                // tsConfigPath should point to the file where "baseUrl" and "paths" are specified
                tsConfigPath: './tsconfig.extend.json',
            },
        },
        { plugin: resolveUrlLoader },
    ],
};
