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

terminal.addFunction("4inarow", async function() {
    const N = " ", X = "X", O = "O"
    let field = Array.from(Array(6)).map(() => Array(7).fill(N))

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
        }

        swapColor() {
            this.movingColor = (this.movingColor == X) ? O : X
        }

        makeMove(move) {
            putIntoField(move, this.movingColor, this.field)
            this.swapColor()
        }

        unmakeMove(move) {
            popUpper(move, this.field)
            this.swapColor()
        }

        evaluate() {
            let evaluation = evaluateField(this.field)
            if (this.movingColor == O) evaluation *= -1
            return evaluation
        }

        getBestMove(depth) {
            totalEvaluations++
            let evaluation = this.evaluate()
            if (depth == 0 || Math.abs(evaluation) > 10000) {
                return {
                    move: null,
                    score: evaluation
                }
            }
            let moves = [0, 1, 2, 3, 4, 5, 6].filter(m => {
                return rowFree(m, this.field)
            })
            let alpha = -Infinity
            let bestMove = null
            for (let move of moves) {
                this.makeMove(move)
                let score = -this.getBestMove(depth - 1).score
                this.unmakeMove(move)
                if (score > alpha) {
                    alpha = score
                    bestMove = move
                }
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
        let computerMove = new Board(field).getBestMove(5).move
        if (computerMove == null) {
            throw new Error("the computer couldn't decide...")
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
        // lines += "#-------------#-------------#"
        // lines += "|             |             |"
        // lines += "|    #--------#----------#   |"
        // lines += "|    |        |          |   |"
        // lines += "|    |    #----#----#    |   |"
        // lines += "|    |    |         |    |   |"
        // lines += "#----#----#         #----#----#"
        // lines += "|    |    |         |   |   |"
        // lines += "|    |    #----#----#   |   |"
        // lines += "|    |        |         |   |"
        // lines += "|    #--------#---------#   |"
        // lines += "|             |            |"
        // lines += "#-------------#------------#"

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
