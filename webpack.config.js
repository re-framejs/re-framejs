var path = require('path');

module.exports = {
    entry: {
        //main: 'myapp.js',
        //perf: 'perf.js',
        reframe: 'reframe/core.js'
    },
    output: {
        path: path.resolve('dist/'),
        publicPath: '/js/',
        filename: "[name].js",
        library: ['reframe'],
        libraryTarget: 'umd'
    },
    externals: {
        immutable: 'Immutable',
        react: 'React',
        rx: 'Rx'
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