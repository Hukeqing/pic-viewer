/**
 * @type {Array.<HTMLElement>}
 */
const column = []

/**
 * @type {Array.<number>}
 */
const columnLength = []

/**
 * @type {HTMLElement}
 */
let container = null

/**
 * @type {HTMLElement}
 */
let trigger = null

/**
 * @type {Array.<string>}
 */
let imageIdList = null

let curStart = 0, curEnd = 100, onload = 0

const resize = () => {
    const width = window.innerWidth
    const minWidth = 200
    const columnNum = Math.ceil(width / minWidth)
    // remove old
    for (const columnElement of column) {
        container.removeChild(columnElement)
    }

    column.length = 0
    columnLength.length = 0

    let gridTemplateColumns = ''
    for (let i = 0; i < columnNum; i++) {
        const child = document.createElement("div")
        child.className = 'flow'
        container.appendChild(child)
        column.push(child)
        columnLength.push(0)
        if (i !== 0) gridTemplateColumns += ' '
        gridTemplateColumns += '1fr'
    }
    container.style.gridTemplateColumns = gridTemplateColumns
}

const add = (code) => {
    const child = document.createElement("img")
    child.src = `${BASE_URL}/api/image/${code}/thumbnail`
    child.className = 'thumbnail'
    child.loading = 'lazy'
    ++onload
    get(`/api/image/${code}/info`, {}).then(res => {
        // noinspection JSUnresolvedReference
        const cost = res.height / res.width
        let index = 0
        for (let i = 1; i < columnLength.length; i++)
            if (columnLength[i] < columnLength[index]) index = i
        column[index].appendChild(child)
        columnLength[index] += cost
        --onload
    }).catch(() => {
        --onload
    })
}

const isInViewPortOfTwo = (el) => {
    const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    const top = el.getBoundingClientRect() && el.getBoundingClientRect().top
    return top <= viewPortHeight + 100
}

const loadMore = () => {
    for (let i = curStart; i < curEnd; i++) {
        add(imageIdList[i])
    }
}

const scroll = () => {
    if (onload) return
    if (isInViewPortOfTwo(trigger)) {
        curStart = curEnd
        curEnd = Math.min(imageIdList.length, curEnd + 100)
        loadMore()
        console.log('start', curStart, 'end', curEnd)
    }
}

const start = () => {
    container = document.getElementById("container")
    trigger = document.getElementById("trigger")
    resize()
    get('/api/home/image/list', {}).then(res => {
        // noinspection JSValidateTypes
        imageIdList = res
        curStart = 0
        curEnd = Math.min(imageIdList.length, 100)
        loadMore()
        document.body.onscroll = scroll
    }).catch(res => {
        if (res.code === 1) {
            window.location.href = '/login.html'
        }
    })
}
