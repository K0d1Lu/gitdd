import { getRepoFromUrl } from '~modules/strings.mjs'

describe('Strings manipulatiton methods', function () {
	describe('getRepoFromUrl method', function () {
		it('Should return repository name when a .git url is passed', function () {
			const repoName = getRepoFromUrl('http://site.com/user/repo-name.git')
			expect(repoName).toEqual('repo-name')
		})
	})
})
