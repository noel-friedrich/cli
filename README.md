# cli - web terminal
> simulating a terminal inside a website  
> available at [noel-friedrich.de/cli](https://noel-friedrich.de/cli/)
> replaced by [terminal Project](https://github.com/noel-friedrich/cli/)

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
* plot your favorite equation using `plot tan(2x)` (and hear them!)
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
The following list can also be viewed using the [`whatis *`](https://noel-friedrich.de/cli/?cmd=whatis%20*) command

| Command      | Description                                                     |
| ------------ | --------------------------------------------------------------- |
 | [`!`](https://noel-friedrich.de/cli/?cmd=!) | run a command from history |
 | [`./`](https://noel-friedrich.de/cli/?cmd=./) | alias for 'run' |
 | [`2048`](https://noel-friedrich.de/cli/?cmd=2048) | play a game of 2048 |
 | [`4inarow`](https://noel-friedrich.de/cli/?cmd=4inarow) | play a game of Connect Four against the computer |
 | [`LS`](https://noel-friedrich.de/cli/?cmd=LS) | alias for 'sl' |
 | [`alias`](https://noel-friedrich.de/cli/?cmd=alias) | create a new alias for a given function |
 | [`background`](https://noel-friedrich.de/cli/?cmd=background) | change the background color of the terminal |
 | [`base64`](https://noel-friedrich.de/cli/?cmd=base64) | encode/decode a message using base64 |
 | [`bc`](https://noel-friedrich.de/cli/?cmd=bc) | start a bc (basic calculator) session |
 | [`bf`](https://noel-friedrich.de/cli/?cmd=bf) | alias for 'brainfuck' |
 | [`binomcdf`](https://noel-friedrich.de/cli/?cmd=binomcdf) | calculate the binomial cumulative distribution function |
 | [`binompdf`](https://noel-friedrich.de/cli/?cmd=binompdf) | calculate binomial distribution value |
 | [`brainfuck`](https://noel-friedrich.de/cli/?cmd=brainfuck) | parse given brainfuck code |
 | [`cal`](https://noel-friedrich.de/cli/?cmd=cal) | print a calendar |
 | [`cat`](https://noel-friedrich.de/cli/?cmd=cat) | print file content |
 | [`cd`](https://noel-friedrich.de/cli/?cmd=cd) | change current directory |
 | [`ceasar`](https://noel-friedrich.de/cli/?cmd=ceasar) | shift the letters of a text |
 | [`cheese`](https://noel-friedrich.de/cli/?cmd=cheese) | take a foto with your webcam |
 | [`chess`](https://noel-friedrich.de/cli/?cmd=chess) | play a game of chess against the computer |
 | [`clear`](https://noel-friedrich.de/cli/?cmd=clear) | clear the terminal |
 | [`clock`](https://noel-friedrich.de/cli/?cmd=clock) | display a clock |
 | [`cmatrix`](https://noel-friedrich.de/cli/?cmd=cmatrix) | show the matrix |
 | [`cmdnotfound`](https://noel-friedrich.de/cli/?cmd=cmdnotfound) | undefined |
 | [`color-test`](https://noel-friedrich.de/cli/?cmd=color-test) | test the color capabilities of the terminal |
 | [`compliment`](https://noel-friedrich.de/cli/?cmd=compliment) | get info about yourself |
 | [`convert`](https://noel-friedrich.de/cli/?cmd=convert) | convert a file to another format |
 | [`copy`](https://noel-friedrich.de/cli/?cmd=copy) | copy the file content to the clipboard |
 | [`cowsay`](https://noel-friedrich.de/cli/?cmd=cowsay) | let the cow say something |
 | [`cowthink`](https://noel-friedrich.de/cli/?cmd=cowthink) | let the cow think something |
 | [`cp`](https://noel-friedrich.de/cli/?cmd=cp) | copy a file |
 | [`curl`](https://noel-friedrich.de/cli/?cmd=curl) | download a file from the internet |
 | [`cw`](https://noel-friedrich.de/cli/?cmd=cw) | get the calendar week of a date |
 | [`derivative`](https://noel-friedrich.de/cli/?cmd=derivative) | take the derivative of a term |
 | [`donut`](https://noel-friedrich.de/cli/?cmd=donut) | display a spinning donut |
 | [`download`](https://noel-friedrich.de/cli/?cmd=download) | download a file |
 | [`du`](https://noel-friedrich.de/cli/?cmd=du) | display disk usage of current directory |
 | [`echo`](https://noel-friedrich.de/cli/?cmd=echo) | print a line of text |
 | [`edit`](https://noel-friedrich.de/cli/?cmd=edit) | edit a file of the current directory |
 | [`eval`](https://noel-friedrich.de/cli/?cmd=eval) | evaluate javascript code |
 | [`exit`](https://noel-friedrich.de/cli/?cmd=exit) | exit the terminal |
 | [`exportmelody`](https://noel-friedrich.de/cli/?cmd=exportmelody) | export a .melody file to a .mp3 one |
 | [`f`](https://noel-friedrich.de/cli/?cmd=f) | calculate friendship score with a friend |
 | [`factor`](https://noel-friedrich.de/cli/?cmd=factor) | print the prime factors of a number |
 | [`fizzbuzz`](https://noel-friedrich.de/cli/?cmd=fizzbuzz) | print the fizzbuzz sequence |
 | [`foreground`](https://noel-friedrich.de/cli/?cmd=foreground) | change the foreground color of the terminal |
 | [`frequency`](https://noel-friedrich.de/cli/?cmd=frequency) | play a given frequency for a given amount of time |
 | [`games`](https://noel-friedrich.de/cli/?cmd=games) | list all games to play |
 | [`get`](https://noel-friedrich.de/cli/?cmd=get) | get a value from the server |
 | [`github`](https://noel-friedrich.de/cli/?cmd=github) | alias for 'run home/github.exe' |
 | [`greed`](https://noel-friedrich.de/cli/?cmd=greed) | play a game of greed |
 | [`greed:big`](https://noel-friedrich.de/cli/?cmd=greed:big) | alias for 'greed -b' |
 | [`grep`](https://noel-friedrich.de/cli/?cmd=grep) | search for a pattern in a file |
 | [`head`](https://noel-friedrich.de/cli/?cmd=head) | display the first lines of a file |
 | [`helloworld`](https://noel-friedrich.de/cli/?cmd=helloworld) | display the hello-world text |
 | [`help`](https://noel-friedrich.de/cli/?cmd=help) | shows this help menu |
 | [`hi`](https://noel-friedrich.de/cli/?cmd=hi) | say hello to the terminal |
 | [`hidebtns`](https://noel-friedrich.de/cli/?cmd=hidebtns) | hides the buttons in the terminal |
 | [`highscores`](https://noel-friedrich.de/cli/?cmd=highscores) | Show global highscores for a game |
 | [`history`](https://noel-friedrich.de/cli/?cmd=history) | undefined |
 | [`href`](https://noel-friedrich.de/cli/?cmd=href) | open a link in another tab |
 | [`hugehugeturtlo`](https://noel-friedrich.de/cli/?cmd=hugehugeturtlo) | spawn huge huge turtlo |
 | [`hugeturtlo`](https://noel-friedrich.de/cli/?cmd=hugeturtlo) | spawn huge turtlo |
 | [`img2ascii`](https://noel-friedrich.de/cli/?cmd=img2ascii) | Convert an image to ASCII art |
 | [`joke`](https://noel-friedrich.de/cli/?cmd=joke) | tell a joke |
 | [`kaprekar`](https://noel-friedrich.de/cli/?cmd=kaprekar) | display the kaprekar steps of a number |
 | [`kill`](https://noel-friedrich.de/cli/?cmd=kill) | kill a process |
 | [`letters`](https://noel-friedrich.de/cli/?cmd=letters) | prints the given text in ascii art |
 | [`logistic-map`](https://noel-friedrich.de/cli/?cmd=logistic-map) | draw the logistic map |
 | [`ls`](https://noel-friedrich.de/cli/?cmd=ls) | list all files of current directory |
 | [`lscmds`](https://noel-friedrich.de/cli/?cmd=lscmds) | list all available commands |
 | [`lscpu`](https://noel-friedrich.de/cli/?cmd=lscpu) | get some helpful info about your cpu |
 | [`lsusb`](https://noel-friedrich.de/cli/?cmd=lsusb) | list all usb devices |
 | [`lunar-lander`](https://noel-friedrich.de/cli/?cmd=lunar-lander) | play a classic game of moon-lander |
 | [`man`](https://noel-friedrich.de/cli/?cmd=man) | show the manual page for a command |
 | [`mandelbrot`](https://noel-friedrich.de/cli/?cmd=mandelbrot) | draws the mandelbrot set |
 | [`melody`](https://noel-friedrich.de/cli/?cmd=melody) | open the melody-maker |
 | [`mill2player`](https://noel-friedrich.de/cli/?cmd=mill2player) | play a game of mill with a friend locally |
 | [`mkdir`](https://noel-friedrich.de/cli/?cmd=mkdir) | create a new directory |
 | [`morse`](https://noel-friedrich.de/cli/?cmd=morse) | translate latin to morse or morse to latin |
 | [`mv`](https://noel-friedrich.de/cli/?cmd=mv) | move a file |
 | [`name`](https://noel-friedrich.de/cli/?cmd=name) | set a default name for the highscore system to use |
 | [`ncr`](https://noel-friedrich.de/cli/?cmd=ncr) | calculate binomial distribution value |
 | [`number-guess`](https://noel-friedrich.de/cli/?cmd=number-guess) | guess a random number |
 | [`oneko`](https://noel-friedrich.de/cli/?cmd=oneko) | just use turtlo |
 | [`pascal`](https://noel-friedrich.de/cli/?cmd=pascal) | print a pascal triangle |
 | [`password`](https://noel-friedrich.de/cli/?cmd=password) | Generate a random password |
 | [`play`](https://noel-friedrich.de/cli/?cmd=play) | play a .melody file |
 | [`plot`](https://noel-friedrich.de/cli/?cmd=plot) | plot a mathematical function within bounds |
 | [`pong`](https://noel-friedrich.de/cli/?cmd=pong) | play a game of pong against the computer |
 | [`pv`](https://noel-friedrich.de/cli/?cmd=pv) | print a message with a typing animation |
 | [`pwd`](https://noel-friedrich.de/cli/?cmd=pwd) | print the current working directory |
 | [`qr`](https://noel-friedrich.de/cli/?cmd=qr) | generate a qr code |
 | [`quiz`](https://noel-friedrich.de/cli/?cmd=quiz) | play the quiz game |
 | [`rate`](https://noel-friedrich.de/cli/?cmd=rate) | rate a programming language |
 | [`reboot`](https://noel-friedrich.de/cli/?cmd=reboot) | reboot the website |
 | [`reload`](https://noel-friedrich.de/cli/?cmd=reload) | force reload all resources |
 | [`reset`](https://noel-friedrich.de/cli/?cmd=reset) | reset the terminal |
 | [`reverse`](https://noel-friedrich.de/cli/?cmd=reverse) | reverse a message |
 | [`rm`](https://noel-friedrich.de/cli/?cmd=rm) | remove a file |
 | [`rmdir`](https://noel-friedrich.de/cli/?cmd=rmdir) | remove a directory |
 | [`rndm`](https://noel-friedrich.de/cli/?cmd=rndm) | generate a random number based on the current time |
 | [`run`](https://noel-friedrich.de/cli/?cmd=run) | run a .exe file |
 | [`runfunc`](https://noel-friedrich.de/cli/?cmd=runfunc) | alias for '!' |
 | [`search`](https://noel-friedrich.de/cli/?cmd=search) | search something via google.com |
 | [`set`](https://noel-friedrich.de/cli/?cmd=set) | set a value on the server |
 | [`sha256`](https://noel-friedrich.de/cli/?cmd=sha256) | calculate the SHA-256 hash of a message |
 | [`shutdown`](https://noel-friedrich.de/cli/?cmd=shutdown) | shutdown the terminal |
 | [`sl`](https://noel-friedrich.de/cli/?cmd=sl) | steam locomotive |
 | [`sleep`](https://noel-friedrich.de/cli/?cmd=sleep) | sleep for a number of seconds |
 | [`snake`](https://noel-friedrich.de/cli/?cmd=snake) | play a game of snake |
 | [`solve`](https://noel-friedrich.de/cli/?cmd=solve) | solve a mathematical equation for x |
 | [`sort`](https://noel-friedrich.de/cli/?cmd=sort) | display a file in sorted order |
 | [`sorting`](https://noel-friedrich.de/cli/?cmd=sorting) | display a sorting algorithm |
 | [`stacker`](https://noel-friedrich.de/cli/?cmd=stacker) | play a stacker game |
 | [`style`](https://noel-friedrich.de/cli/?cmd=style) | change the style of the terminal |
 | [`sudo`](https://noel-friedrich.de/cli/?cmd=sudo) | try to use sudo |
 | [`tac`](https://noel-friedrich.de/cli/?cmd=tac) | tnetnoc elif daer |
 | [`tetris`](https://noel-friedrich.de/cli/?cmd=tetris) | play a classic game of tetris |
 | [`tictactoe`](https://noel-friedrich.de/cli/?cmd=tictactoe) | play a game of tic tac toe against the computer. |
 | [`timer`](https://noel-friedrich.de/cli/?cmd=timer) | set a timer |
 | [`todo`](https://noel-friedrich.de/cli/?cmd=todo) | manage a todo list |
 | [`touch`](https://noel-friedrich.de/cli/?cmd=touch) | create a file in the current directory |
 | [`tree`](https://noel-friedrich.de/cli/?cmd=tree) | alias for 'ls -r' |
 | [`turtlo`](https://noel-friedrich.de/cli/?cmd=turtlo) | spawn turtlo |
 | [`type-test`](https://noel-friedrich.de/cli/?cmd=type-test) | test your typing speed |
 | [`uname`](https://noel-friedrich.de/cli/?cmd=uname) | print the operating system name |
 | [`unhidebtns`](https://noel-friedrich.de/cli/?cmd=unhidebtns) | unhides the buttons in the terminal |
 | [`upload`](https://noel-friedrich.de/cli/?cmd=upload) | upload a file from your computer |
 | [`vigenere`](https://noel-friedrich.de/cli/?cmd=vigenere) | encrypt/decrypt a message using the vigenere cipher |
 | [`w`](https://noel-friedrich.de/cli/?cmd=w) | print the current time elapsed |
 | [`wc`](https://noel-friedrich.de/cli/?cmd=wc) | display word and line count of file |
 | [`whatday`](https://noel-friedrich.de/cli/?cmd=whatday) | get the weekday of a date |
 | [`whatis`](https://noel-friedrich.de/cli/?cmd=whatis) | display a short description of a command |
 | [`whoami`](https://noel-friedrich.de/cli/?cmd=whoami) | get client info |
 | [`yes`](https://noel-friedrich.de/cli/?cmd=yes) | print a message repeatedly |
 | [`zip`](https://noel-friedrich.de/cli/?cmd=zip) | zip a file |

## Status
Project is _NO LONGER IN PROGRESS_
