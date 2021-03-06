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
| `!`           | alias for 'runfunc'                                |
| `./`          | alias for 'run'                                    |
| `<`           | alias for 'cat'                                    |
| `alias`       | create a new alias for a given function            |
| `apt`         | apititude package manager                          |
| `apt-get`     | apititude package manager                          |
| `background`  | change the background color of the terminal        |
| `bc`          | compute the value of a mathematical expression     |
| `bf`          | parse given brainfuck code                         |
| `brainfuck`   | parse given brainfuck code                         |
| `c`           | my evaluation of c (programming language)          |
| `c#`          | my evaluation of c# (programming language)         |
| `c++`         | my evaluation of c++ (programming language)        |
| `cal`         | display the calendar of the current month          |
| `cat`         | read file content                                  |
| `cd`          | change current directory                           |
| `ceasar`      | encrypt a text using the ceasar cipher             |
| `clear`       | clear terminal window                              |
| `cmatrix`     | feel cool, be hacker                               |
| `cmdnotfound` | undefined                                          |
| `color`       | display styling options for the terminal           |
| `color-test`  | test the color functionality                       |
| `cowsay`      | let the cow say something                          |
| `cowthink`    | let the cow think something                        |
| `cp`          | duplicate a file to another folder                 |
| `cpp`         | my evaluation of cpp (programming language)        |
| `csharp`      | my evaluation of csharp (programming language)     |
| `css`         | my evaluation of css (programming language)        |
| `curl`        | download a file from the internet                  |
| `dir`         | list the files in the current directory            |
| `download`    | download a local file                              |
| `echo`        | print whatever you type                            |
| `edit`        | edit a file of the current directory               |
| `eval`        | evaluate a javascript expression                   |
| `exit`        | exit the terminal                                  |
| `f`           | display the friendship-score of a friend           |
| `factor`      | calculate the prime factors of a given number      |
| `fizzbuzz`    | do the fizzbuzz                                    |
| `foreground`  | change the foreground color of the terminal        |
| `get`         | get a value from the server                        |
| `go`          | my evaluation of go (programming language)         |
| `groups`      | display the groups of a user                       |
| `haskell`     | my evaluation of haskell (programming language)    |
| `head`        | display the first lines of a file                  |
| `helloworld`  | undefined                                          |
| `help`        | show this help menu                                |
| `hi`          | say hello to the terminal                          |
| `history`     | undefined                                          |
| `hs`          | my evaluation of hs (programming language)         |
| `html`        | my evaluation of html (programming language)       |
| `img2ascii`   | image to ascii converter                           |
| `java`        | my evaluation of java (programming language)       |
| `javascript`  | my evaluation of javascript (programming language) |
| `js`          | my evaluation of js (programming language)         |
| `jsx`         | my evaluation of jsx (programming language)        |
| `kill`        | kill a process                                     |
| `kotlin`      | my evaluation of kotlin (programming language)     |
| `ls`          | list all files of current directory                |
| `lscmds`      | list all existing commands                         |
| `lscpu`       | get some helpful info about your cpu               |
| `lsusb`       | list all USB devices                               |
| `lua`         | my evaluation of lua (programming language)        |
| `mkdir`       | create a new directory                             |
| `morse`       | translate latin to morse or morse to latin         |
| `mv`          | move a file to a different directory               |
| `nano`        | open nano editor                                   |
| `open`        | alias for 'cat'                                    |
| `password`    | generate a new random password                     |
| `php`         | my evaluation of php (programming language)        |
| `plot`        | plot a mathematical function within bounds         |
| `pwd`         | display the current working directory              |
| `py`          | my evaluation of py (programming language)         |
| `python`      | my evaluation of python (programming language)     |
| `python2`     | my evaluation of python2 (programming language)    |
| `python3`     | my evaluation of python3 (programming language)    |
| `reboot`      | reboot the website                                 |
| `reset`       | reset everything                                   |
| `reverse`     | reverse a message                                  |
| `rm`          | delete a file of the current directory             |
| `rmdir`       | delete a directory including all its contents      |
| `ruby`        | my evaluation of ruby (programming language)       |
| `run`         | run a .exe file                                    |
| `runfunc`     | run a function of 'history'                        |
| `rust`        | my evaluation of rust (programming language)       |
| `set`         | set a value on the server                          |
| `shutdown`    | shutdown the website... or not?                    |
| `sleep`       | undefined                                          |
| `solve`       | solve a mathematical equation for x                |
| `sort`        | display a file in sorted order                     |
| `style`       | alias for 'color'                                  |
| `sudo`        | execute a command as root                          |
| `swift`       | my evaluation of swift (programming language)      |
| `tac`         | tnetnoc elif daer                                  |
| `todo`        | manage todo lists                                  |
| `top`         | display the top processes                          |
| `touch`       | create a file in the current directory             |
| `uname`       | display the name of the operating system           |
| `w`           | show the active users and their time elapsed       |
| `wc`          | display word and line count of file                |
| `whatis`      | get a short description of a command               |
| `whoami`      | get your current username                          |
| `yes`         | repeat a message until you press Ctrl+C            |
| `zip`         | zip a file                                         |

## Status
Project is _IN PROGRESS_
