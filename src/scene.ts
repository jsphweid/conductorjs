import { ReactConductorProps } from './react-conductor'
import { black, white, FULL_CIRCLE, STARTING_ANGLE_OFFSET } from './common/constants'
import { PointType } from './common/types'
import { getSecondsPerBeat, angleReducer } from './common/helpers'

export default class Scene {
	ctx: CanvasRenderingContext2D
	width: number
	height: number
	centerPoint: PointType
	circleRadius: number
	secondsPerBeat: number
	acceleration: number

	constructor(_ctx: CanvasRenderingContext2D, props: ReactConductorProps) {
		this.ctx = _ctx
		this.width = props.width
		this.height = props.height
		this.centerPoint = { x: props.width / 2, y: props.height / 2 }
		this.circleRadius = props.options.circleRadius
		this.secondsPerBeat = getSecondsPerBeat(props.bpm)
		this.acceleration = props.options.acceleration
		this.ctx.lineWidth = props.options.lineWidth
	}

	public drawFrame = (time: number) => {
		if (!time) return
		const currentAngle = this.getCurrentAngle(time)
		const percentThroughCycle = angleReducer(currentAngle + STARTING_ANGLE_OFFSET) / FULL_CIRCLE

		const x = this.circleRadius * Math.cos(currentAngle) + this.centerPoint.x
		const y = this.circleRadius * Math.sin(currentAngle) + this.centerPoint.y

		this.drawClearRect(percentThroughCycle)
		this.drawBorder(percentThroughCycle)
		this.drawSquare(this.centerPoint.x, this.centerPoint.y, percentThroughCycle)
		this.drawSquare(x, y, percentThroughCycle)
		this.drawDownbeatLine(percentThroughCycle)
	}

	private drawClearRect = (percentThroughCycle: number) => {
		this.ctx.fillStyle = percentThroughCycle < 0.2 ? black : white
		this.ctx.fillRect(0, 0, this.width, this.height)
	}

	private drawDownbeatLine = (percentThroughCycle: number) => {
		this.ctx.strokeStyle = percentThroughCycle < 0.2 ? white : black
		this.ctx.beginPath()
		this.ctx.moveTo(this.centerPoint.x, this.centerPoint.y)
		this.ctx.lineTo(this.centerPoint.x, this.centerPoint.y + this.circleRadius)
		this.ctx.stroke()
	}

	private drawBorder = (percentThroughCycle: number) => {
		this.ctx.strokeStyle = percentThroughCycle < 0.2 ? white : black
		this.ctx.strokeRect(0, 0, this.width, this.height)
	}

	private drawSquare = (x: number, y: number, percentThroughCycle: number) => {
		const dotWidth = 30 * percentThroughCycle + 2
		const centerOffset = dotWidth / 2
		this.ctx.fillStyle = percentThroughCycle < 0.2 ? white : black
		this.ctx.fillRect(x - centerOffset, y - centerOffset, dotWidth, dotWidth)
	}

	private getCurrentAngle = (time: number) => {
		const numBeatsSinceStart = time / this.secondsPerBeat
		const angle = numBeatsSinceStart * FULL_CIRCLE + FULL_CIRCLE * 0.25
		const modification = this.acceleration * Math.sin(angle + STARTING_ANGLE_OFFSET)
		return angle + modification
	}
}
