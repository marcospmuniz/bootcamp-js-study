import User from '../models/User';

class UserController {
  async list(req, res) {
    const users = await User.findAll();

    return res.json(users);
  }

  async store(req, res) {
    // checa se já existe um usuário cadastrado com o e-mail informado
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      // retorna um bad request
      return res.status(400).json({ error: 'User aready exists.' });
    }

    const {
      id, name, email, provider,
    } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
