const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackBar = require('webpackbar');
const CracoAntDesignPlugin = require('craco-antd');
const CracoAlias = require('craco-alias');
const sassResourcesLoader = require('craco-sass-resources-loader');
const resolveUrlLoader = require('craco-resolve-url-loader');
const path = require('path');

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
        {
            plugin: sassResourcesLoader,
            options: {
                resources: ['./src/styles/_variables.scss'],
            },
        },
    ],
};
