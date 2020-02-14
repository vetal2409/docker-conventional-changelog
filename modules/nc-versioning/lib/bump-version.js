const semver = require('semver');

module.exports = function (currentVersion, releaseType) {
    return semver.inc(currentVersion, releaseType);
};
