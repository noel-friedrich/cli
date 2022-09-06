class Color {
    static RED = "red"
    static BLUE = "blue"
    static GREEN = "green"
    static YELLOW = "yellow"
    static WHITE = "white"
    static BLACK = "black"
    static ORANGE = "orange"

    static rgb(r, g, b) {
        return `rgb(${r}, ${g}, ${b})`
    }

    static rgba(r, g, b, a) {
        return `rgba(${r}, ${g}, ${b}, ${a})`
    }

    static hex(str) {
        return `#${str}`
    }

    static random() {
        const r = () => Math.floor(Math.random() * 256)
        return `rgb(${r()}, ${r()}, ${r()})`
    }

    static niceRandom() {
        const r = () => Math.floor(Math.random() * 100) + 150
        return `rgb(${r()}, ${r()}, ${r()})`
    }

    static SWAMP_GREEN = Color.rgb(139, 195, 74)
    static PURPLE = Color.rgb(79, 79, 192)
    static LIGHT_GREEN = Color.rgb(129, 255, 129)
    static LIGHT_RED = Color.hex("f56a6a")

    static get COLOR_1() {
        return "var(--accent-color-1)"
    }

    static get COLOR_2() {
        return "var(--accent-color-2)"
    }
}

class IntendedError extends Error {
    constructor(message) {
        super(message)
        this.name = "IntendedError"
    }
}

let COMMAND_RUNNING = false

class TerminalFunction {

    constructor(terminalRef, name, description, func, helpVisible=false) {
        this.terminal = terminalRef
        this.name = name
        this.description = description
        this.func = func
        this.helpVisible = helpVisible
    }

    async run(...params) {
        COMMAND_RUNNING = true
        try {
            if (this.func.constructor.name == "AsyncFunction") {
                var output = await this.func(...params)
            } else {
                var output = this.func(...params)
            }
            if (!(params.length == 2 && params[1] == false))
                this.terminal.finishFunction()
            return output
        } catch (e) {
            if (e instanceof IntendedError) {} else {
                terminal.printf`${{[Color.RED]: e.name}}: ${{[Color.WHITE]: e.message}}\n`
                console.error(e)
            }
            this.terminal.finishFunction()
        }
    }

}

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

function stringMul(str, n) {
    str = String(str)
    let out = ""
    for (let i = 0; i < n; i++)
        out += str
    return out
}

function stringPad(str, l, padStr=" ") {
    str = String(str)
    while (str.length < l) {
        str = padStr + str
    }
    return str
}

function stringPadBack(str, l, padStr=" ") {
    str = String(str)
    while (str.length < l) {
        str = str + padStr
    }
    return str
}

function parseArgs(argStr, ignoreNamed=true) {
    let args = Array()
    const hyphens = ["'", '"']
    let inHyphen = false
    let tempArg = ""
    for (let char of argStr) {
        if (!inHyphen && hyphens.includes(char)) {
            inHyphen = char
        } else if (inHyphen && inHyphen == char) {
            inHyphen = false
        } else if (char == " " && !inHyphen) {
            args.push(tempArg)
            tempArg = ""
        } else {
            tempArg += char
        }
    }
    if (tempArg) args.push(tempArg)
    args = args.filter(a => a != "")
    if (ignoreNamed) {
        for (let i = 0; i < args.length; i++) {
            if (namedArgRegex.test(args[i])) {
                args.splice(i, 1)
                args.splice(i, 1)
                i--
            }
        }
    }
    return args
}

function getArgs(funcInfo, args, standardVals) {
    let ignoreNamed = standardVals === false
    let parsedArgs = parseArgs(funcInfo.rawArgs, !ignoreNamed)
    let namedArgs = extractNamedArgs(funcInfo.rawArgs)
    let outputArgs = {}
    let parsedExpected = []
    let parsedExpectedOptions = []
    let argCount = 0
    standardVals = standardVals || {}
    for (let i = 0; i < args.length; i++) {
        let expectedArg = args[i]
        let expectedArgOptions = {
            numeric: false,
            expanding: false,
            optional: false,
            min: null,
            max: null,
        }
        if (expectedArg.startsWith("?")) {
            expectedArgOptions.optional = true
            expectedArg = expectedArg.slice(1)
        } else if (expectedArg.startsWith("*")) {
            expectedArgOptions.expanding = true
            expectedArg = expectedArg.slice(1)
        }
        let subArgs = expectedArg.split(":").slice(1)
        if (subArgs.includes("n")) {
            expectedArgOptions.numeric = true
            let nextArg = subArgs[subArgs.indexOf("n") + 1]
            if (nextArg && /^\-?[0-9]+\~\-?[0-9]+$/.test(nextArg)) {
                let [min, max] = nextArg.split("~").map(a => parseInt(a))
                expectedArgOptions.min = min
                expectedArgOptions.max = max
            }
        }
        expectedArg = expectedArg.split(":", 1)[0]
        parsedExpected.push(expectedArg)
        parsedExpectedOptions.push(expectedArgOptions)
        if (!expectedArgOptions.optional) {
            argCount++
        }
    }

    function error() {
        terminal.printf`${{[Color.COLOR_2]: "$"}} `
        terminal.print(funcInfo.funcName + " ")
        for (let i = 0; i < parsedExpected.length; i++) {
            if (!parsedExpectedOptions[i].optional) {
                var str = `<${parsedExpected[i]}>`
            } else {
                var str = `<?${parsedExpected[i]}>`
            }
            terminal.printf`${{[Color.COLOR_1]: str}} `
        }
        terminal.printLine()
        throw new IntendedError()
    }

    function numError(argName, argOpts) {
        try {
            error()
        } catch {}
        terminal.print(argName + " ", Color.COLOR_1)
        terminal.print("must be a number")
        if (argOpts.min != null) {
            terminal.print(` between ${argOpts.min} and ${argOpts.max}`)
        }
        terminal.printLine()
        throw new IntendedError()
    }

    if (parsedArgs.length > parsedExpected.length && !parsedExpectedOptions[parsedExpectedOptions.length - 1].expanding)
        error()

    for (let i = 0; i < parsedExpected.length; i++) {
        let given = parsedArgs[i]
        let excpected = parsedExpected[i]
        let argOpts = parsedExpectedOptions[i]
        if (given == undefined && !argOpts.optional) {
            error()
        } else if (given == undefined) {
            outputArgs[excpected] = undefined
        } else if (argOpts.numeric) {
            if (/^\-?[0-9]+(?:\.[0-9]*)?$/.test(given)) {
                let value = parseFloat(given)
                if (argOpts.min != null) {
                    if (value < argOpts.min || value > argOpts.max) {
                        numError(excpected, argOpts)
                    }
                }
                outputArgs[excpected] = value
            } else {
                numError(excpected, argOpts)
            }
        } else {
            if (outputArgs[excpected] == undefined) {
                outputArgs[excpected] = given
            } else {
                outputArgs[excpected] += " " + given
            }
        }
        if (parsedArgs[i + 1] != undefined && parsedExpectedOptions[i].expanding) {
            parsedArgs.shift()
            i--
        }
    }
    if (!ignoreNamed)
    for (let [key, val] of Object.entries(namedArgs)) {
        if (key in outputArgs) {
            let argOpts = parsedExpectedOptions[parsedExpected.indexOf(key)]
            if (argOpts.numeric) {
                if (/^\-?[0-9]+(?:\.[0-9]*)?$/.test(val)) {
                    let value = parseFloat(val)
                    if (argOpts.min != null) {
                        if (value < argOpts.min || value > argOpts.max) {
                            numError(key, argOpts)
                        }
                    }
                    outputArgs[key] = value
                } else {
                    numError(key, argOpts)
                }
            } else {
                outputArgs[key] = val
            }
        } else {
            throw new Error(`"${key}" is not a valid argument`)
        }
    }
    for (let i = 0; i < parsedExpected.length; i++) {
        if (parsedExpectedOptions[i].optional) {
            let key = parsedExpected[i]
            let val = outputArgs[key]
            if ([true, undefined].includes(val)) {
                if (key in standardVals) {
                    outputArgs[key] = standardVals[key]
                }
            }
        }
    }
    return outputArgs
}

const namedArgRegex = /^(?:\-{2}[a-zA-Z][a-zA-Z0-9\-\_]*)|(?:\-{1}[a-zA-Z])$/

function extractNamedArgs(argStr) {
    let parsedArgs = parseArgs(argStr, false)
    let namedArgs = Object()
    for (let arg of parsedArgs) {
        if (namedArgRegex.test(arg)) {
            let argName = String(arg)
                .split("").reverse().join("").split("-")[0]
                .split("").reverse().join("")
            let argValue = parsedArgs[parsedArgs.indexOf(arg) + 1]
            if (!argValue) argValue = true
            if (namedArgRegex.test(argValue)) argValue = true
            namedArgs[argName] = argValue
        }
    }
    return namedArgs
}

let TERMINAL_SLEEPING = false
let STRG_C_PRESSED = false

document.addEventListener("keydown", function(e) {
    if (e.key == "c" && e.ctrlKey && TERMINAL_SLEEPING) {
        STRG_C_PRESSED = true
    }
})

function terminalAbort() {
    terminal.printf`\n${{[Color.RED]: "Aborted. [^c]"}}\n`
}

async function sleep(ms) {
    return new Promise(async (resolve, reject) => {
        TERMINAL_SLEEPING = true
        let HANDLED_STRG_C = false
        let intervalFunc = setInterval(function() {
            if (STRG_C_PRESSED) {
                HANDLED_STRG_C = true
                terminalAbort()
                terminal.finishFunction()
                STRG_C_PRESSED = false
                TERMINAL_SLEEPING = false
                clearInterval(intervalFunc)
            }
        }, 50)
        setTimeout(function() {
            clearInterval(intervalFunc)
            if (HANDLED_STRG_C)
                return
            TERMINAL_SLEEPING = false
            if (STRG_C_PRESSED) {
                STRG_C_PRESSED = false
                terminalAbort()
                terminal.finishFunction()
            } else {
                resolve()
            }
        }, ms)
    })
}

function levenshteinDistance(s1, s2) {
    const [l1, l2] = [s1, s2].map(s => s.length + 1)
    let matrix = Array.from(Array(l1))
        .map((_, i) => Array.from(Array(l2))
        .map((_, j) => (i == 0) ? j : ((j == 0) ? i : 0)))
    for (let i = 1; i < l1; i++) {
        for (let j = 1; j < l2; j++) {
            let a, b, c
            if (s1[i - 1] == s2[j - 1]) {
                a = matrix[i - 1][j - 1]
                b = matrix[i - 1][j    ] + 1
                c = matrix[i    ][j - 1] + 1
            } else {
                a = matrix[i - 1][    j] + 1
                b = matrix[i - 1][j - 1] + 1
                c = matrix[i    ][j - 1] + 1
            }
            matrix[i][j] = Math.min(a, b, c)
        }
    }
    return matrix[l1 - 1][l2 - 1] / (Math.max(l1, l2) - 1)
}

function getFolder(path) {
    let currFolder = FILE_SYSTEM
    let incorrectPath = "home"
    for (let folder of path) {
        incorrectPath += `/${folder}`
        folder = folder.trim()
        if (!(folder in currFolder.content)) {
            return [currFolder, incorrectPath]
        }
        currFolder = currFolder.content[folder]
    }
    return [currFolder, false]
}

function strToPath(str) {
    let path = str.split("/")
    if (path.length == 1)
        path = str.split("\\")
    path = path.map(p => String(p).trim()).filter(p => p != "")
    return path
}

function strRepeat(str, num) {
    let out = ""
    for (let i = 0; i < num; i++)
        out += str
    return out
}

class Terminal {

    parentNode = document.getElementById("terminal")
    buttonsNode = document.getElementById("terminal-buttons")
    currInput = null
    functions = Array()
    prevCommands = Array()
    currPath = Array()

    get background() {
        return document.documentElement.style.getPropertyValue("--background")
    }

    set background(color) {
        document.documentElement.style.setProperty("--background", color)
    }

    get foreground() {
        return document.documentElement.style.getPropertyValue("--foreground")
    }

    set foreground(color) {
        document.documentElement.style.setProperty("--foreground", color)
    }

    get accentColor1() {
        return document.documentElement.style.getPropertyValue("--accent-color-1")
    }

    set accentColor1(color) {
        document.documentElement.style.setProperty("--accent-color-1", color)
    }
    
    get accentColor2() {
        return document.documentElement.style.getPropertyValue("--accent-color-2")
    }

    set accentColor2(color) {
        document.documentElement.style.setProperty("--accent-color-2", color)
    }

    get btnColor() {
        return document.documentElement.style.getPropertyValue("--btn-color")
    }

    set btnColor(color) {
        document.documentElement.style.setProperty("--btn-color", color)
    }

    export() {
        return {
            currPath: this.currPath,
            prevCommands: this.prevCommands,
            files: FILE_SYSTEM.export(),
            background: this.background,
            foreground: this.foreground,
            accentColor1: this.accentColor1,
            accentColor2: this.accentColor2,
            btnColor: this.btnColor
        }
    }

    save() {
        let data = JSON.stringify(this.export())
        localStorage.setItem("terminal-autosave", data)
    }

    load() {
        let lastAutosave = localStorage.getItem("terminal-autosave")
        if (lastAutosave) {
            try {
                let data = JSON.parse(lastAutosave)
                this.currPath = data.currPath
                this.prevCommands = data.prevCommands
                this.background = data.background
                this.foreground = data.foreground
                this.accentColor1 = data.accentColor1
                this.accentColor2 = data.accentColor2
                this.btnColor = data.btnColor
                FILE_SYSTEM = FileElement.fromData(data.files)
                console.log("Loaded Autosave")
            } catch {
                console.error("Loading Autosave Failed")
            }
        }
    }

    scroll(behavior="smooth") {
        this.parentNode.scrollTo({
            top: 1000000,
            behavior: behavior
        })   
    }

    makeInputFunc(input) {
        return async function() {
            if (COMMAND_RUNNING) return
            if (this.currInput) {
                this.currInput.remove()
                this.currInput = null
            }
            await this.animatePrint(input)
            await this.inputLine(input)
        }.bind(this)
    }

    constructor() {
        this.parentNode.addEventListener("click", function() {
            if (this.currInput != null) {
                this.currInput.focus()
            }
        }.bind(this))
    
        this.commandNotFoundFunc = this.addFunction("cmdnotfound", function(inpLine) {
            this.printLine(`${inpLine}: command not found`)
        }.bind(this))

        this.addFunction("help", function() {
            this.printf`${{[Color.COLOR_1]: "Welcome to the Help Menu!"}}\n`
            this.printLine("Here are some commands to try out:\n")
            let longestCommandLength = this.functions.filter(f => f.helpVisible)
                .reduce((p, c) => Math.max(p, c.name.length), 0)
            for (let terminalFunc of this.functions.filter(f => f.helpVisible)) {
                this.printCommand("  " + terminalFunc.name, terminalFunc.name, Color.PURPLE, false)
                let spaces = strRepeat(" ", longestCommandLength - terminalFunc.name.length + 2)
                this.printLine(`${spaces}${terminalFunc.description}`)
            }
            this.printLine("\n(there are also A LOT of secret ones)")
        }.bind(this), "show this help menu")

        this.load()
        this.updatePath()
        this.updateFileSystem()
    }

    animatePrint(line) {
        return new Promise(async function(resolve) {
            COMMAND_RUNNING = true
            for (let char of line) {
                this.print(char)
                await sleep(50)
            }
            COMMAND_RUNNING = false
            this.addLineBreak()
            resolve()
        }.bind(this))
    }

    makeButtons(buttonData) {
        this.buttonsNode.innerHTML = ""
        for (let [buttonText, command] of Object.entries(buttonData)) {
            let button = document.createElement("button")
            button.textContent = buttonText
            button.onclick = async function() {
                if (COMMAND_RUNNING) return
                let commandArray = [command]
                if (Array.isArray(command))
                    commandArray = command
                for (let subCommand of commandArray) {
                    if (this.currInput) {
                        this.currInput.remove()
                        this.currInput = null
                    }
                    await this.animatePrint(subCommand)
                    await this.inputLine(subCommand)
                }
            }.bind(this)
            this.buttonsNode.appendChild(button)
        }
    }

    addFunction(funcName, func, funcDescription, helpVisible) {
        let terminalFunc = new TerminalFunction(
            this, funcName, funcDescription, func, helpVisible
        )
        this.functions.push(terminalFunc)
        return terminalFunc
    }

    async prompt(msg=null) {
        return new Promise(async function(resolve) {
            if (msg != null) {
                this.print(msg)
            }
            let inputElement = this.makeInput()
            inputElement.onkeydown = function(event) {
                if (event.key == "Enter") {
                    inputElement.remove()
                    let value = inputElement.value
                    this.printLine(value)
                    resolve(value.trim())
                } else if (event.ctrlKey && event.key == "c") {
                    if (inputElement.value)
                        this.print(inputElement.value)
                    inputElement.remove()
                    terminalAbort()
                    this.finishFunction()
                }
            }.bind(this)
        }.bind(this))
    }

    async promptNum(msg=null, options={}) {
        return new Promise(async function(resolve) {
            while (true) {
                let inp = await this.prompt(msg)
                if (isNaN(inp) || inp.length == 0) {
                    this.printf`${{[Color.RED]: "Error"}}: You must supply a valid number\n`
                    continue
                }
                let num = parseFloat(inp)
                if ("min" in options && options.min > num) {
                    this.printf`${{[Color.RED]: "Error"}}: The number must be larger than ${{[Color.WHITE]: options.min - 1}}\n`
                } else if ("max" in options && options.max < num) {
                    this.printf`${{[Color.RED]: "Error"}}: The number must be smaller than ${{[Color.WHITE]: options.max + 1}}\n`
                } else {
                    resolve(num)
                    return
                }
            }
        }.bind(this))
    }

    async acceptPrompt(msg=null, standardYes=true) {
        msg += standardYes ? " [Y/n] " : " [y/N] "
        let input = await terminal.prompt(msg)
        while (!["y", "n"].includes(input.toLowerCase()) && input != "") {
            terminal.print("Invalid Input!\n", Color.RED)
            input = await terminal.prompt(msg)
        }
        if (input == "") input = standardYes ? "y" : "n"
        if (input == "n") throw new IntendedError()
    }

    
    getFunction(name) {
        return this.functions.find(f => f.name == name)
    }
    
    addLineBreak(indentToggle=true) {
        let br = this.parentNode.appendChild(document.createElement("br"))
        if (indentToggle) this.print("  ")
        return br
    }
    
    cleanMessage(msg) {
        return String(msg)
    }

    printCommand(commandText, command, color=Color.WHITE, endLine=true) {
        let pre = this.print(commandText, color)
        pre.classList.add("clickable")
        pre.onclick = this.makeInputFunc(command)
        if (endLine) this.addLineBreak()
        return pre
    }

    printLink(msg, url, color=Color.WHITE, endLine=true) {
        let anchorElement = document.createElement("a")
        anchorElement.href = url
        anchorElement.textContent = msg
        if (color != Color.WHITE)
            anchorElement.style.color = color
        this.parentNode.appendChild(anchorElement)
        if (endLine) this.addLineBreak()
        return anchorElement
    }

    printf(strings, ...args) {
        let out = []
        for (let i = 0; i < strings.length; i++) {
            out.push(this.print(strings[i]))

            if (!args[i]) continue
            let colorVal = Object.keys(args[i])[0]
            out.push(this.print(String(args[i][colorVal]), colorVal))
        }
        return out
    }

    print(message="", color=Color.WHITE) {
        message = this.cleanMessage(message)
        let lines = message.split("\n")
        let out = undefined
        for (let i = 0; i < lines.length; i++) {
            let subMsg = lines[i]
            let messagePre = document.createElement("pre")
            messagePre.textContent = subMsg
            if (color != Color.WHITE)
                messagePre.style.color = color
            this.parentNode.appendChild(messagePre)
            out = messagePre
            if (i != lines.length - 1)
                this.addLineBreak()
        }
        return out
    }

    printError(msg) {
        terminal.print("Error", Color.RED)
        terminal.printLine(`: ${msg}`)
    }

    printTable(inRows, headerRow=null) {
        let rows = inRows.map(r => r.map(c => (c == undefined) ? " " : c))
        if (headerRow != null) rows.unshift(headerRow)
        const column = i => rows.map(row => row[i])
        const columnWidth = i => Math.max(...column(i)
            .map(e => String((e == undefined) ? " " : e).length))
        for (let rowIndex = 0; rowIndex <= rows.length; rowIndex++) {
            if (rowIndex == 0
                || (rowIndex == 1 && headerRow != null)
                || (rowIndex == rows.length)) {
                let line = ""
                for (let columnIndex = 0; columnIndex < rows[0].length; columnIndex++) {
                    let item = stringMul("-", columnWidth(columnIndex))
                    line += `+-${item}-`
                }
                line += "+"
                terminal.printLine(line)
            }
            if (rowIndex == rows.length) break
            let line = ""
            for (let columnIndex = 0; columnIndex < rows[0].length; columnIndex++) {
                let itemVal = rows[rowIndex][columnIndex]
                if (itemVal == undefined) itemVal = " "
                let item = stringPad(itemVal, columnWidth(columnIndex))
                line += `| ${item} `
            }
            line += "|  "
            terminal.printLine(line)
        }
    }

    setTextDiv(newTextDiv) {
        this.tempParentNode = this.parentNode
        this.parentNode = newTextDiv
    }

    get approxWidthInChars() {
        let pre = Array.from(document.querySelectorAll("pre")).filter(e => e.textContent == "$")[0]
        if (!pre) return null
        return ~~(this.parentNode.clientWidth / pre.offsetWidth * 0.9)
    }

    resetTextDiv() {
        this.parentNode = this.tempParentNode
    }

    printLine(message="", color=Color.WHITE, indent=true) {
        message = this.cleanMessage(message)
        let messagePre = null
        for (let lineMsg of message.split("\n")) {
            messagePre = document.createElement("pre")
            messagePre.textContent = lineMsg
            if (color != Color.WHITE)
                messagePre.style.color = color
            this.parentNode.appendChild(messagePre)
            this.addLineBreak(indent)
        }
        return messagePre
    }

    finishFunction(lineBreak=true) {
        if (lineBreak) this.addLineBreak(false)
        this.print(`home/${this.currPath.join("/")} `)
        this.printf`${{[Color.COLOR_2]: "$"}} `
        if (!isMobile) {
            this.awaitInput()
        }
        COMMAND_RUNNING = false
        terminal.updateFileSystem()
        terminal.save()
    }

    makeInput() {
        let inputElement = document.createElement("input")
        this.parentNode.appendChild(inputElement)
        let rect = inputElement.getBoundingClientRect()
        inputElement.style.width = `${this.parentNode.clientWidth - rect.left - rect.width}px`
        setTimeout(() => inputElement.focus(), 300)
        inputElement.scrollIntoView({behavior: "smooth"})
        this.currInput = inputElement
        return inputElement
    }

    awaitInput(configure=true) {
        let inputElement = this.makeInput()

        if (!configure) return

        inputElement.onkeydown = async function(event) {
            let key = event.key
            let currValue = inputElement.value.trim()

            if (event.ctrlKey && key != "Control") {
                event.preventDefault()

                if (key.toUpperCase() == "K") {
                    await this.getFunction("clear").run()
                    return
                }

                inputElement.remove()
                this.currInput = null
                this.printLine(`^${key}`, Color.WHITE, false)
                this.inputLine("")
            }

            if (key == "Tab") {
                event.preventDefault()
                let tabMatchStr = currValue.split(/\s/).slice(-1).pop()
                let possibleMatches = Object.keys(terminal.currFolder.content).concat(terminal.functions.map(f => f.name))
                for (let possibleMatch of possibleMatches) {
                    if (!tabMatchStr) continue
                    if (possibleMatch.startsWith(tabMatchStr)) {
                        let splitInput = currValue.split(/\s/)
                        splitInput.pop()
                        let preTabMatchStr = splitInput.join(" ")
                        if (preTabMatchStr)
                            inputElement.value = `${preTabMatchStr} ${possibleMatch}`
                        else
                            inputElement.value = possibleMatch
                        return
                    }
                }
            }

            if (key == "Enter") {
                inputElement.remove()
                this.currInput = null
                this.printLine(currValue, Color.WHITE, !!currValue)
                this.inputLine(currValue)
            } else if (key == "ArrowUp") {
                if (this.prevCommands.length > 0) {
                    let upIndex = parseInt(inputElement.getAttribute("_upIndex"))
                    if (!inputElement.hasAttribute("_upIndex")) {
                        upIndex = this.prevCommands.length - 1
                    } else {
                        upIndex = Math.max(upIndex - 1, 0)
                    }
                    inputElement.setAttribute("_upIndex", upIndex)
                    inputElement.value = this.prevCommands[upIndex]
                    event.preventDefault()
                    inputElement.selectionStart = inputElement.selectionEnd = 10000
                }
            } else if (key == "ArrowDown") {
                if (inputElement.hasAttribute("_upIndex")) {
                    let upIndex = parseInt(inputElement.getAttribute("_upIndex"))
                    upIndex = Math.min(upIndex + 1, this.prevCommands.length)
                    inputElement.setAttribute("_upIndex", upIndex)
                    if (upIndex == this.prevCommands.length) {
                        inputElement.value = ""
                    } else {
                        inputElement.value = this.prevCommands[upIndex]
                    }
                }
            }
        }.bind(this)
    }

    get lastCommand() {
        return this.prevCommands[this.prevCommands.length - 1]
    }

    async inputLine(inputStr) {
        if (inputStr.length > 0 && inputStr != this.lastCommand) 
            this.prevCommands.push(inputStr)
        
        let splitStr = inputStr.split(/\s/)

        let functionText = splitStr[0]

        let argString = ""
        if (inputStr.match(/\.\/[^\s]+$/)) {
            functionText = "./"
            argString = inputStr.match(/\.\/([^\s]+)$/)[1]
        }

        if (inputStr.match(/^\![0-9]+$/)) {
            functionText = "!"
            argString = inputStr.match(/^\!([0-9]+)$/)[1]
        }

        let foundFunction = this.getFunction(functionText)

        for (let i = 0; i < splitStr.length; i++) {
            if (i == 0) continue
            argString += splitStr[i] + " "
        }

        if (foundFunction) {
            await foundFunction.run(argString, {
                funcName: functionText,
                rawArgs: argString
            })
            return
        } else if (!inputStr) {
            this.finishFunction(false)
        } else {
            await this.commandNotFoundFunc.run(functionText)
        }
    }

    get currFolder() {
        let currFolder = FILE_SYSTEM
        for (let folder of this.currPath) {
            currFolder = currFolder.content[folder]
        }
        return currFolder
    }

    get rootFolder() {
        return FILE_SYSTEM
    }

    updateFileSystem() {
        this.rootFolder.updatePaths()
    }

    getFile(path, fileType=null, printError=true) {
        function notFoundError() {
            if (printError) {
                terminal.printError(`File not found "${path}"`)
    
                while (path.startsWith("/") || path.endsWith("\\"))
                    path = path.slice(1)
                while (path.endsWith("/") || path.endsWith("\\"))
                    path = path.slice(0, -1)
    
                let closestMatch = null
                let smallestDistance = Infinity
                const allRelativeFiles = getAllFiles("path", terminal.currFolder)
                    .map(p => p.slice(terminal.currFolder.path.length + 1))
                for (let name of allRelativeFiles) {
                    let fileName = removeFileExtension(name)
                    let filePath = removeFileExtension(path)
                    let distance = levenshteinDistance(filePath, fileName)
                    if (distance < smallestDistance) {
                        smallestDistance = distance
                        closestMatch = name
                    }
                }
    
                if (smallestDistance < 0.4) {
                    terminal.print("Did you mean ")
                    terminal.print(closestMatch, Color.YELLOW)
                    terminal.printLine("?")
                }
            }

            throw new IntendedError()
        }
        let currFile = this.currFolder
        for (let item of strToPath(path)) {
            if (currFile.type == FileType.FOLDER) {
                if (item in currFile.content) {
                    currFile = currFile.content[item]
                } else {
                    notFoundError()
                }
            } else {
                notFoundError()
            }
        }
        if (fileType != null && fileType != currFile.type)
            throw new Error(`File is not of type ${fileType}`)
        return currFile
    }

    fileExists(path) {
        try {
            this.getFile(path, null, false)
            return true
        } catch {
            return false
        }
    }

    addToPath(folderName) {
        this.currPath.push(folderName)
    }

    set fontSize(value) {
        this.parentNode.style.setProperty("--font-size", `${value}em`)
    }

    pathToStr(path) {
        let pathStr = "home/"
        for (let pathItem of path) {
            if (pathItem.length > 0)
                pathStr += `${pathItem}/`
        }
        return pathStr
    }

    get pathAsStr() {
        return this.pathToStr(this.currPath)
    }

    updatePath() {
        if (this.currFolder.buttonsData) {
            let data = this.currFolder.buttonsData
            this.makeButtons(data)
        } else {
            this.makeButtons({})
        }
    }

}

function fileExists(fileName) {
    for (let existingFileName of Object.keys(terminal.currFolder.content)) {
        if (existingFileName == fileName.toLowerCase()) {
            return true
        }
    }
    return false
}

function getFile(fileName) {
    for (let existingFileName of Object.keys(terminal.currFolder.content)) {
        if (existingFileName == fileName.toLowerCase()) {
            return terminal.currFolder.content[existingFileName]
        }
    }
    return null
}

const terminal = new Terminal()

let helloWorld = terminal.addFunction("helloworld", function() {
    terminal.printLine(welcome_txt_content)
})

async function main() {
    if (isMobile) {
        document.querySelectorAll("*").forEach(e => {
            e.classList.add("mobile")
        })
        document.querySelector("#terminal-input").focus()
    }

    terminal.print("  ")
    helloWorld.run()
}

document.querySelector("#terminal-input").onkeydown = function(event) {
    if (event.key == "Enter") {
        terminal.printLine(this.value)
        terminal.inputLine(this.value)
        this.value = ""
    }
    setTimeout(function() {
        terminal.parentNode.scrollTo({
            top: terminal.parentNode.scrollHeight,
            behavior: "smooth"
        })
    }, 10)
}

main()
