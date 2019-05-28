/*  
  
  function gotDevices(deviceInfos) {
    console.log("coucoux");
    console.log(deviceInfos);
    for (var i = 0; i !== deviceInfos.length; ++i) {
      var deviceInfo = deviceInfos[i];
      var option = document.createElement('option');
      option.value = deviceInfo.deviceId;
      console.log(deviceInfo.label);
    } 
  }

  function gotStream(stream) {
    console.log("stream");
    console.log(stream);
    console.log(stream.getUserMedia);
    console.log();
    window.stream = stream; // make variable available to browser console
    return navigator.mediaDevices.enumerateDevices();
  }

  function handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
  }
  

document.querySelector('#get-access').addEventListener('click', async function init(e) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      }).then(gotStream).then(gotDevices).catch(handleError);

      const videoTracks = stream.getVideoTracks();
      const track = videoTracks[0]
      alert(`Getting video from: ${track.label}`)
      document.querySelector('video').srcObject = stream
      document.querySelector('#get-access').setAttribute('hidden', true)
      setTimeout(() => { track.stop() }, 3 * 1000)
    } catch (error) {
      alert(`${error.name}`)
      console.error(error)
    }
  })
  
*/

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyD8ogXw5ztNWzqGl_c6Kss4y_C_VUgwP0A",
  authDomain: "mixer-webrtc.firebaseapp.com",
  databaseURL: "https://mixer-webrtc.firebaseio.com",
  projectId: "mixer-webrtc",
  storageBucket: "mixer-webrtc.appspot.com",
  messagingSenderId: "1068646898283",
  appId: "1:1068646898283:web:4f17d7e16307fad0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database().ref();
var yourVideo = document.getElementById("yourVideo");
var friendsVideo = document.getElementById("friendsVideo");
var yourId = Math.floor(Math.random()*1000000000);
var servers = {'iceServers': []};
var pc = new RTCPeerConnection(servers);
pc.onicecandidate = (event => event.candidate?sendMessage(yourId, JSON.stringify({'ice': event.candidate})):console.log("Sent All Ice") );
pc.onaddstream = (event => friendsVideo.srcObject = event.stream);

function sendMessage(senderId, data) {
 var msg = database.push({ sender: senderId, message: data });
 msg.remove();
}

function readMessage(data) {
 var msg = JSON.parse(data.val().message);
 var sender = data.val().sender;
 if (sender != yourId) {
  if (msg.ice != undefined)
    pc.addIceCandidate(new RTCIceCandidate(msg.ice));
  else if (msg.sdp.type == "offer")
    pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
    .then(() => pc.createAnswer())
    .then(answer => pc.setLocalDescription(answer))
    .then(() => sendMessage(yourId, JSON.stringify({'sdp': pc.localDescription})));
  else if (msg.sdp.type == "answer")
    pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
  }
};

database.on('child_added', readMessage);

function showMyFace() {
 navigator.mediaDevices.getUserMedia({audio:true, video:true})
 .then(stream => yourVideo.srcObject = stream)
 .then(stream => pc.addStream(stream));
}

function showFriendsFace() {
 pc.createOffer()
 .then(offer => pc.setLocalDescription(offer) )
 .then(() => sendMessage(yourId, JSON.stringify({'sdp': pc.localDescription})) );
}
