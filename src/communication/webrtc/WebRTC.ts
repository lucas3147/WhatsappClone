export var localConnection: RTCPeerConnection;
export var sendChannel: RTCDataChannel;
export var remoteDescription: RTCSessionDescription | null;
var contraints: MediaStreamConstraints | undefined;
var transceiver: (track: any) => RTCRtpTransceiver;

export function createLocalConnection () {
    localConnection = new RTCPeerConnection();
}

export async function addIceCandidate(candidateObj: RTCIceCandidate) {
    const candidate = new RTCIceCandidate(candidateObj);
    try {
        await localConnection.addIceCandidate(candidate)
    } catch (err) {
        handleAddCandidateError();
    }
}

export function handleICECandidateEvent(callbackSuccess: (candidate: RTCIceCandidate) => void) {
    localConnection.onicecandidate = e => {
        if (e.candidate) {
            callbackSuccess(e.candidate);
        }
    }
}

export async function createOffer(callbackSuccess: () => void) {
    localConnection.createOffer()
    .then(offer => localConnection.setLocalDescription(offer))
    .then(() => {
        callbackSuccess();
    })
    .catch(handleCreateDescriptionError);
}

export async function addRemoteDescriptionAnswer() {
    if (remoteDescription) {
        await localConnection
        .setRemoteDescription(remoteDescription)
        .catch(handleCreateDescriptionError);
    }
}

export function disconnectedPeer() {
    if (localConnection) {
        localConnection.ontrack = null;
        localConnection.onicecandidate = null;
        localConnection.onnegotiationneeded = null;
        localConnection.oniceconnectionstatechange = null;
        localConnection.onicegatheringstatechange = null;
        localConnection.onsignalingstatechange = null;

        if (localConnection.iceConnectionState != 'closed') {
            localConnection.getTransceivers().forEach(transceiver => {
                transceiver.stop();
            });
        }

        localConnection.close();
        remoteDescription = null;
    }
}

export async function handleNegotiationNeeded(sendToServer: (localDescription: RTCSessionDescription | null) => void) {
    localConnection.onnegotiationneeded = async () => {
        try {
            const offer = await localConnection.createOffer();

            if (localConnection.signalingState != "stable") {
                return;
            }
    
            await localConnection.setLocalDescription(offer);
    
            sendToServer(localConnection.localDescription);
    
        } catch (err) {
            console.log("Error na negociação");
        };
    }
}

export async function addRemoteDescriptionOffer(sendToServer: (localDescription: RTCSessionDescription | null) => void) {
    if (remoteDescription) {
        if (localConnection.signalingState != "stable") {
            await Promise.all([
                localConnection.setLocalDescription({ type: "rollback" }),
                localConnection.setRemoteDescription(remoteDescription)
            ]);
            return;
        } else {
            await localConnection.setRemoteDescription(remoteDescription);
        }

        await localConnection.setLocalDescription(await localConnection.createAnswer());

        sendToServer(localConnection.localDescription);
    }
}

export function setRemoteDescription(data: any) {
    remoteDescription = new RTCSessionDescription(data);
}

export function handleTrackReceive(webcamCallback: (this: RTCPeerConnection, ev: RTCTrackEvent) => void) {
    localConnection.ontrack = webcamCallback;
}

export function handleICEConnectionStateChangeEvent(closeCall: () => void) {
    localConnection.oniceconnectionstatechange = () => {
        switch(localConnection.iceConnectionState) {
            case "closed":
            case "failed":
            case "disconnected":
              closeCall();
              break;
          }
    }
}

export function handleSignalingStateChange(closeConnection: () => void) {
    localConnection.onsignalingstatechange = (event) => {
        if (localConnection.signalingState == 'closed'){
            console.log('conexão fechada');
        }
    }
}

export function setContrainsts(contrains: MediaStreamConstraints | undefined) {
    contraints = contrains;
}

export async function addTransceiver(stream: MediaStream) {
    stream.getTracks().forEach(
        transceiver = track => localConnection.addTransceiver(track, {streams: [stream]})
    );
}

function handleCreateDescriptionError(error: any) {
    console.log("Unable to create an offer: " + error.toString());
}
function handleAddCandidateError() {
  console.log("Oh noes! addICECandidate failed!");
}