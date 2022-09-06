let turtlo = {}

function removeExistingTurtlos() {
    let count = 0
    for (let element of document.querySelectorAll(".turtlo")) {
        if (!element.classList.contains("gone")) {
            element.classList.add("gone")
            count++
        }
    }
    return count
}

{

    const TURTLO_STATE = {
        IDLE: "idle",
        WALKING: "walking"
    }
    
    function resetTurtlo() {
        turtlo = {
            x: -500,
            y: -500,
            goalX: window.innerWidth / 2,
            goalY: window.innerHeight / 2,
            rot: 0,
            moving: false,
            intervalFunc: null,
            imageElement: document.createElement("img"),
            startTime: Date.now(),
            state: TURTLO_STATE.WALKING,
            shellDuration: 0,
            lastShellTime: Date.now(),
            inShell: () => ((turtlo.lastShellTime + turtlo.shellDuration) > Date.now()),
            toungeDuration: 0,
            lastToungeTime: Date.now(),
            hasToungeOut: () => ((turtlo.lastToungeTime + turtlo.toungeDuration) > Date.now()),
            spinDuration: 3000,
            lastSpinTime: Date.now(),
            inSpin: () => ((turtlo.lastSpinTime + turtlo.spinDuration) > Date.now()),
            prevRot: 120,
            hugeSpinDuration: 0,
            lastHugeSpinTime: Date.now(),
            inHugeSpin: () => ((turtlo.lastHugeSpinTime + turtlo.hugeSpinDuration) > Date.now()),
            radiusFactor: 0.9
        }
    }

    addEventListener("mousemove", function(event) {
        turtlo.goalX = event.clientX
        turtlo.goalY = event.clientY
        if (turtlo.imageElement) {
            turtlo.goalX -= turtlo.imageElement.clientWidth / 2
            turtlo.goalY -= turtlo.imageElement.clientHeight - 10
        }
    })

    function drawTurtlo() {
        let x = turtlo.x
        let y = turtlo.y

        let timeElapsed = (Date.now() - turtlo.startTime) % 1000
        if (turtlo.inHugeSpin()) {
            let walkingImages = ["walking-0", "walking-1", "walking-2", "walking-1"]
            let imageIndex = Math.floor(timeElapsed / 1001 * walkingImages.length)
            let currImage = walkingImages[imageIndex]
            turtlo.imageElement.src = "img/turtlo/" + currImage + ".png"
            let spinTimeElapsed = Date.now() - turtlo.lastHugeSpinTime
            let timeFactor = spinTimeElapsed / (turtlo.hugeSpinDuration * turtlo.spinAmountFactor)
            //turtlo.rot = timeFactor * 360 + turtlo.prevRot
            let windowRadius = Math.min(window.innerHeight, window.innerWidth) / 2 * turtlo.radiusFactor
            let [midX, midY] = [window.innerWidth / 2, window.innerHeight / 2]
            turtlo.goalX = Math.cos(timeFactor * Math.PI * 2 + turtlo.radiusStart) * windowRadius + midX
            turtlo.goalY = Math.sin(timeFactor * Math.PI * 2 + turtlo.radiusStart) * windowRadius + midY
        } else if (turtlo.inSpin()) {
            turtlo.imageElement.src = "img/turtlo/walking-0.png"
            let timeElapsed = Date.now() - turtlo.lastSpinTime
            turtlo.rot = ((timeElapsed / turtlo.spinDuration) * 360 + turtlo.prevRot)
        } else if (turtlo.inShell()) {
            turtlo.imageElement.src = "img/turtlo/hidden.png"
        } else if (turtlo.hasToungeOut()) {
            turtlo.imageElement.src = "img/turtlo/tounge.png"
        } else if (turtlo.state == TURTLO_STATE.WALKING) {
            let walkingImages = ["walking-0", "walking-1", "walking-2", "walking-1"]
            let imageIndex = Math.floor(timeElapsed / 1001 * walkingImages.length)
            let currImage = walkingImages[imageIndex]
            turtlo.imageElement.src = "img/turtlo/" + currImage + ".png"
        } else if (turtlo.state == TURTLO_STATE.IDLE) {
            turtlo.imageElement.src = "img/turtlo/walking-0.png"
        }

        turtlo.imageElement.style.top = y + "px"
        turtlo.imageElement.style.left = x + "px"
        turtlo.imageElement.style.transform = `rotate(${turtlo.rot}deg)`
    }

    function moveTurtlo() {
        if (!turtlo.inShell()) {
            let xDiff = turtlo.goalX - turtlo.x
            let yDiff = turtlo.goalY - turtlo.y
            turtlo.x += xDiff * 0.05
            turtlo.y += yDiff * 0.05

            let rotation = Math.atan2(yDiff, xDiff) + Math.PI / 2
            turtlo.rot = rotation * 180 / Math.PI

            let length = Math.sqrt(xDiff ** 2 + yDiff ** 2)
            turtlo.state = (length > 15) ? TURTLO_STATE.WALKING : TURTLO_STATE.IDLE
        }

        if (turtlo.state == TURTLO_STATE.IDLE) {
            let chance = Math.random() < 0.01
            if (!chance)
                return
            if (turtlo.hasToungeOut() || turtlo.inShell() || turtlo.inSpin() || turtlo.inHugeSpin())
                return
            let activities = {
                goIntoShell() {
                    turtlo.lastShellTime = Date.now()
                    turtlo.shellDuration = 5000 + 8000 * Math.random()
                },
                stickToungeOut() {
                    turtlo.lastToungeTime = Date.now()
                    turtlo.toungeDuration = 1000 + 1000 * Math.random()
                },
                moveToRandomSpot() {
                    turtlo.goalX = Math.random() * window.innerWidth
                    turtlo.goalY = Math.random() * window.innerHeight
                },
                spinAround() {
                    turtlo.lastSpinTime = Date.now()
                    turtlo.spinDuration = 300 + Math.random() * 2000
                    turtlo.prevRot = turtlo.rot
                },
                spinWalkAround() {
                    turtlo.lastHugeSpinTime = Date.now()
                    turtlo.hugeSpinDuration = 5000 + Math.random() * 5000
                    turtlo.spinAmountFactor = Math.random()
                    turtlo.prevRot = turtlo.rot
                    turtlo.radiusFactor = (0.4 + Math.random() * 0.5)
                    turtlo.radiusStart = Math.random() * Math.PI * 2
                },
                walkout() {
                    let prevX = turtlo.x
                    let prevY = turtlo.y
                    turtlo.goalX += (Math.random() - 0.5) * 2 * 300
                    turtlo.goalX = -300
                    setTimeout(function() {
                        if (turtlo.x > 0) return
                        turtlo.x = window.innerWidth + 100
                        turtlo.goalX = prevX
                        turtlo.goalY = prevY
                    }, Math.random() * 1000 + 2000)
                }
            }
            let activityChances = [
                [activities.goIntoShell,      1],
                [activities.stickToungeOut,   3],
                [activities.spinAround,       3],
                [activities.spinWalkAround,   2],
                [activities.moveToRandomSpot, 1],
                [activities.walkout,          1],
            ]
            let totalChance = activityChances.map(e => e[1]).reduce((a, e) => a + e, 0)
            let randomValue = Math.random() * totalChance
            let cumulativeChance = 0
            for (let [activity, chance] of activityChances) {
                cumulativeChance += chance
                if (cumulativeChance > randomValue) {
                    activity()
                    break
                }
            }
        }
    }

    function updateTurtlo() {
        drawTurtlo()
        moveTurtlo()
    }

    function startTurtlo(cssClass=null) {
        terminal.printLine("to remove turtlo, use 'kill turtlo'") 
        removeExistingTurtlos()
        if (turtlo.intervalFunc)
            clearInterval(turtlo.intervalFunc)
        resetTurtlo()
        turtlo.imageElement.classList.add("turtlo")
        if (cssClass) turtlo.imageElement.classList.add(cssClass)
        drawTurtlo()
        document.body.appendChild(turtlo.imageElement)
        turtlo.intervalFunc = setInterval(updateTurtlo, 50)
    }

    terminal.addFunction("turtlo", function() {
        startTurtlo()  
    }, "spawn turtlo", true)

    terminal.addFunction("hugeturtlo", function() {
        startTurtlo("huge")   
    }, "spawn huge turtlo")

    terminal.addFunction("hugehugeturtlo", function() {
        startTurtlo("hugehuge")   
    }, "spawn huge huge turtlo")

    terminal.addFunction("oneko", function() {
        terminal.printLine("oneko isn't installed. Try turtlo instead!")
    }, "just use turtlo")

}

function killTurtlo() {
    if (turtlo.intervalFunc)
        clearInterval(turtlo.intervalFunc)
    return removeExistingTurtlos() != 0
}
