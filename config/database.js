require('dotenv').config();

module.exports = {
  'development': {
      'username': process.env.DB_DEV_USERNAME,
      'password': process.env.DB_DEV_PASSWORD,
      'database': process.env.DB_DEV_DATABASE,
      'host': process.env.DB_DEV_HOST,
      'dialect': 'mysql'
  },
  'test': {
      'username': process.env.DB_TEST_USERNAME,
      'password': process.env.DB_TEST_PASSWORD,
      'database': process.env.DB_TEST_DATABASE,
      'host': process.env.DB_TEST_HOST,
      'dialect': 'mysql'
  },
  'production': {
      'username': process.env.DB_PROD_USERNAME,
      'password': process.env.DB_PROD_PASSWORD,
      'database': process.env.DB_PROD_DATABASE,
      'host': process.env.DB_PROD_HOST,
      'dialect': 'mysql'
  }
};