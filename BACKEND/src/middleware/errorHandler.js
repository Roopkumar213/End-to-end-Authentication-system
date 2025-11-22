// errorHandler.js
// Optional reusable error formatting middleware

module.exports = (err, req, res, next) => {
  console.error('ERROR:', err);

  const status = err.status || 500;

  const body = {
    error: err.message || 'Internal Server Error',
  };

  if (process.env.NODE_ENV !== 'production') {
    body.stack = err.stack;
  }

  return res.status(status).json(body);
};
