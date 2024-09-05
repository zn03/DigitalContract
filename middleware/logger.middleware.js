const { logger } = require('../config/logger');

/**
 * winston logger middelware
 */
const resDotJsonInterceptor = (res, send) => (content) => {
    res.contentBody = content;
    res.json = send;
    res.json(content);
};

module.exports.loggerMiddleware = (req, res, next) => {
    res.json = resDotJsonInterceptor(res, res.json);
    res.on('finish', () => {
        logger.info(`${req.method} ${req.path} ${res.statusCode} ${req.ip}`);
        if (req.headers.Authorization) {
            logger.info(`API Start with authorization`)
        }
        if (req.query) {
            logger.info(`Query: ${JSON.stringify(req.query)}`)
        }
        if (req.body) {
            logger.info(`Body: ${JSON.stringify(req.body)}`)
        }
        if (req.params) {
            logger.info(`Param: ${JSON.stringify(req.params)}`)
        }
        logger.info(`Response Body: ${JSON.stringify(res.contentBody)}`);
    });
    next();
}