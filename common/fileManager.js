const fs = require('fs')
const CacheManager = require('./cache')

const containCache = new CacheManager()
const existCache = new CacheManager()


class FileManager {

    async readAsyncJson(path) {
        return containCache.getOrElse(path,
            () => JSON.parse(fs.readFileSync(path).toLocaleString()),
            CacheManager.MINUTE)
    }

    readJson(path) {
        return containCache.getOrElse(path,
            () => JSON.parse(fs.readFileSync(path).toLocaleString()),
            CacheManager.MINUTE)
    }

    async existAsync(path) {
        return existCache.getOrElse(path, () => fs.existsSync(path), CacheManager.DAY)
    }

    exist(path) {
        return existCache.getOrElse(path, () => fs.existsSync(path), CacheManager.DAY)
    }
}

const fileManager = new FileManager()

module.exports = fileManager
