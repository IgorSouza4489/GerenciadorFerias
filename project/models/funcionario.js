const {DataTypes} = require('sequelize')
const sequelize = require('../config.js')

const Funcionario = sequelize.define('funcionarios', {
  idFuncionario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contrato: {
    type: DataTypes.STRING,
    allowNull: false
  },
  matricula: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  datainicio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idGestor: {
    type: DataTypes.INTEGER,
    references: {
      model: Funcionario,
      key: 'idFuncionario'
    }
  }
});

//module.exports = Funcionario;