const express = require('express');
const User = require('../models/funcionarios');
const jwt = require('jsonwebtoken')
const router = express.Router();

//Método para buscar dados do usuário atual, só busca se ele estiver logado e com token válido
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

  
  router.get('/gestores/:id', verifyToken, async (req, res) => {
    try {
      const id = req.params.id;
      const gestor = await User.findOne({
        where: { idfuncionario: id, tipo:'Gestor' },
        attributes: ['idfuncionario', 'nome', 'email' ]
      });
      res.json(gestor);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro');
    }
  });

  router.get('/gestores', verifyToken, async (req, res) => {
    try {
      const gestores = await User.findAll({
        where: { tipo: 'Gestor' },
        attributes: ['idfuncionario', 'nome']
      });
      res.json(gestores);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro');
    }
  });


  router.get('/:id', verifyToken, async (req, res) => {
    try {
    const id = req.params.id;
    const user = await User.findOne({
      where: { idfuncionario: id },
      attributes: { exclude: ['senha'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro');
  }
});



module.exports = router;