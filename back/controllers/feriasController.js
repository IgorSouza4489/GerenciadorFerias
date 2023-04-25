const Solicitacao = require('../models/solicitacoes');
const Funcionario = require('../models/funcionarios');
const Notificacao = require('../models/notificacoes')
const FeriasAtual = require('../models/feriasatual')
const moment = require('moment');
const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const sequelize = require('../config.js');
const { Op } = require('sequelize');


const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Sem autorização' });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
    console.log(decoded)
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send('Token inválido');
  }
};

router.post('/solicitar', verifyToken, async (req, res) => {
  try {
    const { statussolicitacao, datainicio, datafim, datasolicitacao, observacao, dataresposta, solicitacao13, idfuncionario } = req.body;

    let feriasAtual = await FeriasAtual.findOne({
      where: { idfuncionario },
    });

    if (!feriasAtual) {
      feriasAtual = await FeriasAtual.create({
        idfuncionario,
        diasdisponiveis: 30,
        periodoquinze: false,
      });
    }

    //verifica numero solicitacoes no periodo aquisitivo atual com momentjs
    const periodoAtualInicio = moment(feriasAtual.datainicio).add(1, 'years');
    const periodoAtualFim = moment(periodoAtualInicio).add(1, 'years').subtract(1, 'days');
    const solicitacoesPeriodoAtual = await Solicitacao.findAndCountAll({
      where: {
        idfuncionario,
        datasolicitacao: {
          $gte: periodoAtualInicio.format('YYYY-MM-DD'),
          $lte: periodoAtualFim.format('YYYY-MM-DD')
        },
        statussolicitacao: 'Aprovada'
      }
    });

    const solicitacoesPeriodoAtualPendente = await Solicitacao.findAndCountAll({
      where: {
        idfuncionario,
        datasolicitacao: {
          $gte: periodoAtualInicio.format('YYYY-MM-DD'),
          $lte: periodoAtualFim.format('YYYY-MM-DD')
        },
        statussolicitacao: 'Pendente'
      }
    });
    console.log(`Número total de solicitações Pendentes no período aquisitivo atual: ${solicitacoesPeriodoAtualPendente.count}`)
    console.log(`Número total de solicitações Aprovadas no período aquisitivo atual: ${solicitacoesPeriodoAtual.count}`);

    //verificar substracao e depois devo verificar para n deixar negativo no banco de dados
    const diasSolicitados = moment(datafim).diff(moment(datainicio), 'days'); //momentjs



    
    //se existe uma solicitacao pendente == 1 ou aprovada == 1 e ele tem 20 dias disponiveis e ferias 15 false então obrigatoriamente ele fez uma solicitacao anterior de 10 dias.
    if (solicitacoesPeriodoAtualPendente.count == 1 && feriasAtual.diasdisponiveis == 20 && feriasAtual.periodoquinze === false && diasSolicitados < 15 || solicitacoesPeriodoAtual.count == 1 && feriasAtual.diasdisponiveis == 20 && feriasAtual.periodoquinze === false && diasSolicitados < 15) {
      return res.status(408).json({ error: 'Você solicitou anteriormente 10 dias de férias, essa solicitação deve ser de pelo menos 15 dias.' });
    }

    //checa se os dias disponivels == 15 e dia solicitado diferente de 15 e ferias 15 false. Se sim ele avisa para tirar 15 dias
    if (feriasAtual.diasdisponiveis == 15 && diasSolicitados != 15 && feriasAtual.periodoquinze === false) {
      return res.status(404).json({ error: 'Você possui 15 dias restantes de saldo e ainda não tirou 15 dias ou mais de férias nesse período.' });
    }

    //se saldo indisponivel
    if ((feriasAtual.diasdisponiveis -= diasSolicitados) < 0) {
      return res.status(400).json({ error: 'Seu saldo de férias não permite que escolha essa quantidade de dias' });
    };

  
    if (diasSolicitados >= 15) {
      feriasAtual.periodoquinze = true;
    }

    /*
    if (solicitacoesPeriodoAtual.count >= 2 && feriasAtual.periodoquinze === false) {
      return res.status(402).json({ error: 'A próxima solicitação precisa ser de pelo menos 15 dias' });
    }
    */

    await feriasAtual.save();

    const solicitacao = await Solicitacao.create({
      statussolicitacao,
      datainicio,
      datafim,
      datasolicitacao,
      observacao,
      dataresposta,
      solicitacao13,
      idfuncionario,
      numerosolicitacoes: solicitacoesPeriodoAtual.count + 1
    });

    //Recuperar todas as solicitações do período aquisitivo atual e exibir o número total no console.log
    const solicitacoesPeriodoAtualAtualizadas = await Solicitacao.findAll({
      where: {
        idfuncionario,
        datasolicitacao: {
          $gte: periodoAtualInicio.format('YYYY-MM-DD'),
          $lte: periodoAtualFim.format('YYYY-MM-DD')
        }
      }
    });

    console.log(`Número total de solicitações no período aquisitivo atual: ${solicitacoesPeriodoAtualAtualizadas.length}`);

    res.status(201).json(solicitacao);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro');
  }
});

router.get('/notificacoes/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const notificacoes = await Notificacao.findAll({
      where: { idfuncionario: id, lida: false },
    });
    res.json(notificacoes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro');
  }
});

//`SELECT idfuncionario FROM projetoqq.funcionarios WHERE idgestor = ${id}`
//CONSUMIR COM AXIOS ANTES DE DORMIRRRRRRRRRRRRRRRRRR 04AM
router.get('/solicitacoes/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const solicitacao = await Solicitacao.findAll({
      where: { idfuncionario: id },
    });
    if (!solicitacao) {
      return res.status(404).json({ message: 'Solicitação não encontrada' });
    }
    res.json(solicitacao);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro');
  }
});


router.patch('/solicitacoes-resposta/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const { observacao, statussolicitacao, dataresposta, idfuncionario, datafim, datainicio } = req.body;
    const solicitacao = await Solicitacao.findByPk(id);
    if (!solicitacao) {
      return res.status(404).json({ message: 'Solicitação não encontrada' });
    }

    let feriasAtual = await FeriasAtual.findOne({
      where: { idfuncionario },
    });

    console.log(datafim)
    solicitacao.observacao = observacao;
    solicitacao.statussolicitacao = statussolicitacao;
    solicitacao.dataresposta = dataresposta
    var dataInicio = moment(req.body.datainicio, 'DD/MM/YYYY');
    var dataFim = moment(req.body.datafim, 'DD/MM/YYYY');
    const diasSolicitados = moment(dataFim).diff(moment(dataInicio), 'days'); //momentjs

    if (solicitacao.statussolicitacao == 'Reprovada') {
      feriasAtual.diasdisponiveis += diasSolicitados
    }

    if (solicitacao.statussolicitacao == 'Reprovada' && diasSolicitados >= 15) {
      feriasAtual.periodoquinze = false
    }

    await feriasAtual.save()
    await solicitacao.save();
    res.json(solicitacao);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro');
  }
});


//Busca todas as solicitacoes feitas por um funcionario de gestor id X
router.get('/solicitacoes-gestor/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const solicitacoes = await Solicitacao.findAll({
      include: {
        model: Funcionario,
        where: { idgestor: id },
      }
    });
    res.json(solicitacoes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro');
  }
});
/* router.post('/logout', (req, res) => {
   localStorage.removeItem('token');
   res.status(200).send('Logout realizado com sucesso');
 });
 */


 router.get('/periodo-aquisitivo/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const funcionario = await Funcionario.findOne({
      where: { idfuncionario: id },
    });

    if (!funcionario) {
      return res.status(400).json({ error: 'Funcionário não encontrado.' });
    }

    // Verifica se já completou um ano de trabalho
    const hoje = moment();
    const anoCompleto = moment(funcionario.datainicio).add(1, 'years').isSameOrBefore(hoje);

    if (anoCompleto) {
      // Calcula a data de início do período aquisitivo atual
      const mesesDesdeInicioContrato = moment().diff(funcionario.datainicio, 'months');
      const numPeriodosAquisitivos = Math.floor(mesesDesdeInicioContrato / 12);
      const inicioPeriodoAtual = moment(funcionario.datainicio).add(numPeriodosAquisitivos * 12, 'months').add(1, 'days');

      //Calcula a data de fim do período aquisitivo atual
      const fimPeriodoAtual = moment(inicioPeriodoAtual).add(1, 'years').subtract(1, 'days');

      //Calcula a data de início e fim do próximo período aquisitivo
      const inicioProximoPeriodo = moment(fimPeriodoAtual).add(1, 'days');
      const fimProximoPeriodo = moment(inicioProximoPeriodo).add(1, 'years').subtract(1, 'days');

      //Retorna as informações do período aquisitivo atual e do próximo período
      res.status(200).json({
        periodoEmpresa: {
          datainicio: funcionario.datainicio
        },
        periodoAtual: {
          inicio: inicioPeriodoAtual.format('YYYY-MM-DD'),
          fim: fimPeriodoAtual.format('YYYY-MM-DD')
        },
        proximoPeriodo: {
          inicio: inicioProximoPeriodo.format('YYYY-MM-DD'),
          fim: fimProximoPeriodo.format('YYYY-MM-DD')
        }
      });
    } else {
      // Funcionário ainda não completou um ano de trabalho, avisa o usuário
      res.status(200).json({
        mensagem: 'Funcionário ainda não completou um ano de trabalho.'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro');
  }
});

router.get('/solicitacoes-numero/:id',verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const solicitacoes = await Solicitacao.findAll({
      include: {
        model: Funcionario,
        where: { idgestor: id },
      }
    });

    let totalPendentes = 0;
    let totalReprovadas = 0;
    let totalAprovadas = 0;

    solicitacoes.forEach(solicitacao => {
      if (solicitacao.statussolicitacao === 'Pendente') {
        totalPendentes++;
      } else if (solicitacao.statussolicitacao === 'Reprovada') {
        totalReprovadas++;
      } else if (solicitacao.statussolicitacao === 'Aprovada') {
        totalAprovadas++;
      }
    });

    res.json({
      totalPendentes,
      totalReprovadas,
      totalAprovadas
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro');
  }
});

router.get('/ferias-atual/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const feriasatual = await FeriasAtual.findOne({
      where: { idfuncionario: id },
    });
    res.json(feriasatual.diasdisponiveis);
  } catch (error ){
    console.error(error)
    res.status(500).send('Erro')
  }
});


router.get('/funcionarios-status/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Busca todos os funcionários do gestor
    const funcionarios = await Funcionario.findAll({
      where: { idgestor: id },
      include: [{ model: Solicitacao, as: 'solicitacoes' }]
    });


    let totalAtivo = 0
    let totalFerias = 0
    const dataAtual = new Date();
    funcionarios.forEach(funcionario => {
      let funcionarioAtivo = true;

      for (let i = 0; i < funcionario.solicitacoes.length; i++) {
        const solicitacao = funcionario.solicitacoes[i];

        if (solicitacao.statussolicitacao === 'Aprovada' && dataAtual >= new Date(solicitacao.datainicio) && dataAtual <= new Date(solicitacao.datafim)) {
          totalFerias++;
          funcionarioAtivo = false;
          break;
        }
      }

      if (funcionarioAtivo) {
        totalAtivo++;
      }
    });

    const numFuncionariosFerias = totalFerias;
    const numFuncionariosAtivos = totalAtivo;

    res.json({
      numFuncionariosFerias,
      numFuncionariosAtivos
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro');
  }
});


router.get('/funcionarios-ferias/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const year = moment().year();

    const solicitacoes = await Solicitacao.findAll({
      where: {
        statussolicitacao: 'Aprovada',
        datasolicitacao: {
          $gte: `${year}-01-01`,
          $lte: `${year}-12-31`
        }
      },
      include: [
        {
          model: Funcionario,
          where: {
            idgestor: id
          }
        }
      ]
    });

    const funcionariosFerias = {};

    solicitacoes.forEach((solicitacao) => {
      funcionariosFerias[solicitacao.idfuncionario] = true;
    });

    const numFuncionariosFerias = Object.keys(funcionariosFerias).length;

    res.json({
      numFuncionariosFerias
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro');
  }
});


router.get('/lista-funcionarios-status/:id',verifyToken, async (req, res) => {
  try {
    const id = req.params.id;

    const funcionarios = await Funcionario.findAll({
      where: { idgestor: id },
      include: [{ model: Solicitacao, as: 'solicitacoes' },
      { model: FeriasAtual, as: 'feriasatuals' }
      ]
    });

    const dataAtual = new Date();

    const listaFuncionarios = funcionarios.map(funcionario => {

      let ferias = false;
      let periodoVencendo = false;
      let feriasAprovada = false
      let diasDisponiveis = 0;

      const mesesDesdeInicioContrato = moment().diff(funcionario.datainicio, 'months');
      const numPeriodosAquisitivos = Math.floor(mesesDesdeInicioContrato / 12);
      const inicioPeriodoAtual = moment(funcionario.datainicio).add(numPeriodosAquisitivos * 12, 'months').add(1, 'days');
      const fimPeriodoAtual = moment(inicioPeriodoAtual).add(1, 'years').subtract(1, 'days');


      for (let i = 0; i < funcionario.feriasatuals.length; i++) {
        const feriasAtual = funcionario.feriasatuals[i];
          diasDisponiveis = feriasAtual.diasdisponiveis;

          break;
      }

      for (let i = 0; i < funcionario.solicitacoes.length; i++) {
        const solicitacao = funcionario.solicitacoes[i];

        if (
          solicitacao.statussolicitacao === 'Aprovada' &&
          moment(solicitacao.datasolicitacao).isBetween(inicioPeriodoAtual, fimPeriodoAtual, null, '[]')
        ) {
          feriasAprovada = true;
        }

        if (solicitacao.statussolicitacao === 'Aprovada' && dataAtual >= new Date(solicitacao.datainicio) && dataAtual <= new Date(solicitacao.datafim)) {
          ferias = true;
          break;
        }


      }



      if (moment(dataAtual).isBetween(moment(fimPeriodoAtual.clone().subtract(1, 'month').startOf('month')), moment(fimPeriodoAtual))) {
        periodoVencendo = true;
      }

      if (feriasAprovada === false) { 
        diasDisponiveis = 30;
      }
      return {
        id: funcionario.id,
        nome: funcionario.nome,
        email: funcionario.email,
        ferias,
        periodoVencendo,
        feriasAprovada,
        diasDisponiveis

      };
    });



    res.json({
      listaFuncionarios
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro');
  }
});



router.get('/funcionario-status/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;

    //find one
    const funcionario = await Funcionario.findOne({
      where: { idfuncionario: id },
      include: [{ model: Solicitacao, as: 'solicitacoes' },
      ]
    });

    const dataAtual = new Date();
    let ferias = false;
    let periodoVencendo = false;
    let feriasAprovada = false;
    const mesesDesdeInicioContrato = moment().diff(funcionario.datainicio, 'months');
    const numPeriodosAquisitivos = Math.floor(mesesDesdeInicioContrato / 12);
    const inicioPeriodoAtual = moment(funcionario.datainicio).add(numPeriodosAquisitivos * 12, 'months').add(1, 'days');
    const fimPeriodoAtual = moment(inicioPeriodoAtual).add(1, 'years').subtract(1, 'days');

    if (moment(dataAtual).isBetween(moment(fimPeriodoAtual.clone().subtract(1, 'month').startOf('month')), moment(fimPeriodoAtual))) {
      periodoVencendo = true;
    }

    for (let i = 0; i < funcionario.solicitacoes.length; i++) {
      const solicitacao = funcionario.solicitacoes[i];

      //checar se ja tirou ferias no periodo aquisitivo atual
      if (
        solicitacao.statussolicitacao === 'Aprovada' &&
        moment(solicitacao.datasolicitacao).isBetween(inicioPeriodoAtual, fimPeriodoAtual, null, '[]')
      ) {
        feriasAprovada = true;
      }

      //checar se esta de ferias no momento
      if (solicitacao.statussolicitacao === 'Aprovada' && dataAtual >= new Date(solicitacao.datainicio) && dataAtual <= new Date(solicitacao.datafim)) {
        ferias = true;
        break;
      }
    }




    res.json({
      id: funcionario.id,
      nome: funcionario.nome,
      email: funcionario.email,
      ferias,
      periodoVencendo,
      feriasAprovada
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro');
  }
});




//tabela ferias iniciam por mês

router.get('/feriasmes/:idgestor', verifyToken, async (req, res) => {
  const idgestor = req.params.idgestor;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  try {
    const feriasPorMes = await Solicitacao.findAll({
      attributes: [
        [sequelize.fn('date_trunc', 'month', sequelize.col('solicitacoes.datainicio')), 'mes'],
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('solicitacoes.idfuncionario'))), 'qtdFuncionarios']
      ],
      include: {
        model: Funcionario,
        where: {
          idgestor: idgestor
        }
      },
      where: {
        statussolicitacao: 'Aprovada',
        datainicio: {
          [Op.between]: [`${currentYear}-01-01`, `${currentYear}-12-31`]
        }
      },
      group: [
        sequelize.fn('date_trunc', 'month', sequelize.col('solicitacoes.datainicio')),
        sequelize.col('funcionario.idfuncionario')
      ],
      raw: true
    });

    const resultado = feriasPorMes.map(item => {
      const mes = item.mes.toLocaleString('pt-BR', { month: 'long' });
      const qtdFuncionarios = parseInt(item.qtdFuncionarios);
      return { mes, qtdFuncionarios };
    });

    const meses = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];

    const resultadoFinal = meses.map(mes => {
      const item = resultado.find(item => item.mes.toLowerCase() === mes);
      const qtdFuncionarios = item ? item.qtdFuncionarios : 0;
      return { mes, qtdFuncionarios };
    });

    res.json(resultadoFinal);
  } catch (error) {
    console.log(error);
    res.status(500).send('Erro');
  }
});

//test
router.get('/verificar-periodo/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const funcionario = await Funcionario.findOne({
      where: { idfuncionario: id },
    });

    if (!funcionario) {
      return res.status(400).json({ error: 'Funcionário não encontrado.' });
    }

    const hoje = moment();
    const anoCompleto = moment(funcionario.datainicio).add(1, 'years').isSameOrBefore(hoje);

    if (anoCompleto) {
      const numPeriodosAquisitivos = Math.floor(moment().diff(funcionario.datainicio, 'months') / 12);
      const inicioPeriodoAtual = moment(funcionario.datainicio).add(numPeriodosAquisitivos * 12, 'months').add(1, 'days');
      const fimPeriodoAtual = moment(inicioPeriodoAtual).add(1, 'years').subtract(1, 'days');

      if (fimPeriodoAtual.isSameOrBefore(hoje)) {
        const feriasAtual = await FeriasAtual.findOne({
          where: { idfuncionario: funcionario.idfuncionario },
        });

        if (!feriasAtual) {
          return res.status(400).json({ error: 'Dados de férias não encontrados' });
        }

        feriasAtual.diasDisponiveis = 30;
        await feriasAtual.save();

        res.status(200).json({
          mensagem: 'Período aquisitivo atual vencido. Seus dias voltaram a ser 30'
        });
      } else {
        res.status(200).json({
          mensagem: 'Período aquisitivo atual ainda não venceu'
        });
      }
    } else {
      res.status(200).json({
        mensagem: 'Funcionário ainda não completou um ano de trabalho'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro');
  }
});

module.exports = router;
