//models
const Pix = require('../models/Pix');
const User = require('../models/User');
const CurrentAccount = require('../models/CurrentAccount');

//helpers
const FormatDate = require('../helpers/Date');
const DateFormated = require('../helpers/FormatDate');
const PriceFormated = require('../helpers/PriceFormated');
const ValueFormated = require('../helpers/ValueFormated');

module.exports = {
    // transferencia de valor pix
    transferValue: async (req,res)=>{
        let { id } = req.params;
        let { value, pixdestination, description } = req.body;
        let {dateFormat,year,month} = FormatDate();

        try{
            let user = await User.findOne({where: {id}});
            if(user){
                let accountBalance = await CurrentAccount.findOne({where: {iduser:user.id}});
                let accountBalanceFormat = parseInt(accountBalance.initialvalue.replace('.','').replace(',',''));
                let valueFormat = parseInt(value.replace('.','').replace(',',''))
                if(accountBalanceFormat >= valueFormat){
                    if(pixdestination && description){
                        month = DateFormated(month);
                        accountBalanceFormat = (accountBalanceFormat - valueFormat);
                        value = PriceFormated(value.toString());
                        accountBalanceFormat = ValueFormated(accountBalanceFormat.toString());

                        if(description === "transferencia"){
                            description ='Transferencia Pix';
                            await Pix.create({
                                iduser: user.id,
                                value,
                                pixdestination,
                                month,
                                description,
                                year,
                                date: dateFormat
                            });
                            accountBalance.initialvalue = accountBalanceFormat;
                            accountBalance.save();
                            res.status(201);
                            res.json('transferencia realizada com sucesso.');
                        }else{
                            res.status(200);
                            res.json({error:'Operação não realizada.'});
                        }
                    }else{
                        res.status(200);
                        res.json({error:'Preencher todos campos.'});
                    }
                }else{
                    res.status(201);
                    res.json({error:'Saldo insuficiente para essa transação.'});

                }
            }else{
                re.status(200);
                res.json({error:'Usuario não encontrado...'})
            }

        }catch(error){
            res.status(404);
            res.json({error:'Ocorreu um erro tente mais tarde...'})
        }
    },
    //pagamento boleto
    pagamentSlip: async (req,res)=>{
        let {dateFormat,year,month} = FormatDate();
        let { id } = req.params;
        let { value, pixdestination, description } = req.body;
        try{
            let user = await User.findOne({where:{id}}) ;
            if(user){
                let currentAccount = await CurrentAccount.findOne({where:{iduser:user.id}});
                if(currentAccount){
                    if(value){

                        let currentAccountFormat = parseInt(currentAccount.initialvalue.replace('.','').replace(',',''));
                        let valueFormat = parseInt(value.replace('.','').replace(',',''));
    
                        if(currentAccountFormat >= valueFormat){
                            let newValue = 0;
                            currentAccountFormat = (currentAccountFormat - valueFormat);
                            newValue = ValueFormated(currentAccountFormat.toString());
                            month = DateFormated(month);
                            if(pixdestination && description === 'boleto'){
                                description = 'Pagamento de Boleto'
                                value = PriceFormated(value);
                                await Pix.create({
                                    iduser: user.id,
                                    description,
                                    pixdestination,
                                    value,
                                    date: dateFormat,
                                    year,
                                    month
                                });
                                currentAccount.initialvalue = newValue;
                                await currentAccount.save();
                                res.status(201);
                                res.json('Pagamento Efetuado');
                            
                            }else{
                                res.status(200);
                                res.json({error:'Preencha todos os campos...'});
                            };
                        }else{
                            res.status(200);
                            res.json({error:'Saldo insuficiente...'});
                        };

                    }else{
                        res.status(200);
                        res.json({error:'Valor invalido...'});
                    };
                }else{
                    res.status(404);
                    res.json({error:'Conta inexistente'});
                };
            }else{
                res.json(200);
                res.json({error:'Usuario não encontrado...'});
            };
        }catch(error){
            res.status(404);
            res.json({error:'Ocorreu um erro tente mais tarde...'})
        };
    },

    displayPix: async (req,res) => {
        let { id } = req.params;
        
        try{
            let user = await User.findOne({where:{id}});

            if(user){
                let pix = await Pix.findAll({where:{
                    iduser:user.id
                    }},{
                        order:[
                            ['DESC','date']
                        ]
                    }
                );
                if(pix){
                    res.status(201);
                    res.json({pix});
                }else{
                    res.status(201);
                    res.json('Não há lançamentos...');
                }

            }else{
                res.status(404);
                res.json({error:'Usuario não encontrado...'});
            }

        }catch(error){
            res.status(404);
            res.json({error:'Ocorreu um erro tente mais tarde...'});
        }
    }
}