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

    static check = (success, fail) => {
        get('/api/users/check', {})
            .then(() => success())
            .catch(() => fail())
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

    static tags = (callback, success, fail) => {
        cache(`tags`,
            res => Service._(res, callback, success),
            res => Service._(res, callback, fail),
            () => get(`/api/home/tag/list`, {}),
            Service.DAY
        )
    }

    static tagGroup = (callback, success, fail) => {
        cache(`tagGroup`,
            res => Service._(res, callback, success),
            res => Service._(res, callback, fail),
            () => get(`/api/home/tagGroup/list`, {}),
            Service.DAY
        )
    }

    static folder = (callback, success, fail) => {
        cache(`folder`,
            res => Service._(res, callback, success),
            res => Service._(res, callback, fail),
            () => get(`/api/home/folder/list`, {}),
            Service.DAY
        )
    }
}

class TagManager {

    static _tags = []
    static _tagGroup = []
    static _starredTags = []

    static {
        Service.tags(null, res => {
            TagManager._tags = res.historyTags
            TagManager._starredTags = res.starredTags
        }, null)
        Service.tagGroup(null, res => {
            TagManager._tagGroup = res
        })
    }

    static get tags() {
        return this._tags
    }

    static putTag(name) {
        this._tags.push(name)
        // TODO save tag
    }
}

class FolderManager {

    static _folderMap = {}
    /**
     * @type {Array.<Folder>}
     * @private
     */
    static _folderGroup = []

    static {
        Service.folder(null, res => {
            FolderManager._folderGroup = res
            for (const node of res) FolderManager.dfs(node)
        })
    }

    /**
     * @param {Folder} node
     */
    static dfs(node) {
        this._folderMap[node.id] = node
        for (const child of node.children) FolderManager.dfs(child)
    }

    static translate(id) {
        return FolderManager._folderMap[id]?.name ?? id
    }

    static translateList(ids) {
        return ids.map(id => this.translate(id))
    }
}
