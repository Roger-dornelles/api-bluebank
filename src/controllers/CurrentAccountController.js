const CurrentAccount = require('../models/CurrentAccount');

module.exports = {
  // exibir conta
  viewAccount: async(req,res) => {
    const { id } = req.params;
    let account = await CurrentAccount.findOne({where:{iduser:id}});

    try {
      if(account){
        res.status(201);
        res.json(account);
      }else{
        res.status(200);
        res.json({error:'Usuario não encontrado...'});
      }

    }catch(error){
      res.status(404);
      res.json({ error:'Ocorreu um erro tente mais tarde...'});
    }

  },
  //atualizar saldo
  updateAccount:async(req,res) => {
    let { id } = req.params;
    let account = await CurrentAccount.findOne({where:{iduser:id}});
    try {
      if(account){
        let {initialvalue } = req.body;
        if(initialvalue){
          account.initialvalue = initialvalue;
        }
        await account.save();
        res.status(201);
        res.json({})
      }else{
        res.status(200);
        res.json({error:'Conta não encontrada...'});
      }
    }catch(error){
      res.status(404);
      res.json({error:'Ocorreu um erro tente mais tarde...'});
    }
  }
}