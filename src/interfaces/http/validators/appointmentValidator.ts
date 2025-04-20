import Joi from 'joi'

export const appointmentSchema = Joi.object({
  insuredId: Joi.string().required(),
  scheduleId: Joi.string().required(),
  countryISO: Joi.string().valid('PE', 'CL').required(),
})
