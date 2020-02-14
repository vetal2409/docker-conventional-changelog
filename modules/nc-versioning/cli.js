#!/usr/bin/env node
const latestSemver = require('./lib/latest-semver');
const recommendedBump = require('./lib/recommended-bump');
const bumpVersion = require('./lib/bump-version');
const tagGenerator = require('./lib/tag-generator');
const changelog = require('./lib/changelog');


function addTagPrefixOption(yargs) {
    return yargs
        .option('tagPrefix', {
            alias: 't',
            describe: 'Set a custom prefix for the git tag to be created',
            type: 'string',
            default: '',
            // demandOption: true
        });
}

const cli = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command('latestVersion [tagPrefix]', 'Get the latest version extracted from git tags', (yargs) => {
        addTagPrefixOption(yargs)
    }, (argv) => {
        latestSemver(argv.tagPrefix).then(console.log)
    })
    .command('recommendedBump [tagPrefix]', 'Get the releaseType', (yargs) => {
        addTagPrefixOption(yargs)
    }, (argv) => {
        recommendedBump(argv.tagPrefix).then((release) => console.log(release.releaseType))
    })
    .command('bumpVersion', 'Get the releaseType', (yargs) => {
        yargs
            .option('ver', {
                describe: 'Current version w/o prefix and prerelease',
                type: 'string',
                demandOption: true
            })
            .option('releaseType', {
                alias: 'r',
                describe: 'One of release types: major | minor | patch',
                type: 'string',
                demandOption: true
            })
    }, (argv) => {
        console.log(bumpVersion(argv.ver, argv.releaseType));
    })
    .command('generateTags', 'generate tags based on version', (yargs) => {
        addTagPrefixOption(yargs)
            .option('ver', {
                describe: 'Current version w/o prefix and prerelease',
                type: 'string',
                demandOption: true
            })
            .option('includedParent', {
                alias: 'i',
                describe: 'Generate not only 1.2.3 but also generate 1.2 and 1',
                type: 'boolean',
                default: false
            })
    }, (argv) => {
        console.log(argv.tagPrefix);
        console.log(tagGenerator(argv.ver, argv.tagPrefix, argv.includedParent).join(' '));
    })
    .command('changelog', 'Generate changelog', (yargs) => {
        addTagPrefixOption(yargs)
            .option('ver', {
                describe: 'Current version w/o prefix and prerelease',
                type: 'string',
                demandOption: true
            })
    }, (argv) => {
        changelog(argv.ver, {tagPrefix: argv.tagPrefix}).then(console.log)
    })
    .example('$0 latestVersion', 'Get the latest version extracted from git tags')
    .demandCommand(1, 'You need at least one command before moving on')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2020')
    .argv;
