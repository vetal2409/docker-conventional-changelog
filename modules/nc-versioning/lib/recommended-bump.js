const conventionalRecommendedBump = require('conventional-recommended-bump');

/**
 * Calculate the release. release.releaseType can be one of the following values: major | minor | patch
 * @param tagPrefix
 * @returns {Promise<Object>}
 */
module.exports = function (tagPrefix) {
    return new Promise((resolve, reject) => {
        conventionalRecommendedBump({
            preset: require.resolve('conventional-changelog-conventionalcommits'),
            tagPrefix
        }, function (err, release) {
            if (err) {
                return reject(err);
            }

            return resolve(release);
        })
    })
};
