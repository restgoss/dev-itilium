const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://itilium-web.inex-d.local',
            changeOrigin: true,
        })
    );
};