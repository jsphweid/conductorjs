let ctx = null
let num = 0
const audioCtx = new AudioContext()
const FULL_CIRCLE = 2 * Math.PI

const HEIGHT = 500
const WIDTH = 500
const RADIUS_OF_CIRCLE = 100
const DEFAULT_LINE_WIDTH = 6

const BEATS_PER_MINUTE = 60
const BEATS_PER_SECOND = BEATS_PER_MINUTE / 60
const SECONDS_PER_BEAT = 1 / BEATS_PER_SECOND

const ANGLE_OFFSET = 0.25 * FULL_CIRCLE
const CENTER = { x: WIDTH / 2, y: HEIGHT / 2 }
const STARTING_ANGLE_OFFSET = 0.75 * FULL_CIRCLE

const allOscs = []

const NOTE_LENGTH = 0.3

const AMOUNT_INFLUENCE_OF_SWAY = 0.6

let velocity = 0
let yPos = 0
let previousYPos = 0
let started = false
let startTime = null

function init() {
	ctx = document.getElementById('canvas').getContext('2d')
	ctx.lineWidth = DEFAULT_LINE_WIDTH
	window.requestAnimationFrame(draw)
}

function scheduleAllNotes() {
	for (i = 0; i < 10; i++) {
		var osc = audioCtx.createOscillator()
		osc.connect(audioCtx.destination)
		osc.frequency.value = 440.0
		const noteStartTime = i * SECONDS_PER_BEAT + startTime
		osc.start(noteStartTime)
		osc.stop(noteStartTime + NOTE_LENGTH)
		allOscs.push(osc)
	}
}

async function restartAudioContext() {
	allOscs.forEach(osc => {
		osc.disconnect()
	})
	start(true)
}

function start(restart = false) {
	if (started && !restart) {
		restartAudioContext()
	}
	started = true
	startTime = audioCtx.currentTime
	scheduleAllNotes()
}

function angleReducer(angle) {
	angle = angle % FULL_CIRCLE
	return (angle + FULL_CIRCLE) % FULL_CIRCLE
}

function getModifiedRotationAngle(secondsSinceStart) {
	const numBeatsSinceStart = secondsSinceStart / SECONDS_PER_BEAT
	const angle = numBeatsSinceStart * FULL_CIRCLE + ANGLE_OFFSET
	const modification = AMOUNT_INFLUENCE_OF_SWAY * Math.sin(angle + STARTING_ANGLE_OFFSET)
	return angle + modification
}

function draw() {
	window.requestAnimationFrame(draw)
	if (!started) return
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	createFrame()

	createSquare(CENTER.x, CENTER.y)

	const secondsSinceStart = audioCtx.currentTime - startTime

	const currentAngle = getModifiedRotationAngle(secondsSinceStart)
	const percentThroughCycle = angleReducer(currentAngle + STARTING_ANGLE_OFFSET) / FULL_CIRCLE
	console.log('percentThroughCycle', percentThroughCycle)

	x = RADIUS_OF_CIRCLE * Math.cos(currentAngle) + CENTER.x
	y = RADIUS_OF_CIRCLE * Math.sin(currentAngle) + CENTER.y

	createSquare(x, y, percentThroughCycle)

	createDownbeatLine()
}

const createDownbeatLine = () => {
	ctx.beginPath()
	ctx.moveTo(CENTER.x, CENTER.y)
	ctx.lineTo(CENTER.x, CENTER.y + RADIUS_OF_CIRCLE)
	ctx.stroke()
}

const createFrame = () => {
	ctx.strokeRect(0, 0, WIDTH, HEIGHT)
}

const createSquare = (x, y, widthMultiplier = 1) => {
	const dotWidth = 6 * widthMultiplier + 4
	const centerOffset = dotWidth / 2
	ctx.fillRect(x - centerOffset, y - centerOffset, dotWidth, dotWidth)
}

init()
