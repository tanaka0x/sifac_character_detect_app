function resize(canvas, src, minWidth, minHeight) {
  let ctx = canvas.getContext('2d')
  let p = new Promise(function(resolve, reject) {
    let img = new Image()
    img.onload = function(ev) {
      let scale = 1.0
      if (this.width < minWidth || this.height < minHeight) {
        // scale === 1.0
      } else if (this.width > this.height) {
        scale = minHeight / this.height
      } else if (this.width < this.height) {
        scale = minWidth / this.width
      } else if (this.width > minWidth) {
        scale = minWidth / this.width
      }

      const originalWidth = this.width
      const originalHeight = this.height
      const nextWidth = this.width * scale
      const nextHeight = this.height * scale
      canvas.width = nextWidth
      canvas.height = nextHeight
      ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, nextWidth, nextHeight)
      resolve({
        src: canvas.toDataURL(),
        originalWidth, originalHeight,
        width: nextWidth, height: nextHeight,
        scale
      })
    }
    
    img.onerror = function(err) {
      reject(err)
    }
    
    img.src = src
  })

  return p
}

export default resize
