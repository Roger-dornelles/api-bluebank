const CreditCard = require('../models/CreditCard');
const CreditCardInvoice = require('../models/CreditCardInvoice');
const User = require('../models/User');

// helpers (Formatação do dia, mes, ano);
const FormatDate = require('../helpers/Date');
const DateFormated = require('../helpers/FormatDate');
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
    let {month,year} = req.body;
    let invoice = await CreditCardInvoice.findAll({where:{
      iduser:id,
      month,
      year
    }
  },{
order:[
  ['DESC','date',]]
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
  
        let newTotal = invoiceArray.reduce(function(value, numero){
          return value + numero;
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
    let {dateFormat,monthFormat,year,month} = FormatDate();

    let {id} = req.params;
    let { description, value, parcel } = req.body;
    try{
      let cardLimit = await CreditCard.findOne({where:{iduser:id}});
      const user = await User.findOne({where:{id}});
      if(user){

        if(cardLimit.limit >= value){
          // descontar do limite do cartao e formatar novo valor
          let newLimitFormat = parseInt(cardLimit.limit.replace('.','').replace(',',''));
          let newFormatValue = parseInt(value.replace('.','').replace(',',''));
          let newLimit = (newLimitFormat - newFormatValue);
          newLimit = ValueFormated(newLimit.toString());
          //---------------------------------------------------------------
          if(description && value !== ''){
            let parcelInvoice = 0;
            if(parcel){
              parcelInvoice = parcel;
            }
            // formatar valor da compra
            let newValue = 0;
            newValue = PriceFormated(value.toString());
            
            // dividir valor total da compra pelo numero de parcelas
            let newParcelFormated = parseInt(parcelInvoice);
            let newValueFormated = parseInt(newValue.replace('.','').replace(',',''));
            let newDivision = '';
            let divisionValue = '';
            if(newParcelFormated >= 1){
              divisionValue = Math.floor(newValueFormated / newParcelFormated);
              newDivision = divisionValue.toString().replace('.','');
            }
            let newFormatValue = ValueFormated(newDivision.toString());
            //-----------------------------------------------------------

            if(newValue !== 0){
              if(parseInt(parcelInvoice) === 0 || parseInt(parcelInvoice) === 1){
                parcelInvoice = '0';
                await CreditCardInvoice.create({
                  iduser:id,
                  description,
                  value: newValue,
                  parcel:parcelInvoice,
                  date: dateFormat,
                  month: monthFormat,
                  installmentvalue:newFormatValue,
                  year
                });
              }else{
                // criar novas faturas referente ao numero de parcelas
                let newParcelInvoice = parseInt(parcelInvoice);
                for(let i = 0; i < newParcelInvoice; i++){
                  let newMonth = (month + i);
                  let formatDate = DateFormated(newMonth);
                  // formatar ano 
                  let date = new Date();
                  let newYear = date.getFullYear();
                  if(newMonth > 12){
                    newYear += 1;
                    
                  }

                  await CreditCardInvoice.create({
                    iduser:id,
                    description,
                    value: newValue,
                    parcel:parcelInvoice,
                    date: dateFormat,
                    month: formatDate,
                    installmentvalue:newFormatValue,
                    year: newYear
                  });

                }
                //-----------------------------------------------------
              }
              // atualizar limite disponivel cartao de credito
              cardLimit.limit = newLimit;
              await cardLimit.save();

              res.status(201);
              res.json({});

            }
          }else{
              res.status(200);
              res.json({error:'Preencha todos os campos...'});
          }
        }else{
          res.status(200);
          res.json({error:'Limite Indisponivel...'});
        }

      }else{
        res.status(404);
        res.json({error:'Usuario não encontrado...'});
      }

    }catch(error){
      console.log(error);
      res.status(404);
      res.json({error:'Ocorreu um erro tente mais tarde...'});
    }
  },

  // atualizar fatura pagamento
  updateInvoice: async(req,res) => {

    let id  = req.params;
    const user = await User.findOne({where:{id}});
    try{
      if(user){
        let { situation,month } = req.body;
        let searchMonth = CreditCardInvoice.findOne({where:{month}});
        if(searchMonth){
          if(situation){
            searchMonth.situation = situation;
            user.save();
            res.status(201);
            res.json('Atualizado com sucesso...');
          }else{
            res.status(200);
            res.json({});
          }
        }else{
          res.status(200);
          res.json({error:'Não há lançamentos...'});
        }
      }else{
        res.status(200);
        res.json({error:"Usuario não encontrado..."});
      }

    }catch(error){
      res.status(404);
      res.json({error:'Ocorreu um erro tente mais tarde...'});
    }

  }
}