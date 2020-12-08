# ![gitd](gitd.png)

The easiest way to download particular directory of any git repository.

## Usage

### CLI

```bash
gitd -u https://link-to-any-git-repository/project.git -d docs -o mydocs

Options :

-u given url of the git repository (mandatory)
-d folder to download (optional - default: repository name)
-o output folder (optional - default: repository name)
-b branch to checkout (optional - default: "main")
-h keep git history (optional - default: false)
-f move subdir content to output root (optional - default: true)
```

Type `$ gitd --help`to get more insight

Be careful that default branch name is "main" and not "master", according to new git policy. Check this first if the script failed.

### Javascript module

```javascript
import gitd from 'gitd'

gitd
	.download(url, [{ folder, output, branch, history, flatten }])
	.then(() => {
		// use your files
	})
	.catch(err => {
		// error handling (see error.code and error.message for)
	})
```

`folder`, `output` and `branch`, `history`, `flatten` parameters are passed in an object and each of them is optional. They are defaulted the same way as they are in the CLI usage version.

## Installation

### For CLI usage

`$ npm i -g gitd`

or

`$ npx gitd`

### For in project usage

`npm i gitd`

## **How to Contribute**

1. Clone repo and create a new branch: `$ git checkout https://github.com/K0d1Lu/gitd -b name_for_new_branch`.
2. Make changes and test
3. Submit Pull Request with comprehensive description of changes

## **Acknowledgements**

- Stackoverflow community, especially this [answers](https://stackoverflow.com/a/30230735).
- Base logo made from official GIT logo.
