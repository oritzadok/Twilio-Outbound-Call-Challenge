import React, {useState, useEffect} from 'react'
import { Device } from 'twilio-client'
import io from 'socket.io-client'

function App() {
  const [number, setNumber] = useState("")
  const [callStatus, setCallStatus] = useState("")
  const [device, setDevice] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const device = new Device()
 
    fetch("http://localhost:5000/token").then(
      data => data.text()
    ).then(
      token => {
        device.setup(token, {debug: true}) 
      }
    )
    
    device.on('ready', (device) => {
      setDevice(device)
      console.log("Twilio.Device is now ready for connections")
    })
    device.on('connect', connection => {
      setBusy(true)
      setCallStatus("")
      console.log("connect event")
    })
    device.on('disconnect', () => {
      setBusy(false)
      console.log("disconnect event")
    })
    device.on('error', (error) => {
      console.log(error.message)
    })

    const socket = io('http://localhost:5000')
    socket.on("callStatus", data => {
      setCallStatus(data)
    })

    return () => {
      device.destroy()
      setDevice(null)
    }   
  }, [])

  /*const socket = io('http://localhost:5000')
  socket.on("callStatus", data => {
    setCallStatus(data)
  })*/

  const call = (e) => {
    device.connect({number: number})
  }
  const hangUp = (e) => {
    device.disconnectAll()
  }

  return (
    <div>
      <h1>Twilio Outbound Call</h1>
      <label htmlFor="to">Phone number to call: </label>
      <input
        id="to"
        onChange={(e) => {setNumber(e.target.value)}}
        value={number}
        placeholder="E.g. +972525553316"
        disabled={busy}
      />
      <button onClick={call} disabled={busy}> Call now! </button>
      <button onClick={hangUp} disabled={!busy}> Hang up </button>
      <br/>
      <br/>
      <div>
        <label>Call status: 
          <b> {callStatus} </b>
        </label>
      </div>
    </div>
  )
}

export default App



/*
TODOS:
- Add "proxy": "http://localhost:5000" in package.json
*/