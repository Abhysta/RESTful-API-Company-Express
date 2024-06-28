import Joi from "joi";

const company = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  email_company: Joi.string().email().optional(),
  position: Joi.string().required(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  status: Joi.string().required().default("Melamar"),
  timeAdd: Joi.date().optional(),
  id_user: Joi.string().required(),
});

const editDataValidate = Joi.object({
  id_company: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().optional(),
  email_company: Joi.string().email().optional(),
  position: Joi.string().required(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  status: Joi.string().required().default("Melamar"),
  timeAdd: Joi.date().optional(),
  id_user: Joi.string().required(),
});

const searchValidate = Joi.object({
  name: Joi.string().optional(),
  position: Joi.string().optional(),
  size: Joi.number().min(1).default(10).positive(),
  page: Joi.number().min(1).default(1).positive(),
});

export { company, editDataValidate, searchValidate };
