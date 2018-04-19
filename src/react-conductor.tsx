import * as React from 'react'
import { PointType, ReactConductorOptionsType } from './common/types'
import { FULL_CIRCLE, white, black, STARTING_ANGLE_OFFSET } from './common/constants'
import { angleReducer } from './common/helpers'
import Scene from './scene'

export interface ReactConductorProps {
	audioContext: AudioContext
	width: number
	height: number
	bpm: number
	startTime: number
	options?: ReactConductorOptionsType
}

export default class ReactConductor extends React.Component<ReactConductorProps> {
	canvasContext: CanvasRenderingContext2D
	scene: Scene

	private static defaultProps: Partial<ReactConductorProps> = {
		options: { acceleration: 0.4, lineWidth: 6, circleRadius: 100, fps: 60 }
	}

	constructor(props: ReactConductorProps) {
		super(props)
	}

	componentDidMount() {
		const props = {
			...this.props,
			options: {
				...ReactConductor.defaultProps.options,
				...this.props.options
			}
		}
		this.scene = new Scene(this.canvasContext, props)
		window.requestAnimationFrame(this.animationStep.bind(this))
	}

	public animationStep() {
		setTimeout(() => {
			window.requestAnimationFrame(this.animationStep.bind(this))
			const timeSinceStart = this.props.startTime
				? this.props.audioContext.currentTime - this.props.startTime
				: null
			this.scene.drawFrame(timeSinceStart)
		}, 1000 / this.props.options.fps)
	}

	public render() {
		return (
			<canvas
				id="react-conductor-canvas"
				ref={c => (this.canvasContext = c.getContext('2d'))}
				height={this.props.height}
				width={this.props.width}
			/>
		)
	}
}
