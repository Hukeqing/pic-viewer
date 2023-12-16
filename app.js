const express = require('express');
const path = require('path');
const session = require('express-session')

const config = require('./common/config')

const app = express()

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// noinspection SpellCheckingInspection
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: config.sessionSecret,
    proxy: true,
    cookie: {path: '/', httpOnly: true, secure: false, maxAge: null}
}));

const project = require('./manager/project')

// project.finish.then(() => console.log(project.getFileList(null)))

const userRouter = require('./routes/users')
const homeRouter = require('./routes/home')
const pictureRouter = require('./routes/file')

app.use(`${config.baseUrl}/api/users`, userRouter.router)
app.use(`${config.baseUrl}/api/home`, [userRouter.filterAdmin], homeRouter)
app.use(`${config.baseUrl}/api/image`, [userRouter.filterAdmin], pictureRouter)

// add error router
require('./routes/error')(app)

module.exports = app;
