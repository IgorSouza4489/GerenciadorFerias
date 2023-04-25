const User = require('../models/funcionarios');
const express = require('express');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const router = express.Router();



router.post('/register', async (req, res) => {
    try {
      const {tipo, nome, contrato, matricula, email, emailinstitucional, datainicio, senha, idgestor } = req.body;
      const senhaCriptografada = await bcrypt.hash(senha, 9)
      //await User.sync();

      //checa se matricula ja existe
      const userByMatricula = await User.findOne({ where: { matricula } });
  
      if (userByMatricula) {
        return res.status(400).json({ message: 'Usuário já existe' });
      }

      const user = await User.create({
        tipo, nome, contrato, matricula, email, datainicio, emailinstitucional, senha: senhaCriptografada, idgestor
      });

     

      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro');
    }
  });


  //Método para entrar com a conta de usuário, ele gera um token temporário e armazena em localstorage no frontend
  router.post('/login', async (req, res) => {
    try {
      const {matricula, senha } = req.body;
      //const senhaCriptografada = await bcrypt.hash(senha, 9)
      //await User.sync();
      const user = await User.findOne({
         where: {matricula}
      });
      if (!user) {
        return res.status(404).json({message: 'Matrícula não encontrada'})
      }
      const match = await bcrypt.compare(senha, user.senha)
      if (!match) {
        return res.status(404).json({message: 'Senha incorreta'})
      }
    const token = jwt.sign({ id: user.idfuncionario, tipo: user.tipo }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
  });

  router.post('/logout', (req, res) => {
    localStorage.removeItem('token');
    res.status(200).send('Logout realizado com sucesso');
  });

module.exports = router;
