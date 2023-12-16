const express = require("express")

const project = require('../manager/project')

const router = express.Router()

router.get('/image/list', (req, res) => {
    res.send(project.getFileList(null))
})

router.get('/folder/list', (req, res) => {
    res.send(project.getFolderList())
})

router.get('/tagGroup/list', (req, res) => {
    res.send(project.getTagGroupList())
})

router.get('/tag/list', (req, res) => {
    res.send(project.getTagList())
})

module.exports = router
