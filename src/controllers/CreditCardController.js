const CreditCard = require('../models/CreditCard');
const CreditCardInvoice = require('../models/CreditCardInvoice');
const User = require('../models/User');

// helpers (Formatação do dia, mes, ano);
const FormatDate = require('../helpers/Date');
// formatação de valores
const ValueFormated = require('../helpers/ValueFormated');
const PriceFormated = require('../helpers/PriceFormated');


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
      const user = await User.findOne({where:{id}});
      if(user){

        if(description && value !== ''){
          let parcelInvoice = 0;
          if(parcel){
            parcelInvoice = parcel;
          }
          let newValue = 0;
          newValue = PriceFormated(value.toString());

              if(newValue !== 0){
                await CreditCardInvoice.create({
                  iduser:id,
                  description,
                  value: newValue,
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
      }else{
        res.status(404);
        res.json({error:'Usuario Inexistente'});
      }

    }catch(error){
      console.log(error)
      res.status(404);
      res.json({error:'Ocorreu um erro tente mais tarde...'});
    }
  }
}