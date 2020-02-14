const fs = require("fs");
const accessSync = require('fs-access').sync;
const conventionalChangelog = require('conventional-changelog');
const START_OF_LAST_RELEASE_PATTERN = /(^#+ \[?[0-9]+\.[0-9]+\.[0-9]+|<a name=)/m
const execSync = require('child_process').execSync;

const defaults = {
    infile: 'CHANGELOG.md',
    header: 'All notable changes to this project will be documented in this file.',
    // tagPrefix: 'v',
};

/**
 * Get tag names for current repository based on Version object
 * @param version
 * @param argv
 * @returns {Promise<string>}
 */
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


        const gitRemoteUrl = execShell('git config --get remote.origin.url');

        const [partWithPossibleTilde] = gitRemoteUrl.split('/').filter(part => part.startsWith('~'));
        console.log('part with tilde: ' + partWithPossibleTilde);
        const partWithoutTilde = partWithPossibleTilde.substr(1);
        console.log('part without tilde: ' + partWithoutTilde);
        const tildeExists = partWithPossibleTilde !== partWithoutTilde;

        if (tildeExists) {
            execShell('git remote set-url origin ' + gitRemoteUrl.replace(partWithPossibleTilde, partWithoutTilde));
        }

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
            if (tildeExists) {
                execShell('git remote set-url origin ' + gitRemoteUrl);
                content = content.replace(new RegExp(partWithoutTilde, 'g'), partWithPossibleTilde)
            }
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

function execShell(command) {
    return execSync(command).toString().trim()
}