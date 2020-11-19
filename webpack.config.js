const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    entry: {
        app: path.join(__dirname, 'main.js')
    },
    output: {
        filename: '[name]'.js,
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
              test: /\.vue$/,
              use: 'vue-loader'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
}