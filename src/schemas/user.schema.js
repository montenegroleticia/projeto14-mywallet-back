import joi from "joi";

const userSchema = joi.object({
  nome: joi.string().required(),
  email: joi.string().email().required(),
  senha: joi.string().min(3).required(),
});

export default userSchema;
