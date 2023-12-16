const fs = require('fs')

const config = require('../common/config')
const CacheManager = require("../common/cache")
const fileManager = require('../common/fileManager')

class Project {

    constructor() {
        this.homeUrl = config.home
        this.imagesUrl = `${this.homeUrl}/images`
        this.mtimeUrl = `${this.homeUrl}/mtime.json`
        this.metadataUrl = `${this.homeUrl}/metadata.json`
        this.tagsUrl = `${this.homeUrl}/tags.json`
        this.cache = new CacheManager()

        /**
         * @type {Promise<void>}
         */
        this.finish = this.init()
    }

    async init() {
        // check for the project
        let checkResult = true
        checkResult &&= await fileManager.existAsync(this.homeUrl)
        checkResult &&= await fileManager.existAsync(this.imagesUrl)
        checkResult &&= await fileManager.existAsync(this.mtimeUrl)
        checkResult &&= await fileManager.existAsync(this.metadataUrl)
        checkResult &&= await fileManager.existAsync(this.tagsUrl)
        if (!checkResult) {
            throw `${this.homeUrl} is not a legal eagle library`
        }

        await Promise.all([
            this.cache.setWithFlush('mtime', 10 * CacheManager.MINUTE, async () => await fileManager.readAsyncJson(this.mtimeUrl)),
            this.cache.setWithFlush('metadata', 10 * CacheManager.MINUTE, async () => await fileManager.readAsyncJson(this.metadataUrl)),
            this.cache.setWithFlush('tags', CacheManager.HOUR, async () => await fileManager.readAsyncJson(this.tagsUrl))
        ])
    }

    /**
     * @returns {Array<Folder>}
     */
    getFolderList() {
        /**
         * @type {ProjectMetadata}
         */
        const metadata = this.cache.get('metadata')
        return metadata.folders
    }

    /**
     * @param options
     * @returns {Array<string>}
     */
    getFileList(options) {
        /**
         * @type {Array.<Array.<string>>}
         */
        const mtime = Object.entries(this.cache.get('mtime'))
        return mtime.sort((a, b) => {
            return b[1] - a[1]
        }).map(value => {
            return value[0]
        }).filter(value => value !== 'all')
    }

    /**
     * @returns {Array<TagGroup>}
     */
    getTagGroupList() {
        /**
         * @type {ProjectMetadata}
         */
        const metadata = this.cache.get('metadata')
        return metadata.tagsGroups
    }

    /**
     * @returns {*}
     */
    getTagList() {
        return this.cache.get('tags');
    }
}

const project = new Project()

module.exports = project
