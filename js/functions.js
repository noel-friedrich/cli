terminal.addFunction("ls", function(rawArgs) {
    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length > 1) {
        terminal.printf`${{[Color.RED]: "Error"}}: This command only accepts 1 input parameter\n`
        return
    }

    let targetFolder = terminal.currFolder
    if (parsedArgs.length == 1) {
        let suppliedPath = strToPath(parsedArgs[0])
        let fullPath = terminal.currPath.concat(suppliedPath)
        let [preTargetFolder, errorPath] = getFolder(fullPath)
        if (errorPath) {
            terminal.printf`${{[Color.RED]: "Error"}}: Invalid Path given: \n`
            terminal.printLine(`${errorPath} does not exist!`)
            return
        } else {
            targetFolder = preTargetFolder
        }
    }

    let i = 0
    for (let [fileName, file] of Object.entries(targetFolder.content)) {
        i++
        terminal.printf`${{[Color.YELLOW]: String(i)}} ${{[Color.WHITE]: fileName}}`
        if (file.type == FileType.FOLDER)
            terminal.print("/")
        terminal.printLine()
    }

    if (Object.entries(targetFolder.content).length == 0) {
        terminal.printLine(`this directory is empty`)
    }
}, "list all files of current directory", true)

function getSingleArg(rawArgs, cmdname, argname) {
    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length != 1) {
        terminal.printLine(`You must supply 1 argument:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} ${{[Color.WHITE]: cmdname}} ${{[Color.YELLOW]: "<" + argname + ">"}}'\n`
        return
    }
    return parsedArgs[0]
}

terminal.addFunction("cd", function(rawArgs) {
    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length != 1) {
        terminal.printLine(`You must supply 1 folder to change into:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} cd ${{[Color.YELLOW]: "<folder_name>"}}'\n`
        return
    }
    var folderName = parsedArgs[0]
    if (folderName == ".." || folderName == "-") {
        if (terminal.currPath.length > 0) {
            terminal.currPath.pop()
            terminal.updatePath()
        } else {
            terminal.printf`${{[Color.RED]: "Error"}}: You are already at ground level\n`
        }
        return
    } else if (folderName == "/" || folderName == "~") {
        if (terminal.currPath.length > 0) {
            terminal.currPath = Array()
            terminal.updatePath()
        } else {
            terminal.printf`${{[Color.RED]: "Error"}}: You are already at ground level\n`
        }
        return
    }

    let path = folderName.split("/")
    if (folderName.length == 1)
        path = folderName.split("\\")

    let i = 0
    for (var folderName of path) {
        i++
        if (i == path.length && folderName == "") return
        if (folderName == "") continue
        for (let [fileName, file] of Object.entries(terminal.currFolder.content)) {
            if (fileName == folderName && file.type != FileType.FOLDER) {
                terminal.printf`${{[Color.RED]: "Error"}}: File is not of Type DIRECTORY\n`
                return
            } else if (fileName == folderName && file.type == FileType.FOLDER) {
                terminal.addToPath(fileName)
                terminal.updatePath()
                if (i == path.length)
                    return
            }
        }
    }
    terminal.printLine(`${folderName}: directory not found`)
    terminal.printf`Use ${{[Color.YELLOW]: "ls"}} to view available files\n`
}, "change current directory", true)

let catFunc = function(rawArgs) {
    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length != 1) {
        terminal.printLine(`You must supply 1 file name to open:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} cat ${{[Color.YELLOW]: "<file_name>"}}'\n`
        return
    }

    let openFileName = parsedArgs[0]
    for (let [fileName, file] of Object.entries(terminal.currFolder.content)) {
        if (fileName == openFileName && (file.type == FileType.READABLE || file.type == FileType.PROGRAM)) {
            if (fileName == "passwords.json") {
                setTimeout(function() {
                    window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                }, 1000)
            }
            if (!file.content) {
                terminal.printf`${{[Color.RED]: "Error"}}: File is empty\n`
            } else {
                terminal.printLine(file.content)
            }
            return
        } else if (fileName == openFileName) {
            terminal.printf`${{[Color.RED]: "Error"}}: File is not READABLE\n`
            return
        }
    }
    terminal.printLine(`${openFileName}: file not found`)
    terminal.printf`Use ${{[Color.YELLOW]: "ls"}} to view available files\n`
}
terminal.addFunction("cat", catFunc, "read file content", true)
terminal.addFunction("<", catFunc, "alias for 'cat'")

terminal.addFunction("tac", function(rawArgs) {
    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length != 1) {
        terminal.printLine(`You must supply 1 file name to open:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} tac ${{[Color.YELLOW]: "<file_name>"}}'\n`
        return
    }

    let openFileName = parsedArgs[0]
    for (let [fileName, file] of Object.entries(terminal.currFolder.content)) {
        if (fileName == openFileName && (file.type == FileType.READABLE || file.type == FileType.PROGRAM)) {
            if (!file.content) {
                terminal.printf`${{[Color.RED]: "Error"}}: File is empty\n`
            } else {
                let lines = file.content.split("\n")
                for (var i = lines.length - 1; i >= 0; i--) {
                    terminal.printLine(lines[i])
                }
            }
            return
        } else if (fileName == openFileName) {
            terminal.printf`${{[Color.RED]: "Error"}}: File is not READABLE\n`
            return
        }
    }
    terminal.printLine(`${openFileName}: file not found`)
    terminal.printf`Use ${{[Color.YELLOW]: "ls"}} to view available files\n`
}, "tnetnoc elif daer")

terminal.addFunction("sort", function(rawArgs) {
    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length != 1) {
        terminal.printLine(`You must supply 1 file name to open:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} sort ${{[Color.YELLOW]: "<file_name>"}}'\n`
        return
    }

    let openFileName = parsedArgs[0]
    for (let [fileName, file] of Object.entries(terminal.currFolder.content)) {
        if (fileName == openFileName && (file.type == FileType.READABLE || file.type == FileType.PROGRAM)) {
            if (!file.content) {
                terminal.printf`${{[Color.RED]: "Error"}}: File is empty\n`
            } else {
                let lines = file.content.split("\n")
                lines.sort()
                for (var i = 0; i < lines.length; i++) {
                    terminal.printLine(lines[i])
                }
            }
            return
        } else if (fileName == openFileName) {
            terminal.printf`${{[Color.RED]: "Error"}}: File is not READABLE\n`
            return
        }
    }
    terminal.printLine(`${openFileName}: file not found`)
    terminal.printf`Use ${{[Color.YELLOW]: "ls"}} to view available files\n`
}, "display a file in sorted order")

terminal.addFunction("wc", function(rawArgs) {
    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length != 1) {
        terminal.printLine(`You must supply 1 file name to open:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} wc ${{[Color.YELLOW]: "<file_name>"}}'\n`
        return
    }

    let openFileName = parsedArgs[0]
    for (let [fileName, file] of Object.entries(terminal.currFolder.content)) {
        if (fileName == openFileName && (file.type == FileType.READABLE || file.type == FileType.PROGRAM)) {
            if (!file.content) {
                terminal.printf`${{[Color.RED]: "Error"}}: File is empty\n`
            } else {
                let lineCount = file.content.split("\n").length
                let wordCount = file.content.split(" ").length
                terminal.printf`${{[Color.YELLOW]: lineCount}} lines\n`
                terminal.printf`${{[Color.YELLOW]: wordCount}} words\n`
            }
            return
        } else if (fileName == openFileName) {
            terminal.printf`${{[Color.RED]: "Error"}}: File is not READABLE\n`
            return
        }
    }
    terminal.printLine(`${openFileName}: file not found`)
    terminal.printf`Use ${{[Color.YELLOW]: "ls"}} to view available files\n`
}, "display word and line count of file")

terminal.addFunction("whoami", function() {
    terminal.printLine("You are a visitor of my website!")
}, "get your current username")

class JsEnvironment {
    constructor() {
        this.iframe = document.createElement("iframe")
        this.iframe.style.display = "none"
        document.body.appendChild(this.iframe)
        this.document = this.iframe.contentDocument || this.iframe.contentWindow.document
    }

    eval(code) {
        try {
            let evaluation = this.iframe.contentWindow.eval(code)
            return [evaluation, null]
        } catch (e) {
            return [null, `${e.name}: ${e.message}`]
        }
    }

    getVars() {
        return this.iframe.contentWindow
    }

    getValue(name) {
        return this.getVars()[name]
    }

    setValue(name, value) {
        this.getVars()[name] = value
    }
}

let evalJsEnv = newMathEnv()
evalJsEnv.setValue("console", {log: m => {
    terminal.printf`${{[Color.rgb(38, 255, 38)]: ">>>"}} ${{[Color.WHITE]: String(m)}}\n`
}, realLog: console.log})

terminal.addFunction("eval", function(rawArgs) {
    let [result, error] = evalJsEnv.eval(rawArgs)
    if (error) {
        terminal.printf`${{[Color.RED]: "Error"}}: ${{[Color.WHITE]: error}}\n`
    } else if (result !== null) {
        terminal.printf`${{[Color.rgb(38, 255, 38)]: ">>>"}} ${{[Color.WHITE]: String(result)}}\n`
    }
}, "evaluate a javascript expression")

let runFunc = function(rawArgs) {
    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length != 1) {
        terminal.printLine(`You must supply 1 filename to open:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} run ${{[Color.YELLOW]: "<filename>"}}'\n`
        return
    }

    let openFileName = parsedArgs[0]
    for (let [fileName, file] of Object.entries(terminal.currFolder.content)) {
        if (fileName == openFileName && fileName.endsWith(".js")) {
            let jsEnv = new JsEnvironment()
            jsEnv.setValue("console", {log: m => terminal.printLine(String(m))})
            let [_, error] = jsEnv.eval(file.content)
            if (error) {
                terminal.printf`${{[Color.RED]: "Error"}}: ${{[Color.WHITE]: error}}\n`
            }
            return
        } else if (fileName == openFileName && file.type != FileType.PROGRAM) {
            terminal.printf`${{[Color.RED]: "Error"}}: File is not executable\n`
            return
        } else if (fileName == openFileName && file.type == FileType.PROGRAM) {
            terminal.printLine("You will be redirected to:")
            terminal.printLine(`${file.content}`)
            setTimeout(function() {
                window.location.href = file.content
            }, 1000)
            return
        }
    }
    terminal.printLine(`${openFileName}: file not found`)   
    terminal.printf`Use ${{[Color.YELLOW]: "ls"}} to view available files\n`
}

terminal.addFunction("./", runFunc, "alias for 'run'")
terminal.addFunction("run", runFunc, "run a .exe file")

terminal.addFunction("open", catFunc, "alias for 'cat'")

terminal.addFunction("echo", function(inp) {
    if (!inp) {
        terminal.printLine(`You must supply an argument to print:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} echo ${{[Color.YELLOW]: "<argument>"}}'\n`
        return
    }
    terminal.printLine(inp)
}, "print whatever you type")

function missingPermissions() {
    terminal.printf`${{[Color.RED]: "Error"}}: You do not have permission to use this command!\n`
}

terminal.addFunction("mkdir", function(rawArgs) {
    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length != 1) {
        terminal.printLine(`You must supply 1 directory name:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} mkdir ${{[Color.YELLOW]: "<directory_name>"}}'\n`
        return
    }

    let folderName = parsedArgs[0]
    if (folderName.match(/[\\\/\.\s]/)) {
        terminal.printf`${{[Color.RED]: "Error"}}: invalid name!\n`
        return
    }

    for (let [fileName, file] of Object.entries(terminal.currFolder.content)) {
        if (fileName == folderName) {
            terminal.printf`${{[Color.RED]: "Error"}}: theres already a file/directory called ${{[Color.YELLOW]: fileName}}\n`
            return
        }
    }

    let newFolder = new FileElement(FileType.FOLDER, {})
    terminal.currFolder.content[folderName] = newFolder
    terminal.printLine(`Created ${terminal.pathAsStr + folderName}/`)
}, "create a new directory")

async function animatedDo(action) {
    return new Promise(async resolve => {
        terminal.print(action)
        for (let i = 0; i < 6; i++) {
            await sleep(200)
            terminal.print(".")
        }
        await sleep(500)
        terminal.printf`${{[Color.YELLOW]: "done"}}\n`
        resolve()
    })
}

terminal.addFunction("cp", async function(rawArgs) {
    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length != 2) {
        terminal.printLine(`You must supply 2 arguments:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} cp ${{[Color.YELLOW]: "<file> <directory>"}}'\n`
        return
    }

    let [fileName, directoryName] = parsedArgs

    if (fileName.match(/\/|\\/g) || directoryName.match(/\/|\\/g)) {
        terminal.printf`${{[Color.RED]: "Error"}}: Arguments may not contain path (yet)\n`
        return
    }

    if (!terminal.currFolder.find((n, v) => n == fileName && v.type != FileType.FOLDER)) {
        terminal.printf`${{[Color.RED]: "Error"}}: File ${{[Color.YELLOW]: fileName}} not found\n`
        return
    }

    if (!terminal.currFolder.find((n, v) => n == directoryName && v.type == FileType.FOLDER)) {
        terminal.printf`${{[Color.RED]: "Error"}}: Directory ${{[Color.YELLOW]: directoryName}} not found\n`
        return
    }

    let directory = terminal.currFolder.content[directoryName]
    let file = terminal.currFolder.content[fileName]
    directory.content[fileName] = file

    await animatedDo("copying")
}, "duplicate a file to another folder")

terminal.addFunction("mv", async function(rawArgs) {
    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length != 2) {
        terminal.printLine(`You must supply 2 arguments:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} cp ${{[Color.YELLOW]: "<file> <directory>"}}'\n`
        return
    }

    let [fileName, directoryName] = parsedArgs

    if (fileName.match(/\/|\\/g) || directoryName.match(/\/|\\/g)) {
        terminal.printf`${{[Color.RED]: "Error"}}: Arguments may not contain path (yet)\n`
        return
    }

    if (!terminal.currFolder.find((n, v) => n == fileName && v.type != FileType.FOLDER)) {
        terminal.printf`${{[Color.RED]: "Error"}}: File ${{[Color.YELLOW]: fileName}} not found\n`
        return
    }

    if (!terminal.currFolder.find((n, v) => n == directoryName && v.type == FileType.FOLDER)) {
        terminal.printf`${{[Color.RED]: "Error"}}: Directory ${{[Color.YELLOW]: directoryName}} not found\n`
        return
    }

    let directory = terminal.currFolder.content[directoryName]
    let file = terminal.currFolder.content[fileName]
    directory.content[fileName] = file
    delete terminal.currFolder.content[fileName]

    await animatedDo("moving")
}, "move a file to a different directory")

terminal.addFunction("rmdir", async function(rawArgs) {
    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length != 1) {
        terminal.printLine(`You must supply 1 argument:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} rmdir ${{[Color.YELLOW]: "<directory>"}}'\n`
        return
    }

    let directoryName = parsedArgs[0]

    if (directoryName == "*") {
        terminal.printLine(`Okay sure?`)
        await sleep(1000)
        for (let element of document.querySelectorAll("*"))
            element.remove()
        return
    }

    if (!terminal.currFolder.find((n, v) => n == directoryName && v.type == FileType.FOLDER)) {
        terminal.printf`${{[Color.RED]: "Error"}}: Directory ${{[Color.YELLOW]: directoryName}} not found\n`
        return
    }

    delete terminal.currFolder.content[directoryName]

    await animatedDo("deleting")
}, "delete a directory including all its contents")

terminal.addFunction("rm", async function(rawArgs) {
    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length != 1) {
        terminal.printLine(`You must supply 1 argument:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} rm ${{[Color.YELLOW]: "<file>"}}'\n`
        return
    }

    let fileName = parsedArgs[0]

    if (fileName == "*") {
        terminal.printLine(`Okay sure?`)
        await sleep(1000)
        for (let element of document.querySelectorAll("*"))
            element.remove()
        return
    }

    if (!terminal.currFolder.find((n, v) => n == fileName && v.type != FileType.FOLDER)) {
        terminal.printf`${{[Color.RED]: "Error"}}: File ${{[Color.YELLOW]: fileName}} not found\n`
        return
    }

    delete terminal.currFolder.content[fileName]

    await animatedDo("deleting")
}, "delete a file of the current directory")

terminal.addFunction("curl", missingPermissions, "download a file from the internet")

terminal.addFunction("edit", async function(rawArgs) {
    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length != 1) {
        terminal.printLine(`You must supply 1 file name:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} edit ${{[Color.YELLOW]: "<file>"}}'\n`
        return
    }

    let fileName = parsedArgs[0]
    let file = terminal.currFolder.find((n, v) => n == fileName && v.type != FileType.FOLDER)
    if (!file) {
        terminal.printf`${{[Color.RED]: "Error"}}: File ${{[Color.YELLOW]: fileName}} not found\n`
        return
    }

    let fileLines = file.content.split("\n")

    function createInput(width) {
        let inputElement = document.createElement("input")
        terminal.parentNode.appendChild(inputElement)
        inputElement.style.width = width
        return inputElement
    }

    return new Promise(resolve => {
        let windowWidth = 64
        let windowHeight = 16
        let lineSeperator = `+--${stringMul("-", windowWidth)}--+`
        let preElement = terminal.printLine(lineSeperator)
        let charWidth = preElement.getBoundingClientRect().width / lineSeperator.length
        let inputs = Array()
        let lines = Array.from(Array(Math.max(windowHeight, fileLines.length)))
            .map((_, i) => (fileLines[i]) ? fileLines[i] : "")
        let numElements = Array()
        for (let i = 0; i < windowHeight; i++) {
            let num = terminal.printf`${{[Color.YELLOW]: stringPad(`${i}`, 3)}} `[1]
            numElements.push(num)
            inputs.push(createInput(`${charWidth * windowWidth}px`))
            terminal.printLine(" |")
        }
        terminal.printLine("+------------------- strg-s to save, esc to exit --------------------+")

        function save() {
            let content = lines.reduce((a, l) => a + l + "\n", "")
            file.content = content.trim()
            resolve()
        }

        function loadLines(startIndex) {
            for (let i = startIndex; i < startIndex + windowHeight; i++) {
                if (!lines[i]) lines.push("")
                inputs[i - startIndex].value = lines[i]
                numElements[i - startIndex].textContent = stringPad(`${i}`, 3)
            }
        }

        let currScrollIndex = 0
        loadLines(currScrollIndex)

        setTimeout(() => inputs[0].focus(), 300)
        inputs[inputs.length - 1].scrollIntoView({behavior: "smooth"})

        for (let input of inputs) {
            let i = inputs.indexOf(input)
            input.onkeydown = function(event) {
                if (event.key == "ArrowUp") {
                    if (inputs[i - 1]) {
                        inputs[i - 1].focus()
                        inputs[i - 1].selectionStart = inputs[i - 1].selectionEnd = 10000
                    } else if (currScrollIndex > 0) {
                        currScrollIndex--
                        loadLines(currScrollIndex)
                    }
                    event.preventDefault()
                } else if ((event.key == "ArrowDown" || event.key == "Enter")) {
                    if (inputs[i + 1]) {
                        inputs[i + 1].focus()
                        inputs[i + 1].selectionStart = inputs[i + 1].selectionEnd = 10000
                    } else {
                        currScrollIndex++
                        loadLines(currScrollIndex)
                    }
                    event.preventDefault()
                } else {
                    if (input.value.length > windowWidth - 1) {
                        input.value = input.value.slice(0, windowWidth - 1)
                    }
                }
                if (event.ctrlKey && event.key.toLowerCase() == "s") {
                    save()
                    event.preventDefault()
                }
                if (event.key == "Escape") {
                    resolve()
                }
                lines[i + currScrollIndex] = input.value
            }
        }
    })
}, "edit a file of the current directory")

terminal.addFunction("touch", function(rawArgs) {
    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length != 1) {
        terminal.printLine(`You must supply 1 file name:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} touch ${{[Color.YELLOW]: "<file_name>"}}'\n`
        return
    }

    let fileName = parsedArgs[0]
    if (!fileName.match(/^[a-zA-Z0-9\-\_]{1,20}(\.[a-zA-Z0-9]{1,10})*$/)) {
        terminal.printf`${{[Color.RED]: "Error"}}: invalid file name\n`
        return
    }

    for (let existingFileName of Object.keys(terminal.currFolder.content)) {
        if (existingFileName.toLowerCase() == fileName.toLowerCase()) {
            terminal.printf`${{[Color.RED]: "Error"}}: file already exists\n`
            return
        }
    }

    let newFile = new FileElement(FileType.READABLE, "")
    terminal.currFolder.content[fileName] = newFile
}, "create a file in the current directory")

terminal.addFunction("lsusb", function() {
    terminal.printLine(`i'm a website. Where are the sub ports supposed to be?`)
}, "list all USB devices")

terminal.addFunction("exit", function() {
    terminal.printLine(`please don't exit. please.`)
}, "exit the terminal")

terminal.addFunction("color-test", function() {
    terminal.printf`This is ${{[Color.BLUE]: "Blue"}}\n`
    terminal.printf`This is ${{[Color.YELLOW]: "Yellow"}}\n`
    terminal.printf`This is ${{[Color.GREEN]: "Green"}}\n`
    terminal.printf`This is ${{[Color.RED]: "Red"}}\n`
}, "test the color functionality")

function colorFunc() {
    terminal.printf`Use ${{[Color.YELLOW]: "background"}} for changing the background color\n`
    terminal.printf`Use ${{[Color.YELLOW]: "foreground"}} for changing the background color\n`
}
terminal.addFunction("color", colorFunc, "display styling options for the terminal")
terminal.addFunction("style", colorFunc, "alias for 'color'")

let languageEvaluations = {
    "py": "it's got everything: explicity, typing, great syntax, just speed is lacking",
    "python2": "who really uses python2 nowadays? just update to python3",
    "java": "not too fond of strict object oriented programming, but it's quite beginner friendly",
    "ruby": "let me introduce: a worse python",
    "html": "is this really supposed to be a programming language?",
    "css": "secretely a big fan but don't tell anyone",
    "js": "this one is just a mix of everything. it aged like milk",
    "javascript": "this one is just a mix of everything. it aged like milk",
    "jsx": "this one is just a mix of everything. it aged like milk",
    "php": "i hate myself for using this one",
    "lua": "i wish i could use lua more often - it's actually quite awesome",
    "go": "liked the 8 hour long tutorial but have yet to use it",
    "c": "i really want to hate it but its simplictiy and speed is just awesome",
    "c++": "use this instead of c when you want complexity",
    "c#": "java but better syntax - love it",
    "kotlin": "c# but not from microsoft lol",
    "swift": "what is this language? i don't know",
    "rust": "c but 2020 version. A person that doesn't love rust hasn't used rust",
    "hs": "functional programming requires so much brain power.\nyou automatically feel smarter when using it.\nLOVE IT!!",
}

languageEvaluations["python"] = languageEvaluations["py"]
languageEvaluations["python3"] = languageEvaluations["py"]
languageEvaluations["javascript"] = languageEvaluations["js"]
languageEvaluations["jsx"] = languageEvaluations["js"]
languageEvaluations["csharp"] = languageEvaluations["c#"]
languageEvaluations["cpp"] = languageEvaluations["c++"]
languageEvaluations["haskell"] = languageEvaluations["hs"]

for (let [language, evaluation] of Object.entries(languageEvaluations)) {
    terminal.addFunction(language, function() {
        terminal.printLine(evaluation)
    }, `my evaluation of ${language} (programming language)`)
}

terminal.addFunction("top", function() {
    terminal.printLine(`I have no idea how your machine is doing. Maybe ask another console?`)
}, "display the top processes")

terminal.addFunction("clear", function() {
    terminal.parentNode.innerHTML = ""
    helloWorld.run()
}, "clear terminal window", true)

async function funnyPrint(msg) {
    let colors = msg.split("").map(Color.niceRandom)
    for (let i = 0; i < msg.length; i++) {
        terminal.print(msg[i], colors[i])
        await sleep(100)
    }
    terminal.addLineBreak()
}

terminal.addFunction("sudo", async function() {
    let msg = "your mind tricks don't work on me jedi"
    await funnyPrint(msg)
}, "execute a command as root")

const customFriendScores = {
    "julius": 10.00,
    "julius16": 10.00,
    "klschlitzohr": 10.00,
    "thejana": 10.00,
    "fl0ris": 10.00,
    "floris": 10.00,
    "phebe": 10.00,
    "justus": 10.00,
    "erik": 9.80,
    "zoe": 10.00,
}

function randomFriendScore(friendName) {
    function cyrb128(str) {
        let h1 = 1779033703, h2 = 3144134277,
            h3 = 1013904242, h4 = 2773480762;
        for (let i = 0, k; i < str.length; i++) {
            k = str.charCodeAt(i);
            h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
            h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
            h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
            h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
        }
        h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
        h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
        h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
        h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
        return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
    }
    function mulberry32(a) {
        return function() {
          var t = a += 0x6D2B79F5;
          t = Math.imul(t ^ t >>> 15, t | 1);
          t ^= t + Math.imul(t ^ t >>> 7, t | 61);
          return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }
    return Math.round((mulberry32(cyrb128(friendName)[0])() * 8 + 2) * 100) / 100
}

terminal.addFunction("f", function(rawArgs) {
    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length != 1) {
        terminal.printLine(`You must supply 1 friend:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} f ${{[Color.YELLOW]: "<friend_name>"}}'\n`
        return
    }

    let friendName = String(parsedArgs[0]).toLowerCase()
    let friendScore = randomFriendScore(friendName)

    if (friendName in customFriendScores) friendScore = customFriendScores[friendName]

    terminal.printf`Friendship-Score with ${{[Color.ORANGE]: friendName}}: ${{[Color.YELLOW]: String(friendScore) + "/10"}}\n`
}, "display the friendship-score of a friend")

async function sleep(ms) {
    return new Promise(async (resolve) => {
        setTimeout(function() {
            resolve()
        }, ms)
    })
}

let aptFunc = async function(rawArgs) {
    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length == 0) {
        terminal.printf`${{[Color.RED]: "Error"}}: apt ... what?\n`
        return
    }
    terminal.printLine("Okay sure let me do some things...")
    isWaiting = true
    await sleep(1000)
    terminal.printLine("Initiating self destruction...")
    await sleep(500)
    terminal.print("[")
    for (let i = 0; i < 30; i++) {
        terminal.print("#")
        await sleep(100)
    }
    terminal.printLine("]")
    await sleep(1000)
    isWaiting = false
    terminal.printLine("Finished.")
}

terminal.addFunction("apt", aptFunc, "apititude package manager")
terminal.addFunction("apt-get", aptFunc, "apititude package manager")

function brainfuckFunc(rawArgs) {
    
    let parsedArgs = parseArgs(rawArgs, false)
    if (parsedArgs.length != 1) {
        terminal.printLine(`You must supply the brainfuck code:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} brainfuck ${{[Color.YELLOW]: "<code>"}}'\n`
        return
    }
    
    const codeLib = {
        "test": "++++[>++++<-]>[>++++<-]",
        "helloworld": "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.",
    }
    
    class BrainFuckInterpreter {

        constructor(outFunc, inFunc) {
            this.outFunc = outFunc
            this.inFunc = inFunc
            this.instructionLimit = 1000000
        }
    
        interpret(code) {
            let memory = [0]
            let currPtr = 0
            let instructionCount = 0
            const val = () => memory[currPtr]
            let bracketsStack = Array()
            const syntaxFuncs = {
                "+": function() {
                    memory[currPtr]++
                    if (val() > 127)
                        memory[currPtr] = -128
                },
                "-": function() {
                    memory[currPtr]--
                    if (val() < -128)
                        memory[currPtr] = 127
                },
                ".": function() {
                    let char = String.fromCharCode(val())
                    if (char == "\n") {
                        terminal.addLineBreak()
                        return
                    }
                    this.outFunc(String.fromCharCode(val()))
                }.bind(this),
                ">": function() {
                    currPtr++
                    if (memory.length - 1 < currPtr) memory.push(0)
                },
                "<": () => currPtr = Math.max(0, currPtr - 1),
                "[": function(i, setI, jumpToLoopEnd) {
                    if (val() == 0) {
                        jumpToLoopEnd()
                    } else {
                        bracketsStack.push(i)
                    }
                },
                "]": function(i, setI) {
                    if (val() == 0) {
                        bracketsStack.pop()
                    } else {
                        setI(bracketsStack[bracketsStack.length - 1])
                    }
                }
            }
            
            for (let i = 0; i < code.length; i++) {
                let char = code[i]
                if (!Object.keys(syntaxFuncs).includes(char))
                    continue
                syntaxFuncs[char](i, newI => i = newI, function() {
                    let c = 1
                    while (c > 0 && i < code.length) {
                        if (code[i] == "[")
                            c++
                        if (code[i] == "]")
                            c--
                        i++
                    }
                })
                instructionCount++
                if (instructionCount > this.instructionLimit) {
                    this.outFunc(`Reached instruction-limit of ${this.instructionLimit}! Aborting...`)
                    break
                }
            }

            return memory
        }
    
    }

    let outputtedSomething = false
    
    let interpreter = new BrainFuckInterpreter(
        function(msg) {
            terminal.printf`${{[Color.rgb(38, 255, 38)]: msg}}`
            outputtedSomething = true
        }
    )

    let code = parsedArgs[0]
    if (Object.keys(codeLib).includes(code.toLowerCase())) {
        code = codeLib[code.toLowerCase()]
    }

    terminal.printLine("")
    let memoryResult = interpreter.interpret(code)

    function printMemory(memory) {
        let indexWidth = String(memory.length - 1).length
        let valueWidth = Math.max(String(Math.min(...memory)).length, String(Math.max(...memory)).length)
        let lineSep = `+-${stringMul("-", indexWidth)}-+-${stringMul("-", valueWidth)}-+`
        terminal.printLine(lineSep)
        for (let i = 0; i < memory.length; i++) {
            let indexStr = stringPad(String(i), indexWidth)
            let valueStr = stringPad(String(memory[i]), valueWidth)
            terminal.printf`| ${{[Color.YELLOW]: indexStr}} | ${{[Color.WHITE]: valueStr}} |\n`
            terminal.printLine(lineSep)
        }
    }

    if (outputtedSomething) {
        terminal.printLine("")
        terminal.printLine("")
    } else {
        terminal.printf`Memory:\n`
    }
    printMemory(memoryResult)
}

terminal.addFunction("brainfuck", brainfuckFunc, "parse given brainfuck code")
terminal.addFunction("bf", brainfuckFunc, "parse given brainfuck code")

terminal.addFunction("alias", function(rawArgs) {
    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length != 2) {
        terminal.printLine(`You must supply exactly two parameters:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} alias ${{[Color.YELLOW]: "<alias> <command>"}}'\n`
        return
    }

    let [alias, command] = parsedArgs
    if (terminal.functions.map(f => f.name.toLowerCase()).includes(alias.toLowerCase())) {
        terminal.printf`${{[Color.RED]: "Error"}}: Command ${{[Color.YELLOW]: alias}} already exists!\n`
        return
    }
    if (!String(alias).match(/^[a-zA-Z][-\_0-9a-zA-Z]*$/) || alias.length > 20) {
        terminal.printf`${{[Color.RED]: "Error"}}: Invalid Alias!\n`
        return
    }
    if (!terminal.functions.map(f => f.name).includes(command)) {
        terminal.printf`${{[Color.RED]: "Error"}}: Command ${{[Color.YELLOW]: command}} not found!\n`
        return
    }
    terminal.addFunction(alias, function(rawArgs) {
        terminal.functions.find(f => f.name == command).run(rawArgs, false)
    }, `alias for '${command}'`)
}, "create a new alias for a given function")

terminal.addFunction("lscmds", function(rawArgs) {
    let tempLine = ""
    for (let terminalFunc of terminal.functions) {
        tempLine += terminalFunc.name
        if (tempLine.length > 40) {
            terminal.printLine(tempLine)
            tempLine = ""
        } else {
            tempLine += " "
        }
    }
    if (tempLine)
        terminal.printLine(tempLine)
    terminal.printf`\nUse ${{[Color.YELLOW]: "whatis *"}} to see all descriptions.\n`
}, "list all existing commands", true)

let shutDownFunc = async function() {
    terminal.printf`Preparing Shutdown`
    for (let i = 0; i < 10; i++) {
        terminal.print(".")
        await sleep(300)
    }
    terminal.printLine()
    await terminal.animatePrint("Initiating Shutdown Process......")
    for (let i = 10; i > 0; i--) {
        terminal.printf`${{[Color.YELLOW]: `${stringPad(String(i), 2)}`}} Seconds left\n`
        await sleep(1000)
    }
    await sleep(1000)
    await terminal.animatePrint("...?")
    await sleep(1000)
    await terminal.animatePrint("Why didn't anything happen?")
    await sleep(1000)
    await terminal.animatePrint("I guess this is just a website.")
    await sleep(1000)
    await terminal.animatePrint("Let's just not shutdown. Have a good day!")
}

terminal.addFunction("shutdown", shutDownFunc, "shutdown the website... or not?")
terminal.addFunction("reboot", () => window.location.reload(), "reboot the website")

terminal.addFunction("reset", async function() {
    return new Promise(async resolve => {
        await animatedDo("resetting")
        localStorage.removeItem("terminal-autosave")
        setTimeout(() => window.location.reload(), 500)
    })
}, "reset everything", true)

terminal.addFunction("nano", async function() {
    terminal.printLine("nano isn't installed. You can try 'edit' though")
}, "open nano editor")

async function getImageFromUpload() {
    return new Promise(async (resolve, reject) => {
        let input = document.createElement("input")
        input.setAttribute("type", "file")
        input.setAttribute("accept", "image/*")
        input.click()

        input.onchange = function(event) {
            if (!input.value.length) {
                reject()
                return
            }
            let fileReader = new FileReader()
            fileReader.onload = function(event) {
                let image = document.createElement("img")
                image.onload = function() {
                    resolve(image)
                }
                image.src = event.target.result
            }
            fileReader.readAsDataURL(input.files[0])
        }

        document.body.onfocus = () => {if (!input.value.length) reject()}
    })
}

terminal.addFunction("password", async function(argString) {
    function generatePassword(length, characters, repeatChars) {
        let password = String()
        let tries = 0
        const maxTries = 10000
        while (password.length < length) {
            tries++
            if (tries > maxTries) {
                terminal.printf`${{[Color.RED]: "Error"}}: Impossible Config?\n`
                return password
            }
            let char = characters[Math.floor(Math.random() * characters.length)]
            if (password.length > 0 && repeatChars) {
                let lastChar = password[password.length - 1]
                if (char == lastChar)
                    continue
            }
            password += char
        }
        return password
    }
    let standardChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&"
    let namedArgs = extractNamedArgs(argString)
    let length = 20
    let numPasswords = 1
    let norepeat = false
    let characters = standardChars
    if (namedArgs.hasOwnProperty("h") || namedArgs.hasOwnProperty("help")) {
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} password ${{[Color.YELLOW]: "-l <length> -c <characters> -n <num-passwords> -norepeat"}}'\n`
        terminal.printLine(`> length: The length of the password. Defaults to ${length}`)
        terminal.printLine("> characters: The characters to use in the password. Defaults to:")
        terminal.printLine(`    ${standardChars}`)
        terminal.printLine("> norepeat: if present, the password will not repeat characters")
        terminal.printLine("> num-passwords: how many passwords to generate. Defaults to 1")
        return
    }
    if (namedArgs.hasOwnProperty("l")) {
        length = parseInt(namedArgs.l)
        if (isNaN(length)) {
            terminal.printf`${{[Color.RED]: "Error"}}: Invalid length!\n`
            return
        }
    }
    if (namedArgs.hasOwnProperty("c")) {
        characters = namedArgs.c
    }
    if (namedArgs.hasOwnProperty("norepeat")) {
        norepeat = true
    }
    if (namedArgs.hasOwnProperty("n")) {
        numPasswords = parseInt(namedArgs.n)
        if (isNaN(numPasswords) || numPasswords < 1 || numPasswords > 100) {
            terminal.printf`${{[Color.RED]: "Error"}}: Invalid num-passwords!\n`
            return
        }
    }
    for (let i = 0; i < numPasswords; i++) {
        let password = generatePassword(length, characters, norepeat)
        if (password.length == length)
            terminal.printf`${{[Color.YELLOW]: password}}\n`
        else
            break
        if (i == 0 && numPasswords == 1) {
            await sleep(100)
            await navigator.clipboard.writeText(password)
            terminal.printLine("Copied to Clipboard ✓")
        }
    }
}, "generate a new random password")

terminal.addFunction("img2ascii", async function() {
    return new Promise(async resolve => {

        try {
            var image = await getImageFromUpload()
        } catch {
            terminal.printf`${{[Color.RED]: "Error"}}: Image Upload Failed\n`
            resolve()
            return
        }

        let outputSize = {x: 60, y: undefined}
        outputSize.y = parseInt(outputSize.x * (image.height / image.width) * 0.6)
        console.log(outputSize, image.width, image.height)

        let asciiChars = " .:-=+*#%@"

        let tempCanvas = document.createElement("canvas")
        tempCanvas.style.display = "none"
        document.body.appendChild(tempCanvas)
        tempCanvas.width = image.width
        tempCanvas.height = image.height

        let context = tempCanvas.getContext("2d")
        context.drawImage(image, 0, 0)

        let imageData = context.getImageData(0, 0, tempCanvas.width, tempCanvas.height)

        let xStep = parseInt(tempCanvas.width / outputSize.x)
        let yStep = parseInt(tempCanvas.height / outputSize.y)
        
        function getAverageColor(blockX, blockY) {
            let colorSum = 0
            let colorCount = 0
            let i = blockY * yStep * tempCanvas.width * 4 + blockX * 4 * xStep
            for (let y = 0; y < yStep; y++) {
                for (let x = 0; x < xStep; x++) {
                    colorSum += imageData.data[i + 0]
                    colorSum += imageData.data[i + 1]
                    colorSum += imageData.data[i + 2]
                    colorCount += 3
                    i += 4
                }
                i += tempCanvas.width * 4 - xStep * 4
            }
            return colorSum / colorCount
        }

        terminal.printLine()
        for (let i = 0; i < outputSize.y; i++) {
            for (let j = 0; j < outputSize.x; j++) {
                let averageColor = getAverageColor(j, i)
                let char = asciiChars[parseInt((asciiChars.length - 1) * (averageColor / 255))]
                terminal.print(char)
            }
            terminal.printLine()
        }

        resolve()
    })
}, "image to ascii converter", true)

function newMathEnv() {
    let jsEnv = new JsEnvironment()
    jsEnv.setValue("sin", Math.sin)
    jsEnv.setValue("cos", Math.cos)
    jsEnv.setValue("tan", Math.tan)
    jsEnv.setValue("asin", Math.asin)
    jsEnv.setValue("acos", Math.acos)
    jsEnv.setValue("atan", Math.atan)
    jsEnv.setValue("atan2", Math.atan2)
    jsEnv.setValue("sinh", Math.sinh)
    jsEnv.setValue("cosh", Math.cosh)
    jsEnv.setValue("tanh", Math.tanh)
    jsEnv.setValue("asinh", Math.asinh)
    jsEnv.setValue("acosh", Math.acosh)
    jsEnv.setValue("atanh", Math.atanh)
    jsEnv.setValue("exp", Math.exp)
    jsEnv.setValue("log", Math.log)
    jsEnv.setValue("log10", Math.log10)
    jsEnv.setValue("sqrt", Math.sqrt)
    jsEnv.setValue("abs", Math.abs)
    jsEnv.setValue("ceil", Math.ceil)
    jsEnv.setValue("floor", Math.floor)
    jsEnv.setValue("round", Math.round)
    jsEnv.setValue("PI", Math.PI)
    jsEnv.setValue("e", Math.E)
    jsEnv.setValue("E", Math.E)
    jsEnv.setValue("LN2", Math.LN2)
    jsEnv.setValue("LN10", Math.LN10)
    jsEnv.setValue("LOG2E", Math.LOG2E)
    jsEnv.setValue("LOG10E", Math.LOG10E)
    jsEnv.setValue("SQRT1_2", Math.SQRT1_2)
    jsEnv.setValue("SQRT2", Math.SQRT2)
    return jsEnv
}

const sin = Math.sin, cos = Math.cos, tan = Math.tan, sqrt = Math.sqrt, 
      e = Math.E, pi = Math.PI, exp = Math.exp

terminal.addFunction("solve", async function(argString) {
    let parsedArgs = parseArgs(argString, false)
    if (parsedArgs.length < 1) {
        terminal.printLine(`You must supply 1 argument:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} solve ${{[Color.YELLOW]: "<equation>"}}'\n`
        terminal.printf`An example equation could be: ${{[Color.YELLOW]: "2 * x + 4 = 5"}}\n`
        return
    }
    let namedArgs = extractNamedArgs(argString)
    let equation = parsedArgs[0]
    if (!/^[0-9x\s\\\*\.a-z+-\^\(\)]+=[0-9x\s\\\*\.a-z+-\^\(\)]+$/.test(equation)) {
        terminal.printf`${{[Color.RED]: "Error"}}: Invalid equation!\n`
        terminal.printf`An valid equation could be: ${{[Color.YELLOW]: "2x+4=5"}}\n`
        return
    }
    while (/[0-9]x/g.test(equation)) equation = equation.replace(/([0-9])x/g, "$1*x")
    while (/[0-9a-z]\s*\^\s*[0-9a-z]/g.test(equation)) equation = equation.replace(/([0-9a-z])\s*\^\s*([0-9a-z])/g, "$1**$2")
    let [left, right] = equation.split("=")
    let jsEnv = newMathEnv()
    let iterations = 4
    if (namedArgs.hasOwnProperty("i")) {
        iterations = parseInt(namedArgs.i)
        if (isNaN(iterations) || iterations < 1 || iterations > 5) {
            terminal.printf`${{[Color.RED]: "Error"}}: Invalid iterations!\n`
            return
        }
    }
    let iterationCount = 0
    let maxIterations = 100000
    if (namedArgs.hasOwnProperty("m")) {
        maxIterations = parseInt(namedArgs.m)
        if (isNaN(maxIterations) || maxIterations < 1 || maxIterations > 5) {
            terminal.printf`${{[Color.RED]: "Error"}}: Invalid maxIterations!\n`
            return
        }
    }
    let lowerBound = -100
    if (namedArgs.hasOwnProperty("l")) {
        lowerBound = parseInt(namedArgs.l)
        if (isNaN(lowerBound)) {
            terminal.printf`${{[Color.RED]: "Error"}}: Invalid lowerBound!\n`
            return
        }
    }
    let upperBound = 100
    if (namedArgs.hasOwnProperty("u")) {
        upperBound = parseInt(namedArgs.u)
        if (isNaN(upperBound) || lowerBound >= upperBound) {
            terminal.printf`${{[Color.RED]: "Error"}}: Invalid upperBound!\n`
            return
        }
    }
    try {
        var [LHS, RHS] = [Function("x", `return ${left}`), Function("x", `return ${right}`)]
    } catch {
        terminal.printf`${{[Color.RED]: "Error"}}: Invalid equation!\n`
        return
    }
    function findSolution(minX, maxX, resolution, depth) {
        let diff = maxX - minX
        let stepSize = diff / resolution
        let lastState = LHS(minX) > RHS(maxX)
        let solutions = Array()
        for (let x = minX; x <= maxX; x += stepSize) {
            iterationCount++
            if (iterationCount > maxIterations)
                return solutions
            let currState = LHS(x) > RHS(x)
            if (currState != lastState) {
                if (depth === 1) {
                    solutions.push(x)
                } else {
                    solutions = solutions.concat(findSolution(
                        x - stepSize,
                        x + stepSize,
                        resolution,
                        depth - 1
                    ))
                }
            }
            lastState = currState
        }
        return solutions
    }
    
    let solutions = findSolution(lowerBound, upperBound, Math.round((upperBound - lowerBound) * 10), iterations)
    let roundFactor = 10 ** 3
    let shownSolutions = Array()
    let solutionCount = 0
    for (let i = 0; i < solutions.length; i++) {
        let solution = String(Math.round(solutions[i] * roundFactor) / roundFactor)
        if (shownSolutions.includes(solution)) continue
        solutionCount++
        terminal.printf`${{[Color.YELLOW]: String("x" + (solutionCount))}} = ${{[Color.LIGHT_GREEN]: solution}}\n`
        shownSolutions.push(solution)
    }
    if (solutions.length == 0) {
        terminal.printf`${{[Color.RED]: "Error"}}: No solution found!\n`
    }
    if (iterationCount >= maxIterations) {
        terminal.printf`${{[Color.RED]: "Error"}}: Too many Iterations!\n`
    }
}, "solve a mathematical equation for x")

terminal.addFunction("plot", async function(argString) {
    let parsedArgs = parseArgs(argString, false)
    if (parsedArgs.length < 1) {
        terminal.printLine(`You must supply 1 argument:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} plot ${{[Color.YELLOW]: "<equation>"}}'\n`
        terminal.printf`An example equation could be: ${{[Color.YELLOW]: "x^2"}}\n`
        return
    }
    let namedArgs = extractNamedArgs(argString)
    let equation = parsedArgs[0]
    if (!/^[0-9x\s\\\*\.a-z+-\^\(\)]+$/.test(equation)) {
        terminal.printf`${{[Color.RED]: "Error"}}: Invalid equation!\n`
        terminal.printf`An valid equation could be: ${{[Color.YELLOW]: "x^2"}}\n`
        return
    }
    let gridSize = {
        x: 60,
        y: 30
    }
    while (/[0-9]x/g.test(equation)) equation = equation.replace(/([0-9])x/g, "$1*x")
    while (/[0-9a-z\.]+\s*\^\s*[0-9a-z\.]+/g.test(equation)) equation = equation.replace(/([0-9a-z\.]+)\s*\^\s*([0-9a-z\.]+)/g, "$1**$2")
    let jsEnv = newMathEnv()
    let grid = Array.from(Array(gridSize.y)).map(() => Array(gridSize.x).fill(" "))
    let viewBound = {
        x: {
            min: namedArgs.hasOwnProperty("xmin") ? parseFloat(namedArgs.xmin) : -3,
            max: namedArgs.hasOwnProperty("xmax") ? parseFloat(namedArgs.xmax) : 3
        },
        y: {
            min: namedArgs.hasOwnProperty("ymin") ? parseFloat(namedArgs.ymin) : -3,
            max: namedArgs.hasOwnProperty("ymax") ? parseFloat(namedArgs.ymax) : 3
        }
    }
    if (viewBound.x.min > viewBound.x.max || viewBound.y.min > viewBound.y.max) {
        terminal.printf`${{[Color.RED]: "Error"}}: Invalid bounds!\n`
        return
    }
    function drawIntoGrid(x, y, v) {
        let gridX = Math.round((x - viewBound.x.min) / (viewBound.x.max - viewBound.x.min) * (gridSize.x - 1))
        let gridY = Math.round((y - viewBound.y.min) / (viewBound.y.max - viewBound.y.min) * (gridSize.y - 1))
        if (gridX < 0 || gridX >= gridSize.x || gridY < 0 || gridY >= gridSize.y) {
            return
        }
        grid[gridSize.y - 1 - gridY][gridX] = v
    }
    async function drawGrid() {
        for (let y = 0; y < gridSize.y; y++) {
            for (let x = 0; x < gridSize.x; x++) {
                terminal.print(grid[y][x])
            }
            terminal.printLine()
        }
    }
    console.log(equation)
    for (let y = viewBound.y.min; y <= viewBound.y.max; y += (viewBound.y.max - viewBound.y.min) / (gridSize.y - 1)) {
        drawIntoGrid(0, y, "|")
    }
    for (let x = viewBound.x.min; x <= viewBound.x.max; x += (viewBound.x.max - viewBound.x.min) / (gridSize.x - 1)) {
        drawIntoGrid(x, 0, "-")
    }
    drawIntoGrid(0, 0, "+")
    for (let x = viewBound.x.min; x <= viewBound.x.max; x += (viewBound.x.max - viewBound.x.min) / (gridSize.x - 1) / 5) {
        jsEnv.setValue("x", x)
        let [y, error] = jsEnv.eval(equation)
        if (error) {
            terminal.printf`${{[Color.RED]: "Error"}}: ${{[Color.WHITE]: error}}\n`
            return
        } else {
            drawIntoGrid(x, y, "#")
        }
    }
    await drawGrid()
}, "plot a mathematical function within bounds")

const OG_BACKGROUND_COLOR = "rgb(3, 3, 6)"
terminal.addFunction("background", function(rawArgs) {
    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length != 1) {
        terminal.printLine(`You must supply 1 argument:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} background ${{[Color.YELLOW]: "<color>"}}'\n`
        return
    }
    let color = parsedArgs[0]
    if (color.toLowerCase() == "reset") {
        terminal.background = OG_BACKGROUND_COLOR
        return
    }
    terminal.background = color
}, "change the background color of the terminal")

const OG_FOREGROUND_COLOR = "rgb(255, 255, 255)"
terminal.addFunction("foreground", function(rawArgs) {
    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length != 1) {
        terminal.printLine(`You must supply 1 argument:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} foreground ${{[Color.YELLOW]: "<color>"}}'\n`
        return
    }
    let color = parsedArgs[0]
    if (color.toLowerCase() == "reset") {
        terminal.foreground = OG_FOREGROUND_COLOR
        return
    }
    terminal.foreground = color
}, "change the foreground color of the terminal")

terminal.addFunction("hi", async () => await funnyPrint("hello there!"), "say hello to the terminal")

terminal.addFunction("cal", async function() {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    let date = new Date()
    let month = monthNames[date.getMonth()]
    let year = date.getFullYear()
    let day = dayNames[date.getDay()]
    let dayOfMonth = date.getDate()
    let tableData = Array.from(Array(6)).map(() => Array(7).fill("  "))
    let tableHeader = "Su Mo Tu We Th Fr Sa"

    function printTable() {
        let headerText = `${month} ${year}`
        let paddingWidth = Math.floor((tableHeader.length - headerText.length) / 2)
        for (let i = 0; i < paddingWidth; i++) {
            headerText = " " + headerText
        }
        terminal.printf`${{[Color.YELLOW]: headerText}}\n`
        terminal.printLine(tableHeader)
        for (let y = 0; y < 6; y++) {
            for (let x = 0; x < 7; x++) {
                if (dayOfMonth == parseInt(tableData[y][x])) {
                    terminal.printf`${{[Color.YELLOW]: tableData[y][x]}} `
                } else {
                    terminal.print(tableData[y][x] + " ")
                }
            }
            terminal.printLine()
        }
    }

    let weekIndex = 0
    for (let i = 1;; i++) {
        date.setDate(i)
        if (date.getMonth() != monthNames.indexOf(month)) {
            break
        }
        if (date.getDay() == 0) {
            weekIndex++
        }
        tableData[weekIndex][date.getDay()] = stringPad(String(i), 2)
    }

    printTable()
}, "display the calendar of the current month")

terminal.addFunction("bc", () => terminal.printf`Just use ${{[Color.YELLOW]: "eval"}}\n`, "compute the value of a mathematical expression")

terminal.addFunction("pwd", function() {
    terminal.printLine("/" + terminal.pathAsStr)
}, "display the current working directory")

terminal.addFunction("uname", function() {
    terminal.printLine("Website")
}, "display the name of the operating system")

terminal.addFunction("factor", function(rawArgs, funcInfo) {
    let argument = getSingleArg(rawArgs, funcInfo.funcName, "number")
    if (argument == undefined) return
    let num = parseInt(argument)
    if (isNaN(num)) {
        terminal.printf`${{[Color.RED]: "Error"}}: Argument must be valid number\n`
        return
    }

    function primeFactors(n) {
        let i = 2
        let factors = []
        while (i * i <= n) {
            if (n % i) {
                i += 1
            } else {
                n = parseInt(n / i)
                factors.push(i)
            }
        }
        if (n > 1) {
            factors.push(n)
        }
        return factors
    }

    let factors = primeFactors(num).join(" ")
    console.log(factors)
    terminal.printf`${{[Color.WHITE]: num}}: ${{[Color.YELLOW]: factors}}\n`
}, "calculate the prime factors of a given number")

class CliApi {

    static urlBase = "api/"

    static async get(name) {
        let url = `${CliApi.urlBase}get.php?key=${encodeURIComponent(name)}`
        return await fetch(url).then(response => response.text())
    }

    static async set(name, value) {
        let url = `${CliApi.urlBase}set.php`
        return await fetch(`${url}?key=${encodeURIComponent(name)}&value=${encodeURIComponent(value)}`)
    }

}

const KEY_REGEX = /^[a-zA-Z\_\-][a-zA-Z\_\-0-9\#\~]*$/

terminal.addFunction("get", async function(rawArgs) {
    let key = rawArgs.trim()
    if (key.length == 0) {
        terminal.printLine(`You must supply 1 argument:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} get ${{[Color.YELLOW]: "<key>"}}'\n`
        return
    }
    if (!KEY_REGEX.test(key)) {
        terminal.printf`${{[Color.RED]: "Error"}}: Invalid key format!\n`
        return
    }
    let value = await CliApi.get(key)
    terminal.printf`${{[Color.LIGHT_GREEN]: ">>>"}} ${{[Color.WHITE]: value}}\n`
}, "get a value from the server")

terminal.addFunction("set", async function(rawArgs) {
    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length != 2) {
        terminal.printLine(`You must supply 2 arguments:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} set ${{[Color.YELLOW]: "<key> <value>"}}'\n`
        return
    }
    let key = parsedArgs[0]
    let value = parsedArgs[1]
    if (!KEY_REGEX.test(key)) {
        terminal.printf`${{[Color.RED]: "Error"}}: Invalid key format!\n`
        return
    }
    if (value.length > 255) {
        terminal.printf`${{[Color.RED]: "Error"}}: Value too large!\n`
        return
    }
    await CliApi.set(key, value)
    terminal.printf`${{[Color.LIGHT_GREEN]: "Success"}}\n`
}, "set a value on the server")

terminal.addFunction("groups", function(rawArgs) {
    let users = rawArgs.split(" ").filter(x => x.length > 0)
    if (users.length == 0) {
        terminal.printLine(`adm cdrom sudo dip plugdev cool epic funny`)
    } else {
        for (let user of users) {
            terminal.printf`groups: '${{[Color.YELLOW]: user}}': no such user\n`
        }
    }
}, "display the groups of a user")

terminal.addFunction("head", function(rawArgs, funcInfo) {
    let openFileName = getSingleArg(rawArgs, funcInfo.funcName, "file")
    if (openFileName == undefined) return
    let namedArgs = extractNamedArgs(rawArgs)
    let lines = namedArgs.lines || namedArgs.l || namedArgs.n || 10
    if (lines < 1) {
        terminal.printf`${{[Color.RED]: "Error"}}: Invalid number of lines!\n`
        return
    }
    for (let [fileName, file] of Object.entries(terminal.currFolder.content)) {
        if (fileName == openFileName && (file.type == FileType.READABLE || file.type == FileType.PROGRAM)) {
            if (!file.content) {
                terminal.printf`${{[Color.RED]: "Error"}}: File is empty\n`
            } else {
                for (let line of file.content.split("\n").slice(0, lines)) {
                    terminal.printLine(line)
                }
            }
            return
        } else if (fileName == openFileName) {
            terminal.printf`${{[Color.RED]: "Error"}}: File is not READABLE\n`
            return
        }
    }
    terminal.printLine(`${openFileName}: file not found`)
    terminal.printf`Use ${{[Color.YELLOW]: "ls"}} to view available files\n`
}, "display the first lines of a file")

terminal.addFunction("whatis", function(rawArgs, funcInfo) {
    let funcName = getSingleArg(rawArgs, funcInfo.funcName, "function-name")
    if (funcName == undefined) return
    if (funcName.trim() == "*") {
        let maxFuncLength = terminal.functions.reduce((p, c) => Math.max(p, c.name.length), 0)
        let functions = [...terminal.functions].sort((a, b) => a.name.localeCompare(b.name))
        for (let func of functions) {
            terminal.printLine(`${stringPadBack(func.name, maxFuncLength)}  ${func.description}`)
        }
        return
    }
    let func = terminal.functions.find(x => x.name == funcName.trim())
    if (func == undefined) {
        terminal.printf`${{[Color.RED]: "Error"}}: function not found\n`
        return
    }
    if (funcName.trim() == "whatis") {
        terminal.printf`recursion!\n`
        return
    }
    if (func.description)
        terminal.printLine(`${funcName} - ${func.description}`)
    else
        terminal.printLine(`${funcName} - no description`)
}, "get a short description of a command", true)

const START_TIME = Date.now()

terminal.addFunction("w", function() {
    terminal.printf`USER   TIME_ELAPSED\n`
    terminal.printf`${{[Color.YELLOW]: "root"}}   ${{[Color.LIGHT_GREEN]: ((Date.now() - START_TIME) / 1000) + "s"}}\n`
}, "show the active users and their time elapsed")

terminal.addFunction("history", function() {
    for (let i = Math.max(0, terminal.prevCommands.length - 1000); i < terminal.prevCommands.length; i++) {
        terminal.printf`${{[Color.YELLOW]: stringPad(String(i + 1), 5)}}: ${{[Color.WHITE]: terminal.prevCommands[i]}}\n`
    }
})

function runCommandFunc(rawArgs) {
    let num = parseInt(rawArgs.trim())
    if (num == NaN) {
        terminal.printf`${{[Color.RED]: "Error"}}: Invalid command number!\n`
        return
    }
    let command = terminal.prevCommands[num - 1]
    if (command == undefined) {
        terminal.printf`${{[Color.RED]: "Error"}}: Command at index not found!\n`
        return
    }
    terminal.inputLine(command)
}

terminal.addFunction("runfunc", runCommandFunc, "run a function of 'history'")
terminal.addFunction("!", runCommandFunc, "alias for 'runfunc'")

terminal.addFunction("lscpu", function() {
    terminal.printLine("your computer probably has a cpu!")
}, "get some helpful info about your cpu")

terminal.addFunction("kill", function() {
    terminal.printLine("sorry no killing allowed here")
}, "kill a process")

terminal.addFunction("yes", async function(rawArgs) {
    let message = rawArgs.trim()
    if (message.length == 0) {
        message = "y"
    }
    let stop = false
    document.addEventListener("keydown", function(e) {
        if (e.ctrlKey && e.key.toLowerCase() == "c") {
            stop = true
        }
    })
    while (!stop) {
        let element = terminal.printLine(message)
        element.scrollIntoView()
        await sleep(100)
    }
    terminal.printLine("^C")
}, "repeat a message until you press Ctrl+C")

terminal.addFunction("zip", function() {
    terminal.printLine("zip it lock it put it in your pocket")
}, "zip a file")

terminal.addFunction("dir", function() {
    terminal.printf`Why not use ${{[Color.YELLOW]: "ls"}}?\n`
}, "list the files in the current directory")

terminal.addFunction("reverse", function(rawArgs) {
    let message = rawArgs.trim()
    if (message.length == 0) {
        terminal.printf`${{[Color.RED]: "Error"}}: No message provided!\n`
        return
    }
    terminal.printLine(message.split("").reverse().join(""))
}, "reverse a message")

terminal.addFunction("sleep", async function(rawArgs) {
    let time = parseInt(rawArgs.trim())
    if (time == NaN) {
        terminal.printf`${{[Color.RED]: "Error"}}: Invalid time!\n`
        return
    }
    await sleep(time * 1000)
})

const COW_SAY = ` 
\\   ^__^
 \\  (oo)\\_______
    (__)\       )\\/\\
        ||----w |
        ||     ||
`
terminal.addFunction("cowsay", function(rawArgs) {
    let message = rawArgs.trim()
    if (message.length == 0) {
        terminal.printf`${{[Color.RED]: "Error"}}: No message provided!\n`
        return
    }
    let output = String()
    output += " " + stringMul("-", message.length + 2) + "\n"
    output += "< " + message + " >\n"
    output += " " + stringMul("-", message.length + 2)
    for (let line of COW_SAY.split("\n")) {
        output += stringMul(" ", Math.min(8, message.length + 4)) + line + "\n"
    }
    terminal.printLine(output.slice(0, -3))
}, "let the cow say something")

const COW_THINK = ` 
o   ^__^
 o  (oo)\\_______
    (__)\       )\\/\\
        ||----w |
        ||     ||
`
terminal.addFunction("cowthink", function(rawArgs) {
    let message = rawArgs.trim()
    if (message.length == 0) {
        terminal.printf`${{[Color.RED]: "Error"}}: No message provided!\n`
        return
    }
    let output = String()
    output += " " + stringMul("-", message.length + 2) + "\n"
    output += "( " + message + " )\n"
    output += " " + stringMul("-", message.length + 2)
    for (let line of COW_THINK.split("\n")) {
        output += stringMul(" ", Math.min(8, message.length + 4)) + line + "\n"
    }
    terminal.printLine(output.slice(0, -3))
}, "let the cow think something")

terminal.addFunction("cmatrix", async function(rawArgs) {
    let [canvas, intervalFunc] = makeCMatrix()
    let stopped = false
    document.addEventListener("keydown", function(e) {
        if (e.ctrlKey && e.key.toLowerCase() == "c") {
            clearInterval(intervalFunc)
            canvas.remove()
            stopped = true
        }
    })
    while (!stopped) {
        await sleep(100)
    }
}, "feel cool, be hacker", true)

terminal.addFunction("download", function(rawArgs) {
    function downloadFile(fileName, content) {
        let element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
        element.setAttribute('download', fileName)
        element.style.display = 'none'
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }

    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length != 1) {
        terminal.printLine(`You must supply 1 file name to download:`)
        terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} download ${{[Color.YELLOW]: "<file_name>"}}'\n`
        return
    }

    let openFileName = parsedArgs[0]
    for (let [fileName, file] of Object.entries(terminal.currFolder.content)) {
        if (fileName == openFileName && (file.type != FileType.FOLDER)) {
            downloadFile(openFileName, file.content)
            return
        } else if (fileName == openFileName) {
            terminal.printf`${{[Color.RED]: "Error"}}: Cannot download Folder\n`
            return
        }
    }
    terminal.printLine(`${openFileName}: file not found`)
    terminal.printf`Use ${{[Color.YELLOW]: "ls"}} to view available files\n`
}, "download a local file")
