const api_root = require('./const').api_root // import doesn't always work

export default function post(imgDataURI) {
  const body = JSON.stringify({
    img: imgDataURI
  })
  
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  
  return fetch(api_root + '/images', {
    method: 'POST', headers, body, mode: 'cors'
  }).then((res) => {
    if (res.status === 200 || res.status >= 400) {
      return res.json()
    } else {
      return { error: res.status }
    }
  })
}
