const Joi = require('joi');

// User validation schemas
const userRegistrationSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().max(255).required(),
  password: Joi.string().min(6).max(255).required(),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Note validation schemas
const noteCreateSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  content: Joi.string().allow('').optional(),
});

const noteUpdateSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  content: Joi.string().allow('').optional(),
}).min(1); // At least one field must be provided

// Validation helper function
const validateInput = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    throw new Error(`Validation error: ${errorMessages.join(', ')}`);
  }
  return value;
};

module.exports = {
  userRegistrationSchema,
  userLoginSchema,
  noteCreateSchema,
  noteUpdateSchema,
  validateInput,
};