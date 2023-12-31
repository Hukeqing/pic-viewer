const express = require("express")

const pictureManager = require('../manager/picture')
const {Result} = require('../common/result')

const router = express.Router()

router.get("/:id/info", (req, res) => {
    pictureManager.getPicture(req.params.id).then(picture => {
        res.send(Result.ofOk(picture.metadata))
    })
})

router.get("/:id/thumbnail", (req, res) => {
    pictureManager.getPicture(req.params.id).then(picture => {
        res.sendFile(picture.thumbnailUrl)
    })
})

router.get("/:id/full", (req, res) => {
    pictureManager.getPicture(req.params.id).then(picture => {
        res.sendFile(picture.fullUrl)
    })
})

module.exports = router
