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

let curStart = 0, curEnd = 0, onload = 0, loadOnce = 20

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
    child.onclick = () => window.open(`${BASE_URL}/detail.html?code=${code}`, '_blank')
    ++onload
    Service.info(code, () => --onload, res => {
        // noinspection JSUnresolvedReference
        const cost = res.height / res.width
        let index = 0
        for (let i = 1; i < columnLength.length; i++)
            if (columnLength[i] < columnLength[index]) index = i
        column[index].appendChild(child)
        columnLength[index] += cost
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
        curEnd = Math.min(imageIdList.length, curEnd + loadOnce)
        loadMore()
        console.log('start', curStart, 'end', curEnd)
    }
}

const start = () => {
    container = document.getElementById("container")
    trigger = document.getElementById("trigger")
    resize()
    Service.list(null, res => {
        // noinspection JSValidateTypes
        imageIdList = res
        curStart = 0
        curEnd = Math.min(imageIdList.length, loadOnce)
        loadMore()
        document.body.onscroll = scroll
    }, res => {
        if (res.code === 1) {
            window.location.href = `${BASE_URL}/login.html`
        }
    })
}
