const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');
const conf = require('./next.config');
const http = require('http')
//!==============================
require('dotenv').config();
const mongoose = require('mongoose');
//const server = require('../api/app');
//!=========================

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT, 10) || 7000;

const app = next({ dev });
const handler = app.getRequestHandler();

const devProxy = {
    '/api': {
      target: 'http://localhost:3000',
      pathRewrite: { '^/api': '/' },
      changeOrigin: true,
    },
}


app.prepare().then(() => {
  const server = express();

  if (dev) {
    server.use('/api', createProxyMiddleware(devProxy['/api']));
  }
  
  server.use('/images',express.static('../api/images'));

  server.all('*', (req, res) => handler(req, res))
  
  mongoose.connect(process.env.DATABASE_URL, {useUnifiedTopology: true,useNewUrlParser: true  }).then(()=>{
    server.listen(7000,()=>{
        console.log(`🚀connection successed, Server running at http://localhost:${7000}/`);
    })
  }).catch(err=>{
    console.log('Error while connecting to database:',err)
    //process.exit(1);
  })

})