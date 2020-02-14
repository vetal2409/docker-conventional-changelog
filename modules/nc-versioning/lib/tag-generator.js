const semver = require('semver');

/**
 * Generate tags
 * Converts v1.2.3 to ['v1', 'v2', 'v3']
 * @param version
 * @param tagPrefix
 * @param includeParent
 * @returns {[]}
 */
module.exports = function (version, tagPrefix, includeParent) {
    let v = new semver.SemVer(version);
    let tags = [];
    tags.push(tagPrefix + [v.major, v.minor, v.patch].join('.'));

    if (includeParent) {
        tags.push(tagPrefix + [v.major, v.minor].join('.'));
        tags.push(tagPrefix + [v.major].join('.'));
    }

    return tags
};
