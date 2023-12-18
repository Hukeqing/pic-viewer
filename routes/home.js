const express = require("express")

const project = require('../manager/project')
const {Result} = require('../common/result')

const router = express.Router()

router.get('/image/list', (req, res) => {
    res.send(Result.ofOk(project.getFileList(null)))
})

router.get('/folder/list', (req, res) => {
    res.send(Result.ofOk(project.getFolderList()))
})

router.get('/tagGroup/list', (req, res) => {
    res.send(Result.ofOk(project.getTagGroupList()))
})

router.get('/tag/list', (req, res) => {
    res.send(Result.ofOk(project.getTagList()))
})

module.exports = router
