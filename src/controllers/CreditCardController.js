const CreditCard = require('../models/CreditCard');
const CreditCardInvoice = require('../models/CreditCardInvoice');

// helpers (Formatação do dia, mes, ano);
const FormatDate = require('../helpers/Date');

module.exports = {
  //exibir saldo cartão
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
      res.json({error:'Ocorreu um erro tente mais tarde...'});
    }
  },
  // exibir fatura
  invoice: async (req,res)=>{
    let {id} = req.params;
    let invoice = await CreditCardInvoice.findAll({where:{iduser:id}});
    try{
      if(!invoice){
        res.status(200);
        res.json({error:'Não há lançamentos...'});
      }else{
        res.status(201);
        res.json({invoice});
      }

    }catch(error){
      res.status(404);
      res.json({error:'Ocorreu um erro tente mais tarde...'});
    }
    
  },
  //adicionar despesas
  cardExpenses: async (req,res)=>{
    let {dateFormat,monthFormat} = FormatDate();

    let {id} = req.params;
    let { description, value, parcel } = req.body;
    try{
      if(description && value !== ''){
        let parcelInvoice = 0;
        if(parcel){
          parcelInvoice = parcel;
        }
        await CreditCardInvoice.create({
          iduser:id,
          description,
          value,
          parcel:parcelInvoice,
          date: dateFormat,
          month: monthFormat
        });
        res.status(201);
        res.json({});
      }else{
        res.status(200);
        res.json({error:'Preencha todos os campos...'});
      }

    }catch(error){
      console.log(error);
      res.status(404);
      res.json({error:'Ocorreu um erro tente mais tarde...'});
    }
  }
}