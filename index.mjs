import gitd from 'gitd'
import { handleGitdError } from 'gitd'

/**
 * Implementation exemple
 * To run it from your console type :
 * `npm link && npm link gitd && node index.mjs`
 */
gitd('https://github.com/vuejs/vue-cli.git', { branch: 'master', dir: 'docs' })
	.then(r => console.log('Success : Files downloaded into ', r.path))
	.catch(e => {
		const { code, message } = handleGitdError(e)
		console.error(`Error ${code} : ${message}`)
	})
