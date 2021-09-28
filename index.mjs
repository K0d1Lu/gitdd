import gitdd from 'gitdd'
import { handleGitdError } from 'gitdd'

/**
 * Implementation exemple
 * To run it from your console type :
 * `npm link && npm link gitdd && node index.mjs`
 */
gitdd('https://github.com/vuejs/vue-cli.git', { branch: 'master', dir: 'docs' })
	.then(r => console.log('Success : Files downloaded into ', r.path))
	.catch(e => {
		const { code, message } = handleGitdError(e)
		console.error(`Error ${code} : ${message}`)
	})
