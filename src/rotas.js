const express = require('express');
const rotas = express();

const contas  = require('./controladores/contas');
const transacoes = require('./controladores/transacoes');

rotas.get('/contas', contas.listarContas);
rotas.post('/contas', contas.cadastrarConta);
rotas.put('/contas/:numero_conta', contas.atualizarConta);
rotas.delete('/contas/:numero_conta', contas.deletarConta);

rotas.post('/transacoes/depositar', transacoes.depositarConta);
rotas.post('/transacoes/sacar', transacoes.saqueConta);
rotas.post('/transacoes/transferir', transacoes.transferenciasContas);

rotas.get('/contas/saldo', transacoes.consultarSaldo);
rotas.get('/contas/extrato', transacoes.extrato);

module.exports = rotas;