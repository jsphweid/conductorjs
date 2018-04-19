import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ReactConductor from './react-conductor'
import { NOTE_LENGTH } from './common/constants'
import { getSecondsPerBeat } from './common/helpers'

const BPM = 120
const audioContext: AudioContext = new AudioContext()
const allOscs: OscillatorNode[] = []
let started = false

function start(restart = false) {
	if (started && !restart) {
		restartAudioContext()
	}
	started = true
	const startTime = audioContext.currentTime
	ReactDOM.render(
		<ReactConductor
			audioContext={audioContext}
			height={500}
			width={500}
			bpm={BPM}
			startTime={startTime}
			options={{ acceleration: 0.8 }}
		/>,
		document.getElementById('app')
	)
	scheduleAllNotes(startTime)
}

function scheduleAllNotes(startTime: number) {
	for (let i = 0; i < 10; i++) {
		var osc = audioContext.createOscillator()
		osc.connect(audioContext.destination)
		osc.frequency.value = 440.0
		const noteStartTime = i * getSecondsPerBeat(BPM) + startTime
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

ReactDOM.render(<button onClick={start.bind(this)}>Start</button>, document.getElementById('btn'))
