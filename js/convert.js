{

    function fotoConversionFunc(destinationFormat) {
        return async function(pngContent) {
            try {
                return new Promise(resolve => {
                    let image = new Image()
                    image.onload = function() { 
                        let tempCanvas = document.createElement("canvas")
                        tempCanvas.width = image.width
                        tempCanvas.height = image.height
                        let context2d = tempCanvas.getContext("2d")
                        context2d.drawImage(image, 0, 0)
                        let jpgContent = tempCanvas.toDataURL("image/" + destinationFormat)
                        resolve([jpgContent, FileType.DATA_URL])
                    }
                    image.onerror = () => resolve(null)
                    image.onabort = () => resolve(null)
                    image.src = pngContent
                })
            } catch {
                return null
            }
        }
    }
    
    let POSSIBLE_CONVERSIONS = {}

    {
        const INTERCHANGEABLE_IMAGE_FORMATS = [
            "jpg", "png", "jpeg", "bmp", "gif"
        ]
        for (let a of INTERCHANGEABLE_IMAGE_FORMATS.concat(["svg"])) {
            for (let b of INTERCHANGEABLE_IMAGE_FORMATS) {
                if (a == b) continue
                let conversionStr = `${a}~${b}`
                let conversionFunc = fotoConversionFunc(b)
                POSSIBLE_CONVERSIONS[conversionStr] = conversionFunc
            }
        }
    }

    terminal.addFunction("convert", async function(_, funcInfo) {
        try {
            var args = getArgs(funcInfo, ["input_file", "output_file"])
        } catch {
            terminal.printLine("e.g. 'convert a.png b.jpg'")
            throw new IntendedError()
        }
    
        let inputFile = terminal.getFile(args.input_file)
    
        const getFileFormat = fileName => fileName.split(".").slice(-1)[0]
        let formats = {
            input: getFileFormat(args.input_file),
            output: getFileFormat(args.output_file)
        }

        if (!formats.input || !args.input_file.includes(".")) {
            throw new Error("Invalid Input File Format")
        } else if (!formats.output || !args.output_file.includes(".")) {
            throw new Error("Invalid Output File Format")
        }

        let formatStr = `${formats.input}~${formats.output}`
        if (!(formatStr in POSSIBLE_CONVERSIONS)) {
            throw new Error(`no possible conversion from .${formatStr.replace("~", " to .")}`)
        }

        if (args.output_file.includes("/") || args.output_file.includes("\\")) {
            throw new Error("output file may not be filepath.")
        }

        let line = terminal.printLine("Converting... (may take a bit)")
        await sleep(100)

        let result = await POSSIBLE_CONVERSIONS[formatStr](inputFile.content)
        if (!result) {
            terminal.print("Error", Color.RED)
            terminal.printLine(": could not load file")
            return
        }

        if (terminal.fileExists(args.output_file))
            await terminal.acceptPrompt("Output file will overwrite existing file. Continue?")

        let [newFileContent, newFileType] = result
        let newFile = new FileElement(newFileType, newFileContent, {})
        terminal.currFolder.content[args.output_file] = newFile

        if (newFile.size > MAX_FILE_SIZE) {
            fileTooLargeWarning()
        }

        terminal.printLine("Converting successful.")
    })


}
