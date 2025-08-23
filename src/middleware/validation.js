const { validateInput } = require('../utils/validation');

const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = validateInput(schema, req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  validateRequest,
};