var connection = new RTCMultiConnection();

// this line is VERY_important
connection.socketURL = 'https://192.168.1.14:9001/';

// all below lines are optional; however recommended.

connection.userid = 'source-' + connection.userid;

connection.session = {
    oneway: true,
};

connection.dontCaptureUserMedia = true;
connection.dontGetRemoteStream = true;

//UserMedia WebRTC natif
connection.mediaConstraints = {
    audio: {
        sampleRate: 48000,
        sampleSize: 24,
        channelCount: 2,
        volume: 1.0,
        autoGainControl: false,
        echoCancellation: false,
        noiseSuppression: false,
    },
    video: false
};

connection.iceServers = [];

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: false,
    OfferToReceiveVideo: false
};


connection.onstream = function(event) {
    console.log(event);
    console.log("new STREAM");
    console.log("EVENT " + event.streamid);
    if (event.userid != connection.userid) {
        connection.removeStream(event.streamid);
    }
    document.body.appendChild( event.mediaElement );
};

//Functions
function sendStreamToUser(userid) {
    console.log('==> Sharing audio to ' + userid);
    connection.peers[userid].addStream({
        audio: true,
        oneway: true,
        streamCallback: function(stream) {
            console.log('==> Audio successfully shared to ' + userid);
            console.log(stream);
        }
    });
}

function isDestinationUser(userid) {
    return userid.substring(0, 11) == "destination";
}
//

connection.onSettingLocalDescription = function(event) {
    console.log("onSettingLocalDescription");
    console.log(event);
    if (event.connectionDescription && isDestinationUser(event.userid)) {
        console.log("Destination user found adding stream: " + event.userid);
        console.log(connection);
        sendStreamToUser(event.userid);
    }
};


connection.onNewParticipant = function(participantId, userPreferences) {//override de la fonction de base new participant qui semble ajouter/partager le stream de tous les users qui join
  console.log(participantId);
  if (isDestinationUser(participantId)) {
      console.log('isDestination');
      sendStreamToUser(participantId);
  }
};

var predefinedRoomId = '437829';

window.addEventListener("DOMContentLoaded", function() {
  document.getElementById('btn-join-room').onclick = function() {
      this.disabled = true;
      connection.openOrJoin( predefinedRoomId);
  };
}, false);
