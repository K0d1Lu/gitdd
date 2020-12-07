/**
 * Extract git repository name from a given git url
 *
 * @param {String} url url to parse
 * @returns {String} name of the git repository
 */
export function getRepoFromUrl(url) {
	const parts = url.split('/')
	const gitPart = parts[parts.length - 1]
	return gitPart.split('.')[0]
}
