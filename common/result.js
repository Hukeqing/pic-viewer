class Result {
    code;
    msg;
    data;

    constructor(code, msg, data) {
        this.code = code
        this.msg = msg
        this.data = data
    }

    static ok() {
        return new Result(0, null, null)
    }

    static ofOk(data) {
        return new Result(0, null, data)
    }

    static fail(code) {
        return new Result(code, null, null)
    }

    static ofFail(code, msg) {
        return new Result(code, msg, null)
    }
}

class Error {
    static SYSTEM_ERROR = new Error(-2, 'System Error')
    static NOT_FOUND = new Error(-1, 'oops! not found')
    static NEED_LOGIN = new Error(1, 'need login')
    static PWD_ERROR = new Error(2, 'password error')

    code;
    msg;

    constructor(code, msg) {
        this.code = code
        this.msg = msg
    }

    asResult() {
        return Result.ofFail(this.code, this.msg)
    }

    toResult(msg) {
        return Result.ofFail(this.code, msg)
    }
}

module.exports = {Result, Error}