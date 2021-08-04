from flask import Flask
from flask_socketio import SocketIO
from flask import request
from flask_cors import CORS
from twilio.base.exceptions import TwilioRestException
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VoiceGrant
from twilio.twiml.voice_response import VoiceResponse, Dial
import config

app = Flask(__name__)
CORS(app)
#app.config['SECRET_KEY'] = 'secret!'
#socketio = SocketIO(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route("/token")
def token():
    # Create access token with credentials
    token = AccessToken(config.account_sid, config.api_key, config.api_secret)

    # Create a Voice grant and add to token
    voice_grant = VoiceGrant(
        outgoing_application_sid=config.TwiML_app_sid
    )
    token.add_grant(voice_grant)

    # Return token info as JSON
    return token.to_jwt()

@app.route("/dial", methods=['POST'])
def dial():
    response = VoiceResponse()
    dial = Dial(caller_id=config.my_Twilio_number)
    dial.number(
        request.form.get('number'),
        status_callback_event='ringing answered completed',
        status_callback='https://5ab34c7652e1.ngrok.io/callStatus',
        status_callback_method='POST'
    )
    response.append(dial)
    return str(response)

@app.route("/callStatus", methods=['POST'])
def callStatus():
    socketio.emit('callStatus', request.form.get('CallStatus'))
    return '', 204

if __name__ == "__main__":
    socketio.run(app)
    #socketio.run(app, debug=True)
    #app.run(debug=True)