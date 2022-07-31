// from https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device
let isMobile = false
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true
}

class FileType {
    static FOLDER = "folder"
    static READABLE = "readable"
    static PROGRAM = "program"
    static MELODY = "melody"
}

class FileElement {

    constructor(type, content, buttonsData) {
        this.type = type
        this.content = content
        this.buttonsData = buttonsData || {}
    }

    contains(searchFileName, ignoreCase=true) {
        if (this.type != FileType.FOLDER)
            return false
        for (let fileName of Object.keys(this.content)) {
            if (ignoreCase) {
                if (fileName.toLowerCase() == searchFileName.toLowerCase())
                    return true
            } else {
                if (fileName == searchFileName)
                    return true
            }
        }
        return false
    }

    find(searchFunc) {
        if (this.type != FileType.FOLDER)
            return false
        for (let [n, v] of Object.entries(this.content)) {
            if (searchFunc(n, v)) return v
        }
        return false
    }

    export() {
        let content = this.content
        if (this.type == FileType.FOLDER) {
            content = Object()
            for (let [key, val] of Object.entries(this.content)) {
                content[key] = val.export()
            }
        }
        return {
            type: this.type,
            buttonsData: this.buttonsData,
            content: content
        }
    }

    static fromData(data) {
        let content = data.content
        if (data.type == FileType.FOLDER) {
            content = Object()
            for (let [key, val] of Object.entries(data.content)) {
                content[key] = FileElement.fromData(val)
            }
        }
        return new FileElement(data.type, content, data.buttonsData)
    }

}

const welcome_txt_content = `Hello World!
                  _    __      _          _      _      _     
                 | |  / _|    (_)        | |    (_)    | |    
 _ __   ___   ___| | | |_ _ __ _  ___  __| |_ __ _  ___| |__  
| '_ \\ / _ \\ / _ \\ | |  _| '__| |/ _ \\/ _\` | '__| |/ __| '_ \\ 
| | | | (_) |  __/ |_| | | |  | |  __/ (_| | |  | | (__| | | |
|_| |_|\\___/ \\___|_(_)_| |_|  |_|\\___|\\__,_|_|  |_|\\___|_| |_|

I'm a hobbiest programmer and like to play around with stuff.

This site is built to work like a terminal:
- use 'help' to see a list of available commands
- or just use the buttons instead
`

const about_txt_content = `<noel-friedrich>

    \\O_   This is me, Noel Friedrich.
 ,/\\/     I am a student still very much in learning.
   /      I also really love rainy weather.
   \\      And command line interfaces.
   \`      (because i like to feel cool)

</noel-friedrich>`

const projects_readme_content = `Welcome to my projects Page!

In this folder, there are some projects of mine. Most of
them are websites. You can open a project using the 'run'
command or by simply executing the .exe file inside the 
projects directory: './<project_name>.exe'

I also have a Github. You can open it by executing the
'github.exe' file inside this directory.
`

const perilious_path_txt = `Perilious Path is a simple html game.
You are shown a grid of bombs for 3 seconds,
then you must find a path between two points,
without hitting a bomb.

The game trains your memory skills and is also
available to play on mobile devices!`

const anticookiebox_txt = `This browser extension will delete an 'accept cookie'
section of a page, by simply removing it from your screen
This plugin behaves similar to an ad blocker, but for 'Accept Cookies' Boxes. The plugin will
automatically scan the pages you load and remove the boxes, without accepting any Cookie use!

How does it work?
Behind the scenes, Lucy is your internet-immune system. She's a detective and
just really good at finding 'Accept Cookies' popups. She loves eating them :)

Just keep surfing the web as usual, but without wasting precious time clicking away
useless cookie boxes and giving random web-services access to your personal data.

Get Lucy to be part of your next Web-Journey by installing AntiCookieBox!`

const coville_txt = `Coville is a City-Simulator that allows you to simulate
a virtual city (coville) and a virtual virus (covid).

It's also my submission to the german 'Jugend Forscht' competetion.

(the website is in german)`

const contact_txt = `E-Mail: noel.friedrich@outlook.de`

const extras_txt = `this terminal can actually do quite a lot:
- see all commands using 'lscmds'-command
- there are a few cool ones:
  -> create files using 'touch'
  -> manipulate files using 'edit'
  -> remove files using 'rm'
- all changes you make are locally saved,
  to reset the current state, use 'reset'
- type in the name of your favorite programming language
  to get my opinion of it. If this terminal doesn't know
  the language, i don't either
- use img2ascii to convert images to ascii art
- generate a password using 'password'
  -> use 'password -help' to see all options
- plot math functions using 'plot'
- solve equations for x using 'solve'
- get and set key value pairs globally for all users of
  this terminal using 'set' and 'get'
- manage todo lists using 'todo'
- create melodys using the melody-maker
  -> open home/noel/melodies/README.txt for a
     short how-to
- create ascii-letter art using 'letters <text>'
- play games using 'tictactoe', 'chess' or '4inarow'`

let passwords_json = `{
    "google.com": "FAKE_PASSWORD",
    "github.com": "FAKE_PASSWORD",
    "die-quote.de": "FAKE_PASSWORD",
    "instagram.com": "FAKE_PASSWORD",
    "facebook.com": "FAKE_PASSWORD",
    "steam": "FAKE_PASSWORD"
}`

while (passwords_json.match(/FAKE_PASSWORD/)) {
    passwords_json = passwords_json.replace(/FAKE_PASSWORD/, function() {
        let chars = "zyxwvutsrqponmlkjihgfedcbaABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?@+-#"
        let tempPw = ""
        let len = Math.random() * 8 + 8
        for (let i = 0; i < len; i++) {
            tempPw += chars[Math.floor(Math.random() * chars.length)]
        }
        return tempPw
    }())
}

const sitemapWebsites = [
    "anticookiebox", "cardoid", "chess", "chess/online", "cloth",
    "compli", "coville", "decide", "draw", "gravity",
    "image-crop", "julius-coords", "lettre", "names", "particle",
    "path-finder", "perilious-path", "physics", "plot", "presi",
    "quiz", "random", "raycasting", "rps-ai", "sport", "struktogramm",
    "todo", "trapped-knight", "tv", "unterschrift", "wave", "cli", "bezier"
]

const MELODIES_FOLDER = new FileElement(FileType.FOLDER, {}, {"<": "cd ..", "melody": "melody"})

const melodies_readme_txt = `Welcome to the Melodies Folder!
In this folder are some .melody files, which contain basic melodys.
- to list all melody files, use 'ls'
- to play a file, use 'play <filename>'
- to make your own melody, use 'melody'
- to download a melody as a .mp3, use 'exportmelody <filename>'`

MELODIES_FOLDER.content["README.txt"] = new FileElement(FileType.READABLE, melodies_readme_txt)

let FILE_SYSTEM = new FileElement(FileType.FOLDER, {
    "welcome.txt": new FileElement(FileType.READABLE, welcome_txt_content),
    "about.txt": new FileElement(FileType.READABLE, about_txt_content),
    "projects": new FileElement(FileType.FOLDER, {
        "README.txt": new FileElement(FileType.READABLE, projects_readme_content),
        "github.exe": new FileElement(FileType.PROGRAM, "https://github.com/noel-friedrich/"),
        "perilious-path": new FileElement(FileType.FOLDER, {
            "about.txt": new FileElement(FileType.READABLE, perilious_path_txt),
            "perilious-path.exe": new FileElement(FileType.PROGRAM, "https://noel-friedrich.de/perilious-path")
        }, {"<": "cd ..", "open": "run perilious-path.exe"}),
        "anticookiebox": new FileElement(FileType.FOLDER, {
            "about.txt": new FileElement(FileType.READABLE, anticookiebox_txt),
            "anticookiebox-github.exe": new FileElement(FileType.PROGRAM, "https://github.com/noel-friedrich/AntiCookieBox"),
            "anticookiebox.exe": new FileElement(FileType.PROGRAM, "https://noel-friedrich.de/anticookiebox")
        }, {"<": "cd ..", "install": "run anticookiebox.exe", "github": "run anticookiebox-github.exe"}),
        "coville": new FileElement(FileType.FOLDER, {
            "about.txt": new FileElement(FileType.READABLE, coville_txt),
            "coville-github.exe": new FileElement(FileType.PROGRAM, "https://github.com/noel-friedrich/coville"),
            "coville.exe": new FileElement(FileType.PROGRAM, "https://noel-friedrich.de/coville")
        }, {"<": "cd ..", "open": "run coville.exe", "github": "run coville-github.exe"}),
        "sitemap": new FileElement(FileType.FOLDER, Object.fromEntries(
            sitemapWebsites.map(website => [website, new FileElement(FileType.PROGRAM   , `https://noel-friedrich.de/${website}`)])
        ), {"<": "cd .."})
    }, {
        "<": "cd ..",
        "ppath": ["cd perilious-path", "cat about.txt"],
        "coville": ["cd coville", "cat about.txt"],
        "acb": ["cd anticookiebox", "cat about.txt"]
    }),
    "noel": new FileElement(FileType.FOLDER, {
        "secret": new FileElement(FileType.FOLDER, {
            "passwords.json": new FileElement(FileType.READABLE, passwords_json)
        }, {"<": "cd ..", "passwords": "cat passwords.json"}),
        "contact.txt": new FileElement(FileType.READABLE, contact_txt),
        "melodies": MELODIES_FOLDER
    }, {"<": "cd ..", "secret": "cd secret/", "contact": "cat contact.txt", "melodies": ["cd melodies/", "cat README.txt"]}),
    "extras.txt": new FileElement(FileType.READABLE, extras_txt),
    "github.exe": new FileElement(FileType.PROGRAM, "https://github.com/noel-friedrich/cli"),
}, {"projects": ["cd projects/", "cat README.txt"], "about me": "cat about.txt", "help": "help"})
