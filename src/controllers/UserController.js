const bcrypt = require('bcryptjs');
const Jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

//models
const User = require('../models/User');
const CurrentAccount = require('../models/CurrentAccount');
const CreditCard = require('../models/CreditCard');
const CreditCardInvoice = require('../models/CreditCardInvoice');

//validar dados de cadastro
const {validationResult,matchedData } = require('express-validator');

module.exports = {
  //login
  signin:async(req,res)=>{
    if(req.body.email && req.body.password){
      let {email, password } = req.body;

      try{
        let user = await User.findOne({where:{email}});
        if(user){
          let passwordCheck = await bcrypt.compareSync(password, user.password);
          if(passwordCheck){
            const token = Jwt.sign(
              {email,id:user.id},
              process.env.JWT_SECRET_KEY
            );
            
            res.status(201);
            res.json({id:user.id,token})
          }else{
            res.status(200);
            res.json({error:'Senha invalida...'});
          }
        }else{
          res.status(201);
          res.json({error:'E-mail invalido...'});
        }

      }catch(error){
        res.status(503);
        res.json({error:"Ocorreu um erro tente novamente mais tarde..."})
      }
    }else{
      res.status(201);
      res.json({error:'Preencha todos os campos...'});
    }
    
  },
  //cadastro usuario
  signup: async(req,res)=>{
    if(req.body.name && req.body.email && req.body.password && req.body.cpf !== '' ){

        const errors = validationResult(req);
        if(!errors.isEmpty() ){
          res.json({error: errors.mapped()});
          return;
        }
        const data = matchedData(req);
        const emailCheck = await User.findOne({where:{email:req.body.email}});
      if(emailCheck){
        res.status(201);
        res.json({error:'E-mail já cadastrado...'});
      }else{     
        
        const passwordHash = await bcrypt.hashSync(req.body.password,10);
        const cpfHash = await bcrypt.hashSync(req.body.cpf,10);
        try{
          const user = await User.create({
            name: data.name,
            cpf:cpfHash,
            email:data.email,
            password:passwordHash
          });
          await CurrentAccount.create({
            initialvalue : '1.773,21',
            iduser : user.id
          });
          await CreditCard.create({
            limit:'2.700,00',
            iduser : user.id
          });
          const token = Jwt.sign(
            {email:user.email,id:user.id},
            process.env.JWT_SECRET_KEY
            );
          res.status(201);
          res.json({id:user.id,token});
        }catch(error){
          res.status(200);
          res.json({error})
        }
      }
    }else{
      res.status(201);
      res.json({error:'Preencha todos os campos...'});
    }
  },
  // atualizar dados usuario
  updateUser: async(req,res) =>{
    let {id} = req.params;
    if(id){
      try{
        let {name,email,password} = req.body;
        let user = await User.findOne({where:{id}});
        if(name){
          user.name = name;
        };

        if(email){
          let userEmail = await User.findOne({where:{email}});
          if(userEmail){
            res.status(200);
            res.json({error:'E-mail já cadastrado'});
            return;
          }else{
            user.email = email;
          }
        };

        if(password){
          let userPassword = await User.findOne({where:{id}});
          let passwordCheck = await bcrypt.compareSync(password,userPassword.password);
          if(passwordCheck){
            res.status(201);
            res.json({error:'Senha já cadastrada...'});
            return;
          }else{
            const newPassword = await bcrypt.hashSync(password,10);
            user.password = newPassword;
          }
        }
        await user.save();
        res.status(201);
        res.json('Dados atualizados com sucesso...');
      }catch(error){
        res.status(200);
        res.json({error:"Ocorreu um erro tente mais tarde..."})
      }
    }
  },
  // informações do usuario
  infoUser: async(req,res)=>{
    let { id } = req.params;
    const user = await User.findOne({where:{id}});
    if(user){
      try{
      res.status(201);
      res.json(user)

      }catch(error){
        res.status(200);
        res.json({error:'Ocorreu um erro...'});
      }
    }else{
      res.status(200);
      res.json({error:'Usuario não encontrado...'});
    }
  },
  //excluir usuario
  deleteUser: async(req,res)=>{
    let { id } = req.params;
    
    try{
      let user = await User.findOne({where:{id}});
      if(user){
        const account =  await CurrentAccount.findOne({where:{iduser:user.id}});
        const creditCard = await CreditCard.findOne({where:{iduser:user.id}});
        const creditCardInvoice = await CreditCardInvoice.findOne({where:{iduser:user.id}});

        await account.destroy();
        await creditCard.destroy();
        await creditCardInvoice.destroy();
        await user.destroy();
        res.status(200);
        res.json({});
      }else{
        res.status(200);
        res.json({error:'Usuario não encontrado...'});
      }
    }catch(error){
      res.status(404);
      res.json({error:'Ocorreu um erro tente mais tarde...'});
    }
  }
}