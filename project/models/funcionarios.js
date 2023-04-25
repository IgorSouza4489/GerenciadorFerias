const Sequelize = require('sequelize');
const {DataTypes} = require('sequelize')
const sequelize = require('../config.js')

  const User = sequelize.define('funcionarios', {
    idfuncionario: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tipo: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    contrato: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    matricula: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    datainicio: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    senha: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    idgestor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'funcionarios',
        key: 'idfuncionario'
      }
    }
  }, {
    sequelize,
    tableName: 'funcionarios',
    schema: 'projetoqq',
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    indexes: [
      {
        name: "funcionarios_pkey",
        unique: true,
        fields: [
          { name: "idfuncionario" },
        ]
      },
    ]
  });

  module.exports = User;
