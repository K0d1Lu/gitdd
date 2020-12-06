# ![gitd](gitd.png)

The easiest way to download particular directory of any git repository. 

## Usage

### CLI

```bash
gitd -u https://link-to-any-git-repository/project.git -d docs -o mydocs

Options :

-u given url of the git repository (mandatory)
-d folder to download (optional - default to repository name)
-o output folder (optional - default to repository name)
```



Type `$ gitd --help`to get more insight



### Javascript module

```javascript
import gitd from 'gitd'

gitd.download(url, [folder], [output])
    .then(() => {
        // use your files
    })
    .catch(err => {
        // error handling
    })
```



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
-  Base logo made from official GIT logo.

