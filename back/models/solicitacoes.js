const Sequelize = require('sequelize');
const {DataTypes} = require('sequelize')
const sequelize = require('../config.js')

const Solicitacao = sequelize.define('solicitacoes', {
    idsolicitacao: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    statussolicitacao: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    datainicio: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    datafim: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    datasolicitacao: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    observacao: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    dataresposta: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    solicitacao13: {
      type: DataTypes.BOOLEAN,
      allowNull: true
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
    tableName: 'solicitacoes',
    schema: 'projetoqq',
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    indexes: [
      {
        name: "solicitacoes_pkey",
        unique: true,
        fields: [
          { name: "idsolicitacao" },
        ]
      },
    ]
  });


module.exports = Solicitacao;
