const fs = require("fs");
const accessSync = require('fs-access').sync;
const conventionalChangelog = require('conventional-changelog');
const START_OF_LAST_RELEASE_PATTERN = /(^#+ \[?[0-9]+\.[0-9]+\.[0-9]+|<a name=)/m

const defaults = {
    infile: 'CHANGELOG.md',
    header: 'All notable changes to this project will be documented in this file.',
    // tagPrefix: 'v',
};

module.exports = function (version, argv) {
    return new Promise((resolve, reject) => {
        const args = Object.assign({}, defaults, argv)
        createIfMissing(args);
        const header = args.header;

        let oldContent = fs.readFileSync(args.infile, 'utf-8');
        const oldContentStart = oldContent.search(START_OF_LAST_RELEASE_PATTERN);

        // find the position of the last release and remove header:
        if (oldContentStart !== -1) {
            oldContent = oldContent.substring(oldContentStart);
        }
        let content = '';
        const context = {version: version};
        const changelogStream = conventionalChangelog({
            tagPrefix: args.tagPrefix,
            preset: {
                name: 'conventionalcommits',
                commitUrlFormat: '{{host}}/projects/{{owner}}/repos/{{repository}}/commits/{{hash}}',
                compareUrlFormat: '{{host}}/projects/{{owner}}/repos/{{repository}}/compare/diff?targetBranch=refs/tags/{{previousTag}}&sourceBranch=refs/tags/{{currentTag}}',
            }
        }, context, {merges: null, path: args.path})
            .on('error', function (err) {
                return reject(err)
            });

        changelogStream.on('data', function (buffer) {
            content += buffer.toString()
        });

        changelogStream.on('end', function () {
            fs.writeFileSync(args.infile, header + '\n' + (content + oldContent).replace(/\n+$/, '\n'), 'utf8')
            return resolve(content)
        })
    })
};

function createIfMissing(args) {
    try {
        accessSync(args.infile, fs.F_OK)
    } catch (err) {
        if (err.code === 'ENOENT') {
            fs.writeFileSync(args.infile, '\n', 'utf8')
        }
    }
}