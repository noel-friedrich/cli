{
    let FRAME = "", FRAMES = []
    FRAME  = "     ooOOOO\n"
    FRAME += "    oo      _____\n"
    FRAME += "   _I__n_n__||_|| ________\n"
    FRAME += " >(_________|_7_|-|_NOEL_|\n"
    FRAME += "  /o ()()-()() o   oo  oo"
    FRAMES.push(FRAME)

    FRAME =  "     oo OO OO\n"
    FRAME += "    oo      _____\n"
    FRAME += "   _I__n_n__||_|| ________\n"
    FRAME += " >(_________|_7_|-|_NOEL_|\n"
    FRAME += "  /o ()-()()() o   oo  oo"
    FRAMES.push(FRAME)

    FRAME =  "     oo O O O O\n"
    FRAME += "    oo      _____\n"
    FRAME += "   _I__n_n__||_|| ________\n"
    FRAME += " >(_________|_7_|-|_NOEL_|\n"
    FRAME += "  /o ()()-()() o   oo  oo"
    FRAMES.push(FRAME)

    FRAME =  "      o o o  OO O O\n"
    FRAME += "    o       _____\n"
    FRAME += "   _I__n_n__||_|| ________\n"
    FRAME += " >(_________|_7_|-|_NOEL_|\n"
    FRAME += "  /o ()()()-() o   oo  oo"
    FRAMES.push(FRAME)

    FRAME =  "     ooOOOO  o  O \n"
    FRAME += "    oo      _____\n"
    FRAME += "   _I__n_n__||_|| ________\n"
    FRAME += " >(_________|_7_|-|_NOEL_|\n"
    FRAME += "  /o ()()-()() o   oo  oo"
    FRAMES.push(FRAME)
    

    async function STEAM_LOCOMOTIVE_FUNC(rawArgs, funcInfo) {
        const [CANVAS, CONTEXT] = makeNewWindow()
    
        function drawText(x, y, text, color="#348d36") {
            CONTEXT.fillStyle = "black"
            CONTEXT.clearRect(x - 1, y - 1, CHARWIDTH + 1, 22)
            CONTEXT.fillStyle = color
            CONTEXT.fillText(text, x, y)
        }

        function CHARWIDTH() {
            return CONTEXT.measureText("A").width * 1.8
        }

        function drawTrain(x, frameIndex) {
            let frame = FRAMES[frameIndex]
            let currY = CANVAS.height / 2 - 50
            for (let line of frame.split("\n")) {
                drawText(x, currY, line, Color.WHITE)
                currY += 20
            }
        }
    
        let currFrame = 0
        addEventListener("keydown", function(e) {
            if (e.ctrlKey && e.key == "c") {
                CANVAS.remove()
            }
        })
        for (let x = CANVAS.width; x > -300; x -= CHARWIDTH()) {
            CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height)
            drawTrain(x, currFrame)
            currFrame = (currFrame + 1) % FRAMES.length
            await sleep(30)
        }
        CANVAS.remove()
    
    }
    
    terminal.addFunction("sl", STEAM_LOCOMOTIVE_FUNC, "steam locomotive")
    terminal.addFunction("LS", STEAM_LOCOMOTIVE_FUNC, "alias for 'sl'")
}
