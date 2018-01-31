import {api_root} from './const'

export default function post(imgDataURI) {
  const body = JSON.stringify({
    img: imgDataURI
  })
  
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  
  return fetch(api_root + '/images', {
    method: 'POST', headers, body
  }).then((res) => res.json()).catch((error) => {
    return {error}
  })
}
