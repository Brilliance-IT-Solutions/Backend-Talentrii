const Joi = require('joi');

module.exports = Joi.object({
  title: Joi.string().required().max(20).min(3).messages({
    "string.base": `Title should be string`,
    "string.empty": `Title cannot be an empty field`,
    "any.required": `Title is a required field`,
    "string.min": `Title should have a minimum length of 3`,
    "string.max": `Title characters limit cannnot more than 20`,
  }),
  description: Joi.string().required().max(250).min(4).messages({
    "string.base": `Description should be string`,
    "string.empty": `Description cannot be an empty field`,
    "any.required": `Description is a required field`,
    "string.min": `Description should have a minimum length of 4`,
    "string.max": `Description characters limit cannnot more than 250`,
  }),
  url: Joi.array(),
  latitude:Joi.string().allow(''),
  longitude:Joi.string().allow(''),
  startDate: Joi.date().optional().allow(null),
  endDate: Joi.date().optional().allow(null),
  startTime:Joi.string().allow(''),
  category:Joi.string().required().messages({
    "string.base": `category should be string`,
    "string.empty": `category cannot be an empty field`,
    "any.required": `category is a required field`,
  }),
  endTime:Joi.string().allow(''),
  location:Joi.string().allow(''),
  privacy:Joi.string().allow(''),
});


