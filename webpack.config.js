var webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/js/index.js',
        vendor: ['phaser', 'plugins/Juicy']
    },
    output: {
        path: './dist',
        filename: 'bundle.js'
    },
    resolve: {
        alias: {
            phaser: __dirname + '/node_modules/phaser/build/phaser.min.js',
            'plugins/Juicy': __dirname + '/src/vendor/plugins/Juicy.js'
        }
    },
    module: {
        preLoaders: [
            { test: /\.min\.js$/, loader: 'source-map-loader' }
        ],
        loaders: [
            { test: /phaser(\.min)?\.js$/, loader: 'exports?Phaser!script' },
            { test: /\.(png|jpg)$/, loader: 'url?limit=2048' },
            { test: /\.(ogg|mp3)$/, loader: 'file' },
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'file' }
        ]
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(true),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
        new (require('html-webpack-plugin'))({
            title: 'Starship Clicker'
        })
    ]
};
