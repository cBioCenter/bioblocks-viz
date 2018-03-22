# Getting Started

## Pre-Requisites

In order to build and run the chell-viz repo, all you will need to manually download is a package manager - This project is using [yarn](https://yarnpkg.com/), but `npm` _should_ _mostly_ suffice.

Once that is installed, open a shell/terminal/command-line to the repo and install all the dependencies with the following command:

```sh
yarn
```

This will create and populate a `node_modules` folder containing all of our external npm dependencies. [Please refrain from peeking inside](https://medium.com/@jdan/i-peeked-into-my-node-modules-directory-and-you-wont-believe-what-happened-next-b89f63d21558).

## Developer Tools

This section is to briefly go over some tools to hopefully make your development experience as cozy as possible, but should not in any way be required to run chell visualizations.

### VS Code

Quick detour for tools! It is highly recommended to use [Visual Studio Code](https://code.visualstudio.com/) as your IDE for this project, to take advantage of quite a few developer perks. Simply open the chell-viz folder in VSCode to get started!

#### Extensions

First things first, assuming you're a ~fresh convert~ new user, open the extensions panel with `⇧⌘X`. Select `Show Recommended Extensions` like so:

![Show Recommended Extensions](./assets/recommended_extensions.png)

This will populate a list of about 20 various extensions recommended by the Chell team.

Some of them aren't really specific to this project, like the IDE themes, while some _do_ have settings set up in the `.vscode` directory. Two such extensions are the Code Spell Checker and Debugger for Chrome.

Speaking of...

#### Debugging

Let's now open the debug panel in VSCode, either by clicking the icon or with the keyboard command `⇧⌘D`. There should be a single option selected, `Launch Chrome against localhost`:

![Initial Debug Menu](./assets/vscode_debug.png)

This will start a webpack-dev-server, and open chrome to `http://localhost:8080"`. Further, you can freely use all the normal debug tools like breakpoints. All from the IDE!

#### Formatting

The `formatOnSave` setting is enabled in this workspace, which if you installed the recommended `Prettier Code Formatter` extension, will automatically use the repo's `.prettierrc` file to format code for you in-editor!

### Oh My Zsh

If you're looking to step your shell/terminal/command-line game up, might I recommend [Oh My Zsh](https://github.com/robbyrussell/oh-my-zsh)?

### Ack

I like using [https://beyondgrep.com/](ack) in place of grep. That's about it.

### Workflow

Currently we have 2 stages of checks for code when you are ready to submit a PR.

The first actually happens locally! There is a git pre-commit hook which will run the linter and formatter on _staged_ files, as well as writing the changes to the commit! So if you forgot a semicolon, don't worry, it will automagically be appended and require _no extra work on your part_.

The second phase happens via our [Circle CI Server](circleci.com/gh/cBioCenter/chell-viz) when a PR is made against master. It will checkout, build, lint and test the code. The test results and coverage report are also saved as artifacts for each job.
