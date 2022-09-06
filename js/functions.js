terminal.addFunction("ls", function(_, funcInfo) {
    let args = getArgs(funcInfo, ["?folder", "?r"], {folder: ""})
    let targetFolder = terminal.getFile(!!args.folder ? args.folder : "", FileType.FOLDER)

    let recursive = args.r

    function listFolder(folder, indentation=0) {
        let i = 0
        for (let [fileName, file] of Object.entries(folder.content)) {
            i++
            if (indentation > 0)
                terminal.print(" ".repeat(indentation))
            terminal.print(i + " ", Color.COLOR_1)
            if (file.type == FileType.FOLDER) {
                terminal.printCommand(`${fileName}/`, `cd ${fileName}/`)
                if (recursive) {
                    listFolder(file, indentation + 4)
                }
            } else {
                terminal.printLine(fileName)
            }
        }
    }

    listFolder(targetFolder)

    if (Object.entries(targetFolder.content).length == 0) {
        terminal.printLine(`this directory is empty`)
    }
}, "list all files of current directory", true)

function getSingleArg(rawArgs, cmdname, argname) {
    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length != 1) {
        terminal.printLine(`You must supply 1 argument:`)
        terminal.printf`'${{[Color.COLOR_2]: "$"}} ${{[Color.WHITE]: cmdname}} ${{[Color.COLOR_1]: "<" + argname + ">"}}'\n`
        throw new IntendedError()
    }
    return parsedArgs[0]
}

terminal.addFunction("cd", function(_, funcInfo) {
    let args = getArgs(funcInfo, ["directory"])
    
    if (["-", ".."].includes(args.directory)) {
        if (terminal.currPath.length > 0) {
            terminal.currPath.pop()
            terminal.updatePath()
            return
        } else {
            throw new Error("You are already at ground level")
        }
    } else if (["/", "~"].includes(args.directory)) {
        if (terminal.currPath.length > 0) {
            terminal.currPath = Array()
            terminal.updatePath()
            return
        } else {
            throw new Error("You are already at ground level")
        }
    }
    
    let path = args.directory.split("/")
    if (args.directory.length == 1)
        path = args.directory.split("\\")

    path = path.map(p => p.trim()).filter(p => p.length > 0)

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
    terminal.printf`Use ${{[Color.COLOR_1]: "ls"}} to view available files\n`
}, "change current directory", true)

{
    function makeCatFunc(readFunc) {
        return async function(_, funcInfo) {
            let args = getArgs(funcInfo, ["file"])
            let file = terminal.getFile(args.file)
            if (file.type == FileType.FOLDER) 
                throw new Error("Cannot read directory data")
            if (args.file.endsWith("passwords.json")) {
                let favoriteUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                setTimeout(() => window.location.href = favoriteUrl, 1000)
            }
            if (!file.content)
                throw new Error("File is empty")
            if (readFunc.constructor.name == "AsyncFunction")
                await readFunc(file.content, args.file, file)
            else 
                readFunc(file.content, args.file, file)
        }
    }

    {
        let normalCatFunc = makeCatFunc(content => terminal.printLine(content))
        terminal.addFunction("cat", normalCatFunc, "read file content", true)
        terminal.addFunction("<", normalCatFunc, "alias for 'cat'")
        terminal.addFunction("open", normalCatFunc, "alias for 'cat'")
    }

    terminal.addFunction("tac", makeCatFunc(function(content) {
        let lines = content.split("\n")
        for (var i = lines.length - 1; i >= 0; i--) {
            terminal.printLine(lines[i])
        }
    }), "tnetnoc elif daer")

    terminal.addFunction("sort", makeCatFunc(function(content) {
        let lines = content.split("\n")
        lines.sort()
        for (var i = 0; i < lines.length; i++) {
            terminal.printLine(lines[i])
        }
    }), "display a file in sorted order")

    {

        let runFunc = makeCatFunc(async function(content, fileName, file) {
            if (fileName.endsWith(".js")) {
                let jsEnv = new JsEnvironment()
                jsEnv.setValue("console", {log: m => terminal.printLine(String(m))})
                let [_, error] = jsEnv.eval(content)
                if (error)
                    throw new Error(String(error))
            } else if (file.type != FileType.PROGRAM) {
                throw new Error("File is not executable")
            } else {
                terminal.printLine("You will be redirected to:")
                terminal.printLink(content, content)
                terminal.printf`${{[Color.COLOR_1]: "Ctrl+C"}} to abort\n`
                await sleep(2000)
                window.location.href = content
            }
        })

        terminal.addFunction("./", runFunc, "alias for 'run'")
        terminal.addFunction("run", runFunc, "run a .exe file")

    }

}

terminal.addFunction("wc", function(_, funcInfo) {
    let args = getArgs(funcInfo, ["file"])
    let file = terminal.getFile(args.file)
    if (file.type == FileType.FOLDER) {
        throw new Error("Cannot read file of type FOLDER")
    }
    let fileInfos = {
        "lines": file.content.split("\n").length,
        "words": file.content.split(" ").length,
        "characters": file.content.length
    }
    for (let [infoName, infoContent] of Object.entries(fileInfos)) {
        terminal.print(infoContent + " ", Color.COLOR_1)
        terminal.printLine(infoName)
    }
}, "display word and line count of file")

terminal.addFunction("whoami", function() {
    function startsWithVowel(word) {
        return (
            word.startsWith("a")
            || word.startsWith("e")
            || word.startsWith("i")
            || word.startsWith("o")
            || word.startsWith("u")
        )
    }

    const adjectives = [
        "cool", "fresh", "awesome", "beautiful",
        "fantastic", "good", "wonderful", "colorful"
    ], nouns = [
        "queen", "goddess", "person", "king",
        "god", "human", "princess", "prince"
    ], sentences = [
        "you are a<n> <adjective> <noun>. happy to have you here!",
        "<n> <adjective> <noun>. that's what you are!",
        "you, <noun>, are <adjective>!",
        "i'm going to call you <noun>, because you are <adjective>"
    ], choice = l => l[Math.floor(Math.random() * l.length)]

    let sentence = choice(sentences)
    let lastAdjective = choice(adjectives)
    while (/.*<(?:adjective|n|noun)>.*/.test(sentence)) {
        sentence = sentence.replace(/<n>/, startsWithVowel(lastAdjective) ? "n": "")
        sentence = sentence.replace(/<adjective>/, lastAdjective)
        sentence = sentence.replace(/<noun>/, choice(nouns))
        lastAdjective = choice(adjectives)
    }
    terminal.printLine(sentence)
}, "get info about yourself")

let evalJsEnv = newMathEnv()
evalJsEnv.setValue("console", {log: m => {
    terminal.printf`${{[Color.WHITE]: String(m)}}\n`
}, realLog: console.log})

terminal.addFunction("eval", function(rawArgs) {
    let [result, error] = evalJsEnv.eval(rawArgs)
    if (error) {
        terminal.printf`${{[Color.RED]: "Error"}}: ${{[Color.WHITE]: error}}\n`
    } else if (result !== undefined) {
        terminal.printf`${{[Color.rgb(38, 255, 38)]: ">>>"}} ${{[Color.WHITE]: String(result)}}\n`
    }
}, "evaluate a javascript expression")

terminal.addFunction("echo", function(inp) {
    if (!inp) {
        terminal.printLine(`You must supply an argument to print:`)
        terminal.printf`${{[Color.COLOR_2]: "$"}} echo ${{[Color.COLOR_1]: "<argument>"}}\n`
        return
    }
    terminal.printLine(inp)
}, "echo your words")

function missingPermissions() {
    terminal.printf`${{[Color.RED]: "Error"}}: You do not have permission to use this command!\n`
}

terminal.addFunction("mkdir", function(_, funcInfo) {
    let args = getArgs(funcInfo, ["directory_name"])
    if (args.directory_name.match(/[\\\/\.\s]/))
        throw new Error("File may not contain '/' or '\\'")
    if (terminal.fileExists(args.directory_name))
        throw new Error("File/Directory already exists")
    let newFolder = new FileElement(FileType.FOLDER, {})
    terminal.currFolder.content[args.directory_name] = newFolder
    terminal.printLine(`Created ${terminal.pathAsStr + args.directory_name}/`)
}, "create a new directory")

async function animatedDo(action) {
    return new Promise(async resolve => {
        terminal.print(action)
        for (let i = 0; i < 6; i++) {
            await sleep(200)
            terminal.print(".")
        }
        await sleep(500)
        terminal.printf`${{[Color.COLOR_1]: "done"}}\n`
        resolve()
    })
}

terminal.addFunction("cp", async function(_, funcInfo) {
    let args = getArgs(funcInfo, ["file", "directory"])
    let file = terminal.getFile(args.file)
    if (["..", "-"].includes(args.directory)) {
        if (terminal.currFolder == terminal.rootFolder)
            throw new Error("You are already at ground level")
        var directory = terminal.currFolder.parent
    } else if (["/", "~"].includes(args.directory)) {
        var directory = terminal.rootFolder
    } else {
        var directory = terminal.getFile(args.directory, FileType.FOLDER)
    }
    directory.content[file.name] = file.copy()
}, "duplicate a file to another folder")

terminal.addFunction("mv", async function(_, funcInfo) {
    let args = getArgs(funcInfo, ["file", "directory"])
    let file = terminal.getFile(args.file)
    if (["..", "-"].includes(args.directory)) {
        if (terminal.currFolder == terminal.rootFolder)
            throw new Error("You are already at ground level")
        var directory = terminal.currFolder.parent
    } else if (["/", "~"].includes(args.directory)) {
        var directory = terminal.rootFolder
    } else {
        var directory = terminal.getFile(args.directory, FileType.FOLDER)
    }
    directory.content[file.name] = file.copy()
    delete file.parent.content[file.name]
}, "move a file to a different directory")

terminal.addFunction("rmdir", async function(_, funcInfo) {
    let args = getArgs(funcInfo, ["directory"])
    let directory = terminal.getFile(args.directory, FileType.FOLDER)
    if (Object.keys(directory.content).length > 0) {
        let msg = "the selected directory isn't empty. Continue?"
        await terminal.acceptPrompt(msg, false)
    }
    delete directory.parent.content[directory.name]
}, "delete a directory including all its contents")

terminal.addFunction("rm", async function(_, funcInfo) {
    let args = getArgs(funcInfo, ["file"])
    let file = terminal.getFile(args.file)
    if (file.type == FileType.FOLDER)
        throw new Error("cannot remove directory. use 'rmdir' instead")
    delete file.parent.content[file.name]
}, "delete a file of the current directory")

terminal.addFunction("curl", function() {
    terminal.print("this unfortunately doesn't work due to ")
    terminal.printLink("CORS", "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS")
}, "download a file from the internet")

terminal.addFunction("edit", async function(rawArgs) {
    let parsedArgs = parseArgs(rawArgs)
    if (parsedArgs.length != 1) {
        terminal.printLine(`You must supply 1 file name:`)
        terminal.printf`'${{[Color.COLOR_2]: "$"}} edit ${{[Color.COLOR_1]: "<file>"}}'\n`
        return
    }

    let fileName = parsedArgs[0]
    let file = terminal.currFolder.find((n, v) => n == fileName && v.type != FileType.FOLDER)
    if (!file) {
        terminal.printf`${{[Color.RED]: "Error"}}: File ${{[Color.COLOR_1]: fileName}} not found\n`
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
            let num = terminal.printf`${{[Color.COLOR_1]: stringPad(`${i}`, 3)}} `[1]
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
            let lineIndex = currScrollIndex + i
            input.onkeydown = function(event) {
                if (event.key == "Backspace") {
                    if (input.value.length == 0 && inputs[i - 1]) {
                        inputs[i - 1].focus()
                        lines.splice(lineIndex, 1)
                        loadLines(currScrollIndex)
                        event.preventDefault()
                    }
                } else if (event.key == "ArrowUp") {
                    if (inputs[i - 1]) {
                        inputs[i - 1].focus()
                        inputs[i - 1].selectionStart = inputs[i - 1].selectionEnd = 10000
                    } else if (currScrollIndex > 0) {
                        currScrollIndex--
                        loadLines(currScrollIndex)
                    }
                    event.preventDefault()
                } else if (event.key == "Enter") {
                    lines.splice(lineIndex + 1, 0, "")
                    lines[lineIndex] = input.value
                    if (inputs[i + 1]) {
                        inputs[i + 1].focus()
                        inputs[i + 1].selectionStart = inputs[i + 1].selectionEnd = 10000
                    } else {
                        currScrollIndex++
                    }
                    loadLines(currScrollIndex)
                    event.preventDefault()
                } else if (event.key == "ArrowDown") {
                    if (inputs[i + 1]) {
                        inputs[i + 1].focus()
                        inputs[i + 1].selectionStart = inputs[i + 1].selectionEnd = 10000
                    } else {
                        currScrollIndex++
                        loadLines(currScrollIndex)
                    }
                    event.preventDefault()
                }
                if (event.ctrlKey && event.key.toLowerCase() == "s") {
                    save()
                    event.preventDefault()
                }
                if (event.key == "Escape" || (event.ctrlKey && event.key == "c")) {
                    resolve()
                }
                lines[i + currScrollIndex] = input.value
            }
        }
    })
}, "edit a file of the current directory")

terminal.addFunction("touch", function(_, funcInfo) {
    let args = getArgs(funcInfo, ["filename"])
    if (!/^[a-zA-Z0-9\-\_]{1,20}(\.[a-zA-Z0-9]{1,10})*$/.test(args.filename))
        throw new Error("Invalid filename")
    if (terminal.fileExists(args.filename))
        throw new Error("File already exists")
    let newFile = new FileElement(FileType.READABLE, "")
    terminal.currFolder.content[args.filename] = newFile
}, "create a file in the current directory")

terminal.addFunction("lsusb", function() {
    terminal.printLine(`i'm a website. Where are the sub ports supposed to be?`)
}, "list all USB devices")

terminal.addFunction("exit", function() {
    terminal.printLine(`please don't exit. please.`)
}, "exit the terminal")

terminal.addFunction("color-test", async function() {
    let size = {x: 61, y: 31}
    for (let i = 0; i < size.y; i++) {
        for (let j = 0; j < size.x; j++) {
            let x = (j / size.x - 0.5) * 2
            let y = (i / size.y - 0.5) * 2
            if (x*x + y*y > 1) {
                terminal.print(" ")
            } else {
                let angle = Math.atan2(y, x) / Math.PI * 180
                let hue = Math.round(angle)
                let lightness = Math.round(90 - (x*x + y*y) * 90)
                let color = `hsl(${hue}, 100%, ${lightness}%)`
                terminal.print("#", color)
            }
        }
        terminal.printLine()
    }
}, "test the color functionality")

terminal.addFunction("style", async function(_, funcInfo) {
    class Preset {

        constructor(b=undefined, f=undefined, c1="yellow", c2="rgb(139, 195, 74)", btn=null) {
            this.background = b
            this.foreground = f
            this.accentColor1 = c1
            this.accentColor2 = c2
            this.btnColor = btn || b || "black"
        }

    }

    let PRESETS = {}
    PRESETS["normal"] = new Preset("rgb(3,3,6)", "white")
    PRESETS["ha©k€r"] = new Preset("black", "#4aff36", "#20C20E", "#20C20E")
    PRESETS["light"] = new Preset("#255957", "#EEEBD3")
    PRESETS["fire"] = new Preset("linear-gradient(180deg, red, yellow)", "white")
    PRESETS["phebe"] = new Preset("linear-gradient(to right, red,orange,yellow,lightgreen,blue,indigo,violet)", "white")
    PRESETS["purple"] = new Preset("#371E30", "#F59CA9", "#DF57BC", "#F6828C")
    PRESETS["slate"] = new Preset("#361d32", "#f1e8e6", "#f55951", "#f55951")
    PRESETS["red"] = new Preset("#e74645", "white", "#fdfa66", "#fdfa66", "#e74645")
    PRESETS["cold"] = new Preset("#3c2a4d", "#e0f0ea", "#95adbe", "#95adbe")

    try {
        var args = getArgs(funcInfo, ["preset"])
    } catch {
        terminal.printLine("There are a few presets to choose from:")
        let lineWidth = 0
        for (let presetName of Object.keys(PRESETS)) {
            lineWidth += (presetName + " ").length
            terminal.printCommand(presetName + " ", `style ${presetName}`, Color.WHITE, false)
            if (lineWidth > 35) {
                terminal.printLine()
                lineWidth = 0
            }
        }
        terminal.printLine()
        return
    }
    if (!(args.preset in PRESETS))
        throw new Error(`Unknown preset "${args.preset}"`)
    let attributes = ["background", "foreground", "accentColor1", "accentColor2", "btnColor"]
    let preset = PRESETS[args.preset]
    for (let attribute of attributes) {
        if (preset[attribute] == undefined)
            continue
        terminal[attribute] = preset[attribute]
    }
}, "change the style of the terminal")

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

terminal.addFunction("clear", async function() {
    window.location.reload()
    await sleep(1000)
    throw new Error("reloading failed.")
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
    "imprinzessa": 9.999
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
        terminal.printf`'${{[Color.COLOR_2]: "$"}} f ${{[Color.COLOR_1]: "<friend_name>"}}'\n`
        return
    }

    let friendName = String(parsedArgs[0]).toLowerCase()
    let friendScore = randomFriendScore(friendName)

    if (friendName in customFriendScores) friendScore = customFriendScores[friendName]

    terminal.printf`Friendship-Score with ${{[Color.ORANGE]: friendName}}: ${{[Color.COLOR_1]: String(friendScore) + "/10"}}\n`
}, "display the friendship-score of a friend")

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
        terminal.printf`'${{[Color.COLOR_2]: "$"}} brainfuck ${{[Color.COLOR_1]: "<code>"}}'\n`
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
            terminal.printf`| ${{[Color.COLOR_1]: indexStr}} | ${{[Color.WHITE]: valueStr}} |\n`
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
        terminal.printf`'${{[Color.COLOR_2]: "$"}} alias ${{[Color.COLOR_1]: "<alias> <command>"}}'\n`
        return
    }

    let [alias, command] = parsedArgs
    if (terminal.functions.map(f => f.name.toLowerCase()).includes(alias.toLowerCase())) {
        terminal.printf`${{[Color.RED]: "Error"}}: Command ${{[Color.COLOR_1]: alias}} already exists!\n`
        return
    }
    if (!String(alias).match(/^[a-zA-Z][-\_0-9a-zA-Z]*$/) || alias.length > 20) {
        terminal.printf`${{[Color.RED]: "Error"}}: Invalid Alias!\n`
        return
    }
    if (!terminal.functions.map(f => f.name).includes(command)) {
        terminal.printf`${{[Color.RED]: "Error"}}: Command ${{[Color.COLOR_1]: command}} not found!\n`
        return
    }
    terminal.addFunction(alias, function(rawArgs) {
        terminal.functions.find(f => f.name == command).run(rawArgs, false)
    }, `alias for '${command}'`)
}, "create a new alias for a given function")

terminal.addFunction("lscmds", async function(rawArgs) {
    let namedArgs = extractNamedArgs(rawArgs)
    if (namedArgs.md) {
        let maxFuncLength = terminal.functions.reduce((p, c) => Math.max(p, c.name.length), 0)
        let functions = [...terminal.functions].sort((a, b) => a.name.localeCompare(b.name))
        const allDescriptions = functions.map(f => f.description ? f.description : "undefined")
        let maxDescLength = allDescriptions.reduce((p, c) => Math.max(p, c.length), 0)
        let text = ""
        for (let i = 0; i < functions.length; i++) {
            let func = functions[i]
            let description = allDescriptions[i]
            let funcPart = stringPadBack("\`" + func.name + "\`", maxFuncLength + 2)
            let descpart = stringPadBack(description, maxDescLength)
            text += `| ${funcPart} | ${descpart} |\n` 
        }
        terminal.printLine(text)
        await navigator.clipboard.writeText(text)
        return
    }

    let tempLine = ""
    for (let terminalFunc of terminal.functions) {
        tempLine += terminalFunc.name
        terminal.printCommand(terminalFunc.name, terminalFunc.name, Color.WHITE, false)
        terminal.print(" ")
        if (tempLine.length > 40) {
            tempLine = ""
            terminal.printLine()
        } else {
            tempLine += " "
        }
    }
    if (tempLine.trim().length > 0) terminal.printLine()
    terminal.print("Use ")
    terminal.printCommand("whatis *", "whatis *", Color.COLOR_1, false)
    terminal.printLine(" to see all descriptions")

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
        terminal.printf`${{[Color.COLOR_1]: `${stringPad(String(i), 2)}`}} Seconds left\n`
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

async function fileFromUpload(fileType=null) {
    return new Promise(async (resolve, reject) => {
        let input = document.createElement("input")
        input.setAttribute("type", "file")
        if (fileType)
            input.setAttribute("accept", fileType)
        input.click()

        input.onchange = function(event) {
            if (!input.value.length) {
                reject()
                return
            }
            let fileReader = new FileReader()
            let fileName = input.files[0].name
            let readAsDataURL = (
                fileName.endsWith(".jpg")
                || fileName.endsWith(".png")
                || fileName.endsWith(".jpeg")
                || fileName.endsWith(".svg")
                || fileName.endsWith(".bmp")
                || fileName.endsWith(".gif")
            )
            fileReader.onload = function(event) {
                resolve([fileName, event.target.result, readAsDataURL])
            }
            if (readAsDataURL) {
                fileReader.readAsDataURL(input.files[0])
            } else {
                fileReader.readAsText(input.files[0])
            }
        }

        document.body.onfocus = () => {if (!input.value.length) reject()}  
    })
}

async function getMP3FromUpload() {
    return new Promise(async (resolve, reject) => {
        let input = document.createElement("input")
        input.setAttribute("type", "file")
        input.setAttribute("accept", "audio/mpeg3")
        input.click()

        input.onchange = function(event) {
            if (!input.value.length) {
                reject()
                return
            }
            let fileReader = new FileReader()
            fileReader.onload = function(event) {
                let audio = document.createElement("audio")
                audio.src = event.target.result
                resolve(audio)
            }
            fileReader.readAsDataURL(input.files[0])
        }

        document.body.onfocus = () => {if (!input.value.length) reject()}  
    })
}


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
        terminal.printf`'${{[Color.COLOR_2]: "$"}} password ${{[Color.COLOR_1]: "-l <length> -c <characters> -n <num-passwords> -norepeat"}}'\n`
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
            terminal.printf`${{[Color.COLOR_1]: password}}\n`
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
}, "image to ascii converter")

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
      e = Math.E, pi = Math.PI, exp = Math.exp, abs = Math.abs

terminal.addFunction("solve", async function(argString) {
    let parsedArgs = parseArgs(argString, false)
    if (parsedArgs.length < 1) {
        terminal.printLine(`You must supply 1 argument:`)
        terminal.printf`'${{[Color.COLOR_2]: "$"}} solve ${{[Color.COLOR_1]: "<equation>"}}'\n`
        terminal.printf`An example equation could be: ${{[Color.COLOR_1]: "2 * x + 4 = 5"}}\n`
        return
    }
    let namedArgs = extractNamedArgs(argString)
    let equation = parsedArgs[0]
    if (!/^[0-9x\s\\\*\.a-z+-\^\(\)]+=[0-9x\s\\\*\.a-z+-\^\(\)]+$/.test(equation)) {
        terminal.printf`${{[Color.RED]: "Error"}}: Invalid equation!\n`
        terminal.printf`An valid equation could be: ${{[Color.COLOR_1]: "2x+4=5"}}\n`
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
        let xName = `x${solutionCount}`
        terminal.printf`${{[Color.COLOR_1]: xName}} = ${{[Color.LIGHT_GREEN]: solution}}\n`
        shownSolutions.push(solution)
    }
    if (solutions.length == 0) {
        terminal.printf`${{[Color.RED]: "Error"}}: No solution found!\n`
    }
    if (iterationCount >= maxIterations) {
        terminal.printf`${{[Color.RED]: "Error"}}: Too many Iterations!\n`
    }
}, "solve a mathematical equation for x")

terminal.addFunction("plot", async function(_, funcInfo) {
    try {   
        var args = getArgs(funcInfo, [
            "equation",
            "?xmin:n:-1000~1000", "?xmax:n:-1000~1000",
            "?ymin:n:-1000~1000", "?ymax:n:-1000~1000",
            "?playtime:n:0~10000"
        ], {
            xmin: -Math.PI, xmax: Math.PI,
            ymin: -Math.PI, ymax: Math.PI,
            playtime: 2500
        })
    } catch {
        terminal.printf`An example equation could be: ${{[Color.COLOR_1]: "x^2"}}\n`
        throw new IntendedError()
    }
    let equation = args.equation
    if (!/^[0-9x\s\\\*\.a-z+-\^\(\)]+$/.test(equation)) {
        terminal.printf`${{[Color.RED]: "Error"}}: Invalid equation!\n`
        terminal.printf`An valid equation could be: ${{[Color.COLOR_1]: "x^2"}}\n`
        return
    }
    let gridSize = {
        x: 60,
        y: 30
    }
    while (/[0-9]x/g.test(equation))
        equation = equation.replace(/([0-9])x/g, "$1*x")
    while (/[0-9a-z\.]+\s*\^\s*[0-9a-z\.]+/g.test(equation))
        equation = equation.replace(/([0-9a-z\.]+)\s*\^\s*([0-9a-z\.]+)/g, "$1**$2")
    let jsEnv = newMathEnv()
    let grid = Array.from(Array(gridSize.y)).map(() => Array(gridSize.x).fill(" "))
    let viewBound = {
        x: {min: args.xmin, max: args.xmax},
        y: {min: args.ymin, max: args.ymax}
    }
    if (viewBound.x.min >= viewBound.x.max || viewBound.y.min >= viewBound.y.max) {
        terminal.printf`${{[Color.RED]: "Error"}}: Invalid bounds!\n`
        return
    }
    function drawIntoGrid(x, y, v) {
        if (isNaN(x) || isNaN(y)) return
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
                let color = Color.WHITE
                switch(grid[y][x]) {
                    case ".":
                        color = Color.rgb(100, 100, 100)
                        break
                    case "/":
                    case "#":
                    case "\\":
                    case "]":
                    case "[":
                        color = Color.COLOR_1
                }
                terminal.print(grid[y][x], color)
            }
            terminal.printLine()
        }
    }
    for (let y = viewBound.y.min; y <= viewBound.y.max; y += (viewBound.y.max - viewBound.y.min) / (gridSize.y - 1)) {
        drawIntoGrid(0, y, "|")
    }
    for (let x = viewBound.x.min; x <= viewBound.x.max; x += (viewBound.x.max - viewBound.x.min) / (gridSize.x - 1)) {
        drawIntoGrid(x, 0, "~")
    }
    for (let x = ~~(viewBound.x.min); x < viewBound.x.max; x++) {
        let axisVal = (String(x).length > 1) ? String(x).slice(-1) : String(x)
        for (let y = viewBound.y.min; y <= viewBound.y.max; y += (viewBound.y.max - viewBound.y.min) / (gridSize.y - 1)) {
            if (x == 0) break
            drawIntoGrid(x, y, ".")
        }
        drawIntoGrid(x, 0, axisVal)
    }
    for (let y = ~~(viewBound.y.min); y < viewBound.y.max; y++) {
        let axisVal = (String(y).length > 1) ? String(y).slice(-1) : String(y)
        for (let x = viewBound.x.min; x <= viewBound.x.max; x += (viewBound.x.max - viewBound.x.min) / (gridSize.x - 1)) {
            if (y == 0) break
            drawIntoGrid(x, y, ".")
        }
        drawIntoGrid(0, y, axisVal)
    }
    drawIntoGrid(0, 0, "+")

    let f = new Function("x", "return " + equation)
    function slope(f, x, accuracy=0.01) {
        let minY = f(x - accuracy)
        let maxY = f(x + accuracy)
        let diff = maxY - minY
        return diff / (accuracy * 2)
    }
    const symbols = [
        ["]", 10],
        ["/", 1.5],
        ["#", -1.5],
        ["\\", -10],
        ["[", -Infinity],
    ]
    let yValues = []
    for (let x = viewBound.x.min; x <= viewBound.x.max; x += (viewBound.x.max - viewBound.x.min) / (gridSize.x - 1) / 5) {
        jsEnv.setValue("x", x)
        let [y, error] = jsEnv.eval(equation)
        if (error) {
            throw new Error(error)
        } else {
            let printSymbol = null
            let slopeVal = slope(f, x)
            for (let [symbol, minVal] of symbols) {
                if (slopeVal > minVal) {
                    printSymbol = symbol
                    break
                }
            }
            if (!isNaN(y))
                yValues.push(y)
            if (printSymbol != null)
                drawIntoGrid(x, y, printSymbol)
        }
    }
    await drawGrid()
    terminal.scroll()
    let playTime = args.playtime * 2
    function calcFrequency(y) {
        let maxFreq = 1000
        let minFreq = 200
        let yDiffBound = viewBound.y.max - viewBound.y.min
        let yDiffMin = y - viewBound.y.min
        let freqDiff = maxFreq - minFreq
        let freq = freqDiff * (yDiffMin / yDiffBound)
        return freq
    }
    let frequencies = []
    for (let y of yValues) {
        let frequency = calcFrequency(y)
        frequency = Math.max(50, frequency)
        frequency = Math.min(20000, frequency)
        frequencies.push(frequency)
    }
    let noteTime = playTime / frequencies.length
    for (let note of frequencies) {
        playFrequency(note, noteTime)
        await sleep(noteTime * 0.5)
    }
}, "plot a mathematical function within bounds")

const OG_BACKGROUND_COLOR = "rgb(3, 3, 6)"
terminal.addFunction("background", function(_, funcInfo) {
    let args = getArgs(funcInfo, ["color"])
    if (args.color.toLowerCase() == "reset") {
        terminal.background = OG_BACKGROUND_COLOR
        return
    }
    terminal.background = args.color
}, "change the background color of the terminal")

const OG_FOREGROUND_COLOR = "rgb(255, 255, 255)"
terminal.addFunction("foreground", function(_, funcInfo) {
    let args = getArgs(funcInfo, ["color"])
    if (args.color.toLowerCase() == "reset") {
        terminal.foreground = OG_FOREGROUND_COLOR
        return
    }
    terminal.foreground = args.color
}, "change the foreground color of the terminal")

terminal.addFunction("hi", async () => await funnyPrint("hello there!"), "say hello to the terminal")

terminal.addFunction("whatday", function(rawArgs, funcInfo) {
    function dayToStr(n) {
        return [
            "first", "second", "third", "fourth",
            "fifth", "sixth", "seventh", "eigth",
            "ninth", "tenth", "eleventh", "twelfth",
            "thirteenth", "fourteenth", "fifteenth",
            "sixteenth", "seventeenth", "eighteenth",
            "nineteenth", "twentyth", "twentyfirst",
            "twentysecond", "twentythird", "twentyfourth",
            "twentyfifth", "twentysixth", "twentyseventh",
            "twentyeighth", "twentyninth", "thirtieth",
            "thirtyfirst"
        ][n - 1]
    }

    function yearToStr(n) {
        if (n == 0) return "zero"
        let out = ""
        if (n < 0) {
            out += "minus "
            n *= -1
        }
        function twoDigitNumStr(n) {
            const n1s = [
                "", "one", "two", "three", "four", "five",
                "six", "seven", "eight", "nine", "ten",
                "eleven", "twelve", "thirteen", "fourteen",
                "fifteen"
            ], n2s = [
                "", "", "twenty", "thirty", "fourty",
                "fifty", "sixty", "seventy", "eighty",
                "ninety"
            ]
            if (n1s[n]) return n1s[n]
            let n1 = n % 10
            let n2 = parseInt((n - n1) / 10)
            let out = ""
            out += n2s[n2]
            out += n1s[n1]
            if (n2 == 1) {
                out += "teen"
            }
            return out
        }
        if (String(n).length == 1) {
            return out + twoDigitNumStr(n)
        }
        if (String(n).length == 2) {
            return out + twoDigitNumStr(n)
        }
        if (String(n).length == 3) {
            let n1 = String(n)[0]
            let n2 = String(n).slice(1, 3)
            return out + twoDigitNumStr(n1) + "hundred" + twoDigitNumStr(n2)
        }
        if (String(n).length == 4) {
            let n1 = String(n).slice(0, 2)
            let n2 = String(n).slice(2, 4)
            return out + twoDigitNumStr(n1) + "-" + twoDigitNumStr(n2)
        } 
    }

    const dayNames = [
        "Sunday", "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday"
    ], monthNames = [
        "January", "February", "March", "April", "May",
        "June", "July", "August", "September",
        "October", "November", "December"
    ]
    let dateStr = getSingleArg(rawArgs, funcInfo.funcName, "DD:MM:YYYY")

    function dateEq(d1, d2) {
        return (d1.getFullYear() == d2.getFullYear()
        && d1.getMonth() == d2.getMonth()
        && d1.getDate() == d2.getDate())
    }

    function sayDay(date) {
        let day = dayToStr(date.getDate())
        let month = monthNames[date.getMonth()].toLowerCase()
        let year = yearToStr(date.getFullYear())
        let dayName = dayNames[date.getDay()].toLowerCase()
        if (dateEq(new Date(), date)) {
            terminal.printLine(`today is a ${dayName}`)
        } else {
            if (new Date() > date) {
                terminal.printLine(`the ${day} of ${month} of the year ${year} was a ${dayName}`)
            } else {
                terminal.printLine(`the ${day} of ${month} of the year ${year} will be a ${dayName}`)
            }
        }
    }

    if (dateStr.toLowerCase() == "t" || dateStr.toLowerCase() == "today") {
        sayDay(new Date())
        return
    } else if (/^[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,4}$/.test(dateStr)) {
        let [d, m, y] = dateStr.split(".").map(i => parseInt(i))
        let date = new Date()
        date.setFullYear(y, m - 1, d)
        if (date.getDate() != d || (date.getMonth() + 1) != m || date.getFullYear() != y) {
            throw new Error("Invalid day - doesn't exist.")
        }
        sayDay(date)
    } else {
        terminal.printLine("Date-Format: DD:MM:YYYY, e.g. 01.01.1970")
        throw new Error(`Invalid date: ${dateStr}`)
    }
    
}, "get the weekday of a given date")

terminal.addFunction("cal", async function(rawArgs) {
    const today = new Date()

    const monthNames = [
        "January", "February", "March", "April", "May",
        "June", "July", "August", "September",
        "October", "November", "December"
    ]

    function printMonth(monthIndex, year) {
        let tableData = Array.from(Array(6)).map(() => Array(7).fill("  "))
        let tableHeader = "Su Mo Tu We Th Fr Sa"
        let date = new Date()
        date.setFullYear(year, monthIndex, 1)
        let month = monthNames[date.getMonth()]
        let dayOfMonth = (new Date()).getDate()

        function printTable() {
            let headerText = `${month} ${stringPad(year, 4, "0")}`
            let paddingWidth = Math.floor((tableHeader.length - headerText.length) / 2)
            for (let i = 0; i < paddingWidth; i++) {
                headerText = " " + headerText
            }
            terminal.printf`${{[Color.COLOR_1]: headerText}}\n`
            terminal.printLine(tableHeader)
            for (let y = 0; y < 6; y++) {
                for (let x = 0; x < 7; x++) {
                    if (dayOfMonth == parseInt(tableData[y][x]) &&
                        today.getMonth() == monthIndex &&
                        today.getFullYear() == year) {
                        terminal.printf`${{[Color.COLOR_1]: tableData[y][x]}} `
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
    }

    let chosenYear = null
    let chosenMonth = null

    let arguments = rawArgs.trim().split(" ").map(a => a.trim()).filter(a => a.length > 0)

    argument_loop:
    for (let argument of arguments) {
        for (let month of monthNames) {
            if (month.toLowerCase().startsWith(argument.toLowerCase())) {
                chosenMonth = monthNames.indexOf(month)
                continue argument_loop
            }
        }
        if (/^[0-9]{1,4}$/.test(argument)) {
            chosenYear = parseInt(argument)
        } else if (/^[0-9]{1,2}\.[0-9]{1,4}$/.test(argument)) {
            let [month, year] = argument.split(".")
            chosenMonth = parseInt(month) - 1
            chosenYear = parseInt(year)
        } else if (/^[0-9]{1,4}\.[0-9]{1,2}$/.test(argument)) {
            let [year, month] = argument.split(".")
            chosenMonth = parseInt(month) - 1
            chosenYear = parseInt(year)
        } else {
            throw new Error(`Invalid Month/Year "${argument}"`)
        }
    }

    if (chosenYear < 0) throw new Error("Cannot look past the year 0 - sorry")
    if (chosenYear > 9999) throw new Error("Cannot look past the year 9999 - sorry")
    if (chosenMonth > 11 || chosenMonth < 0)
        throw new Error("That month doesn't exist in this world.")

    if (chosenYear == null && chosenMonth == null) {
        chosenYear = today.getFullYear()
        chosenMonth = today.getMonth()
    }

    if (chosenMonth != null && chosenYear == null) {
        chosenYear = today.getFullYear()
    }

    if (chosenMonth == null) {
        for (let month = 0; month < 12; month++) {
            printMonth(month, chosenYear)
            if (month < 12 - 1) {
                terminal.printLine()
            }
        }
    } else {
        printMonth(chosenMonth, chosenYear)
    }

}, "display the calendar of the current month")

terminal.addFunction("bc", async function() {
    while (true) {
        let text = await terminal.prompt()
        let [result, error] = evalJsEnv.eval(text)
        if (error) {
            terminal.printf`${{[Color.rgb(38, 255, 38)]: ">"}} ${{[Color.WHITE]: error}}\n`
        } else if (result !== null) {
            terminal.printf`${{[Color.rgb(38, 255, 38)]: ">"}} ${{[Color.WHITE]: String(result)}}\n`
        }
    }
}, "compute the value of a mathematical expression")

terminal.addFunction("pwd", function() {
    terminal.printLine("/" + terminal.pathAsStr)
}, "display the current working directory")

terminal.addFunction("uname", function() {
    terminal.printLine("Website")
}, "display the name of the operating system")

terminal.addFunction("factor", async function() {
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

    while (true) {
        let text = await terminal.prompt()
        for (let word of text.trim().split(" ").map(w => w.trim()).filter(w => w.length > 0)) {
            if (word.length == 0 || isNaN(word)) {
                terminal.printf`${{[Color.WHITE]: word}}: Invalid number!\n`
            } else {
                let num = parseArgs(word)
                let factors = primeFactors(num).join(" ")
                terminal.printf`${{[Color.WHITE]: num}}: ${{[Color.COLOR_1]: factors}}\n`
            }
        }
    }
}, "calculate the prime factors of given numbers")

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
        terminal.printf`'${{[Color.COLOR_2]: "$"}} get ${{[Color.COLOR_1]: "<key>"}}'\n`
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
        terminal.printf`'${{[Color.COLOR_2]: "$"}} set ${{[Color.COLOR_1]: "<key> <value>"}}'\n`
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
            terminal.printf`groups: '${{[Color.COLOR_1]: user}}': no such user\n`
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
    terminal.printf`Use ${{[Color.COLOR_1]: "ls"}} to view available files\n`
}, "display the first lines of a file")

terminal.addFunction("whatis", function(rawArgs, funcInfo) {
    let funcName = getSingleArg(rawArgs, funcInfo.funcName, "function-name")
    if (funcName == undefined) return
    if (funcName.trim() == "*") {
        let maxFuncLength = terminal.functions.reduce((p, c) => Math.max(p, c.name.length), 0)
        let functions = [...terminal.functions].sort((a, b) => a.name.localeCompare(b.name))
        for (let func of functions) {
            let funcStr = stringPadBack(func.name, maxFuncLength)
            terminal.printCommand(funcStr, func.name, Color.WHITE, false)
            terminal.printLine(`  ${func.description}`)
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
    terminal.printf`${{[Color.COLOR_1]: "root"}}   ${{[Color.LIGHT_GREEN]: ((Date.now() - START_TIME) / 1000) + "s"}}\n`
}, "show the active users and their time elapsed")

terminal.addFunction("history", function() {
    for (let i = Math.max(0, terminal.prevCommands.length - 1000); i < terminal.prevCommands.length; i++) {
        terminal.printf`${{[Color.COLOR_1]: stringPad(String(i + 1), 5)}}: ${{[Color.WHITE]: terminal.prevCommands[i]}}\n`
    }
}, "show the last 1000 commands")

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

terminal.addFunction("kill", function(rawArgs) {
    if (rawArgs.trim().includes("turtlo")) {
        if (killTurtlo()) {
            terminal.printLine("done.")
        } else {
            terminal.printLine("i see no turtlo alive here")
        }
    } else {
        terminal.printLine("sorry no killing allowed here (except turtlo)")
    }
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
    terminal.printf`Why not use ${{[Color.COLOR_1]: "ls"}}?\n`
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
}, "sleep for a number of seconds")

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

terminal.addFunction("download", function(_, funcInfo) {
    function downloadFile(fileName, file) {
        let element = document.createElement('a')
        if (file.type == FileType.DATA_URL)
            var dataURL = file.content
        else
            var dataURL = 'data:text/plain;charset=utf-8,' + encodeURIComponent(file.content)
        element.setAttribute('href', dataURL)
        element.setAttribute('download', fileName)
        element.style.display = 'none'
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }

    let args = getArgs(funcInfo, ["file"])
    let file = terminal.getFile(args.file)
    if (file.type == FileType.FOLDER)
        throw new Error("cannot download directory")
    downloadFile(file.name, file)
}, "download a local file")

function fetchWithParam(url, params) {
    let query = Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join("&")
    return fetch(`${url}?${query}`)
}

class TodoApi {

    static GET_LIST_API = "https://www.noel-friedrich.de/todo/api/get-list.php"
    static ADD_ITEM_API = "https://www.noel-friedrich.de/todo/api/add-item.php"
    static EDIT_ITEM_API = "https://www.noel-friedrich.de/todo/api/edit-item.php"
    static DELETE_ITEM_API = "https://www.noel-friedrich.de/todo/api/delete-item.php"
    static CHECK_ITEM_API = "https://www.noel-friedrich.de/todo/api/check-item.php"

    static async getList(owner_name) {
        let response = await fetchWithParam(TodoApi.GET_LIST_API, {
            owner_name: owner_name
        })
        return await response.json()
    }
    
    static async addItem(owner_name, text_content, due_time="-") {
        return await fetchWithParam(TodoApi.ADD_ITEM_API, {
            owner_name: owner_name,
            text_content: text_content,
            due_time: due_time
        })
    }

    static async editItem(id, text_content) {
        return await fetchWithParam(TodoApi.EDIT_ITEM_API, {
            id: id,
            text_content: text_content
        })
    }

    static async deleteItem(id) {
        return await fetchWithParam(TodoApi.DELETE_ITEM_API, {id: id})
    }

    static async checkItem(item_id, checked) {
        return await fetchWithParam(TodoApi.CHECK_ITEM_API, {
            item_id: item_id,
            check_val: checked ? 1 : 0
        })
    }

}

terminal.addFunction("todo", async function(rawArgs) {
    let parsedArgs = parseArgs(rawArgs, false)

    const commands = {
        "list": async function(name) {
            let data = await TodoApi.getList(name)
            let formattedData = []
            for (let rawItem of data) {
                let check = (rawItem.done == 1) ? "[x]" : "[ ]"
                let due = rawItem.due_time == "-" ? "" : ` (${rawItem.due_time})`
                let item = `${rawItem.text_content}${due}`
                let id = `#${rawItem.id}`
                formattedData.push({
                    check: check, item: item, id: id
                })
            }
            if (formattedData.length == 0) {
                terminal.printLine(`No items found`)
            }
            let maxItemLength = formattedData.reduce((max, item) => Math.max(max, item.item.length), 0)
            for (let item of formattedData) {
                terminal.printf`${{[Color.COLOR_1]: item.check}} ${{[Color.WHITE]: stringPadBack(item.item, maxItemLength + 1)}} ${{[Color.WHITE]: item.id}}\n`
            }
        },
        "check": async function(id) {
            await TodoApi.checkItem(id, true)
        },
        "uncheck": async function(id) {
            await TodoApi.checkItem(id, false)
        },
        "add": async function(name, text, due_date="-") {
            await TodoApi.addItem(name, text, due_date)
        },
        "edit": async function(id, text) {
            await TodoApi.editItem(id, text)
        },
        "delete": async function(id) {
            await TodoApi.deleteItem(id)
        }
    }

    const command_args = {
        "list": ["name"],
        "check": ["id"],
        "uncheck": ["id"],
        "add": ["name", "text", "due_date"],
        "edit": ["id", "text"],
        "delete": ["id"]
    }

    function showAvailableCommand(command) {
        terminal.printf`> '${{[Color.COLOR_2]: "$"}} todo ${{[Color.WHITE]: command}} ${{[Color.COLOR_1]: command_args[command].map(a => `<${a}>`).join(" ")}}'\n`
    }

    function showAvailableCommands() {
        terminal.printf`'${{[Color.COLOR_2]: "$"}} todo ${{[Color.COLOR_1]: "<command> [args...]"}}':\n`
        for (let [command, _] of Object.entries(command_args)) {
            showAvailableCommand(command)
        }
    }

    if (parsedArgs.length == 0 || (parsedArgs.length == 1 && parsedArgs[0] == "help")) {
        terminal.printLine(`You must supply at least 1 argument:`)
        showAvailableCommands()
        return
    }

    let command = parsedArgs[0]
    let args = parsedArgs.slice(1)

    console.log(command, args)

    if (!(command in commands)) {
        terminal.printLine(`Unknown command! Available commands:`)
        showAvailableCommands()
        return
    }

    if (args.length != command_args[command].length) {
        terminal.printLine(`Invalid number of arguments!`)
        showAvailableCommand(command)
        return
    }

    await commands[command](...args)
}, "manage todo lists")

let audioContext = null

terminal.addFunction("morse", async function(rawArgs) {
    function mostPopularChar(string) {
        string = string.toLowerCase().trim()
        let occurences = {}
        for (let char of string) {
            if (!"abcdefghijklmnopqrstuvwxyz.-".includes(char))
                continue
            if (char in occurences) {
                occurences[char]++
            } else {
                occurences[char] = 1
            }
        }
        let mostPopularC = null
        let mostOccurences = 0
        for (let [char, count] of Object.entries(occurences)) {
            if (count > mostOccurences) {
                mostOccurences = count
                mostPopularC = char
            }
        }
        return mostPopularC
    }
    
    MORSE = {
        A: ".-", B: "-...", C: "-.-.",
        D: "-..", E: ".", F: "..-.",
        G: "--.", H: "....", I: "..",
        J: ".---", K: "-.-", L: ".-..",
        M: "--", N: "-.", O: "---",
        P: ".--.", Q: "--.-", R: ".-.",
        S: "...", T: "-", U: "..-",
        V: "...-", W: ".--", X: "-..-",
        Y: "-.--", Z: "--..",
        "0": "----", "1": ".----",
        "2": "..---", "3": "...--",
        "4": "....-", "5": ".....",
        "6": "-....", "7": "--...",
        "8": "---..", "9": "----.",
        ".": ".-.-.-", ",": "--..--",
        "?": "..--..", "'": ".----.",
        "!": "-.-.--", "/": "-..-.",
        "(": "-.--.", ")": "-.--.-",
        "&": ".-...", ":": "---...",
        ";": "-.-.-.", "=": "-...-",
        "+": ".-.-.", "-": "-....-",
        "_": "..--.-", '"': ".-..-.",
        "$": "...-..-", "@": ".--.-."
    }
    let text = rawArgs.trim().toUpperCase()
    const noinput = () => terminal.printf`${{[Color.RED]: "Error"}}: No input-text given!\n`
    try {
        playFrequency(0, 0)
    } catch {}
    let audioSpeed = 0.4
    if (text.length > 30) audioSpeed = 0.1
    if ([".", "-"].includes(mostPopularChar(text))) {
        text += " "
        let tempLine = "" 
        let tempChar = ""
        for (let char of text) {
            tempChar += char
            if (char == " ") {
                for (let [morseChar, morseCode] of Object.entries(MORSE)) {
                    if (tempChar.trim() == morseCode) {
                        tempLine += morseChar
                        tempChar = ""
                    }
                }
                tempLine += tempChar
                tempChar = ""
            }
            if (tempLine.length > 40) {
                terminal.printLine(tempLine)
                tempLine = ""
            }
        }
        if (tempLine) terminal.printLine(tempLine)
        if (!text) noinput()
    } else {
        for (let char of text) {
            if (char in MORSE) {
                let morseCode = `${MORSE[char]}`
                for (let morseChar of morseCode) {
                    terminal.print(morseChar)
                    if (audioContext) {
                        if (morseChar == ".") {
                            playFrequency(400, 300 * audioSpeed)
                            await sleep(600 * audioSpeed)
                        } else if (morseChar == "-") {
                            playFrequency(500, 600 * audioSpeed)
                            await sleep(900 * audioSpeed)
                        }
                    }
                }
                if (audioContext) {
                    await sleep(800 * audioSpeed)
                }
                terminal.print(" ")
            } else if (char == " ") {
                if (audioContext) {
                    await sleep(1000 * audioSpeed)
                }
                terminal.printLine()
            } else {
                terminal.print(char)
            }
        }
        terminal.printLine()
        if (!text) noinput()
    }
}, "translate latin to morse or morse to latin")

terminal.addFunction("fizzbuzz", function(rawArgs) {
    let maxNum = 50
    if (rawArgs.trim().length > 0) {
        if (!isNaN(rawArgs.trim())) {
            maxNum = parseInt(rawArgs)
        } else {
            terminal.printf`${{[Color.RED]: "Error"}}: Invalid Max!\n`
            return
        }
    }
    if (maxNum < 3 || maxNum > 1000) {
        terminal.printf`${{[Color.RED]: "Error"}}: Invalid Max!\n`
        return
    }
    for (let i = 1; i <= maxNum; i++) {
        let outs = ""
        if (i % 3 == 0) outs += "fizz"
        if (i % 5 == 0) outs += "buzz"
        if (outs == "") outs += i
        terminal.printLine(outs)
    }
}, "do the fizzbuzz")

terminal.addFunction("ceasar", function(rawArgs, funcInfo) {
    let args = parseArgs(rawArgs, false)
    if (args.length != 2) {
        terminal.printLine(`You must supply 2 arguments:`)
        terminal.printf`'${{[Color.COLOR_2]: "$"}} ceasar ${{[Color.COLOR_1]: "<text> <shift-num>"}}'\n`
        return
    }
    let [text, maybeShiftVal] = args
    let shiftVal = 1
    if (!isNaN(maybeShiftVal.trim())) {
        shiftVal = parseInt(maybeShiftVal.trim())
    }
    let alphabet = "abcdefghijklmnopqrstuvwxyz"
    function betterMod(n, m) {
        while (n < 0) n += m
        return n % m
    }
    for (let char of text.toLowerCase()) {
        let index = alphabet.indexOf(char)
        if (index == -1) {
            terminal.print(char)
            continue
        }
        let newChar = alphabet[betterMod((index + shiftVal), alphabet.length)]
        terminal.print(newChar)
    }
    terminal.printLine()
}, "encrypt a text using the ceasar cipher")

terminal.addFunction("clock", async function(rawArgs) {
    let namedArgs = extractNamedArgs(rawArgs)
    let displayMillis = !!namedArgs.millis
    let gridSize = {
        x: 36,
        y: 20
    }
    let grid = Array.from(Array(gridSize.y)).map(() => Array(gridSize.x).fill(" "))
    let containerDiv = null
    function printGrid() {
        const customColors = {
            "x": Color.COLOR_1,
            "#": Color.WHITE,
            "w": Color.ORANGE,
            ".": Color.rgb(50, 50, 50),
            "o": Color.LIGHT_GREEN,
            "s": Color.hex("a4a4c7")
        }
        let prevContainerDiv = containerDiv
        let tempNode = terminal.parentNode
        terminal.parentNode = document.createElement("div")
        containerDiv = terminal.parentNode
        tempNode.appendChild(containerDiv)
        terminal.printLine()
        for (let row of grid) {
            for (let item of row) {
                if (Object.keys(customColors).includes(item)) {
                    terminal.print(item, customColors[item])
                } else {
                    terminal.print(item)
                }
            }
            terminal.printLine()
        }
        if (prevContainerDiv) prevContainerDiv.remove()
        terminal.parentNode = tempNode
    }
    function drawIntoGrid(x, y, v) {
        let gridX = Math.round((x - -1) / (1 - -1) * (gridSize.x - 1))
        let gridY = Math.round((y - -1) / (1 - -1) * (gridSize.y - 1))
        if (gridX < 0 || gridX >= gridSize.x || gridY < 0 || gridY >= gridSize.y) {
            return
        }
        grid[gridSize.y - 1 - gridY][gridX] = v
    }
    function drawCircle(val, radius=1) {
        for (let t = 0; t < Math.PI * 2; t += 0.01) {
            let x = Math.sin(t) * radius
            let y = Math.cos(t) * radius
            drawIntoGrid(x, y, val)
        }
    }
    function drawLine(angle, val, maxVal=1) {
        for (let t = 0; t < maxVal; t += 0.01) {
            let x = Math.sin(angle * Math.PI * 2) * t
            let y = Math.cos(angle * Math.PI * 2) * t
            drawIntoGrid(x, y, val)
        }
    }
    function update() {
        let date = new Date()
        let mins = date.getHours() * 60 + date.getMinutes()
        for (let r = 0; r < 1; r += 0.05) {
            drawCircle(".", r)
        }
        drawCircle("#")
        if (displayMillis)
            drawLine(date.getMilliseconds() / 1000, "s", 0.9)
        drawLine((mins % 720) / 720, "w", 0.75)
        drawLine(date.getMinutes() / 60, "x", 0.9)
        drawLine(date.getSeconds() / 60, "o", 0.9)
        printGrid()
        terminal.scroll("auto")
    }
    while (true) {
        update()
        await sleep(displayMillis ? 40 : 1000)
    }
}, "display the current time")

terminal.addFunction("timer", async function(rawArgs, funcInfo) {
    let words = rawArgs.split(" ").filter(w => w.length > 0)
    let ms = 0
    for (let word of words) {
        if (/^[0-9]+s$/.test(word)) {
            ms += parseInt(word.slice(0, -1)) * 1000
        } else if (/^[0-9]+m$/.test(word)) {
            ms += parseInt(word.slice(0, -1)) * 60 * 1000
        } else if (/^[0-9]+h$/.test(word)) {
            ms += parseInt(word.slice(0, -1)) * 60 * 60 * 1000
        } else {
            throw new Error(`Invalid time '${word}'`)
        }
    }

    if (ms == 0) {
        terminal.printLine("An example time could be: '1h 30m 20s'")
        throw new Error("Invalid time!")
    }

    let notes = [[800, 1], [800, 1], [800, 1], [800, 1]]
    let beep = [[400, 8]]

    try {
        var melodiesFolder = getFolder(["noel", "melodies"])[0].content
    } catch {
        throw new Error("Melodys Folder not found!")
    }
    let melodyNotes = []
    let i = 0
    for (let [fileName, file] of Object.entries(melodiesFolder)) {
        let melodyName = fileName.split(".", 1)[0]
        try {
            melodyNotes.push(JSON.parse(file.content))
            i++
            terminal.printf`${{[Color.COLOR_1]: i}}: ${{[Color.WHITE]: melodyName}}\n`
        } catch {}
    }

    if (melodyNotes.length > 0) {
        let promptMsg = `Which melody do you want to use [1-${melodyNotes.length}]? `
        let tuneSelection = await terminal.promptNum(promptMsg, {min: 1, max: melodyNotes.length})
        notes = melodyNotes[tuneSelection - 1]
    }

    let startTime = Date.now()

    function printStatus(width=50) {
        terminal.printLine()
        let status = Math.min((Date.now() - startTime) / ms, 1)
        let progressbar = stringMul("#", Math.ceil(status * (width - 4)))
        terminal.printLine("+" + stringMul("-", width - 2) + "+")
        terminal.printLine(`| ${stringPadBack(progressbar, width - 4)} |`)
        terminal.printLine("+" + stringMul("-", width - 2) + "+")
        let secondsDiff = (ms / 1000) - Math.floor((Date.now() - startTime) / 1000)
        if (secondsDiff < 0) secondsDiff = 0
        let seconds = Math.ceil(secondsDiff % 60)
        let minutes = 0
        while (secondsDiff >= 60) {
            minutes += 1
            secondsDiff -= 60
        }
        let timeStr = (minutes ? `${minutes}m ` : "") + `${seconds}s left`
        if (status != 1)
            terminal.printLine(`${Math.round(status * 100)}% - ${timeStr}`)
        else
            terminal.printf`${{[Color.LIGHT_GREEN]: "-- timer finished --"}}\n`
    }

    async function alarm() {
        await playMelody(notes)
    }

    let prevTextDiv = null
    while (Date.now() - startTime < ms) {
        textDiv = document.createElement("div")
        terminal.parentNode.appendChild(textDiv)
        terminal.setTextDiv(textDiv)
        printStatus()
        terminal.resetTextDiv()
        if (prevTextDiv) prevTextDiv.remove()
        prevTextDiv = textDiv
        terminal.scroll()
        if (Date.now() - startTime - ms > -3500) {
            await playMelody(beep)
        }
        await sleep(1000)
    }
    if (prevTextDiv) prevTextDiv.remove()
    printStatus()
    try {
        playFrequency(0, 0)
    } catch {}
    if (audioContext) {
        await alarm()
    }
}, "start a timer")

terminal.addFunction("bmi", async function() {
    let mass = await terminal.promptNum("mass in kg: ", {min: 0, max: 1000})
    let height = await terminal.promptNum("height in meters (e.g. 1.8): ", {min: 0, max: 1000})
    let bmi = (mass) / (height ** 2)
    terminal.print("Your BMI is...  ")
    await sleep(2000)
    terminal.printLine(bmi)

    let evaluations = [
        [16.0, "a lot less than usual"],
        [16.9, "a bit less than usual"],
        [18.4, "a tiny bit less than usual"],
        [24.9, "everything is in butter"],
        [29.9, "a little more than usual"],
        [34.9, "you're obese. (class 1)"],
        [39.9, "you're obese. (class 2)"],
        [Infinity, "you're obese. (class 3)"]
    ]
    let evaluation = null
    for (let [minVal, tempEval] of evaluations) {
        if (bmi < minVal) {
            evaluation = tempEval
            break
        }
    }
    if (evaluation == 0) {
        evaluation = "superhuman!"
    }
    terminal.printLine(`Your diagnosis: ${evaluation}`)
    terminal.printLine("source: en.wikipedia.org/wiki/Body_mass_index")
}, "calculate a body-mass-index")

terminal.addFunction("mandelbrot", async function(rawArgs) {
    let gridSize = {x: 60, y: 21}
    gridSize.x = ~~(terminal.approxWidthInChars - 10)
    
    let namedArgs = extractNamedArgs(rawArgs)
    if (namedArgs.w && !isNaN(namedArgs.w) && namedArgs.w.length != 0) {
        gridSize.x = parseInt(namedArgs.w)
    }
    
    gridSize.y = ~~(gridSize.x * 1 / 3)
    if (gridSize.y % 2 == 1) gridSize.y++

    if (namedArgs.h && !isNaN(namedArgs.h) && namedArgs.h.length != 0) {
        gridSize.y = parseInt(namedArgs.h)
    }

    let plotSize = {xmin: -1.85, xmax: 0.47, ymin: -0.95, ymax: 0.95}
    let grid = Array.from(Array(gridSize.y)).map(() => Array(gridSize.x).fill(" "))

    let maxIteration = 1000

    function getPixelCoords(px, py) {
        let xDiff = plotSize.xmax - plotSize.xmin
        let x = plotSize.xmin + (px / gridSize.x) * xDiff
        let yDiff = plotSize.ymax - plotSize.ymin
        let y = plotSize.ymin + (py / gridSize.y) * yDiff
        return [x, y]
    }

    function calcPixel(px, py) {
        let [x0, y0] = getPixelCoords(px, py)
        let [x, y] = [0.0, 0.0]
        let i = 0
        for (; i < maxIteration; i++) {
            let temp = x**2 - y**2 + x0
            y = 2*x*y + y0
            x = temp
            if ((x**2 + y**2) >= 4)
                break
        }
        if (i == maxIteration)
            return "#"
        return "."
    }

    async function drawGrid() {
        for (let y = 0; y < gridSize.y; y++) {
            for (let x = 0; x < gridSize.x; x++) {
                terminal.print(grid[y][x])
            }
            terminal.printLine()
        }
    }

    for (let y = 0; y < gridSize.y; y++) {
        for (let x = 0; x < gridSize.x; x++) {
            grid[y][x] = calcPixel(x, y)
        }
    }
    drawGrid()
}, "draw the mandelbrot set")

terminal.addFunction("hidebtns", function() {
    document.documentElement.style.setProperty("--terminal-btn-display", "none")
}, "hide the terminal buttons")

terminal.addFunction("unhidebtns", function() {
    document.documentElement.style.setProperty("--terminal-btn-display", "block")
}, "unhide the terminal buttons")

function fileTooLargeWarning() {
    terminal.print("Warning", Color.RED)
    terminal.printLine(": File is too large to be saved locally.")
    terminal.printLine("         Thus, it will disappear when reloading.")
}

terminal.addFunction("upload", async function() {
    try {
        var [fileName, fileContent, isDataURL] = await fileFromUpload()
    } catch {
        throw new Error("File Upload Failed")
    }
    let fileType = FileType.READABLE
    if (fileName.endsWith(".melody")) {
        fileType = FileType.MELODY
    } else if (isDataURL) {
        fileType = FileType.DATA_URL
    }
    if (fileExists(fileName)) {
        throw new Error("file already exists in folder")
    }
    terminal.currFolder.content[fileName] = new FileElement(fileType, fileContent, {})
    terminal.printLine("upload finished.")
    if (fileContent.length > MAX_FILE_SIZE) {
        fileTooLargeWarning()
    }
}, "upload a file")

terminal.addFunction("letters", function(rawArgs) {
    let text = rawArgs.trim().toLowerCase()

    if (!text)
        throw new Error("No text given")

    for (let char of text) {
        if (!(char in AsciiArtLetters)) {
            throw new Error("Unsupported character used ('" + char + "')")
        }
    }

    function pasteHorizontal(a, b, l1, l2) {
        let lines = {a: a.split("\n").slice(0, -1), b: b.split("\n").slice(0, -1)}
        let width = {a: () => lines.a[0].length, b: () => lines.b[0].length}
        let height = {a: () => lines.a.length, b: () => lines.b.length}
        
        while (height.a() > height.b()) {
            lines.b.unshift(stringMul(" ", width.b()))
        }
        while (height.b() > height.a()) {
            lines.a.unshift(stringMul(" ", width.a()))
        }

        function eq(a, b) {
            if (a == b) return true
            if (a == " " || b == " ") return true
            if (a == "(" && b == "|") return true
            if (a == ")" && b == "|") return true
            if (b == "(" && a == "|") return true
            if (b == ")" && a == "|") return true
            return false
        }

        for (let i = 0; i < 2; i++) {
            let compressBoth = true
            for (let i = 0; i < height.a(); i++) {
                let [x, y] = [lines.a[i].slice(-1), lines.b[i][0]]
                if (!(eq(x, y))) {
                    compressBoth = false
                    break
                }
            }

            if (!compressBoth)
                break

            for (let i = 0; i < height.a(); i++) {
                let [x, y] = [lines.a[i].slice(-1), lines.b[i][0]]
                if (x == " ") {
                    lines.a[i] = lines.a[i].slice(0, -1) + lines.b[i][0]
                }
                lines.b[i] = lines.b[i].slice(1)
            }
        }

        let combined = ""
        for (let i = 0; i < height.a(); i++)
            combined += lines.a[i] + lines.b[i] + "\n"
        return combined
    }

    let output = AsciiArtLetters[text[0]]
    for (let i = 1; i < text.length; i++) {
        output = pasteHorizontal(output, AsciiArtLetters[text[i]], text[i - 1], text[i])
    }
    terminal.printLine(output)
}, "draw the input in cool letters")

terminal.addFunction("du", function(_, funcInfo) {
    let args = getArgs(funcInfo, ["?folder"], {folder: null})
    let fileNames = []
    let fileSizes = []
    let totalSize = 0
    function getSizeStr(size) {
        if (size < 10 ** 3) return `${size}B`
        if (size < 10 ** 6) return `${Math.ceil(size / 1000)}KB`
        return `${Math.ceil(size / 1000000)}MB`
    }
    let targetFolder = terminal.currFolder
    if (args.folder) {
        targetFolder = terminal.getFile(args.folder)
    }
    for (let [fileName, file] of Object.entries(targetFolder.content)) {
        let fileContent = JSON.stringify(file.export())
        totalSize += fileContent.length
        let fileSize = getSizeStr(fileContent.length)
        if (file.type == FileType.FOLDER)
            fileName += "/"
        fileNames.push(fileName)
        fileSizes.push(fileSize)
    }
    fileNames.unshift("TOTAL")
    fileSizes.unshift(getSizeStr(totalSize))
    let longestSizeLength = fileSizes.reduce((a, e) => Math.max(a, e.length), 0) + 2
    let paddedFileSizes = fileSizes.map(s => stringPadBack(s, longestSizeLength))
    for (let i = 0; i < fileNames.length; i++) {
        if (i == 0) {
            terminal.print(paddedFileSizes[i] + fileNames[i] + "\n", Color.COLOR_1)
        } else {
            terminal.printLine(paddedFileSizes[i] + fileNames[i])
        }
    }
    if (fileNames.length == 0) {
        throw new Error("target-directory is empty")
    }
}, "display disk usage of current directory")

terminal.addFunction("href", function(_, funcInfo) {
    let args = getArgs(funcInfo, ["url"])
    if (!args.url.startsWith("http")) args.url = "https://" + args.url
    window.open(args.url, "_blank").focus()
}, "open a link in another tab")

terminal.addFunction("pv", async function(rawArgs) {
    await terminal.animatePrint(rawArgs)
}, "print text with a cool animation")

terminal.addFunction("cw", function(rawArgs, funcInfo) {
    let args = getArgs(funcInfo, ["?date"], {date: null})
    if (args.date == "today" || !args.date) {
        args.date = "today"
        const today = new Date()
        var day = today.getDate()
        var month = today.getMonth() + 1
        var year = today.getFullYear()
    } else if (!/^[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,4}$/.test(args.date)) {
        throw new Error("Invalid date!")
    } else {
        var [day, month, year] = args.date.split(".").map(d => parseInt(d))
    }

    function getCalendarWeek(day, month, year, yearPlus=0) {
        let firstDay = new Date()
        firstDay.setFullYear(year, 0, 4)
        while (firstDay.getDay() != 1) {
            firstDay.setDate(firstDay.getDate() - 1)
        }
        let currDate = firstDay
        let count = 1
        while (currDate.getDate() != day
        || currDate.getMonth() != (month - 1)
        || currDate.getFullYear() != (year + yearPlus)
        ) {
            currDate.setDate(currDate.getDate() + 1)
            count++
            if (count > 400) {
                return 0
            }
        }
        return Math.ceil(count / 7)
    }

    let calendarWeek = getCalendarWeek(day, month, year)
    let iterationCount = 0

    while (calendarWeek == 0) {
        iterationCount += 1
        calendarWeek = getCalendarWeek(
            day, month, year - iterationCount, iterationCount
        )
        if (iterationCount > 3)
            throw new Error("Invalid day!")
    }

    terminal.printLine(`calenderweek of ${args.date}: ${calendarWeek}`)

}, "get the calendar week for a given date")

terminal.addFunction("donut", async function() {
    // mostly copied from original donut.c code

               let p=terminal.
           print(),A=1,B=1,f=()=>{
         let b=[];let z=[];A+=0.07;B
       +=0.03;let s=Math.sin,c=Math.cos
     ,cA=c(A),sA=s(A),cB=c(B),sB=s(B);for(
    let k=0;k<1760;k++){b[k]=k%80==79?"\n":
    " ";z[k]=0;};for        (let j=0;j<6.28;
    j+=0.07){let ct          =c(j),st=s(j);
    for(i=0;i<6.28;          i+=0.02){let sp
    =s(i),cp=c(i),h          =ct+2,D=1/(sp*h
    *sA+st*cA+5),t=sp       *h*cA-st*sA;let
    x=0|(40+30*D*(cp*h*cB-t*sB)),y=0|(12+15
     *D*(cp*h*sB+t*cB)),o=x+80*y,N=0|(8*((st
     *sA-sp*ct*cA)*cB-sp*ct*sA-st*cA-cp*ct
     *sB));if(y<22&&y>=0&&x>=0&&x<79&&D>z
       [o]){z[o]=D;b[o]=".,-~:;=!*#$@"[
          N>0?N:0];}}}p.innerHTML=b
            .join("")};while(1){f();
              await sleep(30);}

}, "do the spinny donut.c")

terminal.addCommand("grep", async function(args) {
    let recursive = args.r ?? false
    let ignorecase = args.i ?? false
    let invert = args.v ?? false
    let linematch = args.x ?? false

    if (ignorecase)
        args.pattern = args.pattern.toLowerCase()

    let matches = []

    function processFile(file, filename, allowRecursionOnce=false) {
        if (file.type == FileType.FOLDER) {
            if (recursive || allowRecursionOnce) {
                for (let [newName, newFile] of Object.entries(file.content)) {
                    if (!recursive && newFile.type == FileType.FOLDER) continue
                    processFile(newFile, newName)
                }
            } else {
                throw new Error(`File ${filename} is a directory!`)
            }
        } else {
            for (let line of file.content.split("\n")) {
                if (linematch) {
                    let tempLine = line
                    if (ignorecase)
                        tempLine = line.toLowerCase()
                    var matching = tempLine === args.pattern
                } else if (ignorecase) {
                    var matching = line.toLowerCase().includes(args.pattern)
                } else {
                    var matching = line.includes(args.pattern)
                }
                if (matching ^ invert) {
                    if (ignorecase) {
                        var offset = line.toLowerCase().indexOf(args.pattern)
                    } else {
                        var offset = line.indexOf(args.pattern)
                    }
                    matches.push({
                        filename: filename,
                        line: line,
                        offset: offset
                    })
                }
            }
        }
    }

    if (args.file == "*") {
        processFile(terminal.currFolder, ".", true)
    } else {
        for (let filename of args.file.split(" ")) {
            let file = terminal.getFile(filename)
            processFile(file, filename)
        }
    }

    for (let match of matches) {
        terminal.print(match.filename, Color.COLOR_1)
        terminal.print(" : ")
        if (match.offset == -1) {
            terminal.print(match.line)
        } else {
            let prevLine = match.line.substring(0, match.offset)
            let matchLine = match.line.substring(match.offset, match.offset + args.pattern.length)
            let nextLine = match.line.substring(match.offset + args.pattern.length)
            terminal.print(prevLine)
            terminal.print(matchLine, Color.COLOR_2)
            terminal.print(nextLine)
        }
        terminal.addLineBreak()
    }

    if (matches.length == 0) {
        terminal.printLine("no matches")
    }

}, {
    description: "search for a pattern in a file",
    args: ["pattern", "*file", "?r", "?i", "?v", "?x"],
})
