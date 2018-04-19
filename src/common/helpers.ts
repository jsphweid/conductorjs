import { FULL_CIRCLE, STARTING_ANGLE_OFFSET } from './constants'

export function angleReducer(angle: number) {
	return (angle % FULL_CIRCLE + FULL_CIRCLE) % FULL_CIRCLE
}

export function getSecondsPerBeat(bpm: number) {
	return 1 / (bpm / 60)
}
