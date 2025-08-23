const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Default error response
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle specific error types
  if (err.message.includes('Validation error')) {
    statusCode = 400;
    message = err.message;
  } else if (err.message.includes('Invalid token') || err.message.includes('No token provided')) {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.message.includes('Not found')) {
    statusCode = 404;
    message = err.message;
  } else if (err.message.includes('Forbidden')) {
    statusCode = 403;
    message = err.message;
  } else if (err.message.includes('already exists')) {
    statusCode = 409;
    message = err.message;
  }

  // Prisma specific errors
  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Resource already exists';
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Resource not found';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;