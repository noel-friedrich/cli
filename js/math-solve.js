{

let GLOBAL_VARIABLES = {}

const STANDARD_MATH_VARIABLES = {
    e: Math.E,
    pi: Math.PI
}

class ZeroDivisionError extends Error {

    constructor(message) {
        super(message)
        this.name = "ZeroDivisionError"
    }

}

class ParserError extends Error {

    constructor(message) {
        super(message)
        this.name = "ParserError"
    }

}

class VariableError extends Error {

    constructor(message) {
        super(message)
        this.name = "VariableError"
    }

}

class MathOperation {

    static SPECIAL_CHARS = [
        "+", "-", "*", "/", "^", "(", ")", "#",
        "sin", "cos", "tan", "log", "ln", "sqrt", "atan", "acos", "asin"
    ]

    static MATH_FUNCNAMES = [
        "sin", "cos", "tan", "log", "ln", "sqrt", "atan", "acos", "asin"
    ]

    static EQUATION = "eq"
    static CONSTANT = "constant"
    static FUNCTION = "func"
    static VARIABLE = "var"
    static ADDITION = "add"
    static SUBTRACTION = "sub"
    static MULTIPLICATION = "mul"
    static DIVISION = "div"
    static POWER = "pow"
    static ROOT = "root"
    static TERM = "term"

    constructor(operation, contents) {
        this.operation = operation
        this.contents = contents
        this.communitive = false
        this.orderingScore = 1
    }

    get oppositeOperation() {
        switch (this.operation) {
            case MathOperation.ADDITION: return MathOperation.SUBTRACTION
            case MathOperation.SUBTRACTION: return MathOperation.ADDITION
            case MathOperation.MULTIPLICATION: return MathOperation.DIVISION
            case MathOperation.DIVISION: return MathOperation.MULTIPLICATION
            case MathOperation.POWER: return MathOperation.ROOT
            case MathOperation.ROOT: return MathOperation.POWER
        }
        return null
    }

    get childStrs() {
        let strs = []
        for (let content of this.contents) {
            if (content instanceof MathOperation) {
                strs.push(content.toString(this))
            } else {
                strs.push(String(content))
            }
        }
        return strs
    }

    needsBraces() {
        return false
    }

    copy() {
        return new (classFromOperator(this.operation))(this.contentCopy())
    }

    contentCopy() {
        if (Array.isArray(this.contents)) {
            return [...this.contents]
        }
        return this.contents
    }

    derivative() {
        if (this.isActuallyOperation()) {
            let newContents = []
            for (let content of this.contents) {
                if (content instanceof MathOperation) {
                    newContents.push(content.derivative())
                } else {
                    newContents.push(content)
                }
            }
            return new (classFromOperator(this.operation))(newContents)
        } else {
            return new (classFromOperator(this.operation))(this.contentCopy())
        }
    }

    parseOutputString(string, braces=false) {
        if (string.includes("<v1>")) {
            string = string.replace("<v1>", this.childStrs[0])
        }
        if (string.includes("<v2>")) {
            string = string.replace("<v2>", this.childStrs[1])
        }
        if (string.includes("<p1>")) {
            let p1 = " ".repeat(String(this.childStrs[0]).length)
            string = string.replace("<p1>", p1)
        }
        if (string.includes("<p2>")) {
            let p2 = " ".repeat(String(this.childStrs[1]).length)
            string = string.replace("<p2>", p2)
        }
        if (string.includes("<d>")) {
            let p1 = String(this.childStrs[0]).length
            let p2 = String(this.childStrs[1]).length
            let d = "-".repeat(Math.max(p1, p2))
            string = string.replace("<d>", d)
        }
        if (braces) {
            string = "(" + string + ")"
        }
        return string
    }

    toString() {
        let contentString = ""
        for (let content of this.contents) {
            if (content instanceof MathOperation) {
                contentString += content.toString() + ","
            }
            else {
                contentString += String(content) + ","
            }
        }
        contentString = contentString.substring(0, contentString.length - 1)
        return `${this.operation}(${contentString})`
    }

    static valToString(v) {
        return (v instanceof MathOperation) ? v.toString() : String(v)
    }

    static charToOperation(char) {
        switch (char) {
            case "+": return MathOperation.ADDITION
            case "-": return MathOperation.SUBTRACTION
            case "*": return MathOperation.MULTIPLICATION
            case "/": return MathOperation.DIVISION
            case "^": return MathOperation.POWER
            case "#": return MathOperation.ROOT
        }
        return null
    }

    static lexx(string) {
        let tokens = []
        let currToken = ""
        for (let currChar of string) {
            currToken = (currToken + currChar).trim()
            for (let specialChar of MathOperation.SPECIAL_CHARS) {
                if (currToken.endsWith(specialChar)) {
                    if (currToken.length == specialChar.length) {
                        tokens.push(currToken)
                    } else {
                        tokens.push(currToken.substring(0, currToken.length - specialChar.length))
                        tokens.push(specialChar)
                    }
                    currToken = ""
                    break
                }
            }
        }
        if (currToken.length > 0) {
            tokens.push(currToken)
        }
        return tokens
    }

    static eval(string) {
        const isConstant = s => /^[0-9]+(\.[0-9]+)?$/.test(s)
        const isVariable = s => /^[a-zA-Z]$/.test(s)
        const lexxed = MathOperation.lexx(string)
        let parenthesesCount = 0
        function parseTokens(tokens) {
            let operations = []
            let i = tokens.length
            while (i--) {
                const token = tokens[i]
                const previousToken = tokens[i - 1]
                const prevprevToken = tokens[i - 2]
                const nextToken = tokens[i + 1]
                if (token instanceof MathOperation
                    && !MathOperation.MATH_FUNCNAMES.includes(prevprevToken)
                    && previousToken == "("
                    && nextToken == ")") {
                    tokens.splice(i - 1, 3, token)
                }
            }

            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i]
                const operation = MathOperation.charToOperation(token)
                const previousToken = tokens[i - 1]
                const nextToken = tokens[i + 1]
                if (operation != null) {
                    if (previousToken == null || nextToken == null)
                        throw new ParserError("Invalid syntax")
                    operations.push([operation, i - 1, i + 1, parenthesesCount])
                } else if (token == "(") {
                    parenthesesCount++
                } else if (token == ")") {
                    parenthesesCount--
                } else if (isConstant(token) && tokens.length == 1) {
                    return new MathConstant(parseFloat(token))
                } else if (isVariable(token) && tokens.length == 1) {
                    return new MathVariable(token)
                } else if (MathOperation.MATH_FUNCNAMES.includes(token)) {
                    if (nextToken != "(") {
                        throw new ParserError("Invalid syntax")
                    }
                    if (tokens[i + 1] == "(" && tokens[i + 3] == ")") {
                        operations.push([token, i, 4, parenthesesCount, true])
                    }
                }
            }

            operations.sort((a, b) => {
                if (a[3] != b[3]) {
                    return b[3] - a[3]
                }
                function operationScore(operationInfo) {
                    const operationScores = {
                        [MathOperation.ADDITION]: 2,
                        [MathOperation.SUBTRACTION]: 2,
                        [MathOperation.MULTIPLICATION]: 3,
                        [MathOperation.DIVISION]: 3,
                        [MathOperation.POWER]: 4,
                        [MathOperation.CONSTANT]: 5,
                    }
                    if (operationInfo[0] in operationScores) {
                        return operationScores[operationInfo[0]]
                    } else {
                        return 5
                    }
                }
                return operationScore(b) - operationScore(a)
            })

            if (parenthesesCount != 0)
                throw new ParserError("Unbalanced parentheses")

            return operations[0]
        }
        let currTokens = lexxed
        let count = 0

        while (currTokens.length > 1) {
            count ++
            let firstOperation = parseTokens(currTokens)

            if (firstOperation == undefined) 
                throw new ParserError("Invalid syntax!")

            if (firstOperation[4] !== true) {
                let sides = [
                    currTokens[firstOperation[1]],
                    currTokens[firstOperation[2]]
                ]
    
                for (let i = 0; i < sides.length; i++) {
                    if (!(sides[i] instanceof MathOperation)) {
                        if (isConstant(sides[i])) {
                            sides[i] = new MathConstant(parseFloat(sides[i]))
                        } else if (isVariable(sides[i])) {
                            sides[i] = new MathVariable(sides[i])
                        } else {
                            throw new ParserError(`Invalid syntax "${sides[i]}"`)
                        }
                    }
                }
    
                const [leftSide, rightSide] = sides
    
                switch (firstOperation[0]) {
                    case MathOperation.ADDITION:
                        var newOperation = new Addition([leftSide, rightSide])
                        break
                    case MathOperation.SUBTRACTION:
                        var newOperation = new Subtraction([leftSide, rightSide])
                        break
                    case MathOperation.MULTIPLICATION:
                        var newOperation = new Multiplication([leftSide, rightSide])
                        break
                    case MathOperation.DIVISION:
                        var newOperation = new Division([leftSide, rightSide])
                        break
                    case MathOperation.POWER:
                        var newOperation = new Power([leftSide, rightSide])
                        break
                    case MathOperation.ROOT:
                        var newOperation = new Root([leftSide, rightSide])
                        break
                    default:
                        throw new ParserError(`Invalid operation: ${firstOperation[0]}`)
                }
    
                currTokens.splice(firstOperation[1], 3, newOperation)
            } else if (typeof firstOperation[0] === "string") {
                let functionName = firstOperation[0]
                let startIndex = firstOperation[1]
                let argument = currTokens[startIndex + 2]
                let argLength = firstOperation[2]
                if (!(argument instanceof MathOperation)) {
                    if (isConstant(argument)) {
                        argument = new MathConstant(parseFloat(argument))
                    } else if (isVariable(argument)) {
                        argument = new MathVariable(argument)
                    } else {
                        throw new ParserError(`Invalid syntax "${argument}"`)
                    }
                }
                let newOperation = new MathFunction([functionName, argument])
                currTokens.splice(startIndex, argLength, newOperation)
            }

            if (count > 99) { // my lucky number
                throw new ParserError("too complex of an expression, man!")
            }
        }

        return (count == 0) ? parseTokens(currTokens) : currTokens[0]
    }

    trySolve() {
        try {
            let value = this.solve()
            return value
        } catch(e) {
            if (e instanceof ZeroDivisionError) {
                throw new ZeroDivisionError("Division by zero")
            }
            return null
        }
    }

    get content() {
        return this.contents
    }

    equals(other) {
        if (this.operation != other.operation) {
            return false
        }
        if (Array.isArray(this.contents) != Array.isArray(other.contents)) {
            return false
        }
        if (Array.isArray(this.contents)) {
            if (this.contents.length != other.contents.length) {
                return false
            }
            for (let i = 0; i < this.contents.length; i++) {
                if (this.contents[i] instanceof MathOperation) {
                    if (!this.contents[i].equals(other.contents[i])) {
                        return false
                    }
                } else if (this.contents[i] != other.contents[i]) {
                    return false
                }
            }
        } else if (this.contents != other.contents) {
            return false
        }
        return true
    }

    isActuallyOperation() {
        return this.operation != MathOperation.CONSTANT && this.operation != MathOperation.VARIABLE
    }

    simplify() {
        let newContents = this.contentCopy()
        if (Array.isArray(this.contents)) {
            newContents = []
            for (let i = 0; i < this.contents.length; i++) {
                if (this.contents[i] instanceof MathOperation) {
                    try {
                        let value = this.contents[i].solve()
                        if (String(value).length < 5)
                            newContents.push(new MathConstant(value))
                        else
                            newContents.push(this.contents[i])
                    } catch(e) {
                        if (e instanceof ZeroDivisionError) {
                            throw new ZeroDivisionError("Division by zero")
                        }
                        newContents.push(this.contents[i].simplify())
                    }
                } else {
                    newContents.push(this.contents[i])
                }
            }
        }

        if (this.communitive) {
            if (newContents[1].orderingScore > newContents[0].orderingScore) {
                newContents = [newContents[1], newContents[0]]
                return new (classFromOperator(this.operation))(newContents).simplify()
            }


            for (let j = 0; j < 2; j++) {
                if (newContents[j].operation == this.operation) {
                    let currClass = classFromOperator(this.operation)
                    for (let i = 0; i < 2; i++) {
                        let testNewOperation = new (currClass)([newContents[j].contents[i], newContents[1 - j]])
                        let solved = testNewOperation.trySolve()
                        if (solved != null) {
                            return new (currClass)([newContents[j].contents[1 - i], new MathConstant(solved)]).simplify()
                        }
                    }

                    if (this.operation == MathOperation.MULTIPLICATION) {
                        for (let i = 0; i < 2; i++) {
                            if (newContents[j].contents[i].equals(newContents[1 - j])) {
                                return new Multiplication([
                                    new Power(
                                        [newContents[j].contents[i], new MathConstant(2)]
                                    ).simplify(),
                                    newContents[j].contents[1 - i]
                                ]).simplify()
                            }
                        }
                    }
                }

                if (this.operation == MathOperation.MULTIPLICATION) {
                    if (newContents[0].equals(newContents[1])) {
                        return new Power([newContents[0], new MathConstant(2)]).simplify()
                    }
                }

                if (this.isActuallyOperation()) {
                    if (newContents[j].operation == this.oppositeOperation) {
                        if (newContents[0].contents[1].equals(newContents[1])) {
                            return newContents[0].contents[0].simplify()
                        }
                    }
                }

            }
        }

        if (this.operation == MathOperation.MULTIPLICATION) {
            for (let i = 0; i < 2; i++) {
                if (newContents[i].operation == MathOperation.POWER) {
                    if (newContents[1 - i].equals(newContents[i].contents[0])) {
                        return new Power([
                            newContents[i].contents[0],
                            new Addition([
                                newContents[i].contents[1],
                                new MathConstant(1)
                            ]).simplify()
                        ]).simplify()
                    }
                }
            }
        }

        return new (classFromOperator(this.operation))(newContents)
    }

}

function classFromOperator(operator) {
    switch (operator) {
        case MathOperation.ADDITION: return Addition
        case MathOperation.SUBTRACTION: return Subtraction
        case MathOperation.MULTIPLICATION: return Multiplication
        case MathOperation.DIVISION: return Division
        case MathOperation.POWER: return Power
        case MathOperation.ROOT: return Root
        case MathOperation.EQUATION: return Equation
        case MathOperation.TERM: return Term
        case MathOperation.VARIABLE: return MathVariable
        case MathOperation.CONSTANT: return MathConstant
        case MathOperation.FUNCTION: return MathFunction
    }
    throw new Error("Invalid operation: " + operator)
}

class MathConstant extends MathOperation {

    constructor(value) {
        super(MathOperation.CONSTANT, value)
        this.orderingScore = 0
    }

    solve() {
        return this.contents
    }

    toString() {
        return `${this.contents}`
    }

    get value() {
        return this.contents
    }

    derivative() {
        return new MathConstant(0)
    }

}

class MathFunction extends MathOperation {

    constructor(contents) {
        super(MathOperation.FUNCTION, contents)
        this.orderingScore = 1
    }

    solve() {
        let [funcName, arg] = this.contents
        return Math[funcName](arg.solve())
    }

    derivative() {
        let [funcName, arg] = this.contents
        let argDerivative = arg.derivative()
        "sin", "cos", "tan", "log", "ln", "sqrt", "atan", "acos", "asin"
        switch(funcName) {
            case "sin": return new Multiplication([
                    new MathFunction(["cos", arg]),
                    argDerivative
                ]).simplify()
            case "cos": return new Multiplication([
                    new Multiplication([
                        new MathConstant(-1),
                        new MathFunction(["sin", arg])
                    ]),
                    argDerivative
                ]).simplify()
            case "tan": return new Multiplication([
                    new MathFunction(["sec", arg]),
                    argDerivative
                ]).simplify()
            case "log": return new Division([
                    argDerivative,
                    arg
                ]).simplify()
            case "ln": return new Division([
                    argDerivative,
                    arg
                ]).simplify()
            case "sqrt": return new Division([
                    argDerivative,
                    new Multiplication([
                        new MathConstant(2),
                        new Power([arg, new MathConstant(2)])
                    ])
                ]).simplify()
            case "atan": return new Division([
                    argDerivative,
                    new Multiplication([
                        new MathConstant(1),
                        new Power([arg, new MathConstant(2)])
                    ])
                ]).simplify()
            case "acos": return new Multiplication([
                    new Multiplication([
                        new MathConstant(-1),
                        new MathFunction(["sin", arg])
                    ]),
                    argDerivative
                ]).simplify()
            case "asin": return new Multiplication([
                    new MathFunction(["sin", arg]),
                    argDerivative
                ]).simplify()
        }
        throw new Error("cannot differentiate " + funcName + " function")
    }

    simplify() {
        return this
    }

    toString(parent) {
        return this.parseOutputString("<v1>(<v2>)", this.needsBraces(parent))
    }

}

class MathVariable extends MathOperation {

    constructor(contents) {
        super(MathOperation.VARIABLE, contents)
        this.orderingScore = 1
    }

    get name() {
        return `${this.contents}`
    }

    solve() {
        if (this.name in GLOBAL_VARIABLES) {
            return GLOBAL_VARIABLES[this.name]
        }
        throw new VariableError(`Variable ${this.name} not defined`)
    }

    toString() {
        return `${this.name}`
    }

    derivative() {
        let allVariables = Object.keys(GLOBAL_VARIABLES).concat(Object.keys(STANDARD_MATH_VARIABLES)).concat(["x"])
        if (!allVariables.includes(this.name)) {
            throw new ParserError(`Cannot differentiate unknown variable "${this.name}"`)
        }
        return new MathConstant(1)
    }

}

class Addition extends MathOperation {

    constructor(contents) {
        super(MathOperation.ADDITION, contents)
        this.communitive = true
        this.orderingScore = 1
    }

    solve() {
        let [val1, val2] = this.contents.map(val => val.solve())
        return val1 + val2
    }

    needsBraces(parent) {
        if (!parent) return false
        if (parent.operation == MathOperation.FUNCTION)
            return false
        if (parent.operation == MathOperation.POWER) {
            if (parent.contents[0].equals(this)) {
                return true
            } else {
                return false
            }
        }
        return parent.operation != MathOperation.ADDITION && parent.operation != MathOperation.SUBTRACTION
    }

    toString(parent) {
        return this.parseOutputString("<v1>+<v2>", this.needsBraces(parent))
    }

    simplify() {
        let temp = super.simplify()
        for (let i = 0; i < 2; i++) {
            if (temp.contents[i] instanceof MathConstant && temp.contents[i].value == 0) {
                return temp.contents[1 - i].simplify()
            }
        }
        return temp
    }

}

class Subtraction extends MathOperation {

    constructor(contents) {
        super(MathOperation.SUBTRACTION, contents)
        this.orderingScore = 1
    }

    solve() {
        let [val1, val2] = this.contents.map(val => val.solve())
        return val1 - val2
    }

    toString(parent) {
        return this.parseOutputString("<v1>-<v2>", this.needsBraces(parent))
    }

    needsBraces(parent) {
        if (!parent) return true
        if (parent.operation == MathOperation.FUNCTION)
            return false
        if (parent.operation == MathOperation.POWER) {
            if (parent.contents[0].equals(this)) {
                return true
            } else {
                return false
            }
        }
        return true
    }

    simplify() {
        let temp = super.simplify()
        if (temp.contents[1] instanceof MathConstant && temp.contents[1].value == 0) {
            return temp.contents[0].simplify()
        } else if (temp.contents[0] instanceof MathConstant && temp.contents[0].value == 0) {
            return new Multiplication([new MathConstant(-1), temp.contents[1]]).simplify()
        }
        if (temp.contents[0].equals(temp.contents[1])) {
            return new MathConstant(0)
        }
        return temp
    }   

}

class Multiplication extends MathOperation {

    constructor(contents) {
        super(MathOperation.MULTIPLICATION, contents)
        this.orderingScore = 1
        this.communitive = true
    }

    solve() {
        let [val1, val2] = this.contents.map(val => val.solve())
        return val1 * val2
    }

    toString() {
        return this.parseOutputString("<v1>*<v2>")
    }

    simplify() {
        let temp = super.simplify()
        for (let i = 0; i < 2; i++) {
            if (temp.contents[i] instanceof MathConstant && temp.contents[i].value == 0) {
                return new MathConstant(0)
            } else if (temp.contents[i] instanceof MathConstant && temp.contents[i].value == 1) {
                return temp.contents[1 - i].simplify()
            }
        }
        return temp
    }

    derivative() {
        let [v1, v2] = this.contents.map(val => val.copy())
        let [d1, d2] = this.contents.map(val => val.derivative())
        return new Addition([
            new Multiplication([v1.copy(), d2.copy()]).simplify(),
            new Multiplication([d1.copy(), v2.copy()]).simplify()
        ]).simplify()
    }

}

class Division extends MathOperation {

    constructor(contents) {
        super(MathOperation.DIVISION, contents)
        this.orderingScore = 1
    }

    solve() {
        let [val1, val2] = this.contents.map(val => val.solve())
        if (val2 == 0) {
            throw new ZeroDivisionError("Division by zero")
        }
        return val1 / val2
    }

    toString() {
        return this.parseOutputString("<v1>/<v2>")
    }

    simplify() {
        let temp = super.simplify()
        if (temp.contents[0] instanceof MathConstant && temp.contents[0].value == 0) {
            return new MathConstant(0)
        }
        if (temp.contents[1] instanceof MathConstant && temp.contents[1].value == 1) {
            return temp.contents[0].simplify()
        }
        return temp
    }

    derivative() {
        let [v1, v2] = this.contents.map(val => val.copy())
        let [d1, d2] = this.contents.map(val => val.derivative())
        return new Division([
            new Subtraction([
                new Multiplication([v2.copy(), d1.copy()]),
                new Multiplication([v1.copy(), d2.copy()])
            ]).simplify(),
            new Multiplication([v2.copy(), v2.copy()]).simplify()
        ]).simplify()
    }

}

class Power extends MathOperation {

    constructor(contents) {
        super(MathOperation.POWER, contents)
        this.orderingScore = 2
    }

    solve() {
        let [val1, val2] = this.contents.map(val => val.solve())
        return Math.pow(val1, val2)
    }

    toString() {
        return this.parseOutputString("<v1>^(<v2>)")
    }

    simplify() {
        let temp = super.simplify()
        if (temp.contents[1] instanceof MathConstant && temp.contents[1].value == 0) {
            return new MathConstant(1)
        }
        if (temp.contents[1] instanceof MathConstant && temp.contents[1].value == 1) {
            return temp.contents[0].simplify()
        }
        if (temp.contents[0] instanceof MathConstant && temp.contents[0].value == 1) {
            return temp.contents[0].simplify()
        }
        if (temp.contents[0] instanceof Power) {
            return new Power([
                temp.contents[0].contents[0],
                new Multiplication([
                    temp.contents[0].contents[1],
                    temp.contents[1]
                ]).simplify()
            ]).simplify()
        }
        return temp
    }

    derivative() {
        let [base, exponent] = this.contents
        if (base instanceof MathVariable && base.name == "x") {
            return new Multiplication([
                exponent.copy(),
                new Power([
                    base,
                    new Subtraction([
                        exponent,
                        new MathConstant(1)
                    ]).simplify()
                ]).simplify()
            ]).simplify()
        } else if (base instanceof MathVariable && base.name == "e") {
            return new Multiplication([
                this.copy(),
                exponent.derivative()
            ]).simplify()
        } else {
            return new Multiplication([
                this.copy(),
                new MathFunction([
                    "ln",
                    base
                ]).simplify(),
            ]).simplify()
        }
    }

}

class Root extends MathOperation {

    constructor(contents) {
        super(MathOperation.ROOT, contents)
        this.orderingScore = 2
    }

    solve() {
        let [val1, val2] = this.contents.map(val => val.solve())
        return Math.pow(val1, 1 / val2)
    }

    toString() {
        return `${this.contents[0]}^(1/${this.contents[1]})`
    }

    simplify() {
        return new Power([
            this.contents[0],
            new Division([
                new MathConstant(1),
                this.contents[1]
            ]).simplify()
        ]).simplify()
    }

}

class Term extends MathOperation {

    constructor(contents) {
        super(MathOperation.TERM, contents)
        this.orderingScore = 0
    }

    static fromString(string) {
        string = string.replace(/([0-9])([a-z])/g, "$1*$2")
        string = string.replace(/\)\(/g, ")*(")
        string = string.replace(/\(([0-9]+)\)/g, "$1")
        string = string.replace(/sqrt\((.+)\)/g, "$1^(1/2)")
        let term = new Term([MathOperation.eval(string)])
        for (let content of term.contents) {
            if (!(content instanceof MathOperation)) {
                throw new ParserError(`Invalid term "${content}"`)
            }
        }
        return term
    }

    toString() {
        let string = this.contents[0].toString()
        return string
    }

    derivative() {
        return new Term([this.contents[0].derivative()])
    }

    solve() {
        return this.contents[0].solve()
    }

    input(variables) {
        GLOBAL_VARIABLES = variables
        return this.solve()
    }

}

class Equation extends MathOperation {

    constructor(contents) {
        super(MathOperation.EQUATION, contents)
        this.orderingScore = 0
    }

    simplify() {
        let [leftSide, rightSide] = this.contents
        leftSide = leftSide.simplify()
        rightSide = rightSide.simplify()
        return new Equation([leftSide, rightSide])
    }

    static fromString(string) {
        let sides = string.split("=")
        if (sides.length != 2)
            throw new Error("Equation must contain exactly one equal sign")
        let [leftString, rightString] = sides.map(side => side.trim())
        let left = Term.fromString(leftString)
        let right = Term.fromString(rightString)
        return new Equation([left, right])
    }

    toString() {
        return `${this.contents[0].toString()} = ${this.contents[1].toString()}`
    }

}

terminal.addFunction("derivative", function(_, funcInfo) {
    let args = getArgs(funcInfo, ["*term"], false)
    let term = Term.fromString(args.term).simplify()
    let derivative = term.derivative().simplify()
    terminal.printLine(derivative.toString())
}, "take the derivative of a term")

}
