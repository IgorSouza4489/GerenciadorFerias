var DataTypes = require("sequelize").DataTypes;
var _funcionarios = require("./funcionarios");

function initModels(sequelize) {
  var funcionarios = _funcionarios(sequelize, DataTypes);

  funcionarios.belongsTo(funcionarios, { as: "idgestor_funcionario", foreignKey: "idgestor"});
  funcionarios.hasMany(funcionarios, { as: "funcionarios", foreignKey: "idgestor"});

  return {
    funcionarios,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
