//models 
const Loan = require('../models/Loan');
const User = require('../models/User');
const CreditCardInvoice = require('../models/CreditCardInvoice');

// helpers
// formatação de valores
const ValueFormated = require('../helpers/ValueFormated');

// formatação de datas
const FormatDate = require('../helpers/Date');
const DateFormated = require('../helpers/FormatDate');



module.exports = {
    // contratar Emprestimo
    loanContract: async (req,res) => {
        let {dateFormat,monthFormat,year,month} = FormatDate();
        let date = new Date();
        let newYear = date.getFullYear();
        const { id } = req.params;
        let { value, parcel }  = req.body;
        const user = await User.findOne({where:{id}});

        try {
            if(user){
                if(value && parcel){
                    const loan = await Loan.findOne({where:{iduser:id}});

                    let newLoan = loan.value.replace('.','').replace(',','');
                    let newValue = value.replace('.','').replace(',','');
                    if(newValue <= newLoan){
                        let parcelValue = '';
                        // divisão do valor emprestimo pelo numero de parcelas
                        if(parcel >= 2){
                            parcelValue = Math.floor(newValue / parcel);
                            parcelValue = ValueFormated(parcelValue.toString());
                        }else{
                            parcelValue = ValueFormated(newValue.toString());
                        }
                        //------------------------------
                        // criação de parcelas mensais divido pelo numero de parcelas
                        if(parseInt(parcel) <= 12){
                            let parcelLoan = parseInt(parcel);
                            
                            if(parcelLoan >= 2){
                                
                                for(let i = 0; i < parcelLoan; i++){
                                    let newMonth = (month + i);
                                    let monthFormat= DateFormated(newMonth);
                                    // formatar ano 
                                    let date = new Date();
                                    let newYear = date.getFullYear();
                                    if(newMonth > 12){
                                        newYear += 1;
                                        
                                    }
                                    value = value.replace('.','').replace(',','');
                                    value = ValueFormated(value.toString())
                                    await CreditCardInvoice.create({
                                        iduser: user.id,
                                        description:'emprestimo',
                                        value,
                                        parcel,
                                        month:monthFormat,
                                        installmentvalue:parcelValue,
                                        date:dateFormat,
                                        year:newYear
                                    });
                                }
                                const newLimit = (newLoan - newValue);
                                const limitFormated = ValueFormated(newLimit.toString());
                                loan.value = limitFormated;
                                await loan.save();
                                res.status(201);
                                res.json('Empréstimo efetuado com sucesso.');

                            //-------------------------------------------------------------
                            }else{
                                value = value.replace('.','').replace(',','');
                                value = ValueFormated(value.toString());
                                await CreditCardInvoice.create({
                                    iduser: user.id,
                                    description:'emprestimo',
                                    value,
                                    parcel:1,
                                    month:monthFormat,
                                    installmentvalue:value,
                                    date:dateFormat,
                                    year
                                });

                                const newLimit = (newLoan - newValue);
                                const limitFormated = ValueFormated(newLimit.toString());
                                loan.value = limitFormated;
                                await loan.save();
                                res.status(201);
                                res.json('Empréstimo efetuado com sucesso.');
                            }
                        }else{
                            res.status(200);
                            res.json({error:'Numero de parcelas indisponivel.'});
                        }
                    }else{
                        res.status(200);
                        res.json({error:'Valor Indisponivel.'});
                    }
                }else{
                    res.status(200);
                    res.json({error:'Informe um valor e/ou numero de parcelas...'});
                }

            }else{
                res.status(200);
                res.json({error:'Usuario não encontrado...'});
            }
        }catch(error){
            res.status(404);
            res.json({error:'Ocorreu um erro tente mais tarde...'});
        }

    },
    //exibir valor disponivel Emprestimo
    getLimit: async(req,res)=>{
        let { id } = req.params
        try{
            let user = await User.findOne({where:{id}});

            if(user){
                let limit = await Loan.findOne({where:{iduser:user.id}});
                if(limit){
                    res.status(201);
                    res.json(limit.value);
                }else{
                    res.status(200);
                    res.json({error:'Empréstimo indisponivel no momento.'});
                }
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