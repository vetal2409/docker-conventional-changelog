const latestSemver = require('./lib/latest-semver');
const recommendedBump = require('./lib/recommended-bump');
const bumpVersion = require('./lib/bump-version');
const tagGenerator = require('./lib/tag-generator');
const annotatedTag = require('./lib/annotated-tag');


(async function() {
    try {
        let tagPrefix = 'v'; //todo: tmp

        let latestVersion = await latestSemver(tagPrefix);
        console.log('latestSemver: ' + latestVersion);

        let newVersion = '1.0.0';
        if ('' !== latestVersion) {
            let release = await recommendedBump(tagPrefix);
            console.log('release: ' + release.releaseType);

            newVersion = bumpVersion(latestVersion, release.releaseType);
            console.log('newVersion: ' + newVersion);
        }

        let tags = tagGenerator(newVersion, tagPrefix, true);
        console.log('generated tags: ' + tags);

        let tagsPromises = tags.map(tag => {
            console.log('Going to tag: ' + tag);
            return annotatedTag(tag, 'chore(release): ' + tag).then(console.log)
        });

        await Promise.all(tagsPromises);

//             //todo: changelog
//             //todo: commit
//             //todo: push
    } catch (err) {
        console.error(err);
    }
})();
