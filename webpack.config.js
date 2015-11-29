var path = require('path');

module.exports = {
    entry: {
        main: 'myapp.js',
        perf: 'perf.js',
        reframe: 'reframe/core.js'
    },
    output: {
        path: path.resolve('target'),
        publicPath: '/js/',
        filename: "[name].bundle.js"
    },
    resolve: {
        root: [
            path.resolve(),
            path.resolve('src/main/js')
        ]
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                //include: [
                //    path.resolve('src/main/js')
                //],
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    devServer: {
        contentBase: path.resolve('src/main/webapp')
    },
    devtool: 'source-map'
};