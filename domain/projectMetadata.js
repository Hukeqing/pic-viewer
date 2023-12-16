class AbstractFolder {
    /**
     * @type {string}
     */
    id;
    /**
     * @type {string}
     */
    name;
    /**
     * @type {string}
     */
    description;
    /**
     * @type {number}
     */
    modificationTime;
    /**
     * @type {string|null}
     */
    orderBy;
    /**
     * @type {boolean}
     */
    sortIncrease;
}


class Folder extends AbstractFolder {
    /**
     * @type {Array.<Folder>}
     */
    children;
    /**
     * @type {Array.<string>}
     */
    tags;
    /**
     * @type {string}
     */
    password;
    /**
     * @type {string}
     */
    passwordTips;
}

class SmartFolder extends AbstractFolder {
    /**
     * TODO: support smart folder
     *
     * @type {Array.<*>}
     */
    conditions;

    /**
     * @type {Array.<SmartFolder>}
     */
    children;
}

class TagGroup {
    /**
     * @type {string}
     */
    id;
    /**
     * @type {string}
     */
    name;
    /**
     * @type {Array.<string>}
     */
    tags;
}

class ProjectMetadata {
    /**
     * @type {Array.<Folder>}
     */
    folders;

    /**
     * @type {Array.<SmartFolder>}
     */
    smartFolders;

    /**
     * TODO: support quick access
     *
     * @type {Array.<*>}
     */
    quickAccess;

    /**
     * @type {Array.<TagGroup>}
     */
    tagsGroups;

    /**
     * @type {Date}
     */
    modificationTime;

    /**
     * @type {string}
     */
    applicationVersion;
}

module.exports = {Folder, SmartFolder, TagGroup, ProjectMetadata}
