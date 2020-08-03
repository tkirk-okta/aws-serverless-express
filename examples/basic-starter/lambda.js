'use strict'
const awsServerlessExpress = require('aws-serverless-express')
const appIn = require('./app')
const app = appIn.app
const router = appIn.router
const { ExpressOIDC } = require('@okta/oidc-middleware')

const oidc = new ExpressOIDC({
  issuer: 'https://tkirk.oktapreview.com/oauth2/auslkqbnk1Xqo73k70h7',
  client_id: '0oat1a9r3wQwljjLe0h7',
  client_secret: 'vQ7Pkoji5ok2xPj4Wh7t2HDUXKSkEVAVtg4IZkKP',
  appBaseUrl: 'https://kd4prg3ab7.execute-api.us-east-1.amazonaws.com/prod',
  scope: 'openid profile',
  loginRedirectUri: "https://kd4prg3ab7.execute-api.us-east-1.amazonaws.com/prod/authorization-code/callback",
  routes: {
    loginCallback: {
      afterCallback: '/prod/protected'
    }
  },
});



const ensureAuthenticated = oidc.ensureAuthenticated('/prod/protected')
router.get('/protected', ensureAuthenticated, (req, res) => {
  res.send('Top Secret');
});

app.use('/', router)
app.use(oidc.router)

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below, then redeploy (`npm run package-deploy`)
const binaryMimeTypes = [
  'application/javascript',
  'application/json',
  'application/octet-stream',
  'application/xml',
  'font/eot',
  'font/opentype',
  'font/otf',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'text/comma-separated-values',
  'text/css',
  'text/html',
  'text/javascript',
  'text/plain',
  'text/text',
  'text/xml'
]
const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes)

exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context)
