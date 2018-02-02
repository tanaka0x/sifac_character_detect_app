import React from 'react'

const labelColor = {
  honoka: '#FFA500',
  eli: '#ADD8E6',
  kotori: '#A9A9A9',
  umi: '#0000FF',
  rin: '#FFFF00',
  maki: '#FF0000',
  hanayo: '#008000',
  nico: '#FFC0CB',
  nozomi: '#9400D3'
}

export default class DetectionView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      src: null
    }
  }
  
  updateImg(src, result, width, height) {
    if (!src) {
      this.setState({src: null})
      return
    }

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = width
    canvas.height = height
    this._img.onload = (ev) => {
      ctx.drawImage(this._img, 0, 0, width, height, 0, 0, width, height)
      if (this.props.result) {
        this.props.result.forEach((item) => {
          const {xmin, ymin, xmax, ymax, label} = item
          ctx.strokeStyle = labelColor[label]
          ctx.lineWidth = 3

          ctx.strokeRect(xmin, ymin, xmax - xmin, ymax - ymin)
        })
      }

      this.setState({src: canvas.toDataURL()})
    }
    
    this._img.src = src
  }
  
  componentDidMount() {
    const {src, result, width, height} = this.props
    this._img = new Image()
    this.updateImg(src, result, width, height)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.src !== nextProps.src || this.props.result !== nextProps.result) {
      const {src, result, width, height} = nextProps
      this.updateImg(src, result, width, height)
    }
  }

  render() {
    const {src} = this.state
    const {imgStyle} = this.props
    if (src) {
      return (<img src={src} style={imgStyle}/>)
    }
    return null
  }
}
