//models
const CreditCard = require('../models/CreditCard');
const CreditCardInvoice = require('../models/CreditCardInvoice');
const User = require('../models/User');
const DescriptionInvoiceValue = require('../models/DescriptionInvoiceValue');
const Loan = require('../models/Loan');

// helpers (Formatação do dia, mes, ano);
const FormatDate = require('../helpers/Date');
const DateFormated = require('../helpers/FormatDate');
//formatação de valores
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
    let {month,year} = FormatDate();
    
    try{
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

    if(invoice.length === 0){
      res.status(200);
      res.json({error:'Não há lançamentos...'});
    }else{
      let invoiceValue = 0;
      if(invoice.length >= 1){
        //formatar valores, exibir valor total gasto no mes
        let invoiceArray = [];
        for(let i in invoice){
          let arrayValues = parseFloat(invoice[i].installmentvalue.replace('.','').replace(',',''))
          invoiceArray.push(arrayValues);
        }
        
        let newTotal = invoiceArray.reduce(function(value, item){
          return value + item;
        });
        invoiceValue = ValueFormated(newTotal.toString());
      }
      //-------------------------------------------------------------
      //criar fatura do mes se não existir com valor total da fatura
      let descriptionInvoiceValue = await DescriptionInvoiceValue.findOne({where:{iduser:id,month,year}});
      if(!descriptionInvoiceValue){

        await DescriptionInvoiceValue.create({
          iduser:id,
          month: month,
          year: year,
          situation: 'Em Aberto',
          value:invoiceValue
        })
      }else{
        let descriptionInvoice = await DescriptionInvoiceValue.findOne({where:{iduser:id,month,year}});
        descriptionInvoice.value = invoiceValue;
        descriptionInvoice.save();
      }
      
        res.status(201);
        res.json({invoice,invoiceValue});
    }

    }catch(error){

      res.status(404);
      res.json({error});
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

        if(parseInt(cardLimit.limit.replace('.','').replace(',','')) >= parseInt(value.replace('.','').replace(',',''))){
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
            if(newParcelFormated >= 2){
              divisionValue = Math.floor(newValueFormated / newParcelFormated);
              newDivision = divisionValue.toString().replace('.','');
            }else{
              newDivision = newValue.replace('.','').replace(',','')
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

      res.status(404);
      res.json({error:'Ocorreu um erro tente mais tarde...'});
    }
  },

  // atualizar fatura pagamento
  updateInvoice: async(req,res) => {

    let {id}  = req.params;
    let { situation,month,year } = req.body;
    try{
      const user = await User.findOne({where:{id}});
      if(user){
        let searchInvoice = await CreditCardInvoice.findAll({where:{iduser:id,month,year}});
        
        if(searchInvoice){
          let descriptionInvoiceValue = await DescriptionInvoiceValue.findOne({where:{iduser:id,month,year}});
          
          if(descriptionInvoiceValue && descriptionInvoiceValue.situation === 'Em Aberto'){
            
            if(situation && situation === 'Pagamento Efetuado'){

              descriptionInvoiceValue.situation = situation;
              descriptionInvoiceValue.save();
              
              //adicionar valor fatura ao limite cartão
              if(descriptionInvoiceValue.situation === "Pagamento Efetuado"){
                let cardLimit = await CreditCard.findOne({where:{iduser:id}});
                if(cardLimit){
                  let newValues = parseInt(cardLimit.limit.replace('.','').replace(',','')) + parseInt(descriptionInvoiceValue.value.replace('.','').replace(',',''));
                  cardLimit.limit = ValueFormated(newValues.toString());
                  //cardLimit.save();
                }
              }
              //--------------------------------------------------------
              // adicionar valor do emprestimo pago ao valor total para novo emprestimo
              for(let i in searchInvoice){
                let loanArray = [];
                if(searchInvoice[i].description === 'emprestimo'){
                  loanArray.push(parseInt(searchInvoice[i].installmentvalue.replace('.','').replace(',','')));
                  let sum = 0;
                  for(let i = 0; i < loanArray.length; i++){
                    sum += loanArray[i];
                  };
                  let loan = await Loan.findOne({where:{iduser:user.id}});
                  if(loan){
                    let loanValue = parseInt(loan.value.replace('.','').replace(',',''));
                    loanValue += sum;
                    loan.value = ValueFormated(loanValue.toString());
                    await loan.save();
                  };
                };
              };
              //--------------------------------------------------------------------------------
  
              res.status(201);
              res.json('Pagamento Efetuado');
            }else{
              res.status(200);
              res.json({error:'Pagamento não efetuado...'})
            };

          }else{
            res.status(200);
            res.json({error:'Pagamento já foi efetuado.'});
          };

        }else{
          res.status(200);
          res.json({error:'Não há lançamentos...'});
        };
      }else{
        res.status(200);
        res.json({error:"Usuario não encontrado..."});
      };

    }catch(error){
      res.status(404);
      res.json({error:'Ocorreu um erro tente mais tarde...'});
    };

  }
}