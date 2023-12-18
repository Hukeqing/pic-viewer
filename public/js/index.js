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
 * @type {Array.<string>}
 */
let imageIdList = null

let curStart = 0, curEnd = 100

const resize = () => {
    const width = window.innerWidth
    const minWidth = 300
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
    get(`/api/image/${code}/info`, {}).then(res => {
        // noinspection JSUnresolvedReference
        const cost = res.height / res.width
        let index = 0
        for (let i = 1; i < columnLength.length; i++)
            if (columnLength[i] < columnLength[index]) index = i
        column[index].appendChild(child)
        columnLength[index] += cost
    })
}

const flush = () => {
    for (let i = curStart; i < curEnd; i++) {
        add(imageIdList[i])
    }
}

const start = () => {
    container = document.getElementById("container")
    resize()
    get('/api/home/image/list', {}).then(res => {
        // noinspection JSValidateTypes
        imageIdList = res
        curStart = 0
        curEnd = Math.min(imageIdList.length, 100)
        flush()
    })
}
