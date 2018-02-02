import React from 'react'
import Link from 'gatsby-link'
import resize from '../lib/resize'
import post from '../api/post'
import DetectionView from '../components/DetectionView'

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      src: null,
      width: null,
      height: null,
      requesting: false,
      requestError: null,
      result: null,
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
    if (!this.state.src) {
      this.setState({requestError: 'Image was not selected.'})
      return
    }

    this.setState({requesting: true})
    const src = this.state.src
    const finalizer = this.finishRequest
    
    return post(src).then((resData) => {
      // fetch doesnt reject
      if (resData.error) {
        throw resData.error
      }

      finalizer({
        requestError: null,
        result: resData.result
      })
      // draw img and rects on canvas
    }).catch((error) => {
      finalizer({
        requestError: error,
        result: null
      })
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
      let canvas = document.createElement('canvas')
      resize(canvas, e.target.result, 300, 300).then((result) => {
        c.setState({src: result.src, width: result.width, height: result.height})
      })
    }

    reader.readAsDataURL(file)
  }

  render() {
    const {requestError, result, src, width, height, requesting} = this.state
    let msg = null
    if (requesting) {
      msg = 'Now requesting...'
    } else if (requestError) {
      msg = requestError.toString()
    } else if (result) {
      msg = JSON.stringify(result)
    }

    
    return (
      <div>
        <div>
          <DetectionView
            src={src}
            result={result}
            width={width}
            height={height}
          />
        </div>
        <div>
          {msg}
        </div>
        <div>
          <button onClick={this.onPressButton}>Go!</button>
          <input type='file' name='img' onChange={this.onFileChange} />
        </div>

        <div>
          アプリ名、遊び方募集してます => <a href='https://twitter.com/@tanaka_cpp'>@tanaka_cpp</a>
        </div>
      </div>
    )
  }
}

export default IndexPage
