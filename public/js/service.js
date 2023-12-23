class Cache {
    /**
     * @param {*} value
     * @param {number} ttl
     */
    constructor(value, ttl) {
        this.value = value
        this.ddl = new Date().getTime() + ttl
    }
}

/**
 *
 * @param {string} key
 * @param {function} success
 * @param {function} fail
 * @param {() => Promise} orElse
 * @param ttl
 */
const cache = (key, success, fail, orElse, ttl) => {
    const flush = () => {
        orElse().then(res => {
            window.localStorage.setItem(key, JSON.stringify(new Cache(res, ttl)))
            success(res)
        }).catch(res => {
            fail(res)
        })
    }

    const cacheString = window.localStorage.getItem(key)
    if (!cacheString) {
        flush()
        return;
    }

    /**
     * @type {Cache}
     */
    const cacheValue = JSON.parse(cacheString)
    if (cacheValue?.ddl > new Date().getTime()) {
        success(cacheValue.value)
        return
    }

    flush()
}

class Service {

    static SECOND = 1000
    static MINUTE = 60 * Service.SECOND
    static HOUR = 60 * Service.MINUTE
    static DAY = 24 * Service.HOUR

    static _ = (res, callback, ret) => {
        if (callback) callback()
        if (ret) ret(res)
    }

    static login = (token, callback, success, fail) => {
        post('/api/users/login', {token: token}).then(res => {
            Service._(res, callback, success)
        }).catch(res => {
            Service._(res, callback, fail)
        })
    }

    static list = (callback, success, fail) => {
        cache('list',
            res => Service._(res, callback, success),
            res => Service._(res, callback, fail),
            () => get('/api/home/image/list', {}),
            Service.DAY
        )
    }

    static info = (code, callback, success, fail) => {
        cache(`info_${code}`,
            res => Service._(res, callback, success),
            res => Service._(res, callback, fail),
            () => get(`/api/image/${code}/info`, {}),
            Service.HOUR
        )
    }
}
