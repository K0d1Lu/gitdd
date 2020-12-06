#!/usr/bin/env node

import shelljs from 'shelljs'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

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
	})
	.example(
		'$0 -u https://git.com/owner/repo.git -d docs -o repo-docs',
		'will create a "repo-docs" directory and clone the subdirectory docs of the "repo" repository into it.'
	)
	.check(argv => {
		if (argv.url.slice(argv.url.length - 4) !== '.git') {
			throw new Error('Url must be a git repository (i.e : ending with.git)')
		} else {
			return true
		}
	}).argv

// Initialise constants
const { url } = args

const repo = getRepoFromUrl(url)
const { dir } = args
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
	shelljs.exec(`echo ${dir} > .git/info/sparse-checkout`)
}

shelljs.exec('git pull origin master')

/**
 * Extract git repository name from a given git url
 *
 * @param {String} url url to parse
 * @returns {String} name of the git repository
 */
function getRepoFromUrl(url) {
	const parts = url.split('/')
	const gitPart = parts[parts.length - 1]
	return gitPart.split('.')[0]
}
