import fs from 'fs'
import shelljs from 'shelljs'
import gitd from '~main.mjs'

describe('Main module', function () {
	it('Should export a gitd method', function () {
		expect(gitd).toBeDefined()
	})

	describe('Gitd method resolve cases', function () {
		afterEach(() => {
			shelljs.exec('rm -rf gitd')
			shelljs.exec('rm -rf custom-folder')
		})

		it('Should resolve with a path if files were downloaded', () => {
			return gitd('https://github.com/K0d1Lu/gitd.git').then(r => {
				expect(r.path).toEqual(`${process.cwd()}/gitd`)
			})
		})

		it('Should resolve with a path if folder is given', () => {
			return gitd('https://github.com/K0d1Lu/gitd.git', {
				dir: 'src',
			}).then(r => {
				expect(r.path).toEqual(`${process.cwd()}/gitd`)
			})
		})

		it('Should resolve with an extended path if folder is given and flatten is false', () => {
			return gitd('https://github.com/K0d1Lu/gitd.git', {
				dir: 'src',
				flatten: false,
			}).then(r => {
				expect(r.path).toEqual(`${process.cwd()}/gitd/src`)
			})
		})

		it('Should resolve with a custom path if output option is given', () => {
			return gitd('https://github.com/K0d1Lu/gitd.git', {
				out: 'custom-folder',
			}).then(r => {
				expect(r.path).toEqual('custom-folder')
			})
		})

		it('Should resolve with a custom path if output, dir options are given', () => {
			return gitd('https://github.com/K0d1Lu/gitd.git', {
				dir: 'src',
				out: 'custom-folder',
			}).then(r => {
				expect(r.path).toEqual('custom-folder')
			})
		})

		it('Should resolve with an extended custom path if output, dir and flatten options are given', () => {
			return gitd('https://github.com/K0d1Lu/gitd.git', {
				dir: 'src',
				out: 'custom-folder',
				flatten: false,
			}).then(r => {
				expect(r.path).toEqual('custom-folder/src')
			})
		})

		it('Should delete .git folder if history option is not passed', () => {
			return gitd('https://github.com/K0d1Lu/gitd.git').then(r => {
				expect(fs.existsSync(`${r.path}/.git`)).toBe(false)
			})
		})

		it('Should not delete .git folder if history option is passed to true', () => {
			return gitd('https://github.com/K0d1Lu/gitd.git', { history: true }).then(
				r => {
					expect(fs.existsSync(`${r.path}/.git`)).toBe(true)
				}
			)
		})
	})

	describe('Gitd method error handling', function () {
		it('Should reject if url does not end wit .git', () => {
			return gitd('https://github.com/K0d1Lu/gitd').catch(err => {
				expect(err.message).toEqual(
					'url must be a git repository (i.e : ending with.git)'
				)
				expect(err.code).toEqual(43)
			})
		})

		it('Should reject if git pulled failed because of wrong branch name', () => {
			return gitd('https://github.com/K0d1Lu/gitd.git', {
				branch: 'no-existing-branch',
			}).catch(err => {
				expect(err.message).toEqual(
					'git pull failed, please check repository, directory and branch names'
				)
				expect(err.code).toEqual(44)
			})
		})

		it('Should reject if git pulled failed because of wrong repository name', () => {
			return gitd('https://github.com/K0d1Lu/gitddd.git').catch(err => {
				expect(err.message).toEqual(
					'git pull failed, please check repository, directory and branch names'
				)
				expect(err.code).toEqual(44)
			})
		})

		it('Should reject if git pulled failed because of wrong directory name', () => {
			return gitd('https://github.com/K0d1Lu/gitd.git', {
				dir: 'non-existing-directory',
			}).catch(err => {
				expect(err.message).toEqual(
					'git pull failed, please check repository, directory and branch names'
				)
				expect(err.code).toEqual(44)
			})
		})

		it('Should delete the output directory in case of failure', () => {
			return gitd('https://github.com/K0d1Lu/gitd').catch(() => {
				expect(fs.existsSync(`${process.cwd()}/gitd`)).toBe(false)
			})
		})
	})
})
