import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

import shelljs from 'shelljs'
import { getRepoFromUrl } from './modules/strings.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const cli = path.resolve(__dirname, 'cli.mjs')

/**
 * Download subfolder from any git repository
 *
 * @async
 * @function gitd
 *
 * @param {String} url - git url to get the files from
 * @param {Object} [options] - options to pass to cli script
 * @param {String} [options.folder] - subfolder of the git repository to download (defaulted to the whole repository)
 * @param {String} [options.output] - folder where to dowload the (defaulted to the repository name)
 * @param {String} [options.branch] - branch to checkout (defaulted to master)
 * @param {Boolean} [options.history] - manage if we keep history or not (if not .git folder is deleted, defaulted to false)
 * @param {Boolean} [options.flatten] - manage if we put subdirectory files into the root of output folder or not (defaulted to true)
 *
 * @returns {Promise} Reject with error code and message if an error occured || resolve with an object containing the path to the files
 */
export default async function gitd(
	url,
	{ folder, output, branch, history, flatten }
) {
	const cmd = `node ${cli} -u ${url} ${folder ? '-d ' + folder : ''} ${
		output ? '-o ' + output : ''
	} ${branch ? '-b ' + branch : ''} ${history ? '-h' + history : ''} ${
		flatten ? '-f' + flatten : ''
	}}`

	const { code } = await shelljs.exec(cmd)
	const out = output ? output : `${process.cwd()}/${getRepoFromUrl(url)}`

	if (!code) {
		return {
			path: folder && flatten !== false ? `${out}/${folder}` : out,
		}
	}

	let message

	switch (code) {
		case 42:
			message = 'git must be installed to run gitd'
			break
		case 43:
			message = 'url must be a git repository (i.e : ending with.git)'
			break
		case 44:
			message = 'git pull failed, please check folder or branch name'
			break
		default:
			message = 'unknown error occured during gitd execution'
	}

	shelljs.exec(`rm -rf ${out}`)

	throw { code, message }
}
