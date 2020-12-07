#!/usr/bin/env node

import shelljs from 'shelljs'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { getRepoFromUrl } from './modules/strings.mjs'

// git is mandatory to run gitd
if (!shelljs.which('git')) {
	shelljs.echo('Sorry, this script requires git')
	shelljs.exit(42)
}

/**
 * Setup cli options
 * Set aliases and support --help
 */
const args = yargs(hideBin(process.argv))
	.options({
		url: {
			alias: 'u',
			demandOption: true,
			describe: 'url of the git repository',
			type: 'string',
		},
		dir: {
			alias: 'd',
			demandOption: false,
			describe: 'subdirectory to download',
			type: 'string',
		},
		out: {
			alias: 'o',
			demandOption: false,
			describe: 'local directory where to download files',
			type: 'string',
		},
		branch: {
			alias: 'b',
			demandOption: false,
			describe: 'branch to get the files from',
			type: 'string',
			default: 'master',
		},
		history: {
			alias: 'h',
			demandOption: false,
			describe: 'keep git history of the downloaded folder',
			type: 'boolean',
			default: false,
		},
		flatten: {
			alias: 'f',
			demandOption: false,
			describe: 'move subdirectory files and folder to output folder root',
			type: 'boolean',
			default: true,
		},
	})
	.example(
		'$0 -u https://git.com/owner/repo.git -d docs -o repo-docs -b dev',
		'will create a "repo-docs" directory and clone the subdirectory docs of the "repo" repository into it.'
	)
	.check(argv => {
		if (argv.url.slice(argv.url.length - 4) !== '.git') {
			shelljs.echo('url must be a git repository (i.e : ending with.git)')
			shelljs.exit(43)
		} else {
			return true
		}
	}).argv

// Initialise constants
const { url } = args

const repo = getRepoFromUrl(url)
const { dir, branch, history, flatten } = args
const { out = repo } = args

// create directory and make it current directory
shelljs.mkdir(out)
shelljs.cd(out)

// Exec git commands
/*
1. git init
2. git add remote origin
3. git config core.sparseCheckout to true
4. echo dirname into .git/info/sparse-checkout
5. git pull
*/
shelljs.exec('git init')
shelljs.exec(`git remote add origin ${url}`)

if (dir) {
	shelljs.exec('git config core.sparseCheckout true')
	shelljs.exec(`echo "${dir}" > .git/info/sparse-checkout`)
}

if (
	shelljs.exec(`git pull origin ${branch} ${history ? '' : '--depth 1'}`)
		.code !== 0
) {
	shelljs.echo(
		'git pull failed, please check repository, folder and branch names'
	)
	shelljs.exit(44)
}

if (!history) {
	shelljs.exec('rm -rf .git')
}

if (flatten) {
	shelljs.exec(`cd ${dir} && mv * ../`)
	shelljs.exec(`rm -rf ${dir}`)
}
