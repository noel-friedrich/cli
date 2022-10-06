function angleDifference(a, b) {
    var diff = a - b
    while (diff < -Math.PI/2) diff += Math.PI
    while (diff > Math.PI/2) diff -= Math.PI
    return diff
}

class Vector2d {

    constructor(x, y) {
        this.x = x
        this.y = y
    }

    copy() {
        return new Vector2d(this.x, this.y)
    }

    add(v) {
        return new Vector2d(this.x + v.x, this.y + v.y)
    }

    iadd(v) {
        this.x += v.x
        this.y += v.y
    }

    sub(v) {
        return new Vector2d(this.x - v.x, this.y - v.y)
    }

    isub(v) {
        this.x -= v.x
        this.y -= v.y
    }

    mul(v) {
        return new Vector2d(this.x * v.x, this.y * v.y)
    }

    imul(v) {
        this.x *= v.x
        this.y *= v.y
    }

    div(v) {
        return new Vector2d(this.x / v.x, this.y / v.y)
    }

    idiv(v) {
        this.x /= v.x
        this.y /= v.y
    }

    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    get normalized() {
        let m = this.length
        return new Vector2d(this.x / m, this.y / m)
    }
    
    scale(x) {
        return new Vector2d(this.x * x, this.y * x)
    }

    dot(v) {
        return this.x * v.x + this.y * v.y
    }

    iscale(x) {
        this.x *= x
        this.y *= x
    }

    distance(v) {
        return this.sub(v).length
    }

    cross(v) {
        return this.x * v.y - this.y * v.x
    }

    static fromAngle(angle) {
        return new Vector2d(Math.cos(angle), Math.sin(angle))
    }

    static fromPolar(mag, angle) {
        return new Vector2d(mag * Math.cos(angle), mag * Math.sin(angle))
    }

    static fromArray(arr) {
        return new Vector2d(arr[0], arr[1])
    }

    set(x, y) {
        this.x = x
        this.y = y
    }

    addX(x) {
        return new Vector2d(this.x + x, this.y)
    }

    addY(y) {
        return new Vector2d(this.x, this.y + y)
    }

    rotate(angle) {
        let x = this.x * Math.cos(angle) - this.y * Math.sin(angle)
        let y = this.x * Math.sin(angle) + this.y * Math.cos(angle)
        return new Vector2d(x, y)
    }

    irotate(angle) {
        let x = this.x * Math.cos(angle) - this.y * Math.sin(angle)
        let y = this.x * Math.sin(angle) + this.y * Math.cos(angle)
        this.x = x
        this.y = y
    }

    static random() {
        let direction = Math.random() * Math.PI * 2
        return Vector2d.fromAngle(direction)
    }

    get angle() {
        return Math.atan2(this.y, this.x)
    }

    angleDifference(v) {
        return angleDifference(this.angle, v.angle)
    }

    angleTo(v) {
        return Math.atan2(v.y - this.y, v.x - this.x)
    }

    equals(v) {
        return this.x == v.x && this.y == v.y
    }

}

terminal.addFunction("tictactoe", async function() {
    const N = " "
    const X = "X"
    const O = "O"

    let field = [[N, N, N], [N, N, N], [N, N, N]]

    function setField(n, val) {
        let row = (n + 2) % 3
        let index = Math.floor((n -0.1) / 3)
        field[index][row] = val
    }

    function getField(n) {
        let row = (n + 2) % 3
        let index = Math.floor((n - 0.1) / 3)
        return field[index][row]
    }

    function printField() {
        terminal.printLine(` ${getField(1)} | ${getField(2)} | ${getField(3)} `)
        terminal.printLine(`---+---+---`)
        terminal.printLine(` ${getField(4)} | ${getField(5)} | ${getField(6)} `)
        terminal.printLine(`---+---+---`)
        terminal.printLine(` ${getField(7)} | ${getField(8)} | ${getField(9)} `)
    }

    async function getUserInput() {
        input = await terminal.promptNum("Your move [1-9]: ", {min: 1, max: 9})
        if (getField(input) != N) {
            terminal.printLine("Field is not free.")
            return getUserInput()
        } else {
            return input
        }
    }

    function isWon() {
        function any(l) {
            for (let e of l)
                if (e)
                    return true
            return false
        }
        const possibleWins = [
            [1, 2, 3], [4, 5, 6], [7, 8, 9],
            [1, 4, 7], [2, 5, 8], [3, 6, 9],
            [1, 5, 9], [3, 5, 7]
        ]
        for (let winner of [X, O]) {
            for (let winConfig of possibleWins) {
                let winConfigTrue = true
                for (let condition of winConfig) {
                    if (getField(condition) != winner)
                        winConfigTrue = false
                }
                if (winConfigTrue) {
                    return winner
                }
            }
        }
        return false
    }

    function isDraw() {
        for (let i = 0; i < 9; i++)
            if (getField(i + 1) == N)
                return false
        return true
    }

    function getComputerInput() {
        const possibleWins = [
            [1, 2, 3], [4, 5, 6], [7, 8, 9],
            [1, 4, 7], [2, 5, 8], [3, 6, 9],
            [1, 5, 9], [3, 5, 7]
        ]

        for (let player of [X, O]) {
            for (let possibleWin of possibleWins) {
                let count = 0
                for (let num of possibleWin) {
                    if (getField(num) == player)
                        count++
                }
                if (count == 2) {
                    for (let num of possibleWin) {
                        if (getField(num) == N)
                            return num
                    }
                }
            } 
        }

        let a = Math.floor(Math.random() * 9) + 1
        while (getField(a) != 0)
            a = Math.floor(Math.random() * 9) + 1
        return a
    }

    if (Math.random() < 0.5) {
        setField(getComputerInput(), O)
    }

    while (!isWon() && !isDraw()) {
        printField()
        setField(await getUserInput(), X)
        if (isWon() || isDraw())
            break
        setField(getComputerInput(), O)
    }

    let winner = isWon()
    terminal.printLine("the game has ended...")
    await sleep(2000)
    printField()
    if (winner) {
        terminal.printLine(`${winner} has won!`)
    } else {
        terminal.printLine("It's a draw!")
    }

}, "play a game of tictactoe (beatable)")

terminal.addFunction("4inarow", async function(rawArgs) {
    const N = " ", X = "X", O = "O"
    let field = Array.from(Array(6)).map(() => Array(7).fill(N))

    let DEPTH = 5

    if (/^[1-9]$/.test(rawArgs.trim())) {
        DEPTH = parseInt(rawArgs.trim())
        terminal.printLine(`Set search-depth to ${DEPTH}`)
    }

    function printField(f=field) {
        const betweenRow = "+---+---+---+---+---+---+---+"
        terminal.printLine("+-1-+-2-+-3-+-4-+-5-+-6-+-7-+")
        for (let row of f) {
            terminal.print("| ")
            for (let item of row) {
                switch(item) {
                    case X: terminal.print(X, Color.YELLOW); break;
                    case O: terminal.print(O, Color.BLUE); break;
                    case N: terminal.print(" ")
                }
                terminal.print(" | ")
            }
            terminal.printLine("\n" + betweenRow)
        }
    }

    function putIntoField(n, val, f=field) {
        for (let i = 5; i >= 0; i--) {
            if (f[i][n] == N) {
                f[i][n] = val
                return true
            }
        }
        return false
    }

    function popUpper(n, f=field) {
        for (let i = 0; i < 6; i++) {
            if (f[i][n] != N) {
                f[i][n] = N
                return true
            }
        }
        return false
    }

    function rowFree(n, f=field) {
        for (let i = 0; i < 6; i++)
            if (f[i][n] == N) return true
        return false
    }

    function makeFieldMove(oldField, n, val) {
        let newField = JSON.parse(JSON.stringify(oldField))
        putIntoField(n, val, newField)
        return newField
    }

    async function getUserMove() {
        input = await terminal.promptNum("Your move [1-7]: ", {min: 1, max: 7}) - 1
        if (!rowFree(input)) {
            terminal.printLine("Field is not free.")
            return getUserMove()
        } else {
            return input
        }
    }

    function getWinner(f=field) {
        for (let player of [X, O]) {

            for (let i = 0; i < 7; i++) {
                let count = 0
                for (let j = 0; j < 6; j++) {
                    if (f[j][i] == player) count++
                    else count = 0

                    if (count == 4)
                        return player
                }
            }

            for (let i = 0; i < 6; i++) {
                let count = 0
                for (let j = 0; j < 7; j++) {
                    if (f[i][j] == player) count++
                    else count = 0

                    if (count == 4)
                        return player
                }
            }

            for (let i = -2; i < 4; i++) {
                let j = i
                let count = 0
                for (let k = 0; k < 6; k++) {
                    if (j < 0 || j > 6) {
                        j++
                        continue
                    }

                    if (f[k][j] == player) count++
                    else count = 0

                    if (count == 4)
                        return player
                    j++
                }
            }

            for (let i = 8; i >= 3; i--) {
                let j = i
                let count = 0
                for (let k = 0; k < 6; k++) {
                    if (j < 0 || j > 6) {
                        j++
                        continue
                    }

                    if (f[k][j] == player) count++
                    else count = 0

                    if (count == 4)
                        return player
                    j--
                }
            }

        }

        return null
    }

    function isDraw(f=field) {
        for (let i = 0; i < 7; i++) { 
            for (let j = 0; j < 6; j++) {
                if (f[j][i] == N) return false
            }
        }
        return true
    }
    
    const possibleWins = [
        // HORIZONTAL
        [[0, 0], [0, 1], [0, 2], [0, 3]],
        [[0, 1], [0, 2], [0, 3], [0, 4]],
        [[0, 2], [0, 3], [0, 4], [0, 5]],
        [[0, 3], [0, 4], [0, 5], [0, 6]],
        [[1, 0], [1, 1], [1, 2], [1, 3]],
        [[1, 1], [1, 2], [1, 3], [1, 4]],
        [[1, 2], [1, 3], [1, 4], [1, 5]],
        [[1, 3], [1, 4], [1, 5], [1, 6]],
        [[2, 0], [2, 1], [2, 2], [2, 3]],
        [[2, 1], [2, 2], [2, 3], [2, 4]],
        [[2, 2], [2, 3], [2, 4], [2, 5]],
        [[2, 3], [2, 4], [2, 5], [2, 6]],
        [[3, 0], [3, 1], [3, 2], [3, 3]],
        [[3, 1], [3, 2], [3, 3], [3, 4]],
        [[3, 2], [3, 3], [3, 4], [3, 5]],
        [[3, 3], [3, 4], [3, 5], [3, 6]],
        [[4, 0], [4, 1], [4, 2], [4, 3]],
        [[4, 1], [4, 2], [4, 3], [4, 4]],
        [[4, 2], [4, 3], [4, 4], [4, 5]],
        [[4, 3], [4, 4], [4, 5], [4, 6]],
        [[5, 0], [5, 1], [5, 2], [5, 3]],
        [[5, 1], [5, 2], [5, 3], [5, 4]],
        [[5, 2], [5, 3], [5, 4], [5, 5]],
        [[5, 3], [5, 4], [5, 5], [5, 6]],

        // VERTICAL
        [[0, 0], [1, 0], [2, 0], [3, 0]],
        [[1, 0], [2, 0], [3, 0], [4, 0]],
        [[2, 0], [3, 0], [4, 0], [5, 0]],
        [[0, 1], [1, 1], [2, 1], [3, 1]],
        [[1, 1], [2, 1], [3, 1], [4, 1]],
        [[2, 1], [3, 1], [4, 1], [5, 1]],
        [[0, 2], [1, 2], [2, 2], [3, 2]],
        [[1, 2], [2, 2], [3, 2], [4, 2]],
        [[2, 2], [3, 2], [4, 2], [5, 2]],
        [[0, 3], [1, 3], [2, 3], [3, 3]],
        [[1, 3], [2, 3], [3, 3], [4, 3]],
        [[2, 3], [3, 3], [4, 3], [5, 3]],
        [[0, 4], [1, 4], [2, 4], [3, 4]],
        [[1, 4], [2, 4], [3, 4], [4, 4]],
        [[2, 4], [3, 4], [4, 4], [5, 4]],
        [[0, 5], [1, 5], [2, 5], [3, 5]],
        [[1, 5], [2, 5], [3, 5], [4, 5]],
        [[2, 5], [3, 5], [4, 5], [5, 5]],
        [[0, 6], [1, 6], [2, 6], [3, 6]],
        [[1, 6], [2, 6], [3, 6], [4, 6]],
        [[2, 6], [3, 6], [4, 6], [5, 6]],

        // DIAGONAL
        [[2, 0], [3, 1], [4, 2], [5, 3]],
        [[1, 0], [2, 1], [3, 2], [4, 3]],
        [[0, 0], [1, 1], [2, 2], [3, 3]],
        [[2, 1], [3, 2], [4, 3], [5, 4]],
        [[1, 1], [2, 2], [3, 3], [4, 4]],
        [[0, 1], [1, 2], [2, 3], [3, 4]],
        [[2, 2], [3, 3], [4, 4], [5, 5]],
        [[1, 2], [2, 3], [3, 4], [4, 5]],
        [[0, 2], [1, 3], [2, 4], [3, 5]],
        [[2, 3], [3, 4], [4, 5], [5, 6]],
        [[1, 3], [2, 4], [3, 5], [4, 6]],
        [[0, 3], [1, 4], [2, 5], [3, 6]],

        [[2, 3], [3, 2], [4, 1], [5, 0]],
        [[1, 3], [2, 2], [3, 1], [4, 0]],
        [[0, 3], [1, 2], [2, 1], [3, 0]],
        [[2, 4], [3, 3], [4, 2], [5, 1]],
        [[1, 4], [2, 3], [3, 2], [4, 1]],
        [[0, 4], [1, 3], [2, 2], [3, 1]],
        [[2, 5], [3, 4], [4, 3], [5, 2]],
        [[1, 5], [2, 4], [3, 3], [4, 2]],
        [[0, 5], [1, 4], [2, 3], [3, 2]],
        [[2, 6], [3, 5], [4, 4], [5, 3]],
        [[1, 6], [2, 5], [3, 4], [4, 3]],
        [[0, 6], [1, 5], [2, 4], [3, 3]],
    ]

    function evaluateField(f=field) {
        let score = 0

        for (let player of [X, O]) {
            let factor = (player == X) ? 1 : -1
            for (let possibleWin of possibleWins) {
                let count = 0
                for (let pos of possibleWin) {
                    if (f[pos[0]][pos[1]] == player) {
                        count++
                    }
                }
                if (count == 4 && player == X) {
                    score += 1000000
                } else if (count == 4 && player == O) {
                    score -= 1000100
                } else if (count == 3) {
                    score += 10 * factor
                } else if (count == 2) {
                    score += 0.1 * factor
                }
            }
        }

        return score
    }

    class Board {

        constructor(field) {
            this.field = field
            this.movingColor = O
            this.lastMoves = []
            this.prevMoveOrder = [3, 4, 2, 5, 0, 6, 1]
        }

        get lastMove() {
            return this.lastMoves[this.lastMoves.length - 1]
        }

        swapColor() {
            this.movingColor = (this.movingColor == X) ? O : X
        }

        makeMove(move) {
            putIntoField(move, this.movingColor, this.field)
            this.swapColor()
            this.lastMoves.push(move)
        }

        unmakeMove(move) {
            popUpper(move, this.field)
            this.swapColor()
            this.lastMoves.pop()
        }

        evaluate() {
            let evaluation = evaluateField(this.field)
            if (this.movingColor == O) evaluation *= -1
            return evaluation
        }

        getBestMove(depth, alpha=-Infinity, beta=Infinity) {
            totalEvaluations++
            let evaluation = this.evaluate()
            if (depth == 0 || Math.abs(evaluation) > 10000) {
                return {
                    move: null,
                    score: evaluation
                }
            }

            let moves = this.prevMoveOrder.filter(m => rowFree(m, this.field))
            let moveEval = Array.from(Array(7), () => -10000000)
            let bestMove = null
            for (let move of moves) {
                this.makeMove(move)
                let score = -this.getBestMove(depth - 1, -beta, -alpha).score
                moveEval[move] = score
                this.unmakeMove(move)
                if (score >= beta) {
                    return {
                        move: null,
                        score: beta
                    }
                }
                if (score > alpha) {
                    alpha = score
                    bestMove = move
                }
            }

            if (DEPTH == depth) {
                this.prevMoveOrder.sort(function(a, b) {
                    return moveEval[a] - moveEval[b]
                })
            }

            return {
                move: bestMove,
                score: alpha
            }
        }

    }

    let totalEvaluations = 0

    while (!isDraw() && !getWinner()) {
        printField()
        let userMove = await getUserMove()
        putIntoField(userMove, X)
        if (isDraw() || getWinner())
            break
        totalEvaluations = 0
        let evaluation = new Board(field).getBestMove(DEPTH)
        let computerMove = evaluation.move
        let moveScore = ~~evaluation.score
        terminal.printLine(`(depth=${DEPTH}, eval=${moveScore})`)
        if (totalEvaluations < 1000)
            DEPTH += 4
        else if (totalEvaluations < 10000)
            DEPTH++
        console.log(totalEvaluations)
        if (computerMove == null) {
            terminal.printLine("The computer resigns. You win!")
            return
        }
        putIntoField(computerMove, O)
    }

    let winner = getWinner()
    printField()
    if (winner) {
        terminal.printLine(`The winner is ${winner}`)
    } else {
        terminal.printLine("It's a draw!")
    }
}, "play a game of 4 in a row (beatable)")

terminal.addFunction("chess", async function() {
    let board = new ChessBoard("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")

    function makeComputerMove() {
        let bestMove = board.calcMove(3)
        if (!bestMove.move) {
            terminal.printLine("Checkmate!")
            return
        }
        board.makeMove(bestMove.move)
    }

    async function getPlayerMove() {
        let inp = await terminal.prompt("Your Move: ")
        if (!/^[abcdefgh][1-8]\-[abcdefgh][1-8]$/.test(inp)) {
            terminal.printLine("Invalid move format!")
            return getPlayerMove()
        }
        let move = Move.fromString(inp)
        if (!board.generateMoves(board.playerColor).find(m => m.equals(move))) {
            terminal.printLine("Illegal move!")
            return getPlayerMove()
        }
        return move
    }

    terminal.printLine("example move: 'd2-d4'")

    while (board.generateMoves(board.movingColor).length != 0) {
        terminal.printLine(board.toNiceString())
        let playerMove = await getPlayerMove()
        board.makeMove(playerMove)
        makeComputerMove()
    }
    
}, "play a game of chess (beatable)")

terminal.addFunction("mill2player", async function() {

    //     #-----------#-----------#
    //     |           |
    //     |   #-------#-------#
    //     |   |       |      
    //     |   |   #---#---#
    //     |   |   |       |
    //     #---#---#       #
    //     |   |   |       |
    //     |   |   #---#---#

    const N = "#", X = "X", O = "O"
    let fields = Array.from(Array(3)).map(() => Array.from(Array(8)).map(() => N))

    let PHASE = 1

    function nextPhase() {
        PHASE++
        terminal.printLine("the game enters the next phase.")
        if (PHASE == 2) {
            terminal.printLine("now you may move your points.")
        } else if (PHASE == 3) {
            terminal.printLine("a player has only 3 stones left: they may jump anywhere now!")
        }
    }

    const lookup = [
        [0, 0], [0, 1], [0, 2], [1, 0],
        [1, 1], [1, 2], [2, 0], [2, 1],
        [2, 2], [0, 7], [1, 7], [2, 7],
        [2, 3], [1, 3], [0, 3], [2, 6],
        [2, 5], [2, 4], [1, 6], [1, 5],
        [1, 4], [0, 6], [0, 5], [0, 4]
    ]

    function getField(n) {
        let [i, j] = lookup[n]
        return fields[i][j]
    }

    function doubleToSingle(a, b) {
        for (let i = 0; i < lookup.length; i++) {
            let look = lookup[i]
            if (look[0] == a && look[1] == b)
                return i
        }
        return -1
    }

    function printField() {
        let lines = "\n"
        lines += "#-----------#-----------#\n"
        lines += "|           |           |\n"
        lines += "|   #-------#-------#   |\n"
        lines += "|   |       |       |   |\n"
        lines += "|   |   #---#---#   |   |\n"
        lines += "|   |   |       |   |   |\n"
        lines += "#---#---#       #---#---#\n"
        lines += "|   |   |       |   |   |\n"
        lines += "|   |   #---#---#   |   |\n"
        lines += "|   |       |       |   |\n"
        lines += "|   #-------#-------#   |\n"
        lines += "|           |           |\n"
        lines += "#-----------#-----------#\n"

        let i = 0
        for (let char of lines) {
            if (char == "#") {
                let val = getField(i)
                if (val == X) terminal.print(X, Color.YELLOW)
                if (val == O) terminal.print(O, Color.BLUE)
                if (val == N) terminal.print(N, Color.rgb(100, 100, 100))
                i++
            } else {
                terminal.print(char)
            }
        }
    }

    function setField(n, val) {
        let [i, j] = lookup[n]
        fields[i][j] = val
    }

    let playerMills = {[X]: [], [O]: []}

    const possibleWins = [
        [[0, 0], [0, 1], [0, 2]],
        [[0, 2], [0, 3], [0, 4]],
        [[0, 4], [0, 5], [0, 6]],
        [[0, 6], [0, 7], [0, 0]],
        [[1, 0], [1, 1], [1, 2]],
        [[1, 2], [1, 3], [1, 4]],
        [[1, 4], [1, 5], [1, 6]],
        [[1, 6], [1, 7], [1, 0]],
        [[2, 0], [2, 1], [2, 2]],
        [[2, 2], [2, 3], [2, 4]],
        [[2, 4], [2, 5], [2, 6]],
        [[2, 6], [2, 7], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 3], [1, 3], [2, 3]],
        [[0, 5], [1, 5], [2, 5]],
        [[0, 7], [1, 7], [2, 7]],
    ]

    function getMills(player) {
        let mills = []
        for (let possibleWin of possibleWins) {
            let count = 0
            for (let i = 0; i < 3; i++) {
                let [j, k] = possibleWin[i]
                if (fields[j][k] == player)
                    count++
            }
            if (count == 3) {
                mills.push(possibleWin)
            }
        }
        return mills
    }

    function possibleMoves(pos) {
        let poses = []
        for (let possibleWin of possibleWins) {
            for (let i = 0; i < 3; i++) {
                let tempPos = doubleToSingle(possibleWin[i][0], possibleWin[i][1])
                if (tempPos == pos) {
                    if (i == 0)
                        poses = poses.concat([
                            doubleToSingle(possibleWin[0][0], possibleWin[0][1]),
                            doubleToSingle(possibleWin[1][0], possibleWin[1][1])
                        ])
                    if (i == 1) 
                        poses = poses.concat([
                            doubleToSingle(possibleWin[0][0], possibleWin[0][1]),
                            doubleToSingle(possibleWin[1][0], possibleWin[1][1]),
                            doubleToSingle(possibleWin[2][0], possibleWin[2][1])
                        ])
                    if (i == 2)
                        poses = poses.concat([
                            doubleToSingle(possibleWin[1][0], possibleWin[1][1]),
                            doubleToSingle(possibleWin[2][0], possibleWin[2][1])
                        ])
                }
            }
        }
        return poses
    }

    function oppositePlayer(player) {
        return (player == X) ? O : X
    }

    function countStones(player) {
        let count = 0
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 8; j++) {
                if (fields[i][j] == player)
                    count++
            }
        }
        return count
    }

    function stoneInMill(stone) {
        let allMills = getMills(X).concat(getMills(O))
            .map(m => m.map(e => doubleToSingle(e[0], e[1]))).flat()
        return allMills.includes(stone)
    }

    async function checkMillSituation(player) {
        let numMills = getMills(player).length
        if (numMills > playerMills[player]) {
            printField()
            let a = await terminal.promptNum(`${player} take one [1-24]: `, {min: 1, max: 24}) - 1
            while (getField(a) != oppositePlayer(player) || stoneInMill(a)) {
                terminal.printLine("field must be of opposite player and not in mill!")
                a = await terminal.promptNum(`${player} take one [1-24]: `, {min: 1, max: 24}) - 1
            }
            setField(a, N)
        }
        playerMills[player] = numMills
    }

    async function playerInput(player, phase=PHASE) {
        if (phase == 1) {
            let a = await terminal.promptNum(`${player} set [1-24]: `, {min: 1, max: 24}) - 1
            if (getField(a) != N) {
                terminal.printLine("field must be free!")
                await playerInput(player)
            }
            setField(a, player)
            await checkMillSituation(player)
        } else if (countStones(player) <= 3) {
            let a = await terminal.promptNum(`${player} move from [1-24]: `, {min: 1, max: 24}) - 1
            let b = await terminal.promptNum(`${player} move to [1-24]: `, {min: 1, max: 24}) - 1
            if (getField(b) != N || getField(a) != player) {
                terminal.printLine("Invalid move!")
                return await playerInput(player)
            }
            let temp = getField(a)
            setField(a, N)
            playerMills[player] = getMills(player).length
            setField(b, temp)
            await checkMillSituation(player)
        } else if (phase > 1) {
            let a = await terminal.promptNum(`${player} move from [1-24]: `, {min: 1, max: 24}) - 1
            let moves = possibleMoves(a)
            if (moves.length == 1) {
                var b = moves[0]
            } else {
                var b = await terminal.promptNum(`${player} move to [1-24]: `, {min: 1, max: 24}) - 1
            }
            if (getField(b) != N || getField(a) != player || !moves.includes(b)) {
                terminal.printLine("Invalid move!")
                return await playerInput(player)
            }
            let temp = getField(a)
            setField(a, N)
            playerMills[player] = getMills(player).length
            setField(b, temp)
            await checkMillSituation(player)
        }
    }

    let playerDecks = {[X]: 9, [O]: 9}

    while (playerDecks[O] > 0) {
        for (let player of [X, O]) {
            printField()
            await playerInput(player)
            playerDecks[player]--
        }
    }

    nextPhase()

    while (countStones(X) >= 3 && countStones(O) >= 3) {
        for (let player of [X, O]) {
            printField()
            await playerInput(player)
        }
    }

    let winner = (countStones(X) > countStones(O)) ? X : O
    terminal.printLine(`the winner is: ${winner}`)

}, "play the mill game with 2 players")

terminal.addCommand("snake", async function(args) {
    const width = 30
    const height = 20
    const speed = 150 / args.s
    const startLength = 10

    const EMPTY = 0
    const SNAKE = 1
    const FOOD = 2
    const WALLY = 3
    const WALLX = 4
    const WALLC1 = 5
    const WALLC2 = 6
    let snake = [[width / 2, height / 2]]
    let direction = [1, 0]
    let snakeAlive = true

    let cells = null
    let foodPos = null
    function updateCells() {
        cells = Array.from({length: height}, () => Array.from({length: width}, () => EMPTY))
        for (let i = 0; i < width; i++) {
            cells[0][i] = WALLX
            cells[height - 1][i] = WALLX
        }
        for (let i = 0; i < height; i++) {
            cells[i][0] = WALLY
            cells[i][width - 1] = WALLY
        }
        cells[0][0] = WALLC1
        cells[0][width - 1] = WALLC2
        cells[height - 1][0] = WALLC1
        cells[height - 1][width - 1] = WALLC2
        for (let [x, y] of snake) {
            cells[y][x] = SNAKE
        }
        if (foodPos != null)
            cells[foodPos[1]][foodPos[0]] = FOOD
        return cells
    }
    updateCells()

    function makeNewFood() {
        let x = Math.floor(Math.random() * width)
        let y = Math.floor(Math.random() * height)
        if (cells[y][x] == EMPTY) {
            return [x, y]
        } else {
            return makeNewFood()
        }
    }
    foodPos = makeNewFood()

    function enlargenSnake() {
        snake.push([...snake[snake.length - 1]])
        foodPos = makeNewFood()
    }

    for (let i = 0; i < startLength; i++) {
        enlargenSnake()
    }

    function updateSnake() {
        if (moves.length > 0) {
            let newDirection = moves.shift()
            if (newDirection[0] != -direction[0] || newDirection[1] != -direction[1]) {
                direction = newDirection
            }
        }
        let newHead = [snake[0][0] + direction[0], snake[0][1] + direction[1]]
        for (let i = snake.length - 1; i >= 0; i--) {
            if (i == 0) {
                snake[i] = newHead
            } else {
                snake[i] = [...snake[i - 1]]
            }
            if (snake[i][0] >= width - 1) snake[i][0] = 1
            if (snake[i][0] <= 0) snake[i][0] = width - 2
            if (snake[i][1] >= height - 1) snake[i][1] = 1
            if (snake[i][1] <= 0) snake[i][1] = height - 2
            if (snake[i][0] == foodPos[0] && snake[i][1] == foodPos[1]) {
                enlargenSnake()
            }
        }
        for (let i = 1; i < snake.length; i++) {
            if (snake[i][0] == snake[0][0] && snake[i][1] == snake[0][1]) {
                snakeAlive = false
            }
        }
    }

    function printCells() {
        let elements = []
        for (let y = 0; y < height; y++) {
            let line = []
            for (let x = 0; x < width; x++) {
                line.push(terminal.print(" "))
            }
            elements.push(line)
            terminal.addLineBreak()
        }
        return elements
    }

    let elements = printCells()

    let moves = []

    function draw() {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let cell = cells[y][x]
                if (cell == EMPTY) {
                    elements[y][x].innerText = ". "
                    elements[y][x].style.color = "var(--foreground)"
                } else if (cell == SNAKE) {
                    elements[y][x].innerText = "# "
                    elements[y][x].style.color = "var(--accent-color-1)"
                } else if (cell == FOOD) {
                    elements[y][x].innerText = "# "
                    elements[y][x].style.color = "var(--accent-color-2)"
                } else if (cell == WALLY) {
                    elements[y][x].innerText = "| "
                    elements[y][x].style.color = "var(--foreground)"
                } else if (cell == WALLX) {
                    elements[y][x].innerText = "--"
                    elements[y][x].style.color = "var(--foreground)"
                } else if (cell == WALLC1) {
                    elements[y][x].innerText = "+-"
                    elements[y][x].style.color = "var(--foreground)"
                } else if (cell == WALLC2) {
                    elements[y][x].innerText = "+ "
                    elements[y][x].style.color = "var(--foreground)"
                }
            }
        }
    }

    function turnSnakeRed() {
        for (let i = 0; i < snake.length; i++) {
            elements[snake[i][1]][snake[i][0]].style.color = "var(--error-color)"
        }
    }

    terminal.printLine("Use the arrow keys to move the snake.")
    terminal.scroll()

    let listener = addEventListener("keydown", function(event) {
        if (event.repeat) return
        if (snakeAlive == false) return
        if (event.key == "ArrowUp") {
            moves.push([0, -1])
            event.preventDefault()
        } else if (event.key == "ArrowDown") {
            moves.push([0, 1])
            event.preventDefault()
        } else if (event.key == "ArrowLeft") {
            moves.push([-1, 0])
            event.preventDefault()
        } else if (event.key == "ArrowRight") {
            moves.push([1, 0])
            event.preventDefault()
        }
    })

    while (snakeAlive) {
        updateCells()
        updateSnake()
        draw()
        await sleep(speed)
    }

    updateCells()
    draw()
    terminal.printLine(`You lost! Your score was ${snake.length - startLength}.`)
    turnSnakeRed()

    removeEventListener("keydown", listener)
}, {
    description: "play snake",
    args: ["?s:n:1~10"],
    standardVals: {s: 2}
})

terminal.addCommand("2048", async function(args) {
     let cells = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    function addRandomCell(tries=0) {
        let x = Math.floor(Math.random() * 4)
        let y = Math.floor(Math.random() * 4)
        if (cells[y][x] == 0) {
            cells[y][x] = 2
        } else if (tries < 1000) {
            // probability of missing in 1000 tries is ~ 9 * 10^(-29)
            // and thus negligible
            addRandomCell(tries + 1)
        } else {
            gameRunning = false
        }
    }

    addRandomCell()
    addRandomCell()

    const cellColors = {
        2: "#6198f3",
        4: "lightgreen",
        8: "yellow",
        16: "orange",
        32: "red",
        64: "purple",
        128: "#f18585",
        256: "cyan",
        512: "lime",
        1024: "magenta",
        2048: "teal"
    }

    let elements = []
    function makeElements() {
        terminal.printLine("  +--------+--------+--------+--------+")
        for (let y = 0; y < 4; y++) {
            terminal.printLine("  |        |        |        |        |")

            let line = []
            for (let x = 0; x < 4; x++) {
                terminal.print("  |  ")
                line.push(terminal.print("    "))
            }
            elements.push(line)

            terminal.printLine("  |")
            terminal.printLine("  |        |        |        |        |")
            terminal.printLine("  +--------+--------+--------+--------+")
        }
    }
    makeElements()

    function draw() {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                let cell = cells[y][x]
                if (cell == 0) {
                    elements[y][x].textContent = "    "
                } else {
                    let text = stringPad(cell, 4)
                    elements[y][x].textContent = text
                }
                elements[y][x].style.color = cellColors[cell] || "white"
            }
        }
        scoreElement.textContent = score
    }

    function cellsCopy() {
        let copy = []
        for (let y = 0; y < 4; y++) {
            let line = []
            for (let x = 0; x < 4; x++) {
                line.push(cells[y][x])
            }
            copy.push(line)
        }
        return copy
    }

    let score = 0

    function shift(d, tempCells) {
        let movedCount = 0
        let countScore = tempCells == undefined
        tempCells ??= cells
        for (let i = 0; i < 4; i++) {
            for (let x = 0; x < 4; x++) {
                for (let y = 0; y < 4; y++) {
                    let newX = x + d[0]
                    let newY = y + d[1]
                    if (Math.max(newX, newY) > 3 || Math.min(newX, newY) < 0)
                        continue
                    if (tempCells[newY][newX] == 0) {
                        tempCells[newY][newX] = tempCells[y][x]
                        tempCells[y][x] = 0
                        movedCount++
                    }
                    if (tempCells[newY][newX] == tempCells[y][x]) {
                        tempCells[newY][newX] *= 2
                        tempCells[y][x] = 0
                        movedCount++
                        if (countScore)
                            score += tempCells[newY][newX]
                    }
                }
            }
        }
        return movedCount
    }

    function checkPossible() {
        let movedCount = 0
        movedCount += shift([1, 0], cellsCopy())
        movedCount += shift([-1, 0], cellsCopy())
        movedCount += shift([0, 1], cellsCopy())
        movedCount += shift([0, -1], cellsCopy())
        return movedCount > 0
    }

    function checkWin() {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (cells[y][x] == 2048) {
                    return true
                }
            }
        }
        return false
    }

    let gameRunning = true

    let listener = addEventListener("keydown", function(event) {
        if (event.repeat) return
        if (gameRunning == false) return
        let combinedCount = 0
        if (event.key == "ArrowUp") {
            combinedCount += shift([0, -1])
            event.preventDefault()
        } else if (event.key == "ArrowDown") {
            combinedCount += shift([0, 1])
            event.preventDefault()
        } else if (event.key == "ArrowLeft") {
            combinedCount += shift([-1, 0])
            event.preventDefault()
        } else if (event.key == "ArrowRight") {
            combinedCount += shift([1, 0])
            event.preventDefault()
        } else if (event.key == "c" && event.ctrlKey) {
            gameRunning = false
            removeEventListener("keydown", listener)
            return
        }
        if (combinedCount > 0) {
            addRandomCell()
        }
        draw()
        if (checkWin())
            gameRunning = false
    })

    terminal.scroll()
    terminal.printLine("  Use the arrow keys to move the tiles.")
    terminal.print("  Your Score: ")
    let scoreElement = terminal.print("0", Color.COLOR_2)
    terminal.addLineBreak()

    while (gameRunning) {
        await sleep(100)
        if (!checkPossible()) {
            gameRunning = false
        }
    }

    removeEventListener("keydown", listener)

    if (checkWin() == false)
        terminal.printLine(`  You lost!`, Color.COLOR_1)
    else
        terminal.printLine(`  You won!`, Color.COLOR_1)
}, {
    description: "play 2048"
})

let secretShip = null
terminal.addCommand("lunar-lander", async function(args) {
    let [canvas, context] = makeNewWindow()
    const windowMiddle = () => new Vector2d(canvas.width / 2, canvas.height / 2)
    const clearWindow = () => context.clearRect(0, 0, canvas.width, canvas.height)

    const KEY = {
        UP_ARROW: "ArrowUp",
        LEFT_ARROW: "ArrowLeft",
        RIGHT_ARROW: "ArrowRight",
        UP: "up",
        DOWN: "down",
    }

    const startTime = Date.now()

    const gravityConstant = 0.00001
    const gravity = new Vector2d(0, gravityConstant)

    class KeyListener {

        constructor() {
            this.keys = {}
            this.onCtrlCCallback = null
            this.onTouchStartCallback = null
            this.onTouchMoveCallback = null
            this.onTouchEndCallback = null

            function pos(event) {
                let rect = canvas.getBoundingClientRect()
                return new Vector2d(event.clientX - rect.left, event.clientY - rect.top)
            }

            this.keyup = addEventListener("keyup", event => {
                this.keys[event.key] = false
            })

            this.keydown = addEventListener("keydown", event => {
                if (Object.values(KEY).includes(event.key))
                    event.preventDefault()

                this.keys[event.key] = true

                if (event.key == "c" && event.ctrlKey) {
                    if (this.onCtrlCCallback != null)
                        this.onCtrlCCallback(event)
                }
            })

            this.touchDown = addEventListener("touchstart", event => {
                if (this.onTouchStartCallback != null) {
                    this.onTouchStartCallback(event, pos(event.touches[0]))
                }
            })

            this.touchMove = addEventListener("touchmove", event => {
                if (this.onTouchMoveCallback != null) {
                    this.onTouchMoveCallback(event, pos(event.touches[0]))
                }
            })

            this.touchUp = addEventListener("touchend", event => {
                if (this.onTouchEndCallback != null) {
                    this.onTouchEndCallback(event)
                    event.preventDefault()
                }
            })

            this.onContextMenu = addEventListener("contextmenu", event => {
                event.preventDefault()
            })

            this.upRules = {}
            this.downRules = {}
        }

        onCtrlC(callback) {
            this.onCtrlCCallback = callback
        }

        onTouchStart(callback) {
            this.onTouchStartCallback = callback
        }

        onTouchMove(callback) {
            this.onTouchMoveCallback = callback
        }

        onTouchEnd(callback) {
            this.onTouchEndCallback = callback
        }

        remove() {
            removeEventListener("keyup", this.keyup)
            removeEventListener("keydown", this.keydown)
            removeEventListener("touchstart", this.touchDown)
            removeEventListener("touchmove", this.touchMove)
            removeEventListener("touchend", this.touchUp)
            removeEventListener("contextmenu", this.onContextMenu)
        }

        isDown(key) {
            return this.keys[key] === true
        }

        isUp(key) {
            return !this.keys[key]
        }

        addRule(key, callback, type=undefined) {
            type ??= KEY.DOWN
            if (type == KEY.DOWN) {
                this.downRules[key] = callback
            } else if (type == KEY.UP) {
                this.upRules[key] = callback
            }
        }

        runRules() {
            for (let key in this.downRules) {
                if (this.isDown(key)) {
                    this.downRules[key]()
                }
            }
            for (let key in this.upRules) {
                if (this.isUp(key)) {
                    this.upRules[key]()
                }
            }
        }

        clearRules() {
            this.downRules = {}
            this.upRules = {}
        }

    }

    class Particle {

        constructor(x, y, ms=1000, color=null, vel) {
            this.pos = new Vector2d(x, y)
            this.velocity = vel ?? new Vector2d(0, 0)
            this.size = 2
            this.prevPos = this.pos.copy()

            this.ms = ms
            this.startTime = Date.now()
            this.c = color ?? {r: 255, g: 255, b: 255}
        }

        get alive() {
            return Date.now() - this.startTime < this.ms
        }

        get color() {
            let alpha = 1 - (Date.now() - this.startTime) / this.ms
            return `rgba(${this.c.r}, ${this.c.g}, ${this.c.b}, ${alpha})`
        }

        get realPos() {
            return this.pos.mul(new Vector2d(canvas.width, canvas.height))
        }

        update(deltaTime, landscape) {
            this.velocity.iadd(gravity.scale(deltaTime))
            this.pos.iadd(this.velocity.scale(deltaTime)
                .div(new Vector2d(canvas.width / canvas.height, 1)))

            if (landscape.checkCollision(this.realPos)) {
                let newAngle = this.velocity.angle + Math.PI
                let surfaceNormal = landscape.getSurfaceNormal(this.pos)
                let angleDiff = surfaceNormal.angle - newAngle
                this.velocity = Vector2d.fromAngle(newAngle)
                    .scale(this.velocity.length)
                    .rotate(-angleDiff * 2)
            } else {
                this.prevPos = this.pos.copy()
            }

        }

        draw(zoomPos) {
            context.fillStyle = this.color
            let pos = zoomPos(this.pos)
            let zoom = 1 / zoomPos("getZoomFactor")
            let size = this.size * zoom
            context.fillRect(pos.x - size / 2, pos.y - size / 2, size, size)
        }

    }

    class Player {

        constructor() {
            this.pos = new Vector2d(0.5, 0.1)
            this.velocity = new Vector2d(0, 0)
            this.startSize = 15
            this.size = this.startSize
            
            this.rotationSpeed = 0.1
            this.rotation = 0

            this.score = 0
            this.crashed = false
            this.particles = []

            this.thrustIncrease = 0.03
            this.thrust = 0
            this.thrustAcceleration = gravityConstant * 2

            this.hasLanded = false
        }

        reset() {
            this.hasLanded = false
            this.crashed = false
            this.pos = new Vector2d(0.5, 0.1)
            this.velocity = new Vector2d(0, 0)
            this.rotation = 0
        }

        get canLand() {
            let landingMaxSpeed = 4
            let landingMaxAngle = Math.PI / 8

            while (this.rotation < 0) this.rotation += Math.PI * 2
            while (this.rotation > Math.PI * 2) this.rotation -= Math.PI * 2
            let angle = (this.rotation > Math.PI) ? (this.rotation - Math.PI * 2) : (this.rotation)
            return this.speedY <= landingMaxSpeed && Math.abs(angle) < landingMaxAngle
        }

        get midPoint() {
            return this.pos.mul(new Vector2d(canvas.width, canvas.height))
        }

        calcScreenPos(zoomPos) {
            return zoomPos(this.pos)
        }

        get speedX() {
            return Math.round(Math.abs(this.velocity.x) * 10000)
        }

        get speedY() {
            return Math.round(Math.abs(this.velocity.y) * 10000)
        }

        get speed() {
            return Math.sqrt(this.speedX ** 2 + this.speedY ** 2)
        }

        get points() {
            let points = [
                new Vector2d(0, -this.size),
                new Vector2d(this.size, this.size),
                new Vector2d(0, this.size / 2),
                new Vector2d(-this.size, this.size)
            ]
            for (let point of points) {
                point.irotate(this.rotation)
                point.iadd(this.midPoint)
            }
            return points
        }

        get flamePoints() {
            let timeDelta = ((Date.now() - startTime) % 200) / 200
            let flameOffset = this.thrust + (Math.sin(timeDelta * Math.PI * 2) + 1) / 2 * 0.3
            let points = [
                new Vector2d(0, this.size / 2 + 1),
                new Vector2d(this.size / 2, this.size / 1.41 + 2),
                new Vector2d(0, this.size * 0.5 + this.size * 2 * flameOffset),
                new Vector2d(-this.size / 2, this.size / 1.41 + 2)
            ]
            for (let point of points) {
                point.irotate(this.rotation)
                point.iadd(this.midPoint)
            }
            return points
        }

        crash() {
            if (this.crashed)
                return
            this.crashed = true
            this.crashTime = Date.now()
            for (let i = 0; i < 1000; i++) {
                let particle = new Particle(this.pos.x, this.pos.y, 3000)
                particle.velocity = Vector2d.random().scale((this.speed + 0.1) * 0.0005 * Math.random())
                this.particles.push(particle)
            }
        }

        spawnThrustParticles() {
            const spawnParticle = () => {
                let angleDiff = (Math.random() - 0.5) * 2 * (Math.PI / 20)
                let particleDirection = Vector2d.fromAngle(
                    this.rotation + Math.PI / 2 + angleDiff)
                const normalSpeed = 0.003
                let particleSpeed = (1 + Math.random()) * normalSpeed + this.velocity.length
                let particle = new Particle(
                    this.pos.x,
                    this.pos.y,
                    3000, {r: 192, g: 105, b: 64},
                    particleDirection.scale(particleSpeed)
                )
                particle.size = 5
                this.particles.push(particle)
            }

            for (let i = 0; i < 10; i++)
            if (Math.random() < this.thrust)
                spawnParticle()
        }

        update(deltaTime, landscape) {
            if (!this.crashed) {
                if (this.thrust > 0) {
                    let direction = Vector2d.fromAngle(this.rotation - Math.PI / 2)
                    this.velocity.iadd(direction
                        .scale(this.thrustAcceleration)
                        .scale(this.thrust))

                    this.spawnThrustParticles()
                }
    
                this.velocity.iadd(gravity.scale(deltaTime))
                this.pos.iadd(this.velocity.scale(deltaTime)
                    .div(new Vector2d(canvas.width / canvas.height, 1)))
            }

            for (let point of this.points) {
                if (landscape.checkPlatform(point) && this.canLand) {
                    this.velocity.x = 0
                    this.velocity.y = -0.003
                    this.hasLanded = true
                    this.score += 10
                    break
                }
                if (landscape.checkCollision(point)) {
                    this.crash()
                    break
                }
            }

            if (this.pos.x < 0) {
                this.pos.x = 0
                this.velocity.x *= -1
            } else if (this.pos.x > 1) {
                this.pos.x = 1
                this.velocity.x *= -1
            } else if (this.pos.y < 0) {
                this.pos.y = 0
                this.velocity.y *= -1
            }

            for (let particle of this.particles) {
                particle.update(deltaTime, landscape)
            }
            this.particles = this.particles.filter(particle => particle.alive)
        }

        draw(zoomPos) {
            function drawPoints(points, color, method) {
                context.fillStyle = color
                context.strokeStyle = color
                context.beginPath()
                context.moveTo(points[0].x, points[0].y)
                for (let i = 0; i < points.length; i++) {
                    let pos = zoomPos(new Vector2d(
                        points[i].x,
                        points[i].y
                    ), true)
                    if (i == 0) context.moveTo(pos.x, pos.y)
                    else context.lineTo(pos.x, pos.y)
                }
                context.closePath()
                context[method]()
            }

            for (let particle of this.particles) {
                particle.draw(zoomPos)
            }

            if (this.crashed)
                return
            drawPoints(this.points, "white", "fill")
            //if (this.thrust > 0)
            //    drawPoints(this.flamePoints, "red", "stroke")
        }

        get screenPos() {
            return this.pos.mul(new Vector2d(canvas.width, canvas.height))
        }

    }

    class Platform {

        constructor(xStart, width) {
            this.xStart = xStart
            this.width = width
        }

        get xEnd() {
            return this.xStart + this.width
        }

    }

    class Landscape {

        generateData() {
            let funcs = []
            const random = () => Math.random()
            for (let i = 0; i < 50; i++) {
                let a = random() * 0.04
                let b = random() * 2
                let c = random() * 2 * Math.PI
                funcs.push((x) => a * Math.sin(b * x + c))
            }

            let data = []
            for (let x = 0; x < canvas.width; x++) {
                let y = 0
                let adjustedX = x / canvas.width * Math.PI * 4
                for (let func of funcs) {
                    let tempY = func(adjustedX)
                    y += tempY
                }
                data.push(y + 0.25)
            }
            return data
        }

        async generatePlatform() {
            let blendData = (xStart, xEnd, height, direction) => {
                for (let x = xStart; x < xEnd; x++) {
                    let xBlend = (x - xStart) / (xEnd - xStart)
                    let yBlend = (Math.sin(xBlend * Math.PI + Math.PI / 2) + 1) / 2
                    let heightDiff = height - this.data[x]
                    this.data[x] += heightDiff * (direction == -1 ? yBlend : 1 - yBlend)
                }
            }

            let xStart = Math.random() * 0.7 + 0.15
            let width = 100 / canvas.width
            let platform = new Platform(xStart, width)
            let platformHeight = Math.max(...this.data.slice(
                Math.floor(platform.xStart * this.data.length),
                Math.floor(platform.xEnd * this.data.length))) + 0.03
            let coordStart = Math.round(xStart * this.data.length)
            let coordEnd = Math.round(platform.xEnd * this.data.length)
            for (let x = coordStart; x < coordEnd; x++) {
                this.data[x] = platformHeight
            }

            let blendDistance = 100
            blendData(coordStart - blendDistance, coordStart, platformHeight, 1)
            blendData(coordEnd, coordEnd + blendDistance, platformHeight, -1)

            this.platform = platform
        }

        async generateValidData() {
            return new Promise(async resolve => {
                let data = this.generateData()
                let generationTries = 0
                while (this.maxAltitude(data) > 0.5 || this.minAltitude(data) < 0) {
                    generationTries++
                    data = this.generateData()
                    if (generationTries % 1 == 0)
                        await sleep(0)
                }
                resolve(data)
            })
        }

        generateSurfaceNormals() {
            let normals = []
            for (let i = 1; i < this.data.length; i++) {
                let diff = this.data[i] - this.data[i - 1]
                let angle = Math.atan(diff * canvas.height)
                normals.push(angle - Math.PI / 2)
            }
            return normals
        }

        async generate() {
            this.data = await this.generateValidData()
            await this.generatePlatform()
            this.surfaceNormals = this.generateSurfaceNormals()
            this.generating = false
        }

        get platformPos() {
            let x = this.platform.xStart * canvas.width + this.platform.width * canvas.width / 2
            let y = (1 - this.data[Math.floor(this.platform.xStart * this.data.length)]) * canvas.height
            return new Vector2d(x, y)
        }

        maxAltitude(data) {
            return Math.max(...(data ?? this.data))
        }

        minAltitude(data) {
            return Math.min(...(data ?? this.data))
        }

        constructor() {
            this.generating = true
            this.platform = null
            this.generate()
        }

        checkCollision(point) {
            let x = point.x / canvas.width * this.data.length
            let y = point.y / canvas.height
            let altitude = this.data[Math.floor(x)]
            return y > (1 - altitude)
        }

        getSurfaceNormal(point) {
            let x = point.x * this.data.length
            let angle = this.surfaceNormals[Math.floor(x)]
            return Vector2d.fromAngle(angle)
        }

        checkPlatform(point) {
            let x = point.x / canvas.width
            let y = point.y / canvas.height
            let platform = this.platform
            return x > platform.xStart && x < platform.xEnd && y > (1 - this.data[Math.floor(platform.xStart * this.data.length)])
        }

        get platformHeight() {
            return this.data[Math.floor(this.platform.xStart * this.data.length)]
        }

        draw(zoomPos) {
            context.fillStyle = "white"
            context.beginPath()
            context.moveTo(0, canvas.height)
            for (let i = 0; i < this.data.length; i++) {
                let pos = zoomPos(new Vector2d(
                    i / this.data.length,
                    1 - this.data[i]
                ))
                context.lineTo(pos.x, pos.y)
            }
            context.lineTo(canvas.width, canvas.height)
            context.closePath()
            context.fill()
        }

    }

    class Game {

        FPS = 30
        running = true

        get deltaMs() {
            return 1000 / this.FPS
        }

        registerKeyEvents() {
            this.keyListener.addRule(KEY.UP_ARROW, () => {
                this.player.thrust = Math.min(this.player.thrust + this.player.thrustIncrease, 1)
            }, KEY.DOWN)

            this.keyListener.addRule(KEY.LEFT_ARROW, () => {
                this.player.rotation -= this.player.rotationSpeed
            }, KEY.DOWN)

            this.keyListener.addRule(KEY.RIGHT_ARROW, () => {
                this.player.rotation += this.player.rotationSpeed
            }, KEY.DOWN)

            this.keyListener.addRule(KEY.UP_ARROW, () => {
                this.player.thrust = 0
            }, KEY.UP)

            this.keyListener.onTouchStart((event, pos) => {
                this.currTouchPos = pos
            })

            this.keyListener.onTouchMove((event, pos) => {
                this.currTouchPos = pos
            })

            this.keyListener.onTouchEnd(() => {
                this.currTouchPos = null
            })
        }

        runTouchHandling() {
            if (this.player.crashed) return

            if (this.currTouchPos == null) {
                this.player.thrust = 0
                return
            }

            this.player.thrust = Math.min(this.player.thrust + this.player.thrustIncrease, 1)

            let playerPos = this.player.calcScreenPos(this.makeZoomPos())
            let angle = playerPos.angleTo(this.currTouchPos)
            this.player.rotation = angle - Math.PI / 2
        }

        drawStats() {
            context.fillStyle = "white"
            context.font = "20px Arial bold"
            context.textAlign = "left"
            let heightPointer = 30
            function drawText(msg) {
                context.fillText(msg, 10, heightPointer)
                heightPointer += 30
            }
            drawText(`use arrow keys or touch`)
            drawText(`score: ${this.player.score}`)
        }
        
        constructor() {
            this.currTouchPos = null
            this.keyListener = new KeyListener()

            this.keyListener.onCtrlC(() => {
                this.running = false
                this.keyListener.remove()
                canvas.remove()
            })

            this.player = new Player()
            secretShip = this.player
            this.landscape = new Landscape()
            this.registerKeyEvents()

            this.zoom = 1

            this.endAnimationLength = 3000
            this.newLandscape = null
        }
        
        makeZoomPos() {
            let zoomFactor = 1 / this.zoom
            let xWidth = zoomFactor
            let yWidth = zoomFactor

            let platformXPos = this.landscape.platform.xStart + this.landscape.platform.width / 2
            let xStart = Math.min(Math.max(0, platformXPos - xWidth / 2), 1 - xWidth)
            let yStart = Math.min(Math.max(0,  this.landscape.platformHeight - yWidth / 2 + 0.1), 1 - yWidth)

            yStart = 1 - yWidth - yStart

            function zoomPos(pos, canvasPos=false) {
                if (pos == "getZoomFactor")
                    return zoomFactor
                if (canvasPos) {
                    pos = new Vector2d(
                        pos.x / canvas.width,
                        pos.y / canvas.height
                    )
                }
                return new Vector2d(
                    (pos.x - xStart) / xWidth * canvas.width,
                    (pos.y - yStart) / yWidth * canvas.height
                )
            }

            return zoomPos
        }

        async update(timeDelta) {
            this.player.update(timeDelta / this.deltaMs, this.landscape)

            let playerPlatformDistance = this.player.screenPos.distance(this.landscape.platformPos)
            let tempZoom = 1 / (playerPlatformDistance / canvas.width * 4)
            let targetZoom = Math.min(Math.max(tempZoom, 1), 2)
            let zoomDiff = targetZoom - this.zoom
            this.zoom += zoomDiff * 0.02

            if (this.player.hasLanded) {
                if (this.newLandscape == null) {
                    this.newLandscape = new Landscape()
                } else if (this.newLandscape.generating == false) {
                    this.player.reset()
                    for (let i = 0; i < this.landscape.data.length; i++) {
                        this.landscape.data[i] = this.newLandscape.data[i]
                        this.zoom += (1 - this.zoom) * 0.01
                        if (i % 5 == 0)
                            await sleep(0)
                    }
                    this.landscape = this.newLandscape
                    this.newLandscape = null
                }
            }
        }

        redraw() {
            clearWindow()

            let zoomPos = this.makeZoomPos()

            this.drawStats()
            this.player.draw(zoomPos)
            this.landscape.draw(zoomPos)
        }

        drawMessage(msg) {
            context.fillStyle = "white"
            context.font = "50px Arial bold"
            context.textAlign = "center"
            context.fillText(msg, canvas.width / 2, canvas.height / 2)
        }

        async run() {
            let prevTime = Date.now()

            while (this.landscape.generating) {
                this.drawMessage("Generating landscape...")
                await sleep(100)
            }

            while (this.running) {
                if (isMobile) {
                    this.runTouchHandling()
                } else {
                    this.keyListener.runRules()
                }

                let timeDelta = Date.now() - prevTime
                prevTime = Date.now()
                this.update(timeDelta)
                this.redraw()

                if (this.player.crashed) {
                    this.drawMessage("Game Over")

                    if (Date.now() - this.player.crashTime > this.endAnimationLength) {
                        this.running = false
                    }
                }

                await sleep(this.deltaMs)
            }

            this.keyListener.remove()
        }

    }

    while (true) {
        let game = new Game()
        await game.run()
    }
    
}, {
    description: "play a classic game of moon-lander"
})

let tetrisGame = null
terminal.addCommand("tetris", async function(args) {

    const pieces = [
        [[0,-2], [0,-1], [0, 0], [ 0, 1]],
        [[0,-1], [0, 0], [0, 1], [-1, 0]],
        [[0,-1], [0, 0], [0, 1], [-1, 1]],
        [[0,-1], [0, 0], [0, 1], [-1,-1]],
        [[0,-1], [0, 0], [-1,1], [-1, 0]],
        [[-1,-1],[0, 0], [-1,0], [ 0, 1]],
        [[-1,-1],[0, 0], [-1,0], [ 0,-1]],
    ].map(p => p.map(s => new Vector2d(s[0], s[1])))

    const pieceType = {
        CUBE: 6
    }

    const pieceColors = [
        Color.hex("FF0000"),
        Color.hex("00FF00"),
        Color.hex("0000FF"),
        Color.hex("FFFF00"),
        Color.hex("FF00FF"),
        Color.hex("00FFFF"),
        Color.hex("88FF88"),
    ]

    const FIELD_HEIGHT = 20
    const FIELD_WIDTH = 10

    class Piece {

        constructor(pieceIndex, game) {
            this.pieceIndex = pieceIndex ?? Math.floor(Math.random() * pieces.length)
            this.relativeCoords = [...pieces[pieceIndex]]
            this.color = pieceColors[pieceIndex]
            this.pos = 0
            this.falling = true
            this.game = game

            this.id = Math.random()
        }

        equals(otherPiece) {
            return this.id == otherPiece.id
        }

        get value() {
            return this.pieceIndex + 1
        }

        get type() {
            return this.pieceIndex
        }

        get coords() {
            return this.relativeCoords.map(c => c.add(this.pos))
        }

        rotate() {
            if (this.type == pieceType.CUBE)
                return

            let prevCoords = this.relativeCoords.map(c => c.copy())
            this.relativeCoords = this.relativeCoords.map(c => new Vector2d(-c.y, c.x))
            if (this.outOfBounds()) {
                this.relativeCoords = prevCoords
            }
        }

        draw() {
            this.coords.forEach(c => {
                if (c.x >= 0 && c.x < FIELD_WIDTH && c.y >= 0 && c.y < FIELD_HEIGHT) {
                    this.game.canvas[c.y][c.x] = this.value
                }
            })
        }

        touchesOtherPiece() {
            for (let pos of this.coords) {
                if (this.game.fieldOccupied(pos, this)) {
                    return true
                }
            }
            return false
        }

        outOfBounds() {
            if (this.touchesOtherPiece()) return true
            return this.coords.some(c => c.x < 0 || c.x >= FIELD_WIDTH || c.y >= FIELD_HEIGHT)
        }

        moveSide(amount) {
            this.pos = this.pos.add(new Vector2d(amount, 0))
            if (this.outOfBounds()) {
                this.pos = this.pos.add(new Vector2d(-amount, 0))
            }
        }

        update() {
            this.pos.y += 1
            if (this.outOfBounds()) {
                this.pos.y -= 1
                this.falling = false
            }
        }

    }

    class TetrisGame {

        firstDraw() {
            this.canvasOutputs = []
            this.nextPieceOutputs = []
            this.holdPieceOutputs = []
            this.scoreOutput = null
            terminal.printLine("+" + "-".repeat(FIELD_WIDTH * 2) + "+")
            for (let i = 0; i < FIELD_HEIGHT; i++) {
                let outputRow = []
                terminal.print("|")
                for (let j = 0; j < FIELD_WIDTH; j++) {
                    let element = terminal.print("  ")
                    outputRow.push(element)
                    element.style.transition = "none"
                }
                terminal.print("|")
                this.canvasOutputs.push(outputRow)

                const printPiecePart = output => {
                    terminal.print("   |")
                    let line = []
                    for (let i = 0; i < 3; i++) {
                        line.push(terminal.print("  "))
                        line[i].style.transition = "none"
                    }
                    terminal.print("|")
                    output.push(line)
                }

                if (i == 0) terminal.print("   +-Next-+")
                if (i > 0 && i < 5) printPiecePart(this.nextPieceOutputs)
                if (i == 5) terminal.print("   +------+")

                if (i == 7) terminal.print("   +-Hold-+")
                if (i > 7 && i < 12) printPiecePart(this.holdPieceOutputs)
                if (i == 12) terminal.print("   +------+")

                if (i == 14) {
                    terminal.print("   Score: ")
                    this.scoreOutput = terminal.print("0")
                }

                terminal.addLineBreak()
            }
            terminal.printLine("+" + "-".repeat(FIELD_WIDTH * 2) + "+")
        }

        clearCanvas() {
            this.canvas = Array.from({length: FIELD_HEIGHT}, () => Array.from({length: FIELD_WIDTH}, () => 0))
        }

        drawPixel(pos, value) {
            if (pos.x < 0 || pos.x >= FIELD_WIDTH || pos.y < 0 || pos.y >= FIELD_HEIGHT)
                return

            let realPos = pos.mul(new Vector2d(1, 1))

            let color = "rgba(0, 0, 0, 0)"
            if (value != 0) {
                color = pieceColors[value - 1]
            }

            this.canvasOutputs[realPos.y][realPos.x].style.backgroundColor = color
        }

        constructor() {
            this.running = true
            this.intervalTime = 500

            this.canvasOutputs = null
            this.firstDraw()

            this.canvas = null
            this.clearCanvas()

            this.pieces = []
            this.pieceQueue = this.makeShuffledPieces()

            this.holdPieceIndex = null

            this.score = 0
        }

        makeShuffledPieces() {
            let tempPieces = Array.from({length: pieces.length}, (_, i) => i)
            tempPieces.sort(() => Math.random() - 0.5)
            return tempPieces
        }

        get currFallingPiece() {
            return this.pieces.find(p => p.falling)
        }

        anyPieceFalling() {
            return this.pieces.some(p => p.falling)
        }

        update() {
            for (let piece of this.pieces)
                piece.update()
            if (!this.anyPieceFalling()) {
                if (this.pieceQueue.length < 2) {
                    this.pieceQueue = this.makeShuffledPieces()
                }
                this.spawnPiece(this.pieceQueue.shift())
            }

            this.checkLines()
        }

        removeLine(lineIndex) {
            this.pieces.forEach(p => {
                for (let i = 0; i < p.relativeCoords.length; i++) {
                    let relativeCoord = p.relativeCoords[i]
                    let coord = relativeCoord.add(p.pos)
                    if (coord.y == lineIndex) {
                        p.relativeCoords.splice(i, 1)
                        i--
                    } else if (coord.y < lineIndex) {
                        p.relativeCoords[i] = relativeCoord.add(new Vector2d(0, 1))
                    }
                }
            })
        }

        checkLines() {
            for (let y = 0; y < FIELD_HEIGHT; y++) {
                let line = this.canvas[y]
                if (line.every(v => v != 0)) {
                    this.removeLine(y)
                    this.score += 1
                }
            }
        }

        fieldOccupied(pos, ignorePiece) {
            for (let piece of this.pieces) {
                if (piece.equals(ignorePiece))
                    continue
                if (piece.coords.some(c => c.equals(pos)))
                    return true
            }
            return false
        }

        spawnPiece(typeIndex) {
            let piece = new Piece(typeIndex, this)
            piece.pos = new Vector2d(Math.floor(FIELD_WIDTH / 2), 0)
            let rotations = Math.floor(Math.random() * 4)
            for (let i = 0; i < rotations; i++)
                piece.rotate()
            this.pieces.push(piece)
            if (piece.touchesOtherPiece())
                this.running = false
        }

        drawSidepanel(pieceIndex, outputArray) {
            if (pieceIndex === undefined || pieceIndex === null) return

            let piece = new Piece(pieceIndex, this)

            for (let i = 0; i < outputArray.length; i++) {
                for (let j = 0; j < outputArray[i].length; j++) {
                    outputArray[i][j].style.backgroundColor = "rgba(0, 0, 0, 0)"
                    let x = j - 1
                    let y = i - 2
                    if (piece.relativeCoords.some(c => c.x == x && c.y == y)) {
                        outputArray[i][j].style.backgroundColor = pieceColors[piece.pieceIndex]
                    }
                }
            }
        }

        hold() {
            if (this.holdPieceIndex === null) {
                this.holdPieceIndex = this.currFallingPiece.pieceIndex
                this.pieces.splice(this.pieces.indexOf(this.currFallingPiece), 1)
                return
            } else {
                let temp = this.currFallingPiece.pieceIndex
                this.pieces.splice(this.pieces.indexOf(this.currFallingPiece), 1)
                this.spawnPiece(this.holdPieceIndex)
                this.holdPieceIndex = temp
            }
        }

        draw() {
            this.clearCanvas()
            for (let piece of this.pieces)
                piece.draw(this)
            for (let i = 0; i < FIELD_HEIGHT; i++) {
                for (let j = 0; j < FIELD_WIDTH; j++) {
                    let value = this.canvas[i][j]
                    this.drawPixel(new Vector2d(j, i), value)
                }
            }

            this.drawSidepanel(this.pieceQueue[0], this.nextPieceOutputs)
            this.drawSidepanel(this.holdPieceIndex, this.holdPieceOutputs)

            this.scoreOutput.textContent = this.score
        }

    }

    let game = new TetrisGame()

    let keyListener = addEventListener("keydown", (e) => {
        if (game.running == false)
            return

        if (e.key == "c" && e.ctrlKey) {
            removeEventListener("keydown", keyListener)
            game.running = false
        }

        if (game.anyPieceFalling() == false)
            return
        if (e.key == "ArrowLeft") {
            game.currFallingPiece.moveSide(-1)
            game.draw()
        } else if (e.key == "ArrowRight") {
            game.currFallingPiece.moveSide(1)
            game.draw()
        } else if (e.key == "ArrowDown") {
            game.update()
            game.draw()
            e.preventDefault()
        } else if (e.key == "ArrowUp") {
            game.currFallingPiece.rotate()
            game.draw()
            e.preventDefault()
        } else if (e.key == "h") {
            game.hold()
            game.draw()
            e.preventDefault()
        }
    })

    terminal.scroll()
    tetrisGame = game
    while (game.running) {
        game.update()
        game.draw()
        await sleep(game.intervalTime)
    }

    terminal.printLine(`Game over! Your score was ${game.score}`)

}, {
    description: "play a classic game of tetris"
})

terminal.addCommand("number-guess", async function(args) {
    terminal.printLine("i'm thinking of a random number. can you guess it?")
    let number = Math.floor(Math.random() * 1000) + 1
    let tries = 0
    while (true) {
        let guess = await terminal.promptNum("guess: ", {lineEnd: false})
        tries++
        if (guess == number) {
            break
        }
        if (guess < number) {
            terminal.printLine(`too low! (n > ${guess})`)
        }
        if (guess > number) {
            terminal.printLine(`too high! (n < ${guess})`)
        }
    }
    terminal.printLine(`you got it! it took you ${tries} tries`)    
}, {
    description: "guess a random number"
})

terminal.addCommand("stacker", async function(args) {
    const GAME_SIZE = new Vector2d(26, 10)
    const towerOffset = 3

    let towerWidth = 12

    const firstPrint = () => {
        let outputs = []
        for (let i = 0; i < GAME_SIZE.y; i++) {
            let line = []
            for (let j = 0; j < GAME_SIZE.x; j++) {
                let output = terminal.print(" ")
                line.push(output)
            }
            outputs.push(line)
            terminal.addLineBreak()
        }
        return outputs
    }

    terminal.printLine("press SPACE to place block")
    let outputs = firstPrint()

    const drawTowerLine = (lineIndex, towerWidth) => {
        let startX = Math.floor(GAME_SIZE.x / 2 - towerWidth / 2)
        for (let i = 0; i < towerWidth; i++) {
            outputs[lineIndex][startX + i].textContent = "#"
        }
    }

    for (let i = towerOffset; i < outputs.length; i++) {
        drawTowerLine(i, towerWidth)
    }

    const moveDown = () => {
        for (let i = outputs.length - 1; i >= 0; i--) {
            let prevLine = ""
            if (i > 0) {
                for (let j = 0; j < outputs[i - 1].length; j++) {
                    prevLine += outputs[i - 1][j].textContent
                }
            } else {
                prevLine = " ".repeat(outputs.length)
            }
            
            for (let j = 0; j < outputs[i].length; j++) {
                outputs[i][j].textContent = prevLine[j]
            }
        }
    }

    let scrollPos = 0
    let scrollDirection = 1

    const clearScrollPiece = () => {
        let scrollLine = towerOffset - 1
        for (let i = 0; i < outputs[scrollLine].length; i++) {
            outputs[scrollLine][i].textContent = " "
        }
    }

    const drawScrollPiece = () => {
        let scrollLine = towerOffset - 1
        clearScrollPiece()
        for (let i = scrollPos; i < scrollPos + towerWidth; i++) {
            if (i < 0 || i > outputs[scrollLine].length - 1)
                continue
            outputs[scrollLine][i].textContent = "#"
        }
    }

    let score = 0

    const dropPiece = () => {
        let scrollLine = towerOffset - 1
        towerWidth = 0
        for (let i = 0; i < outputs[scrollLine].length; i++) {
            if (outputs[scrollLine][i].textContent != "#")
                continue
            
            if (outputs[scrollLine + 1][i].textContent == "#") {
                towerWidth++
            } else {
                outputs[scrollLine][i].textContent = " "
            }
        }
        if (towerWidth > 0) {
            score++
        } else {
            gameRunning = false
            return
        }

        moveDown()
        update()
    }

    const update = () => {
        if (scrollPos + towerWidth >= GAME_SIZE.x)
            scrollDirection = -1
        if (scrollPos <= 0)
            scrollDirection = 1
        
        scrollPos += scrollDirection

        drawScrollPiece()
    }

    let gameRunning = true

    let keyListener = addEventListener("keydown", (e) => {
        if (gameRunning == false)
            return

        if (e.key == "c" && e.ctrlKey) {
            removeEventListener("keydown", keyListener)
            gameRunning = false
        }

        if (e.key == " ") {
            dropPiece()
        }
    })

    terminal.scroll()
    while (gameRunning) {
        update()
        await sleep(100 - Math.min(score, 15) * 5)
    }

    terminal.printLine(`Game over! Your score: ${score}`)

}, {
    description: "play a stacker game"
}) 
