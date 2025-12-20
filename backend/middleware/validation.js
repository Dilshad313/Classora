import Joi from 'joi';

const instituteProfileValidation = Joi.object({
  instituteName: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Institute name is required',
      'string.min': 'Institute name must be at least 2 characters long',
      'string.max': 'Institute name cannot exceed 200 characters',
      'any.required': 'Institute name is required'
    }),

  tagline: Joi.string()
    .trim()
    .min(5)
    .max(500)
    .required()
    .messages({
      'string.empty': 'Tagline is required',
      'string.min': 'Tagline must be at least 5 characters long',
      'string.max': 'Tagline cannot exceed 500 characters',
      'any.required': 'Tagline is required'
    }),

  phone: Joi.string()
    .trim()
    .min(5)
    .max(20)
    .pattern(/^[\+]?[0-9\s\-\(\)]{5,20}$/)
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.min': 'Phone number must be at least 5 characters long',
      'string.max': 'Phone number cannot exceed 20 characters',
      'string.pattern.base': 'Please enter a valid phone number',
      'any.required': 'Phone number is required'
    }),

  address: Joi.string()
    .trim()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.empty': 'Address is required',
      'string.min': 'Address must be at least 10 characters long',
      'string.max': 'Address cannot exceed 1000 characters',
      'any.required': 'Address is required'
    }),

  country: Joi.string()
    .trim()
    .min(2)
    .required()
    .messages({
      'string.empty': 'Country is required',
      'string.min': 'Country must be at least 2 characters long',
      'any.required': 'Country is required'
    }),

  website: Joi.string()
    .trim()
    .uri({ 
      allowRelative: false,
      scheme: ['http', 'https']
    })
    .allow('')
    .allow(null)
    .optional()
    .messages({
      'string.uri': 'Please enter a valid website URL (must start with http:// or https://)'
    })
});

const validateInstituteProfile = (req, res, next) => {
  const { error } = instituteProfileValidation.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });
  
  if (error) {
    console.log('❌ Validation errors:', error.details);
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
      errors: error.details.map(detail => detail.message)
    });
  }
  
  console.log('✅ Validation passed');
  next();
};

export {
  validateInstituteProfile
};