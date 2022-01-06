const CreditCard = require('../models/CreditCard');

module.exports = {
  //exibir saldo
  viewCredit: async (req,res)=>{
    try{
      let { id } = req.params;
      let account = await CreditCard.findOne({where:{iduser:id}});
      if(account){
        res.status(201);
        res.json(account);
      }else{
        res.status(200);
        res.json({error:'Usuario não encontrado...'});
      }
    }catch(error){
      res.status(404);
      res.json({error:'Ocorreu um erro tente mais tarde...'})
    }
  }
}