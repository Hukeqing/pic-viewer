class Config {
    constructor() {
        this._token = process.env.ADMIN_TOKEN ?? '123456'
        this._home = process.env.PIC_HOME ?? undefined
        this._sessionSecret = process.env.SESSION_SECRET ?? Math.random().toString()
        this._baseUrl = process.env.BASE_URL ?? ''
    }

    get token() {
        return this._token
    }

    get home() {
        return this._home;
    }

    get sessionSecret() {
        return this._sessionSecret;
    }

    get baseUrl() {
        return this._baseUrl;
    }
}

const config = new Config()

module.exports = config