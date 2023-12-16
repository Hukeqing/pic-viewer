class CacheValue {
    /**
     * @type {*}
     */
    value;
    /**
     * @type {number}
     */
    ttl;
    /**
     * @type {Date}
     */
    ddl;
    /**
     * @type {() => Promise}
     */
    flush;
    /**
     * @param {*} value
     * @param {number} ttl
     * @param {() => Promise} flush
     */
    constructor(value, ttl, flush) {
        this.value = value
        this.ttl = ttl
        this.ddl = ttl ? ttl + new Date().getDate() : null
        this.flush = flush
    }

    /**
     * @returns {*|null}
     */
    get data() {
        if (!this.ddl || this.ddl > new Date().getDate()) {
            return this.value
        } else if (this.flush) {
            this.flush().then(res => {
                this.value = res
            })
            this.ddl = this.ttl ? this.ttl + new Date().getDate() : null
            return this.value
        } else {
            return null
        }
    }
}

class CacheManager {

    static SECOND = 1000
    static MINUTE = 60 * CacheManager.SECOND
    static HOUR = 60 * CacheManager.MINUTE
    static DAY = 24 * CacheManager.HOUR

    constructor() {

        /**
         * @type {{$Keys: string, $Values: CacheValue}}
         */
        this.cache = {}
    }

    /**
     * @param {string} key
     * @returns {*|null}
     */
    get(key) {
        const result = this.cache[key]?.data
        if (!result) {
            delete this.cache[key]
        }

        return result
    }

    /**
     * @param {string} key
     * @param {Function} orElse
     * @param {number} ttl
     * @returns {*}
     */
    getOrElse(key, orElse, ttl) {
        let result = this.cache[key]?.data
        if (!result) {
            result = orElse()
            this.cache[key] = new CacheValue(result, ttl, null)
        }

        return result
    }

    erase(key) {
        delete this.cache[key]
    }

    /**
     * @param {string} key
     * @param {*} value
     * @param {number} ttl
     */
    set(key, value, ttl) {
        this.cache[key] = new CacheValue(value, ttl, null)
    }

    /**
     * @param {string} key
     * @param {number} ttl
     * @param {() => Promise} flush
     */
    async setWithFlush(key, ttl, flush) {
        this.cache[key] = new CacheValue(await flush(), ttl, flush)
    }
}

module.exports = CacheManager
