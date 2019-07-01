import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    /*
     * Aqui no método init, nós declaramos os parametros do model
     * que podem ser cadastrados pelo nosso app.
     */
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      },
    );

    // adiciona uma função a ser executada antes de salvar os dados no banco de
    // dados, funcionar como se fosse uma trigger
    this.addHook('beforeSave', async (user) => {
      // se foi passado password na requisição ao model, criptografa ele e salva
      // na coluna password_hash com um salt 8 (não muito pesado para executar)
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
  }
}

export default User;
