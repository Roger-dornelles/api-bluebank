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
        let { value, pixdestination } = req.body;
        let {dateFormat,year,month} = FormatDate();

        try{
            let user = await User.findOne({where: {id}});
            if(user){
                let accountBalance = await CurrentAccount.findOne({where: {iduser:user.id}});
                let accountBalanceFormat = parseInt(accountBalance.initialvalue.replace('.','').replace(',',''));
                let valueFormat = parseInt(value.replace('.','').replace(',',''))
                if(accountBalanceFormat >= valueFormat){
                    if(pixdestination !== ''){
                        month = DateFormated(month);
                        accountBalanceFormat = (accountBalanceFormat - valueFormat);
                        value = PriceFormated(value.toString());
                        accountBalanceFormat = ValueFormated(accountBalanceFormat.toString());
                        await Pix.create({
                            iduser: user.id,
                            value,
                            pixdestination,
                            month,
                            year,
                            date: dateFormat
                        });
                        accountBalance.initialvalue = accountBalanceFormat;
                        accountBalance.save();
                        res.status(201);
                        res.json('transferencia realizada com sucesso.');
                    }else{
                        res.status(200);
                        res.json({error:'Preencher Pix de destino.'});
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
            console.log('ERROR ',error);
            res.status(404);
            res.json({error:'Ocorreu um erro tente mais tarde...'})
        }
    }
}