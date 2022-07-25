# cli - web terminal
> simulating a terminal inside a website  
> available at [noel-friedrich.de/cli](https://noel-friedrich.de/cli/)

## Table of contents
* [Introduction](#introduction)
  * [fun stuff to try](#fun-stuff-to-try)
* [Commands](#commands)
* [Status](#status)

## Introduction

The page is build to work like a Unix-Terminal, including:
* 100-ish Commands (functions!) such as `ls`, `cd` and of course `cowsay`
* a file-system that you can navigate and manipulate
* fun like TAB-autocompletion, `history` or `cmatrix`
* multiple ways to get rickrolled
* all changes made are locally saved (using LocalStorage)

### fun stuff to try

* execute your own code:
  1. make a file using `touch main.js`
  2. edit that file using `edit main.js`
  3. write js-code inside the editor, e.g. `console.log("Hello World!")`
  4. exit and save by hitting `Strg+S`
  5. execute your new script using `./main.js` or `run main.js`
* plot your favorite equation using `plot e^x`
* solve your favorite equation using `solve x*x=10`
* feel like a hacker using `cmatrix`
* let the cow say something using `cowsay`
  * or let it think using `cowthink`
* get my opinion of a programming language my typing its name into the terminal
* convert a picture into ascii using `img2ascii`
* set and get key-value pairs on the server using `set` and `get`
  * these values are saved globally for all users to see
* most of your favorite unix-commands should do something
* shutdown the website using `shutdown`
* remove your website using `rm *`
* see your command history using `history`
  * execute a command from your history using `!<index>`

## Commands

You may execute a command by simply typing it into the terminal and pressing `Enter`  
The following list can also be viewed using the `whatis *` command

| Command      | Description                                                     |
| ------------ | --------------------------------------------------------------- |
| `!`           | undefined                                          |
| `./`          | show this help menu                                |
| `<`           | undefined                                          |
| `alias`       | list all files of current directory                |
| `apt`         | change current directory                           |
| `apt-get`     | read file content                                  |
| `background`  | alias for 'cat'                                    |
| `bc`          | tnetnoc elif daer                                  |
| `bf`          | display a file in sorted order                     |
| `brainfuck`   | display word and line count of file                |
| `c`           | get your current username                          |
| `c#`          | evaluate a javascript expression                   |
| `c++`         | alias for 'run'                                    |
| `cal`         | run a .exe file                                    |
| `cat`         | alias for 'cat'                                    |
| `cd`          | print whatever you type                            |
| `ceasar`      | create a new directory                             |
| `clear`       | duplicate a file to another folder                 |
| `cmatrix`     | move a file to a different directory               |
| `cmdnotfound` | delete a directory including all its contents      |
| `color`       | delete a file of the current directory             |
| `color-test`  | download a file from the internet                  |
| `cowsay`      | edit a file of the current directory               |
| `cowthink`    | create a file in the current directory             |
| `cp`          | list all USB devices                               |
| `cpp`         | exit the terminal                                  |
| `csharp`      | test the color functionality                       |
| `css`         | display styling options for the terminal           |
| `curl`        | alias for 'color'                                  |
| `dir`         | my evaluation of py (programming language)         |
| `download`    | my evaluation of python2 (programming language)    |
| `echo`        | my evaluation of java (programming language)       |
| `edit`        | my evaluation of ruby (programming language)       |
| `eval`        | my evaluation of html (programming language)       |
| `exit`        | my evaluation of css (programming language)        |
| `f`           | my evaluation of js (programming language)         |
| `factor`      | my evaluation of javascript (programming language) |
| `fizzbuzz`    | my evaluation of jsx (programming language)        |
| `foreground`  | my evaluation of php (programming language)        |
| `get`         | my evaluation of lua (programming language)        |
| `go`          | my evaluation of go (programming language)         |
| `groups`      | my evaluation of c (programming language)          |
| `haskell`     | my evaluation of c++ (programming language)        |
| `head`        | my evaluation of c# (programming language)         |
| `helloworld`  | my evaluation of kotlin (programming language)     |
| `help`        | my evaluation of swift (programming language)      |
| `hi`          | my evaluation of rust (programming language)       |
| `history`     | my evaluation of hs (programming language)         |
| `hs`          | my evaluation of python (programming language)     |
| `html`        | my evaluation of python3 (programming language)    |
| `img2ascii`   | my evaluation of csharp (programming language)     |
| `java`        | my evaluation of cpp (programming language)        |
| `javascript`  | my evaluation of haskell (programming language)    |
| `js`          | display the top processes                          |
| `jsx`         | clear terminal window                              |
| `kill`        | execute a command as root                          |
| `kotlin`      | display the friendship-score of a friend           |
| `ls`          | apititude package manager                          |
| `lscmds`      | apititude package manager                          |
| `lscpu`       | parse given brainfuck code                         |
| `lsusb`       | parse given brainfuck code                         |
| `lua`         | create a new alias for a given function            |
| `mkdir`       | list all existing commands                         |
| `morse`       | shutdown the website... or not?                    |
| `mv`          | reboot the website                                 |
| `nano`        | reset everything                                   |
| `open`        | open nano editor                                   |
| `password`    | generate a new random password                     |
| `php`         | image to ascii converter                           |
| `plot`        | solve a mathematical equation for x                |
| `pwd`         | plot a mathematical function within bounds         |
| `py`          | change the background color of the terminal        |
| `python`      | change the foreground color of the terminal        |
| `python2`     | say hello to the terminal                          |
| `python3`     | display the calendar of the current month          |
| `reboot`      | compute the value of a mathematical expression     |
| `reset`       | display the current working directory              |
| `reverse`     | display the name of the operating system           |
| `rm`          | calculate the prime factors of a given number      |
| `rmdir`       | get a value from the server                        |
| `ruby`        | set a value on the server                          |
| `run`         | display the groups of a user                       |
| `runfunc`     | display the first lines of a file                  |
| `rust`        | get a short description of a command               |
| `set`         | show the active users and their time elapsed       |
| `shutdown`    | undefined                                          |
| `sleep`       | run a function of 'history'                        |
| `solve`       | alias for 'runfunc'                                |
| `sort`        | get some helpful info about your cpu               |
| `style`       | kill a process                                     |
| `sudo`        | repeat a message until you press Ctrl+C            |
| `swift`       | zip a file                                         |
| `tac`         | list the files in the current directory            |
| `todo`        | reverse a message                                  |
| `top`         | undefined                                          |
| `touch`       | let the cow say something                          |
| `uname`       | let the cow think something                        |
| `w`           | feel cool, be hacker                               |
| `wc`          | download a local file                              |
| `whatis`      | manage todo lists                                  |
| `whoami`      | translate latin to morse or morse to latin         |
| `yes`         | do the fizzbuzz                                    |
| `zip`         | encrypt a text using the ceasar cipher             |

## Status
Project is _IN PROGRESS_
