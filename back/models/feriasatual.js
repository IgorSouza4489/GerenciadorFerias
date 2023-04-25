const Sequelize = require('sequelize');
const {DataTypes} = require('sequelize')
const sequelize = require('../config.js')

const FeriasAtual = sequelize.define('feriasatual', {
    idferias: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idfuncionario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'funcionarios',
        key: 'idfuncionario'
      }
    },
    diasdisponiveis: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    periodoquinze: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'feriasatual',
    schema: 'projetoqq',
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    indexes: [
      {
        name: "feriasatual_pkey",
        unique: true,
        fields: [
          { name: "idferias" },
        ]
      },
    ]
  });

  module.exports = FeriasAtual;

