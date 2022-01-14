const CreditCard = require('../models/CreditCard');
const CreditCardInvoice = require('../models/CreditCardInvoice');
const {mask} = require('remask');

// helpers (Formatação do dia, mes, ano);
const FormatDate = require('../helpers/Date');
// formatação de valores
const ValueFormated = require('../helpers/ValueFormated');


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
  // exibir faturas
  invoices: async (req,res)=>{
    let {id} = req.params;
    let month = req.body.month;
    let invoice = await CreditCardInvoice.findAll({where:{
      iduser:id,
      month
    }
  },{
order:[
  ['DESC','date']]
  }
  );

  try{
    if(invoice.length === 0){
      res.status(200);
      res.json({error:'Não há lançamentos...'});
    }else{
      let invoiceValue = 0;
      if(invoice.length > 0){

        let invoiceArray = [];
        for(let i in invoice){
          let arrayValues = parseFloat(invoice[i].value.replace('.','').replace(',',''))
          invoiceArray.push(arrayValues);
        }
  
        let newTotal = invoiceArray.reduce(function(total, numero){
          return total + numero;
        });
        invoiceValue = ValueFormated(newTotal.toString());
      }
        res.status(201);
        res.json({invoice,invoiceValue});
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
    // ---------- formatação de valor  ---------
        let values = 0;
        if(value.length <= 3){
          res.status(200);
          res.json({error:'Valor Invalido'})
        };

        if(value.length === 4){
          const patterns = ['9,99']
          values  = mask(value,patterns)
        };

        if(value.length === 5){
          const patterns = ['99,99']
          values = mask(value,patterns)
        };

        if(value.length === 6){
          const patterns = ['999,99']
          values = mask(value,patterns)
        };

        if(value.length === 8 ){
          const patterns = ['9.999,99']
          values = mask(value,patterns)
        };

        if(value.length === 9 ){
          const patterns = ['99.999,99']
          values = mask(value,patterns)
        };

        if(value.length === 10 ){
          const patterns = ['999.999,99']
          values = mask(value,patterns)
        };
        //-------------------------------
        if(values !== 0){
          await CreditCardInvoice.create({
            iduser:id,
            description,
            value: values,
            parcel:parcelInvoice,
            date: dateFormat,
            month: monthFormat
          });
          res.status(201);
          res.json({});
        }
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