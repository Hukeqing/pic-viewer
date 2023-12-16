const config = require('../common/config')
const CacheManager = require("../common/cache")
const fileManager = require('../common/fileManager')

class Picture {
    /**
     * @type {PictureMetadata}
     */
    metadata;
    /**
     * @type {string}
     */
     thumbnailUrl;
    /**
     * @type {string}
     */
    fullUrl;

    constructor(id) {
        this.id = id
        this.homeUrl = `${config.home}/images/${this.id}.info`
        this.metadataUrl = `${this.homeUrl}/metadata.json`

        /**
         * @type {Promise<void>}
         */
        this.finish = this.init()
    }

    async init() {
        let checkResult = true
        checkResult &&= await fileManager.existAsync(this.homeUrl)
        checkResult &&= await fileManager.existAsync(this.metadataUrl)

        if (!checkResult) {
            throw `${this.homeUrl} is not a legal picture file`
        }

        this.metadata = await fileManager.readAsyncJson(this.metadataUrl)
        this.fullUrl = `${this.homeUrl}/${this.metadata.name}.${this.metadata.ext}`
        if (this.metadata.noThumbnail) {
            this.thumbnailUrl = this.fullUrl
        } else {
            this.thumbnailUrl = `${this.homeUrl}/${this.metadata.name}_thumbnail.png`
        }
    }
}

class PictureManager {
    constructor() {
        this.cache = new CacheManager()
    }

    /**
     * @param id
     * @returns {Promise<Picture>}
     */
    async getPicture(id) {
        let picture = this.cache.getOrElse(id, () => new Picture(id), CacheManager.DAY)
        await picture.finish
        return picture
    }
}

const pictureManager = new PictureManager()

module.exports = pictureManager
