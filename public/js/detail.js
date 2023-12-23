/**
 * @type {string}
 */
let code

/**
 * @type {PictureMetadata}
 */
let metadata

const displaySize = (size) => {
    const code = ['', 'Ki', 'Mi', 'Gi', 'Ti']
    let ceil = 1024
    for (const suffer of code) {
        if (size < ceil) {
            return `${Math.ceil(size / ceil * 102400) / 100}${suffer}B`
        }
        ceil *= 1024
    }
}

const start = () => {
    // get code
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=");
        if (pair[0] === 'code') {
            code = pair[1]
            break
        }
    }

    Service.info(code, null, res => {
        metadata = res
        document.getElementById("info-id").innerText = metadata.id
        document.getElementById("info-name").innerText = metadata.name
        document.getElementById("info-size").innerText = displaySize(metadata.size)
        document.getElementById("info-tags").innerText = metadata.tags
        document.getElementById("info-folders").innerText = metadata.folders
        document.getElementById("info-url").innerText = metadata.url
        document.getElementById("info-url").href = metadata.url
        document.getElementById("info-shape").innerText = `${metadata.width} * ${metadata.height}`
        for (let i = 0; i < Math.min(metadata.palettes.length, 10); i++) {
            const palette = metadata.palettes[i]
            document.getElementById(`palette-${i}`).style.backgroundColor =
                `rgb(${palette.color[0]}, ${palette.color[1]}, ${palette.color[2]})`
        }
    }, res => {
        alert(res.msg)
    })

    document.getElementById("img").src = `/api/image/${code}/full`
}
