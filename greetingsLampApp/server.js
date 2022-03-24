const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');
const conf = require('./next.config');
const { ironSession,withIronSession } = require("next-iron-session");
//!==============================
require('dotenv').config();
//!=========================

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 7000;
console.log('port:',port);
console.log('process.env.POR:',process.env.PORT);
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
    server.use('/api',createProxyMiddleware(devProxy['/api']));
  }

  server.use('/images',express.static('../api/images'));
  server.all('*',(req,res)=> handler(req, res))

  server.listen(process.env.PORT,()=>{
    console.log(`🚀connection successed, Server running at http://localhost:${process.env.PORT}/`);
  })

})