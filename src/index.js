const express = require('express');
const { v4: uuidv4 } = require('uuid')

const app = express();

let customers = []

app.use(express.json());

function verifyIfExistsAccountCPF(req, res, next) {
    const { cpf } = req.headers;

    let customer = customers.find(customer => customer.cpf == cpf)

    if(!customer) {
        return res.json({ error: 'Customer not found!' })
    }

    req.customer = customer

    return next()
}

app.post('/account', (req, res) => {
    const { cpf, name } = req.body;

    const customersAlreadyExists = customers.some(customer => customer.cpf === cpf)

    if (customersAlreadyExists) {
        return res.status(400).json({ error: 'Customer already exists!' })
    }

    const id = uuidv4()

    customers.push({
        cpf, name, id, statement: []
    })

    return res.status(201).send()
})

app.get('/statement', verifyIfExistsAccountCPF, (req, res) => {
    const { customer } = req

    return res.json(customer.statement)
})

app.listen(3333);