const semver = require('semver');

/**
 * Bump the version based on release type (major | minor | patch)
 *
 * @param currentVersion string
 * @param releaseType string
 * @returns string
 */
module.exports = function (currentVersion, releaseType) {
    return semver.inc(currentVersion, releaseType);
};
