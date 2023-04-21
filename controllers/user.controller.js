import bcrypt from "bcrypt";

const userSchema = joi.object({
  email: joi.email().required(),
  senha: joi.string().required().min(3),
});

export async function postCadastro(req, res) {
  const { email, senha } = req.body;

  const validation = userSchema.validate(req.body, { abortEarly: false });
  if (validation.err) {
    const erros = validation.err.details.map((detail) => detail.message);
    return res.status(422).send(erros);
  }

  try {
    const user = await db.collection("usuarios").findOne({ email });
    if (user) return res.status(409).send("Esse email já existe");

    const hash = bcrypt.hashSync(senha, 10);

    await db.collection("usuarios").insertOne({ email, hash });
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function postLogin(req, res) {
  const { email, senha } = req.body;

  const validation = userSchema.validate(req.body, { abortEarly: false });
  if (validation.err) {
    const erros = validation.err.details.map((detail) => detail.message);
    return res.status(422).send(erros);
  }

  try {
    const user = await db.collection("usuarios").findOne({ email });
    if (!user) return res.status(401).send("Email inválido!");

    const passwordIsCorrect = bcrypt.compareSync(senha, user.senha);
    if (!passwordIsCorrect) return res.status(401).send("Senha incorreta!");

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}