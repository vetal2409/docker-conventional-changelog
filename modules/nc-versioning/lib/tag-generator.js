const semver = require('semver');

module.exports = function (version, tagPrefix, includeParent) {
    //todo: prerelease
    let v = new semver.SemVer(version);
    let tags = [];
    tags.push(tagPrefix + [v.major, v.minor, v.patch].join('.'));

    if (includeParent) {
        tags.push(tagPrefix + [v.major, v.minor].join('.'));
        tags.push(tagPrefix + [v.major].join('.'));
    }

    return tags
};
