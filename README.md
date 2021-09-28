# ![gitdd](gitdd.png)

## GIT DIRECTORY DOWNLOADER

> The easiest way to download particular directory of any git repository.
>



## Usage

### CLI

```bash
gitdd -u https://link-to-any-git-repository/project.git -d docs -o mydocs

Options :

-u given url of the git repository (mandatory)
-d folder to download (optional - default: repository name)
-o output folder (optional - default: repository name)
-b branch to checkout (optional - default: "main")
-h keep git history (optional - default: false)
-f move subdir content to output root (optional - default: true)
```

Type `$ gitdd --help`to get more insight

Be careful that default branch name is "main" and not "master", according to new git policy. Check this first if the script failed.

We support ssh connection to retrieve git files, just pass the git address in its ssh format (i.e _git@endpoint:project/repository.git_).

### Javascript module

```javascript
import gitdd from 'gitdd'

gitdd
	.(url, [{ dir, out, branch, history, flatten }])
	.then(() => {
		// use your files
	})
	.catch(err => {
		// error handling
  	const { code, message } = handleGitdError(err) // get internal error descriptor
	})
```

`dir`, `out` and `branch`, `history`, `flatten` parameters are passed in an object and each of them is optional. They are defaulted the same way as they are in the CLI usage version.

## Installation

### For CLI usage

`$ npm i -g gitdd`

or

`$ npx gitdd`

### For in project usage

`npm i gitdd`

## **How to Contribute**

1. Clone repo and create a new branch: `$ git checkout https://github.com/K0d1Lu/gitdd -b name_for_new_branch`.
2. Make changes and test
3. Submit Pull Request with comprehensive description of changes

## **Acknowledgements**

- Stackoverflow community, especially this [answers](https://stackoverflow.com/a/30230735).
- Base logo made from official GIT logo.
