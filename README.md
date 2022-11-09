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
* 133 commands such as `ls`, `cd` and of course `cowsay`
* a file-system that you can navigate and manipulate
* fun like TAB-autocompletion, `history` or `cmatrix`
* multiple ways to get rickrolled
* all changes made are locally saved (using LocalStorage)
* very cute turtlo

### fun stuff to try

* execute your own code:
  1. make a file using `touch main.js`
  2. edit that file using `edit main.js`
  3. write js-code inside the editor, e.g. `console.log("Hello World!")`
  4. exit and save by hitting `Strg+S`
  5. execute your new script using `./main.js` or `run main.js`
* plot your favorite equation using `plot e^x` (and hear them!)
* solve your favorite equation using `solve x*x=10`
* feel like a hacker using `cmatrix`
* let the cow say something using `cowsay`
* get my opinion of a programming language my typing its name into the terminal
* convert a picture into ascii using `img2ascii`
* set and get key-value pairs on the server using `set` and `get`
  * these values are saved globally for all users to see
* most of your favorite unix-commands should do something
* shutdown the website using `shutdown`
* remove your website using `rm *`
* see your command history using `history`
  * execute a command from your history using `!<index>`
* spawn turtlo using `turtlo` and watch it do stuff
* create melodys using the `melody` editor
* see your favorite calendar using `cal`
* convert your favorite image file to another format
  1. upload the file using `upload`
  2. convert it using `convert <filename>.<old_ending> <filename>.<new_ending>`
  3. download it using `download <filename>.<new_ending>`
* misspell `ls` as `sl`
* calculate the derivative of `sin(x)` using `derivative sin(x)`
* play some games against an artificial opponent player
  * play [`lunar-lander`](https://noel-friedrich.de/cli/?cmd=lunar-lander)
  * play [`chess`](https://noel-friedrich.de/cli/?cmd=chess)
  * play [`4inarow`](https://noel-friedrich.de/cli/?cmd=4inarow)
  * play [`snake`](https://noel-friedrich.de/cli/?cmd=snake)
  * play [`2048`](https://noel-friedrich.de/cli/?cmd=2048)
  * play [`stacker`](https://noel-friedrich.de/cli/?cmd=stacker)
  * view highscores using `highscores <game-name>`

## Commands

You may execute a command by simply typing it into the terminal and pressing `Enter`  
The following list can also be viewed using the `whatis *` command

| Command      | Description                                                     |
| ------------ | --------------------------------------------------------------- |
| `!`              | run a command from history                          |
| `./`             | alias for 'run'                                     |
| `2048`           | play a game of 2048                                 |
| `4inarow`        | play a game of Connect Four against the computer    |
| `alias`          | create a new alias for a given function             |
| `background`     | change the background color of the terminal         |
| `base64`         | encode/decode a message using base64                |
| `bc`             | compute the value of a mathematical expression      |
| `bf`             | alias for 'brainfuck'                               |
| `bmi`            | calculate a body-mass-index                         |
| `brainfuck`      | parse given brainfuck code                          |
| `cal`            | print a calendar                                    |
| `cat`            | print file content                                  |
| `cd`             | change current directory                            |
| `ceasar`         | encrypt a text using the ceasar cipher              |
| `cheese`         | take a foto with your webcam                        |
| `chess`          | play a game of chess against the computer           |
| `clear`          | clear the terminal                                  |
| `clock`          | display the current time                            |
| `cmatrix`        | feel cool, be hacker                                |
| `cmdnotfound`    | undefined                                           |
| `color-test`     | test the color capabilities of the terminal         |
| `compliment`     | get info about yourself                             |
| `convert`        | convert a file to another format                    |
| `copy`           | copy the file content to the clipboard              |
| `cowsay`         | let the cow say something                           |
| `cowthink`       | let the cow think something                         |
| `cp`             | copy a file                                         |
| `curl`           | download a file from the internet                   |
| `cw`             | get the calendar week for a given date              |
| `derivative`     | take the derivative of a term                       |
| `dir`            | list the files in the current directory             |
| `donut`          | do the spinny donut.c                               |
| `download`       | download a file                                     |
| `du`             | display disk usage of current directory             |
| `echo`           | print a line of text                                |
| `edit`           | edit a file of the current directory                |
| `eval`           | evaluate javascript code                            |
| `exit`           | exit the terminal                                   |
| `exportmelody`   | export a .melody file to a .mp3 one                 |
| `f`              | calculate friendship score with a friend            |
| `factor`         | calculate the prime factors of given numbers        |
| `fizzbuzz`       | do the fizzbuzz                                     |
| `foreground`     | change the foreground color of the terminal         |
| `frequency`      | play a given frequency for a given amount of time   |
| `games`          | list all games to play                              |
| `get`            | get a value from the server                         |
| `github`         | alias for 'run home/github.exe'                     |
| `greed`          | play a game of greed                                |
| `greed:big`      | alias for 'greed -b'                                |
| `grep`           | search for a pattern in a file                      |
| `groups`         | display the groups of a user                        |
| `head`           | display the first lines of a file                   |
| `helloworld`     | display the hello-world text                        |
| `help`           | shows this help menu                                |
| `hi`             | say hello to the terminal                           |
| `hidebtns`       | hide the terminal buttons                           |
| `highscores`     | Show global highscores for a game                   |
| `history`        | undefined                                           |
| `href`           | open a link in another tab                          |
| `hugehugeturtlo` | spawn huge huge turtlo                              |
| `hugeturtlo`     | spawn huge turtlo                                   |
| `img2ascii`      | image to ascii converter                            |
| `joke`           | tell a joke                                         |
| `kill`           | kill a process                                      |
| `letters`        | draw the input in cool letters                      |
| `logistic-map`   | draw the logistic map                               |
| `ls`             | list all files of current directory                 |
| `LS`             | alias for 'sl'                                      |
| `lscmds`         | list all existing commands                          |
| `lscpu`          | get some helpful info about your cpu                |
| `lsusb`          | list all usb devices                                |
| `lunar-lander`   | play a classic game of moon-lander                  |
| `man`            | show the manual page for a command                  |
| `mandelbrot`     | draw the mandelbrot set                             |
| `melody`         | open the melody-maker                               |
| `mill2player`    | play a game of mill with a friend locally           |
| `mkdir`          | create a new directory                              |
| `morse`          | translate latin to morse or morse to latin          |
| `mv`             | move a file                                         |
| `name`           | set a default name for the highscore system to use  |
| `nano`           | open nano editor                                    |
| `number-guess`   | guess a random number                               |
| `oneko`          | just use turtlo                                     |
| `pascal`         | print a pascal triangle                             |
| `password`       | generate a new random password                      |
| `play`           | play a .melody file                                 |
| `plot`           | plot a mathematical function within bounds          |
| `pong`           | play a game of pong against the computer            |
| `pv`             | print a message with a typing animation             |
| `pwd`            | display the current working directory               |
| `quiz`           | play the quiz game                                  |
| `rate`           | rate a programming language                         |
| `reboot`         | reboot the website                                  |
| `reload`         | force reload all resources                          |
| `reset`          | reset everything                                    |
| `reverse`        | reverse a message                                   |
| `rm`             | remove a file                                       |
| `rmdir`          | remove a directory                                  |
| `rndm`           | generate a random number based on the current time  |
| `run`            | run a .exe file                                     |
| `runfunc`        | alias for '!'                                       |
| `search`         | search something via google.com                     |
| `set`            | set a value on the server                           |
| `sha256`         | calculate the SHA-256 hash of a message             |
| `shutdown`       | shutdown the website... or not?                     |
| `sl`             | steam locomotive                                    |
| `sleep`          | sleep for a number of seconds                       |
| `snake`          | play a game of snake                                |
| `solve`          | solve a mathematical equation for x                 |
| `sort`           | display a file in sorted order                      |
| `sorting`        | display a sorting algorithm                         |
| `stacker`        | play a stacker game                                 |
| `style`          | change the style of the terminal                    |
| `sudo`           | try to use sudo                                     |
| `tac`            | tnetnoc elif daer                                   |
| `tetris`         | play a classic game of tetris                       |
| `tictactoe`      | play a game of tic tac toe against the computer.    |
| `timer`          | start a timer                                       |
| `todo`           | manage todo lists                                   |
| `touch`          | create a file in the current directory              |
| `tree`           | alias for 'ls -r'                                   |
| `turtlo`         | spawn turtlo                                        |
| `type-test`      | test your typing speed                              |
| `uname`          | display the name of the operating system            |
| `unhidebtns`     | unhide the terminal buttons                         |
| `upload`         | upload a file                                       |
| `vigenere`       | encrypt/decrypt a message using the vigenere cipher |
| `w`              | show the active users and their time elapsed        |
| `wc`             | display word and line count of file                 |
| `whatday`        | get the weekday of a date                           |
| `whatis`         | display a short description of a command            |
| `whoami`         | get client info                                     |
| `yes`            | repeat a message until you press Ctrl+C             |
| `zip`            | zip a file                                          |

## Status
Project is _IN PROGRESS_
