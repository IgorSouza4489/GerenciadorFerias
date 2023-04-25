var DataTypes = require("sequelize").DataTypes;
var _feriasatual = require("./feriasatual");
var _funcionarios = require("./funcionarios");
var _solicitacoes = require("./solicitacoes");

function initModels(sequelize) {
  var feriasatual = _feriasatual(sequelize, DataTypes);
  var funcionarios = _funcionarios(sequelize, DataTypes);
  var solicitacoes = _solicitacoes(sequelize, DataTypes);

  feriasatual.belongsTo(funcionarios, { as: "idfuncionario_funcionario", foreignKey: "idfuncionario"});
  funcionarios.hasMany(feriasatual, { as: "feriasatual", foreignKey: "idfuncionario"});
  funcionarios.belongsTo(funcionarios, { as: "idgestor_funcionario", foreignKey: "idgestor"});
  funcionarios.hasMany(funcionarios, { as: "funcionarios", foreignKey: "idgestor"});
  solicitacoes.belongsTo(funcionarios, { as: "idfuncionario_funcionario", foreignKey: "idfuncionario"});
  funcionarios.hasMany(solicitacoes, { as: "solicitacos", foreignKey: "idfuncionario"});
  


  return {
    feriasatual,
    funcionarios,
    solicitacoes,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
