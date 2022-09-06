async function playFrequency(f, ms, volume=0.5, destination=null, returnSleep=true) {
    if (!audioContext) {
        audioContext = new(window.AudioContext || window.webkitAudioContext)()
        if (!audioContext)
            throw new Error("Browser doesn't support Audio")
    }

    let oscillator = audioContext.createOscillator()
    oscillator.type = "square"
    oscillator.frequency.value = f

    let gain = audioContext.createGain()
    gain.connect(destination || audioContext.destination)
    gain.gain.value = volume

    oscillator.connect(gain)
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + ms / 1000)

    if (returnSleep)
        return sleep(ms)
}

async function playFrequencyRamp(f0, f1, ms, volume=0.5, destination=null, returnSleep=true) {
    if (!audioContext) {
        audioContext = new(window.AudioContext || window.webkitAudioContext)()
        if (!audioContext)
            throw new Error("Browser doesn't support Audio")
    }

    const endTime = audioContext.currentTime + ms / 1000

    let oscillator = audioContext.createOscillator()
    oscillator.type = "square"
    oscillator.frequency.value = f0
    oscillator.frequency.linearRampToValueAtTime(f1, endTime)

    let gain = audioContext.createGain()
    gain.connect(destination || audioContext.destination)
    gain.gain.value = volume

    oscillator.connect(gain)
    oscillator.start(audioContext.currentTime)
    oscillator.stop(endTime)

    if (returnSleep)
        return sleep(ms)
}

async function playMelody(notes, destination=null) {
    if (notes.fileType == "madeMelody") {
        playFrequency(0, 0)
        const frequencies = notes.freq
        const msPerNote = notes.msPerNote
        notes = notes.notes.split("\n").map(function(n) {
            let items = n.split(",")
            return {
                startFrequency: frequencies[items[0]],
                endFrequency: frequencies[items[1]],
                durationNotes: items[2],
                startNote: items[3],
                startTime: msPerNote * items[3],
                durationMs: items[2] * msPerNote,
                endTime: (msPerNote * items[3]) + items[2] * msPerNote
            }
        })
        let timeouts = []
        for (let note of notes) {
            timeouts.push(setTimeout(function() {
                if (note.startFrequency == note.endFrequency) {
                    playFrequency(
                        note.startFrequency,
                        note.durationMs,
                        0.5, destination, false
                    )
                } else {
                    playFrequencyRamp(
                        note.startFrequency,
                        note.endFrequency,
                        note.durationMs,
                        0.5, destination, false
                    )
                }
            }, note.startTime))
        }
        addEventListener("keydown", function(event) {
            if (timeouts.length == 0) return
            if (event.key == "c" && event.ctrlKey) {
                if (timeouts.length > 0) {
                    for (let timeout of timeouts) {
                        clearTimeout(timeout)
                    }
                    timeouts = []
                }
            }
        })
        let notesCopy = [...notes]
        notesCopy.sort((a, b) => a.endTime - b.endTime)
        let totalTime = notesCopy.slice(-1)[0].endTime
        let startTime = Date.now()
        while ((Date.now() - startTime) < totalTime)
            await sleep(100)
    } else {
        for (let i = 0; i < notes.length; i++) {
            let [f, t] = notes[i]
            let ms = 256000 / (Math.abs(t) * 100)
            if (t < 0) ms *= 1.5
            await playFrequency(f, ms, 0.5, destination)
        }
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

    terminal.addFunction("play", async function(_, funcInfo) {
        let args = getArgs(funcInfo, ["file"])
        let file = terminal.getFile(args.file)
        if (file.type != FileType.MELODY)
            throw new Error("File must be of type MELODY")
        try {
            var tunes = JSON.parse(file.content)
        } catch {
            throw new Error("Melody corrupted")
        }
        await playMelody(tunes)
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

    function makeMelodyEditor(tunes) {
        let melodyLength = 100
        let noteFrequencies = [262, 294, 330, 349, 392, 440, 494].reverse()
        let msPerNote = 150
        const guideLineSpace = 50
        const noteLineColor = "black"
        const canvasWidthPx = () => guideLineSpace * (melodyLength + 1)
        const totalLengthMs = () => melodyLength * msPerNote
        const startTime = Date.now()

        const [CANVAS, CONTEXT] = makeNewWindow()
        CANVAS.style.background = "white"
        CANVAS.style.width = canvasWidthPx() + "px"
        CANVAS.width = canvasWidthPx()
        CANVAS.style.position = "absolute"

        let notes = []

        class Note {

            constructor(startFrequency, endFrequency, durationNotes, startNote) {
                this.startFrequency = startFrequency
                this.endFrequency = endFrequency
                this.durationNotes = durationNotes
                this.startNote = startNote
                this.played = this.startX < calcLineX()
            }

            get color() {
                let total = noteFrequencies.length
                let deg = `${Math.round(this.startFrequencyIndex / total * 360)}deg`
                return `hsla(${deg}, 100%, 50%, .5)`
            }

            get startX() {
                return CANVAS.width / (melodyLength + 1) * this.startNote
            }

            get durationMs() {
                return this.durationNotes * msPerNote
            }

            get startFrequencyIndex() {
                let index = noteFrequencies.indexOf(this.startFrequency)
                if (index === -1) throw new Error("Invalid Frequency!")
                return index
            }

            get endFrequencyIndex() {
                let index = noteFrequencies.indexOf(this.endFrequency)
                if (index === -1) throw new Error("Invalid Frequency!")
                return index
            }

            get startPos() {
                let x = this.startNote / (melodyLength + 1) * CANVAS.width
                let y = (this.startFrequencyIndex + 1) / (noteFrequencies.length + 1) * CANVAS.height
                return [x, y]
            }

            get endNote() {
                return this.startNote + this.durationNotes
            }

            get endPos() {
                let x = this.endNote / (melodyLength + 1) * CANVAS.width
                let y = (this.endFrequencyIndex + 1) / (noteFrequencies.length + 1) * CANVAS.height
                return [x, y]
            }

            get isTransition() {
                return this.startFrequency != this.endFrequency
            }

            draw(color=null) {
                const [startX, startY] = this.startPos
                const [endX, endY] = this.endPos
                const r = 20
                drawThickLine(startX + r, startY, endX - r, endY, r, color || this.color)
            }

            eq(otherNote) {
                return (
                    this.startFrequency == otherNote.startFrequency &&
                    this.endFrequency == otherNote.endFrequency &&
                    this.durationNotes == otherNote.durationNotes && 
                    this.startNote == otherNote.startNote
                )
            }

            export() {
                let freqStr = `${this.startFrequencyIndex},${this.endFrequencyIndex}`
                return `${freqStr},${this.durationNotes},${this.startNote}`
            }

            async play() {
                if (this.played) return
                this.played = true
                if (this.isTransition) {
                    playFrequencyRamp(
                        this.startFrequency,
                        this.endFrequency,
                        this.durationMs
                    )
                } else {
                    playFrequency(this.startFrequency, this.durationMs)
                }
            }

            static fromMousePos(x, y) {
                let frequencyIndex = Math.round(y / (CANVAS.height / (noteFrequencies.length + 1)))
                let startNote = Math.floor(x / (CANVAS.width / (melodyLength + 1)))
                frequencyIndex = Math.max(1, Math.min(frequencyIndex, noteFrequencies.length))
                let frequency = noteFrequencies[frequencyIndex - 1]
                return new Note(frequency, frequency, 1, startNote)
            }

        }

        if (tunes) {
            msPerNote = tunes.msPerNote
            noteFrequencies = tunes.freq
            let noteLines = tunes.notes.split("\n")
            for (let line of noteLines) {
                let values = line.split(",")
                notes.push(new Note(
                    noteFrequencies[values[0]],
                    noteFrequencies[values[1]],
                    parseInt(values[2]), parseInt(values[3])
                ))
            }
        }

        function updateMelodyLength() {
            let windowNoteWidth = Math.ceil(window.innerWidth / CANVAS.width * melodyLength * 0.5)
            let latestNote = 0
            for (let note of notes) {
                if (note.endNote > latestNote) {
                    latestNote = note.endNote
                }
            }
            let newMelodyLength = Math.max(windowNoteWidth * 2, latestNote + windowNoteWidth)
            if (newMelodyLength != melodyLength) {
                melodyLength = newMelodyLength
                CANVAS.style.width = canvasWidthPx() + "px"
                CANVAS.width = canvasWidthPx()
            }
        }

        updateMelodyLength()

        addEventListener("resize", function() {
            CANVAS.width = canvasWidthPx()
            CANVAS.style.width = canvasWidthPx()
        })

        function drawThickLine(x0, y0, x1, y1, r=10, color="blue") {
            const xDiff = x1 - x0
            const yDiff = y1 - y0
            const angle = Math.atan2(yDiff, xDiff)

            function movePoint(x, y, angle, distance=r) {
                return [
                    x + Math.cos(angle) * distance,
                    y + Math.sin(angle) * distance
                ]
            }

            // p1 ----------- p3
            //  |             |
            //  |             |
            // p2 ----------- p4

            const [p1x, p1y] = movePoint(x0, y0, angle - Math.PI / 2)
            const [p3x, p3y] = movePoint(x1, y1, angle - Math.PI / 2)
            const [p4x, p4y] = movePoint(x1, y1, angle + Math.PI / 2)

            CONTEXT.beginPath()
            CONTEXT.moveTo(p1x, p1y)
            CONTEXT.arc(x0, y0, r, angle - Math.PI / 2, angle + Math.PI / 2, true)
            CONTEXT.lineTo(p4x, p4y)
            CONTEXT.arc(x1, y1, r, angle - Math.PI / 2, angle + Math.PI / 2)
            CONTEXT.lineTo(p3x, p3y)
            CONTEXT.closePath()
            CONTEXT.fillStyle = color
            CONTEXT.fill()
        }

        function calcLineX() {
            const msPassed = (Date.now() - startTime) % totalLengthMs()
            return (msPassed / totalLengthMs()) * CANVAS.width
        }

        let dragTempNote = null
        let hoverTempNote = null

        function posFromMouseEvent(event) {
            const rect = CANVAS.getBoundingClientRect()
            return [
                event.clientX - rect.left,
                event.clientY - rect.top
            ]
        }

        function updateDragTempNote(event) {
            let [posX, posY] = posFromMouseEvent(event)
            const newDragTempNote = Note.fromMousePos(posX, posY)
            dragTempNote.endFrequency = newDragTempNote.endFrequency
            let duration = Math.max(1, newDragTempNote.startNote - dragTempNote.startNote)
            dragTempNote.durationNotes = duration
        }

        function exportMelody() {
            let notesCopy = [...notes]
            notesCopy.sort((a, b) => a.startNote - b.startNote)
            let notesData = notesCopy.map(n => n.export()).join("\n")
            return JSON.stringify({
                freq: noteFrequencies,
                msPerNote: msPerNote,
                notes: notesData,
                fileType: "madeMelody"
            })
        }

        function saveMelody(event) {
            melodyEditorStopped = new FileElement(
                FileType.MELODY,
                exportMelody(),
                {}
            )
        }

        addEventListener("keydown", function(event) {
            if (event.key == "z" && event.ctrlKey) {
                notes.pop()
                event.preventDefault()
            } else if (event.key == "s" && event.ctrlKey) {
                saveMelody()
                CANVAS.remove()
                clearInterval(intervalFunc)
                event.preventDefault()
            }
        })

        CANVAS.onmousedown = function(event) {
            let [posX, posY] = posFromMouseEvent(event)
            dragTempNote = Note.fromMousePos(posX, posY)
            hoverTempNote = null
        }

        CANVAS.onmousemove = function(event) {
            if (dragTempNote != null)
                updateDragTempNote(event)
            else {
                let [posX, posY] = posFromMouseEvent(event)
                hoverTempNote = Note.fromMousePos(posX, posY)
            }
        }

        CANVAS.onmouseup = function(event) {
            if (dragTempNote != null) {
                updateDragTempNote(event)
                let duplicateNote = notes.find(n => n.eq(dragTempNote))
                if (duplicateNote) {
                    let indexOfDuplicate = notes.indexOf(duplicateNote)
                    notes.splice(indexOfDuplicate, 1)
                    updateMelodyLength()
                } else {
                    notes.push(dragTempNote)
                    updateMelodyLength()
                }
            }
            dragTempNote = null
        }

        function drawNoteLines() {
            const yStep = CANVAS.height / (noteFrequencies.length + 1)
            for (let y = yStep; y < CANVAS.height; y += yStep) {
                drawThickLine(0, y, CANVAS.width, y, 2, noteLineColor)
            }
        }

        function drawNotes() {
            for (let note of notes) {
                note.draw()
            }
            if (dragTempNote != null) {
                dragTempNote.draw()
            }
            if (hoverTempNote) {
                hoverTempNote.draw("rgba(0, 0, 0, 0.25)")
            }
        }

        function resetNotes() {
            for (let note of notes) {
                note.played = false
            }
        }

        let prevLineX = null

        let intervalFunc = setInterval(function() {
            CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height)
            const lineX = calcLineX()
            if (prevLineX > (lineX + 100))
                resetNotes()
            prevLineX = lineX
            drawNoteLines()
            drawNotes()
            drawThickLine(lineX, 0, lineX, CANVAS.height, 10, "rgba(255, 0, 0, 0.5)")

            for (let note of notes.filter(n => !n.played && n.startX < lineX)) {
                note.play()
            }
        }, 10)

        return [CANVAS, intervalFunc]
    }    

    let melodyEditorStopped = false

    terminal.addFunction("melody", async function(_, funcInfo) {
        if (isMobile) {
            throw new Error("Command not available on mobile!")
        }
        let args = getArgs(funcInfo, ["?file"], {file: null})
        let tunes = null
        if (args.file) {
            let file = terminal.getFile(args.file)
            tunes = JSON.parse(file.content)
        }
        terminal.printLine("Click on the lines to add notes!")
        await sleep(1000)
        let [canvas, intervalFunc] = makeMelodyEditor(tunes)
        melodyEditorStopped = false
        document.addEventListener("keydown", function(e) {
            if (e.ctrlKey && e.key.toLowerCase() == "c") {
                canvas.remove()
                clearInterval(intervalFunc)
            }
        })
        while (!melodyEditorStopped) {
            await sleep(100)
        }
        let fileName = await terminal.prompt("What do you want to call your melody? ")
        let validNameFound = false
        while (!validNameFound) {
            if (!fileExists(fileName + ".melody")
            && /[a-zA-Z0-9\_\-\~]{3,20}/.test(fileName))
                break
            if (terminal.fileExists(fileName + ".melody")) {
                terminal.printError("File with that name already exists!")
            } else {
                terminal.printError("Invalid name! (too short?) (invalid characters?)")
            }
            fileName = await terminal.prompt("What do you want to call your melody? ")
        }
        terminal.currFolder.content[fileName + ".melody"] = melodyEditorStopped
        terminal.print("Saved ")
        terminal.updateFileSystem()
        terminal.printLine(melodyEditorStopped.path, Color.COLOR_1)
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
