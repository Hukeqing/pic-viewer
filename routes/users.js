const express = require("express")

const {Result, Error} = require('../common/result')
const config = require('../common/config')

const router = express.Router()

router.post('/login', (req, res) => {
    if (req.body.token === config.token) {
        req.session.user = {
            role: 'admin'
        }
        res.send(Result.ok())
    } else {
        res.send(Error.PWD_ERROR.asResult())
    }
})

router.post('/logout', (req, res) => {
    req.session.user = {}
    res.send(Result.ok())
})

router.get('/check', (req, res) => {
    if (req?.session?.user?.role === 'admin') {
        res.send(Result.ok())
    } else {
        res.send(Error.NEED_LOGIN.asResult())
    }
})

const filterAdmin = (req, res, next) => {
    if (req?.session?.user?.role === 'admin') {
        next()
    } else {
        res.send(Error.NEED_LOGIN.asResult())
    }
}

module.exports = {
    router,
    filterAdmin
}