async function playMelody(notes, destination=null) {
    for (let i = 0; i < notes.length; i++) {
        let [f, t] = notes[i]
        let ms = 256000 / (Math.abs(t) * 100)
        if (t < 0) ms *= 1.5
        playFrequency(f, ms, 0.5, destination)
        await sleep(ms)
    }
}

{
    const STAR_WARS_TUNES = [
        [659, 4], [659, 4], [659, 4], [523, 8], [0, 16],
        [783, 16], [659, 4], [523, 8], [0, 16], [783, 16],
        [659, 4], [0, 4], [987, 4], [987, 4], [987, 4],
        [1046, 8], [0, 16], [783, 16], [622, 4], [523, 8],
        [0, 16], [783, 16], [659, 4]
    ]

    const FAVORITE_SONG_TUNES = [
        [587, -6.0], [659, -6.0], [440, 6.0], [659, -6.0], [740, -6.0], 
        [880, 24.0], [784, 24.0], [740, 12.0], [587, -6.0], [659, -6.0], 
        [440, 3.0], [440, 24.0], [440, 24.0], [494, 24.0], [587, 12.0], 
        [587, 24.0], [587, -6.0], [659, -6.0], [440, 6.0], [659, -6.0], 
        [740, -6.0], [880, 24.0], [784, 24.0], [740, 12.0], [587, -6.0], 
        [659, -6.0], [440, 3.0], [440, 24.0], [440, 24.0], [494, 24.0], 
        [587, 12.0], [587, 24.0], [0, 6.0], [494, 12.0], [554, 12.0], 
        [587, 12.0], [587, 12.0], [659, 12.0], [554, -12.0], [494, 24.0], 
        [440, 3.0], [0, 6.0], [0, 12.0], [494, 12.0], [494, 12.0], [554, 
        12.0], [587, 12.0], [494, 6.0], [440, 12.0], [880, 12.0], [0, 
        12.0], [880, 12.0], [659, -6.0], [0, 6.0], [494, 12.0], [494, 
        12.0], [554, 12.0], [587, 12.0], [494, 12.0], [587, 12.0], [659, 
        12.0], [0, 12.0], [0, 12.0], [554, 12.0], [494, 12.0], [440, 
        -6.0], [0, 6.0], [0, 12.0], [494, 12.0], [494, 12.0], [554, 12.0], 
        [587, 12.0], [494, 12.0], [440, 6.0], [659, 12.0], [659, 12.0], 
        [659, 12.0], [740, 12.0], [659, 6.0], [0, 6.0], [587, 3.0], [659, 
        12.0], [740, 12.0], [587, 12.0], [659, 12.0], [659, 12.0], [659, 
        12.0], [740, 12.0], [659, 6.0], [440, 6.0], [0, 3.0], [494, 12.0], 
        [554, 12.0], [587, 12.0], [494, 12.0], [0, 12.0], [659, 12.0], 
        [740, 12.0], [659, -6.0], [440, 24.0], [494, 24.0], [587, 24.0], 
        [494, 24.0], [740, -12.0], [740, -12.0], [659, -6.0], [440, 24.0], 
        [494, 24.0], [587, 24.0], [494, 24.0], [659, -12.0], [659, -12.0], 
        [587, -12.0], [554, 24.0], [494, -12.0], [440, 24.0], [494, 24.0], 
        [587, 24.0], [494, 24.0], [587, 6.0], [659, 12.0], [554, -12.0], 
        [494, 24.0], [440, 12.0], [440, 12.0], [440, 12.0], [659, 6.0], 
        [587, 3.0], [440, 24.0], [494, 24.0], [587, 24.0], [494, 24.0], 
        [740, -12.0], [740, -12.0], [659, -6.0], [440, 24.0], [494, 24.0], 
        [587, 24.0], [494, 24.0], [880, 6.0], [554, 12.0], [587, -12.0], 
        [554, 24.0], [494, 12.0], [440, 24.0], [494, 24.0], [587, 24.0], 
        [494, 24.0], [587, 6.0], [659, 12.0], [554, -12.0], [494, 24.0], 
        [440, 6.0], [440, 12.0], [659, 6.0], [587, 3.0], [0, 6.0], [0, 
        12.0], [494, 12.0], [587, 12.0], [494, 12.0], [587, 12.0], [659, 
        6.0], [0, 12.0], [0, 12.0], [554, 12.0], [494, 12.0], [440, -6.0], 
        [0, 6.0], [0, 12.0], [494, 12.0], [494, 12.0], [554, 12.0], [587, 
        12.0], [494, 12.0], [440, 6.0], [0, 12.0], [880, 12.0], [880, 
        12.0], [659, 12.0], [740, 12.0], [659, 12.0], [587, 12.0], [0, 
        12.0], [440, 12.0], [494, 12.0], [554, 12.0], [587, 12.0], [494, 
        12.0], [0, 12.0], [554, 12.0], [494, 12.0], [440, -6.0], [0, 
        6.0], [494, 12.0], [494, 12.0], [554, 12.0], [587, 12.0], [494, 
        12.0], [440, 6.0], [0, 12.0], [0, 12.0], [659, 12.0], [659, 12.0], 
        [740, 6.0], [659, -6.0], [587, 3.0], [587, 12.0], [659, 12.0], 
        [740, 12.0], [659, 6.0], [659, 12.0], [659, 12.0], [740, 12.0], 
        [659, 12.0], [440, 12.0], [440, 6.0], [0, -6.0], [440, 12.0], 
        [494, 12.0], [554, 12.0], [587, 12.0], [494, 12.0], [0, 12.0], 
        [659, 12.0], [740, 12.0], [659, -6.0], [440, 24.0], [494, 24.0], 
        [587, 24.0], [494, 24.0], [740, -12.0], [740, -12.0], [659, -6.0], 
        [440, 24.0], [494, 24.0], [587, 24.0], [494, 24.0], [659, -12.0], 
        [659, -12.0], [587, -12.0], [554, 24.0], [494, 12.0], [440, 24.0], 
        [494, 24.0], [587, 24.0], [494, 24.0], [587, 6.0], [659, 12.0], 
        [554, -12.0], [494, 24.0], [440, 6.0], [440, 12.0], [659, 6.0], 
        [587, 3.0], [440, 24.0], [494, 24.0], [587, 24.0], [494, 24.0], 
        [740, -12.0], [740, -12.0], [659, -6.0], [440, 24.0], [494, 24.0], 
        [587, 24.0], [494, 24.0], [880, 6.0], [554, 12.0], [587, -12.0], 
        [554, 24.0], [494, 12.0], [440, 24.0], [494, 24.0], [587, 24.0], 
        [494, 24.0], [587, 6.0], [659, 12.0], [554, -12.0], [494, 24.0], 
        [440, 6.0], [440, 12.0], [659, 6.0], [587, 3.0], [440, 24.0], 
        [494, 24.0], [587, 24.0], [494, 24.0], [740, -12.0], [740, -12.0], 
        [659, -6.0], [440, 24.0], [494, 24.0], [587, 24.0], [494, 24.0], 
        [880, 6.0], [554, 12.0], [587, -12.0], [554, 24.0], [494, 12.0], 
        [440, 24.0], [494, 24.0], [587, 24.0], [494, 24.0], [587, 6.0], 
        [659, 12.0], [554, -12.0], [494, 24.0], [440, 6.0], [440, 12.0], 
        [659, 6.0], [587, 3.0], [440, 24.0], [494, 24.0], [587, 24.0], 
        [494, 24.0], [740, -12.0], [740, -12.0], [659, -6.0], [440, 24.0], 
        [494, 24.0], [587, 24.0], [494, 24.0], [880, 6.0], [554, 12.0], 
        [587, -12.0], [554, 24.0], [494, 12.0], [440, 24.0], [494, 24.0], 
        [587, 24.0], [494, 24.0], [587, 6.0], [659, 12.0], [554, -12.0], 
        [494, 24.0], [440, 6.0], [440, 12.0], [659, 6.0], [587, 3.0], 
        [0, 6.0]
    ]

    const FREQUENCY_TEST_TUNES = [
        [1.0, 32], [1.0512710963760241, 32], [1.1051709180756477, 32], 
        [1.161834242728283, 32], [1.2214027581601699, 32], [1.2840254166877414, 
        32], [1.3498588075760032, 32], [1.4190675485932571, 32], [1.4918246976412703, 
        32], [1.5683121854901687, 32], [1.648721270700128, 32], [1.733253017867395, 
        32], [1.8221188003905089, 32], [1.9155408290138962, 32], [2.0137527074704766, 
        32], [2.117000016612675, 32], [2.225540928492468, 32], [2.339646851925991, 
        32], [2.4596031111569503, 32], [2.585709659315847, 32], [2.718281828459046, 
        32], [2.8576511180631647, 32], [3.004166023946434, 32], [3.158192909689769, 
        32], [3.320116922736549, 32], [3.4903429574618428, 32], [3.669296667619246, 
        32], [3.8574255306969762, 32], [4.055199966844677, 32], [4.26311451516882, 
        32], [4.481689070338068, 32], [4.711470182590745, 32], [4.9530324243951185, 
        32], [5.206979827179853, 32], [5.473947391727204, 32], [5.754602676005735, 
        32], [6.049647464412952, 32], [6.359819522601838, 32], [6.6858944422792765, 
        32], [7.028687580589301, 32], [7.389056098930657, 32], [7.767901106306778, 
        32], [8.166169912567655, 32], [8.584858397177896, 32], [9.025013499434122, 
        32], [9.487735836358526, 32], [9.974182454814718, 32], [10.48556972472757, 
        32], [11.023176380641596, 32], [11.58834671922338, 32], [12.182493960703463, 
        32], [12.807103782663019, 32], [13.463738035001674, 32], [14.154038645375783, 
        32], [14.87973172487281, 32], [15.642631884188145, 32], [16.444646771097016, 
        32], [17.287781840567604, 32], [18.174145369443018, 32], [19.1059537282316, 
        32], [20.085536923187615, 32], [21.115344422540552, 32], [22.197951281441565, 
        32], [23.33606458094264, 32], [24.532530197109267, 32], [25.79033991719297, 
        32], [27.112638920657787, 32], [28.50273364376717, 32], [29.96410004739689, 
        32], [31.5003923087478, 32], [33.11545195869217, 32], [34.81331748760186, 
        32], [36.59823444367781, 32], [38.47466604903193, 32], [40.44730436006718, 
        32], [42.521082000062556, 32], [44.70118449330058, 32], [46.993063231579015, 
        32], [49.40244910552988, 32], [51.93536683483112, 32], [54.5981500331439, 
        32], [57.39745704544583, 32], [60.34028759736157, 32], [63.434000298122896, 
        32], [66.68633104092468, 32], [70.10541234668736, 32], [73.69979369959526, 
        32], [77.47846292526029, 32], [81.4508686649675, 32], [85.6269440021999, 
        32], [90.0171313005211, 32], [94.63240831492331, 32], [99.48431564193298, 
        32], [104.5849855771133, 32], [109.94717245212254, 32], [115.58428452718663, 
        32], [121.51041751873377, 32], [127.74038984602768, 32], [134.28977968493422, 
        32], [141.1749639214755, 32], [148.41315910257515, 32], [156.02246448639346, 
        32], [164.02190729990008, 32], [172.43149031685252, 32], [181.2722418751493, 
        32], [190.56626845862797, 32], [200.3368099747895, 32], [210.60829786667213, 
        32], [221.4064162041846, 32], [232.75816590765942, 32], [244.69193226421757, 
        32], [257.2375559057718, 32], [270.4264074261494, 32], [284.2914658239174, 
        32], [298.8674009670566, 32], [314.1906602856903, 32], [330.2995599096445, 
        32], [347.23438047873015, 32], [365.03746786532406, 32], [383.7533390611068, 
        32], [403.42879349272977, 32], [424.11303004475855, 32], [445.85777008251085, 
        32], [468.71738678241036, 32], [492.74904109324933, 32], [518.0128246683347, 
        32], [544.5719101259212, 32], [572.4927090136626, 32], [601.8450378720731, 
        32], [632.702292812244, 32], [665.1416330443518, 32], [699.2441738158747, 
        32], [735.0951892419615, 32], [772.7843255351377, 32], [812.4058251675302, 
        32], [854.0587625261379, 32], [897.8472916504032, 32], [943.880906671563, 
        32], [992.2747156050095, 32], [1043.1497281802856, 32], [1096.63315842844, 
        32], [1152.8587427833681, 32], [1211.9670744925559, 32], [1274.1059551734313, 
        32], [1339.4307643943944, 32], [1408.1048482046706, 32], [1480.2999275845186, 
        32], [1556.1965278371256, 32], [1635.9844299958966, 32], [1719.8631453758908, 
        32], [1808.0424144560295, 32], [1900.7427313395435, 32], [1998.19589510408, 
        32], [2100.6455894201367, 32], [2208.347991887166, 32], [2321.5724146110115, 
        32], [2440.601977624451, 32], [2565.7343168347484, 32], [2697.282328268455, 
        32], [2835.5749504744526, 32], [2980.9579870416674, 32], [3133.7949712881586, 
        32], [3294.4680752837758, 32], [3463.379065479387, 32], [3640.9503073322876, 
        32], [3827.625821439838, 32], [4023.872393822241, 32], [4230.180743130727, 
        32], [4447.066747699787, 32], [4675.072735511718, 32], [4914.768840299064, 
        32], [5166.754427175922, 32], [5431.659591362911, 32], [5710.146733753438, 
        32], [6002.912217260954, 32], [6310.688108088957, 32], [6634.24400627782, 
        32], [6974.388970105754, 32], [7331.973539155931, 32], [7707.891861108457, 
        32], [8103.083927575326, 32], [8518.537924569058, 32], [8955.29270348246, 
        32], [9414.440378758221, 32], [9897.129058743874, 32], [10404.565716560686, 
        32], [10938.019208165153, 32], [11498.8234451498, 32], [12088.380730216968, 
        32], [12708.165263666002, 32], [13359.726829661873, 32], [14044.69467150283, 
        32], [14764.781565577294, 32], [15521.788104196961, 32], [16317.60719801548, 
        32], [17154.228809291046, 32], [18033.74492782859, 32], [18958.354802043938, 
        32], [19930.370438230402, 32], [20952.22238177879, 32]
    ]

    function makeMelodyFile(tunes) {
        let content = JSON.stringify(tunes)
        let file = new FileElement(FileType.MELODY, content, {})
        return file
    }

    MELODIES_FOLDER.content["star-wars.melody"] = makeMelodyFile(STAR_WARS_TUNES)
    MELODIES_FOLDER.content["favorite-song.melody"] = makeMelodyFile(FAVORITE_SONG_TUNES)
    MELODIES_FOLDER.content["frequencies.melody"] = makeMelodyFile(FREQUENCY_TEST_TUNES)

    terminal.addFunction("play", async function(rawArgs) {
        let parsedArgs = parseArgs(rawArgs)
        if (parsedArgs.length != 1) {
            terminal.printLine(`You must supply 1 file name to open:`)
            terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} play ${{[Color.YELLOW]: "<file_name>"}}'\n`
            return
        }

        let openFileName = parsedArgs[0]
        for (let [fileName, file] of Object.entries(terminal.currFolder.content)) {
            if (fileName == openFileName && (file.type == FileType.MELODY)) {
                try {
                    let tunes = JSON.parse(file.content)
                    await playMelody(tunes)
                } catch (e) {
                    throw new Error("Melody corrupted")
                }
                return
            } else if (fileName == openFileName) {
                terminal.printf`${{[Color.RED]: "Error"}}: File is not MELODY\n`
                return
            }
        }
        terminal.printLine(`${openFileName}: file not found`)
        terminal.printf`Use ${{[Color.YELLOW]: "ls"}} to view available files\n`
    }, "play a .melody file")

    terminal.addFunction("frequency", async function(rawArgs) {
        let parsedArgs = parseArgs(rawArgs)
        if (parsedArgs.length != 2) {
            terminal.printLine(`You must supply 2 arguments:`)
            terminal.printf`'${{[Color.SWAMP_GREEN]: "$"}} ${{[Color.YELLOW]: "<freq> <ms>"}}'\n`
            return
        }
        let frequency = parseInt(parsedArgs[0])
        let ms = parseInt(parsedArgs[1])
        await playFrequency(frequency, ms, 1.)
    }, "play a given frequency for a given amount of time")

    let melodySaved = false

    function makeMelodyEditor(melodyLength=100) {
        melodySaved = false
        let canvasWidthPx = melodyLength * 80
        if (canvasWidthPx < window.innerWidth)
            canvasWidthPx = window.innerWidth
        const CANVAS = document.createElement("canvas")
        CANVAS.style.width = canvasWidthPx + "px"
        CANVAS.style.height = "100%"
        CANVAS.style.position = "absolute"
        CANVAS.style.top = "0"
        CANVAS.style.left = "0"
        CANVAS.style.zIndex = "10000"
        CANVAS.style.backgroundColor = "black"
        document.body.appendChild(CANVAS)
        const CONTEXT = CANVAS.getContext("2d")
        CANVAS.width = canvasWidthPx
        CANVAS.height = window.innerHeight
        CONTEXT.font = "15px Courier New"
        let CHARWIDTH = CONTEXT.measureText("A").width * 1.8
    
        function drawChar(x, y, char, color="#348d36") {
            CONTEXT.fillStyle = color
            CONTEXT.fillText(char, x - (x % CHARWIDTH), y - (y % 20))
        }

        function drawLine(x0, y0, x1, y1, char, color="#348d36") {
            const xDiff = x1 - x0
            const yDiff = y1 - y0
            function pointOnLine(t) {
                let x = (x0 + xDiff * t)
                let y = (y0 + yDiff * t)
                return [x, y]
            }
            let stepSize = 1 / ((xDiff + yDiff) / CHARWIDTH)
            for (let t = 0; t < 1; t += stepSize) {
                let [x, y] = pointOnLine(t)
                drawChar(x, y, char, color)
            }
        }

        function clearCanvas() {
            CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height)
        }

        function exportTunes() {
            let values = []
            for (let i = 0; i < melodyLength; i++) {
                let frequency = 0
                let foundNote = null
                for (let note of notes) {
                    if (note.guideLineIndex == i) {
                        frequency = note.f
                        foundNote = note
                        break
                    }
                }
                if (foundNote) {
                    values.push([frequency, 2560 / foundNote.length])
                    values.push([0, 2560 / (300 - foundNote.length)])
                } else {
                    values.push([0, 8.53])
                }
            }
            return values
        }

        let IN_SAVING = false

        async function save() {
            IN_SAVING = true
            CANVAS.remove()
            clearInterval(intervalFunc)
            let melodyName = await terminal.prompt("What do you want to call your melody? ")

            while (!/^[a-zA-Z0-9_\-]{1,20}$/.test(melodyName) || fileExists(melodyName + ".melody")) {
                terminal.printLine("Invalid Name! (special chars or already exists)")
                melodyName = await terminal.prompt("What do you want to call your melody? ")
            }

            let file = makeMelodyFile(exportTunes())
            let fileName = melodyName + ".melody"
            getFolder(["noel", "melodies"])[0].content[fileName] = file
            melodySaved = true
            
            terminal.printf`Saved to ${{[Color.YELLOW]: "home/noel/melodies/" + fileName}}\n`
        }
    
        addEventListener("resize", function() {
            CANVAS.height = window.innerHeight
            CHARWIDTH = CONTEXT.measureText("A").width * 1.5
            CONTEXT.font = "15px Courier New"
        })

        addEventListener("keydown", function(event) {
            if (IN_SAVING) return
            if (event.ctrlKey && event.key == "z") {
                notes.pop()
            }
            if (event.ctrlKey && event.key == "s") {
                event.preventDefault()
                save()
            }
            if (event.ctrlKey && event.key == "c") {
                IN_SAVING = true
                return
            }
            if (event.key == "+") {
                melodyLength = Math.min(melodyLength + 1, 100)
                event.preventDefault()
            } else if (event.key == "-") {
                melodyLength = Math.max(melodyLength - 1, 5)
                event.preventDefault()
            }
            amountGuideLines = melodyLength
            guideLineDiff = 1 / (melodyLength + 1)
            canvasWidthPx = melodyLength * 80
            if (canvasWidthPx < window.innerWidth)
                canvasWidthPx = window.innerWidth
            CANVAS.style.width = canvasWidthPx + "px"
            CANVAS.width = canvasWidthPx
            intervalLength = melodyLength * 300
        })

        let intervalLength = melodyLength * 300
        let startTime = Date.now()

        let amountGuideLines = melodyLength
        let guideLineDiff = 1 / (amountGuideLines + 1)
        
        function guideLinePos(guideLineIndex) {
            return guideLineDiff * (1 + guideLineIndex) * CANVAS.width
        }

        let musicLines = [
            [0.125, 262], [0.25, 294], [0.375, 330], [0.5, 349],
            [0.625, 392], [0.75, 440], [0.875, 494]
        ]

        function currLinePos() {
            return (((Date.now() - startTime) % intervalLength) / intervalLength)
        }

        class Note {

            constructor(lineIndex, guideLineIndex) {
                this.guideLineIndex = guideLineIndex
                this.lineIndex = lineIndex
                this.length = 100
                this.f = musicLines[lineIndex][1]
                if (this.x > currLinePos()) {
                    this.play()
                    this.played = false
                }
            }

            get x() {
                return guideLinePos(this.guideLineIndex) / CANVAS.width
            }

            draw() {
                drawChar(
                    CANVAS.width * this.x,
                    CANVAS.height * musicLines[this.lineIndex][0],
                    "X", Color.LIGHT_GREEN
                )
            }

            play() {
                if (this.played) return
                playFrequency(this.f, this.length)
                this.played = true
            }

            resetPlayed() {
                this.played = false
            }

        }

        let notes = []

        CANVAS.onclick = function(event) {
            let boundingRect = CANVAS.getBoundingClientRect()
            let mouseX = event.clientX - boundingRect.left
            let mouseY = event.clientY - boundingRect.top
            let mouseXFactor = mouseX / CANVAS.width
            let mouseYFactor = mouseY / CANVAS.height

            let nearestMusicLine = null
            let smallestHeightDiff = Infinity
            for (let musicLine of musicLines) {
                let [heightFactor, f] = musicLine
                let heightDiff = Math.abs(heightFactor - mouseYFactor)
                if (heightDiff < smallestHeightDiff) {
                    smallestHeightDiff = heightDiff
                    nearestMusicLine = musicLine
                }
            }

            let nearestGuideLine = null
            let smallestWidthDiff = Infinity
            for (let i = 0; i < amountGuideLines; i++) {
                let guideLineX = guideLinePos(i)
                let widthDiff = Math.abs(guideLineX - mouseX)
                if (widthDiff < smallestWidthDiff) {
                    smallestWidthDiff = widthDiff
                    nearestGuideLine = i
                }
            }

            let note = new Note(
                musicLines.indexOf(nearestMusicLine),
                nearestGuideLine
            )

            for (let i = 0; i < notes.length; i++) {
                if (notes[i].guideLineIndex == note.guideLineIndex) {
                    if (notes[i].lineIndex == note.lineIndex) {
                        notes.splice(i, 1)
                        return
                    }
                    notes.splice(i, 1)
                    break
                }
            }

            notes.push(note)
        }

        let prevXFactor = null

        let intervalFunc = setInterval(function() {
            clearCanvas()

            let xFactor = currLinePos()
            if (xFactor < prevXFactor) {
                for (let note of notes) {
                    note.resetPlayed()
                }
            }
            prevXFactor = xFactor
            let x = CANVAS.width * xFactor

            let lineColor = Color.rgb(80, 80, 80)

            for (let i = 0; i < amountGuideLines; i++) {
                let x = guideLinePos(i)
                drawLine(x, 0, x, CANVAS.height, "|", lineColor)
            }

            for (let musicLine of musicLines) {
                let [heightFactor, f] = musicLine
                let y = CANVAS.height * heightFactor
                drawLine(0, y, CANVAS.width, y, "-", lineColor)
            }

            drawLine(x, 0, x, CANVAS.height, "#", Color.LIGHT_RED)

            for (let note of notes) {
                note.draw()
                if (note.x < xFactor) {
                    note.play()
                }
            }
        }, 10)

        return [CANVAS, intervalFunc]
    }    

    terminal.addFunction("melody", async function() {
        terminal.printf`Welcome to the ${{[Color.YELLOW]: "MelodyMaker"}}!\n`
        let melodyLength = 10
        await terminal.animatePrint("To use the Melody Music Maker, click on a line to")
        await terminal.animatePrint("add a note to it. The red line will activate the notes")
        await terminal.animatePrint("it crosses. Delete the note by clicking it again.")
        await terminal.animatePrint("To add room for more notes, click \"+\" on your keyboard, ")
        await terminal.animatePrint("to remove room use \"-\". Have fun!")
        await sleep(1000)
        terminal.printf`Add note space using ${{[Color.YELLOW]: "+"}}\n`
        await sleep(1000)
        terminal.printf`Remove note space using ${{[Color.YELLOW]: "-"}}\n`
        await sleep(1000)
        terminal.printf`Exit anytime using ${{[Color.YELLOW]: "Ctrl+C"}}\n`
        await sleep(1000)
        terminal.printf`Save anytime using ${{[Color.YELLOW]: "Ctrl+S"}}\n`
        await sleep(2000)
        terminal.printf`Starting Melody-Maker...`
        await sleep(2000)
        let [canvas, intervalFunc] = makeMelodyEditor(melodyLength)
        let stopped = false
        document.addEventListener("keydown", function(e) {
            if (e.ctrlKey && e.key.toLowerCase() == "c") {
                canvas.remove()
                stopped = true
                clearInterval(intervalFunc)
            }
        })
        while (!stopped && !melodySaved) {
            await sleep(100)
        }
    }, "open the melody-maker")

    terminal.addFunction("exportmelody", async function(rawArgs) {
        let fileName = rawArgs.trim()
        if (!fileExists(fileName))
            throw new Error(`File not found: ${fileName}`)
        let file = getFile(fileName)
        if (file.type != FileType.MELODY)
            throw new Error("File not of Type 'Melody'")
        playFrequency(0, 0)

        let destination = audioContext.createMediaStreamDestination()
        let recorder = new MediaRecorder(destination.stream)
        let chunks = []

        recorder.ondataavailable = function(event) {
            chunks.push(event.data)
        }

        recorder.onstop = function(event) {
            let blob = new Blob(chunks, {type: "audio/mp3; codecs=opus"})
            let url = URL.createObjectURL(blob)
            let element = document.createElement('a')
            element.setAttribute('href', url)
            fileName = fileName.split(".", 1)[0] + ".mp3"
            element.setAttribute('download', fileName)
            element.style.display = 'none'
            document.body.appendChild(element)
            element.click()
            document.body.removeChild(element)
        }

        try {
            let notes = JSON.parse(file.content)
            let elem = terminal.printLine("Recording... (may take a while)")
            recorder.start()
            await playMelody(notes, destination)
            recorder.stop()
            elem.textContent = "Finished Recording."
            elem = terminal.printLine("Downloading...")
            await sleep(1500)
            elem.textContent = "Finished Download."
        } catch (e) {
            throw new Error("Invalid File Format!")
        }
        
        await sleep(300)
        if (!chunks)
            throw new Error("Recording Failed!")

    }, "export a .melody file to a .mp3 one")

}
