const express = require('express');
const router = express.Router();

// controllers
const UserController = require('./controllers/UserController');
const CurrentAccountController = require('./controllers/CurrentAccountController');
const CreditCardController = require('./controllers/CreditCardController');
const PixController = require('./controllers/PixController');
const LoanController = require('./controllers/LoanController');
const TransferenceController = require('./controllers/TransferenceController');
const DonationController = require('./controllers/DonationController')

//validator
const AuthValidator = require('./validator/AuthValidator');

// middleware
const Auth = require('./middlewares/Auth');

// User
//login usuario
router.post('/signin', UserController.signin);
//cadastro usuario
router.post('/signup',AuthValidator.signup,UserController.signup);
// atualizar dados usuario
router.put('/user/:id',Auth.private,UserController.updateUser);
// exibir dados do usuario
router.get('/user/info/:id',Auth.private,UserController.infoUser);
// excluir usuario
router.delete('/user/delete/:id',Auth.private,UserController.deleteUser);

// CurrentAccount
// exibir saldo
router.get('/account/user/:id', Auth.private, CurrentAccountController.viewAccount);
//atualizar saldo
router.put('/account/user/:id',Auth.private, CurrentAccountController.updateAccount);

// CreditCard
//exibir limite cartão
router.get('/creditCard/user/:id', Auth.private, CreditCardController.viewCredit);
//atualizar limite cartao
//router.put('/creditCard/user/:id', Auth.private, CreditCardController.updateCredit)
// exibir faturas
router.get('/creditCard/invoices/:id', Auth.private, CreditCardController.invoices);
// adicionar despesas
router.post('/creditCard/expenses/:id', Auth.private, CreditCardController.cardExpenses);
// atualizar fatura cartao
router.put('/creditCard/expenses/:id',Auth.private, CreditCardController.updateInvoice);

//Pix
//Transferencia de valor
router.post('/pix/transfer/:id', Auth.private, PixController.transferValue);
// pagamentos boleto
router.post('/pix/pagament/:id', Auth.private, PixController.pagamentSlip);
// exibir pix 
router.get('/pix/viewTransfers/:id', Auth.private, PixController.displayPix);

//Loan
// contratar emprestimo
router.post('/loan/:id', Auth.private, LoanController.loanContract);
// exibir valor disponivel para emprestimo
router.get('/loan/limit/:id', Auth.private,LoanController.getLimit);

// transference
//fazer transferencia 
router.post('/transference/user/:id', Auth.private,  TransferenceController.transferValue);

// Donation
// fazer doação
router.post('/user/donation/:id', Auth.private, DonationController.donation)
module.exports = router;