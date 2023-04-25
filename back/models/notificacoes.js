const Sequelize = require('sequelize');
const {DataTypes} = require('sequelize')
const sequelize = require('../config.js')


const Notificacao = sequelize.define('notificacoes', {
    idnotificacao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    mensagem: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lida: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    idfuncionario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'funcionarios',
          key: 'idfuncionario'
        }
      }
  },
  {
    sequelize,
    modelName: 'notificacao',
    tableName: 'notificacoes',
  }
);

// Define o relacionamento com o modelo Usuario
const User = require('./funcionarios');
Notificacao.belongsTo(User, { foreignKey: 'idfuncionario' });

module.exports = Notificacao;
