const withLess = require('next-with-less');
const withImages = require('next-images')

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


const WithLess =withLess({
  lessLoaderOptions: {
  },
  cssLoaderOptions: {
    importLoaders: 3,
    localIdentName: '[local]___[hash:base64:5]'
  },
  
})


const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://greetingslamp-api.herokuapp.com/:path*',
      },
    ]
  },
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

