const withLess = require('next-with-less');
const lessToJS = require('less-vars-to-js');
const cloneDeep = require("clone-deep");

const withImages = require('next-images')
const fs =require('fs')
const path = require('path');
const { readFileSync, existsSync } = require('fs');

const withPlugins = require('next-compose-plugins');
const isProd = process.env.NODE_ENV === "production";

// fix: prevents error when .less files are required by node
if (typeof require !== "undefined") {
  require.extensions[".less"] = (file) => {};
}

const Images = withImages({
  //exclude: path.resolve(__dirname, 'src/assets/images'),
  webpack(config, options) {
    return config
  }
})

const themeVariables = lessToJS(
  fs.readFileSync(
    path.resolve(__dirname, './src/styles/antd.less'),
    'utf8'
  )
);

const WithLess =withLess({
  lessLoaderOptions: {
  },
  cssLoaderOptions: {
    importLoaders: 3,
    localIdentName: '[local]___[hash:base64:5]'
  },
  
})


const nextConfig = {
  api: {
    externalResolver: true,
  },
  staticPageGenerationTimeout: 90,
}

module.exports = withPlugins( 
  [
    Images,
    WithLess,
  ],
  nextConfig,
);

