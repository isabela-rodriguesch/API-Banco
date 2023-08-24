const bancodedados = require('../bancodedados');
const { banco, contas} = require('../bancodedados');

// Listar todas as contas
const listarContas = (req, res)  => {
    const senha_banco = req.query.senha_banco
    if (senha_banco === banco.senha) {
        return res.status(200).json(contas)
    } else {
        return res.status(404).json({mensagem: 'A senha está incorreta.'})
    }
};

// Cadastrar novas Contas
const cadastrarConta= (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha} = req.body;

    if(!nome || !cpf || !data_nascimento || !telefone || !email || !senha ) {
        return res.status(400).json({mensagem: 'Todos os campos de preenchimentos são obrigatórios!'});
    } 

    const cpfExistente = contas.find((algumaConta) => {
        return algumaConta.usuario.cpf === cpf;
    });

    if (cpfExistente) {
        return res.status(400).json({mensagem: 'O CPF informado já existe cadastrado!'});
    }

    const emailExistente = contas.find((algumaConta) => {
        return algumaConta.usuario.email === email;
    });

    if (emailExistente) {
        return res.status(400).json({mensagem: 'O email informado já existe cadastrado!'})
    }


    let numero_conta = bancodedados.numero_conta++
    const conta_nova = {
        numero_conta,
        saldo: 0,
            usuario: {
                nome,
                cpf,
                data_nascimento,
                telefone,
                email,
                senha
            }
    }

    contas.push(conta_nova);

    return res.status(201).json(conta_nova);
};

// Atualizar dados de uma conta
const atualizarConta = (req, res) => {
    const { numero_conta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email,senha} = req.body;

    const conta = contas.find((conta) => {
        return conta.numero_conta === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({mensagem: 'Conta não encontrada'});
    }

    if(!nome || !cpf || !data_nascimento || !telefone || !email || !senha ) {
        return res.status(400).json({mensagem: 'Todos os campos de preenchimentos são obrigatórios!'});
    }

    const cpfExistente = contas.find((algumaConta) => {
        return algumaConta.usuario.cpf === cpf;
    });

    if (cpfExistente) {
        return res.status(400).json({mensagem: 'O CPF informado já existe cadastrado!'})
    }

    const emailExistente = contas.find((algumaConta) => {
        return algumaConta.usuario.email === email;
    });

    if (emailExistente) {
        return res.status(400).json({mensagem: 'O email informado já existe cadastrado!'})
    }

    conta.usuario.nome = nome,
    conta.usuario.cpf = cpf,
    conta.usuario.data_nascimento = data_nascimento,
    conta.usuario.telefone = telefone,
    conta.usuario.email = email,
    conta.usuario.senha = senha

    return res.status(201).json();
}

// Excluir uma conta
const deletarConta = (req, res) => {
    const { numero_conta } = req.params;

    const conta = contas.find((conta) => {
        return conta.numero_conta === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({mensagem: 'Conta não encontrada'});
    }

    if (conta.saldo !== 0) {
        return res.status(400).json({mensagem: 'A conta só pode ser removida se o saldo for zero!'})
    }

    return res.status(204).send();
}

module.exports = {
    listarContas,
    cadastrarConta,
    atualizarConta,
    deletarConta
}