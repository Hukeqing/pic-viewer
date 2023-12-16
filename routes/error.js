const {Error} = require('../common/result')

const notFoundHandler = (req, res, next) => {
    console.log(req.url)
    res.send(Error.NOT_FOUND.asResult())
}

const errorHandler = (err, req, res, next) => {
    console.log(err)
    res.send(Error.SYSTEM_ERROR.asResult())
}

/**
 * @param {Express} app
 */
module.exports = (app) => {
    app.use(notFoundHandler);
    app.use(errorHandler);
}
