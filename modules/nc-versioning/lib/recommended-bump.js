const conventionalRecommendedBump = require('conventional-recommended-bump');

module.exports = function (tagPrefix) {
    return new Promise((resolve, reject) => {
        conventionalRecommendedBump({
            preset: require.resolve('conventional-changelog-conventionalcommits'),
            tagPrefix: tagPrefix
        }, function (err, release) {
            if (err) return reject(err);
            else return resolve(release)
        })
    })
};
