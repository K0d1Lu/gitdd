import * as child from 'child_process'
import util from 'util'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

import { getRepoFromUrl } from './modules/strings.mjs'
import { datas } from './modules/datas.mjs'

/**
 * Download subfolder from any git repository
 *
 * @async
 * @function gitd
 *
 * @param {String} url - git url to get the files from
 * @param {Object} [options] - options to pass to cli script
 * @param {String} [options.dir] - subfolder of the git repository to download (defaulted to the whole repository)
 * @param {String} [options.out] - folder where to dowload the (defaulted to the repository name)
 * @param {String} [options.branch] - branch to checkout (defaulted to master)
 * @param {Boolean} [options.history] - manage if we keep history or not (if not .git folder is deleted, defaulted to false)
 * @param {Boolean} [options.flatten] - manage if we put subdirectory files into the root of output folder or not (defaulted to true)
 *
 * @returns {Promise} Reject with error code and message if an error occured || resolve with an object containing the path to the files
 */
export default async function gitd(
	url,
	{ dir, out, branch, history, flatten } = {}
) {
	const exec = util.promisify(child.exec)
	const n = 'node'
	const p = path.resolve(__dirname, './cli.mjs')
	const u = `-u ${url}`
	const d = dir ? `-d ${dir}` : ''
	const o = out ? `-o ${out}` : ''
	const b = branch ? `-b ${branch}` : ''
	const h = typeof history !== 'undefined' ? `-h ${history}` : ''
	const f = typeof flatten !== 'undefined' ? `-f ${flatten}` : ''

	const cmd = `${n} ${p} ${u} ${d} ${o} ${b} ${h} ${f}`
	datas.output = out ? out : `${process.cwd()}/${getRepoFromUrl(url)}`
	await exec(cmd)

	return {
		path: dir && flatten === false ? `${datas.output}/${dir}` : datas.output,
	}
}

/**
 * Called when main script is on error
 * It gives insight aboout the internal error and remove created folder
 *
 * @param {Object} error - Error object
 * @param {Boolean} [delete] - Flag to delete or not the output folder
 */
export function handleGitdError(error, del = true) {
	let message
	const { code = 0 } = error
	switch (code) {
		case 42:
			message = 'git must be installed to run gitd'
			break
		case 43:
			message = 'url must be a git repository (i.e : ending with.git)'
			break
		case 44:
			message =
				'git pull failed, please check repository, directory and branch names'
			break
		default:
			message = 'unknown error occured during gitd execution'
	}

	if (del) {
		child.exec(`rm -rf ${datas.output}`)
	}

	return { code, message }
}
