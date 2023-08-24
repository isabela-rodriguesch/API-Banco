let {banco, contas, depositos, saques, transferencias} = require('../bancodedados');

const depositarConta = (req, res) => {
    const { numero_conta, valor } = req.body;

    const conta = contas.find((conta) => {
        return conta.numero_conta === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({mensagem: 'A informada conta não foi encontrada'})
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'O valor de depósito não é válido' });
    }

    conta.saldo += valor;

    const deposito = {
        data: new Date(),
        numero_conta,
        valor
    };

    depositos.push(deposito);

    return res.status(204).send();
}

const saqueConta = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    const conta = contas.find((conta) => {
        return conta.numero_conta === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({mensagem: 'A conta informada conta não foi encontrada'});
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'O valor de depósito não é válido' });
    }

    if (conta.usuario.saldo < valor) {
        return res.status(400).json({mensagem: 'Saldo insuficiente!'})
    }

    if (conta.usuario.senha !== senha) {
        return res.status(400).json({mensagem: 'Senha inválida!'})
    }

    conta.saldo -= valor;

    const saque = {
        data: new Date(),
        numero_conta,
        valor,
        senha
    };

    saques.push(saque);

    return res.status(204).json();
}

const transferenciasContas = (req, res) => {
    const { numero_origem, numero_destino, valor, senha } = req.body;
 
     const conta_origem = contas.find((conta) => {
         return conta.numero_conta === Number(numero_origem);
     });
 
     const conta_destino = contas.find((conta) => {
         return conta.numero_conta === Number(numero_destino);
     });

 
     if (!numero_origem || !numero_destino || !valor || !senha) {
         return res.status(400).json({ mensagem: 'Todos os campos de preenchimentos são obrigatórios!' });
     }

     if (!conta_origem || !conta_destino) {
        return res.status(404).json({mensagem: 'A conta de origem ou conta de destino não foi encontrada'})
     }
 
     if (conta_origem.saldo < valor) {
         return res.status(404).json({ mensagem: 'Saldo insuficiente!' });
     }

     if (conta_origem.usuario.senha != senha) {
        return res.status(401).json({mensagem: 'Senha inválida!'})
    }
 
     conta_origem.saldo -= valor;
     conta_destino.saldo += valor;

     const transferencia = {
        data: new Date(),
        conta_origem,
        conta_destino,
        valor,
        senha
    }

    transferencias.push(transferencia);
 
     return res.status(201).json();
 };

const consultarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    const conta = contas.find((conta) => {
        return conta.numero_conta === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'A conta informada não foi encontrada' });        
    }

    if (!numero_conta || !senha) {
        return res.status(404).json({ mensagem: 'O número da conta e/ou senha não foram informados'});        
    }

    if (senha !== conta.usuario.senha) {
        return res.status(404).json({mesagem: 'Senha inválida!'})
    }

    return res.status(200).json({saldo: conta.saldo})
};

const extrato = (req, res) => {
    const { numero_conta, senha } = req.body;
    const conta = contas.find((conta) => {
            return conta.numero_conta === Number(numero_conta);
        });

        if (!conta) {
            return res.status(404).json({ mensagem: 'A conta informada não foi encontrada'});        
        }

        if (!numero_conta || !senha) {
            return res.status(404).json({ mensagem: 'Todos os campos de preenchimentos são obrigatórios!'});        
        }

        if (senha !== conta.usuario.senha) {
            return res.status(404).json({mesagem: 'Senha inválida!'})
        }

        const extratoBancario = { 
            
            depositos: depositos.filter((deposito) => { 
                return deposito.numero_conta === numero_conta; }),
        
            saques: saques.filter((saque) => {
                return saque.numero_conta === numero_conta; }),
        
            transferenciasEnviadas: saques.filter((saque) => {
                return saque.numero_conta === numero_conta; }),

            transferenciasRecebidas: saques.filter((saque) => {
                return saque.numero_conta === numero_conta; }),
    }

    if (!extratoBancario) {
        return res.status(400).json({mensagem: 'Ainda não há transações nessa conta'})
    }

    return res.status(200).json(extratoBancario);
}

module.exports = {
    depositarConta,
    saqueConta,
    transferenciasContas,
    consultarSaldo,
    extrato, 
}