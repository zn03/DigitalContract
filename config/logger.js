const winston = require('winston');

const level = process.env.NODE_ENV == 'production' ? 'info' : 'silly';

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms Z' }),

    winston.format.printf(
        (info) =>
            `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}`
    )
);

const transports = [
    new (winston.transports.Console)()
];

const Logger = winston.createLogger({
    level: level,
    format,
    transports,
});

module.exports.logger = Logger;