/**
 * @typedef Result
 * @property {number} code
 * @property {string} msg
 * @property {JSON} data
 */

const BASE_URL = ''
const HEADER = {"Content-Type": "application/json"}

/**
 * @param {Promise<Response>} res
 * @returns {Promise<JSON>}
 */
const deal = async (res) => {
    const result = await res
    if (result.status !== 200) {
        throw {code: -1, msg: `network error, code: ${result.status}`}
    }

    /**
     * @type {Result}
     */
    const body = await result.json()
    if (body.code) {
        throw {msg: body.msg, code: body.code}
    } else {
        return body.data
    }
}

/**
 * @param url
 * @param params
 * @returns {Promise<JSON>}
 */
const get = async (url, params) => {
    const paramUrl = Object.entries(params).map(value => {
        return `${value[0]}=${value[1]}`
    }).join('&')
    url += '?' + paramUrl
    return await deal(fetch(`${BASE_URL}${url}`, {method: "GET"}))
}

/**
 * @param url
 * @param data
 * @returns {Promise<JSON>}
 */
const post = async (url, data) => {
    return await deal(fetch(`${BASE_URL}${url}`,
        {method: "POST", body: JSON.stringify(data), headers: HEADER}))
}
