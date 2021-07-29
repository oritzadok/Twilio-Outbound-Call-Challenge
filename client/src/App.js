import React, {useState, useEffect} from 'react'

function App() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [callStatus, setCallStatus] = useState("")

  const call = (event) => {

  }

  return (
    <div>
      <h1>Twilio Outbound Call</h1>
      <form onSubmit={call}>
        <label htmlFor="phone-number-to-call">Phone number to call:</label>
        <br/>
        <input
          id="phone-number-to-call"
          onChange={(e) => {setPhoneNumber(e.target.value)}}
          value={phoneNumber}
          placeholder="Enter phone number..."
        />
        <button> Call now! </button>
      </form>
      <div>
        <label htmlFor="status">
          Destination number: {phoneNumber}
          <br/>
          Phone call status:</label>
        <h3 id="status">{callStatus}</h3>
      </div>
    </div>
  )
}

export default App



/*
TODOS:
- Add "proxy": "http://localhost:5000" in package.json
*/