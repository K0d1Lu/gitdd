import fs from 'fs'
import shelljs from 'shelljs'
import gitdd from '~main.mjs'
import { handleGitdError } from '~main.mjs'

describe('Main module', function () {
	it('Should export a gitdd method', function () {
		expect(gitdd).toBeDefined()
	})

	describe('gitdd method resolve cases', function () {
		afterEach(() => {
			shelljs.exec('rm -rf gitdd')
			shelljs.exec('rm -rf custom-folder')
		})

		it('Should resolve with a path if files were downloaded', () => {
			return gitdd('https://github.com/K0d1Lu/gitdd.git').then(r => {
				expect(r.path).toEqual(`${process.cwd()}/gitdd`)
			})
		})

		it('Should resolve with a path if folder is given', () => {
			return gitdd('https://github.com/K0d1Lu/gitdd.git', {
				dir: 'src',
			}).then(r => {
				expect(r.path).toEqual(`${process.cwd()}/gitdd`)
			})
		})

		it('Should resolve with an extended path if folder is given and flatten is false', () => {
			return gitdd('https://github.com/K0d1Lu/gitdd.git', {
				dir: 'src',
				flatten: false,
			}).then(r => {
				expect(r.path).toEqual(`${process.cwd()}/gitdd/src`)
			})
		})

		it('Should resolve with a custom path if output option is given', () => {
			return gitdd('https://github.com/K0d1Lu/gitdd.git', {
				out: 'custom-folder',
			}).then(r => {
				expect(r.path).toEqual('custom-folder')
			})
		})

		it('Should resolve with a custom path if output, dir options are given', () => {
			return gitdd('https://github.com/K0d1Lu/gitdd.git', {
				dir: 'src',
				out: 'custom-folder',
			}).then(r => {
				expect(r.path).toEqual('custom-folder')
			})
		})

		it('Should resolve with an extended custom path if output, dir and flatten options are given', () => {
			return gitdd('https://github.com/K0d1Lu/gitdd.git', {
				dir: 'src',
				out: 'custom-folder',
				flatten: false,
			}).then(r => {
				expect(r.path).toEqual('custom-folder/src')
			})
		})

		it('Should delete .git folder if history option is not passed', () => {
			return gitdd('https://github.com/K0d1Lu/gitdd.git').then(r => {
				expect(fs.existsSync(`${r.path}/.git`)).toBe(false)
			})
		})

		it('Should not delete .git folder if history option is passed to true', () => {
			return gitdd('https://github.com/K0d1Lu/gitdd.git', {
				history: true,
			}).then(r => {
				expect(fs.existsSync(`${r.path}/.git`)).toBe(true)
			})
		})
	})

	describe('gitdd method error handling', function () {
		it('Should reject if url does not end wit .git', () => {
			return gitdd('https://github.com/K0d1Lu/gitdd').catch(err => {
				const { code, message } = handleGitdError(err)
				expect(message).toEqual(
					'url must be a git repository (i.e : ending with.git)'
				)
				expect(code).toEqual(43)
			})
		})

		it('Should reject if git pulled failed because of wrong branch name', () => {
			return gitdd('https://github.com/K0d1Lu/gitdd.git', {
				branch: 'no-existing-branch',
			}).catch(err => {
				const { code, message } = handleGitdError(err)

				expect(message).toEqual(
					'git pull failed, please check directory and branch names'
				)
				expect(code).toEqual(45)
			})
		})

		it('Should reject if git pulled failed because of wrong repository name', () => {
			return gitdd('https://github.com/K0d1Lu/gitddd.git').catch(err => {
				const { code, message } = handleGitdError(err)

				expect(message).toEqual('git pull failed, please check repository name')
				expect(code).toEqual(44)
			})
		})

		it('Should reject if git pulled failed because of wrong directory name', () => {
			return gitdd('https://github.com/K0d1Lu/gitdd.git', {
				dir: 'non-existing-directory',
			}).catch(err => {
				const { code, message } = handleGitdError(err)

				expect(message).toEqual(
					'git pull failed, please check directory and branch names'
				)
				expect(code).toEqual(45)
			})
		})

		it('Should delete the output directory in case of failure', () => {
			return gitdd('https://github.com/K0d1Lu/gitdd').catch(err => {
				handleGitdError(err)
				setTimeout(() => {
					expect(fs.existsSync(`${process.cwd()}/gitdd`)).toBe(false)
				}, 0)
			})
		})
	})
})
