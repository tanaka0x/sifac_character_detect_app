import React from 'react'
import Link from 'gatsby-link'
import resize from '../lib/resize'
import post from '../api/post'

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      src: null,
      requesting: false,
      requestError: null
    }
  }

  startRequest = () => {
    this.setState({requesting: true})
  }
  
  finishRequest = (obj) => {
    if (!obj) {
      obj = {}
    }
    this.setState(Object.assign({requesting: false}, obj))
  }
  
  onPressButton = () => {
    this.setState({requesting: true})
    const finalizer = this.finishRequest
    let canvas = document.createElement('canvas')
    resize(canvas, e.target.result, 300, 300).then((result) => {
      return post(result.src).then((resData) => ({
        resize: result,
        response: resData
      }))
    }).then((result) => {
      // draw img and rects on canvas
    }).catch((error) => {
      finalizer({error})
    })
  }
  
  onFileChange = (ev) => {
    if (!ev.target.files || ev.target.files.length === 0) {
      return
    }
    let c = this
    let reader = new FileReader()
    let file = ev.target.files[0]
    let filename = file.name
    reader.onload = function(e) {
      c.setState({src: e.target.result})
    }

    reader.readAsDataURL(file)
  }

  render() {
    const img = this.state.src !== null ? (<img src={this.state.src} />) : null

    return (
      <div>
          <input type='file' name='img' onChange={this.onFileChange} />
          {img}
      </div>
    )
  }
}

export default IndexPage
