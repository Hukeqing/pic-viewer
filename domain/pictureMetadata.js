class Palette {
    /**
     * @type {[number, number, number]}
     */
    color;

    /**
     * @type {number}
     */
    ratio;
}

class PictureMetadata {
    /**
     * @type {string}
     */
    id;

    /**
     * @type {string}
     */
    name;

    /**
     * @type {number}
     */
    size;

    // noinspection SpellCheckingInspection
    /**
     * @type {Date}
     */
    btime;

    /**
     * @type {Date}
     */
    mtime;

    /**
     * @type {string}
     */
    ext;

    /**
     * @type {Array.<string>}
     */
    tags;

    /**
     * @type {Array.<string>}
     */
    folders;

    /**
     * @type {boolean}
     */
    isDeleted;

    /**
     * @type {string}
     */
    url;

    /**
     * @type {string}
     */
    annotation;

    /**
     * @type {Date}
     */
    modificationTime;

    /**
     * @type {number}
     */
    height;

    /**
     * @type {number}
     */
    width;

    /**
     * @type {boolean}
     */
    noThumbnail;

    /**
     * @type {Array.<Palette>}
     */
    palettes;

    /**
     * @type {Date}
     */
    lastModified;
}

module.exports = PictureMetadata
