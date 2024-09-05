const generateResponse = (status, data, message = '', error = {}) => {
  return {
    status: status,
    data: data,
    message: message,
    errors: error,
    dateLoad: new Date().toISOString()
  };
};

module.exports = {
  generateResponse
};
