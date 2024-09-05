// Loading Express
const express = require('express');
const app = express();
const cors = require('cors');
const client = require('prom-client');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const swaggerFilePath = path.join(__dirname, 'swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8'));

// Create a Registry which registers the metrics
const register = new client.Registry();

// create Error handle
const createError = require('http-errors');

const { generateResponse } = require('./config/generateResponse');
const { logger } = require('./config/logger');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { loggerMiddleware } = require('./middleware/logger.middleware');
app.use(loggerMiddleware);

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use('/api', require('./routes/index'));

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  logger.error(err.message);
  // render the error page
  res.status(err.status || 500);
  if (err.status === 401)
    return res.json(
      generateResponse(400, null, 'Người dùng không được xác thực', {})
    );
  else if (err.status === 404)
    return res.json(generateResponse(404, null, 'API không tồn tại', {}));
  else
    return res.json(
      generateResponse(
        500,
        null,
        'Lỗi không xác định. Vui lòng kiểm tra lại hệ thống',
        {}
      )
    );
});

logger.info(`Server start at port: ${process.env.PORT}`);

module.exports = app;
