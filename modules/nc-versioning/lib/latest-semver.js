const gitSemverTags = require('git-semver-tags');
const semver = require('semver');

/**
 * Calculate the last semver tag with specific prefix
 *
 * @param tagPrefix
 * @returns {Promise<string>}
 */
module.exports = function (tagPrefix) {
    return new Promise((resolve, reject) => {
        gitSemverTags({
            tagPrefix: tagPrefix
        }, function (err, tags) {
            if (err) {
                return reject(err);
            }

            if (!tags.length) {
                return resolve('');
            }

            // ensure that the largest semver tag is at the head.
            const [highestTagWithoutPrefix] = tags.map(tag => cleanPrefix(tag, tagPrefix)).sort(semver.rcompare);

            return resolve(highestTagWithoutPrefix)
        })
    })
};

const cleanPrefix = (version, prefix) => {
    const semVersion = semver.parse(version.trim().split(prefix).join(''));
    return semVersion ? semVersion.version : ''
};
