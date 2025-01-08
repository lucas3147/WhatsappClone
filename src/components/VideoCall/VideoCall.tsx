import { VideoCallProps } from "@/types/VideoCall/VideoCallType";
import { SliderRightContainer } from "../StyledComponents/Containers/Slider"
import { CloseAreaRight } from "../Containers/CloseAreaRight";
import IconItem from "../Icons/IconItem";
import * as WebRTC from "@/communication/webrtc/WebRTC";
import { useEffect, useRef, useState } from "react";
import { setUuidOnSessionStorage } from "@/utils/GenerateId";
import { CircularProgress } from "@mui/material";

const VideoCall = ({show, setShow, otherUser, setShowMenu} : VideoCallProps) => {
    

    const myWebCamRef = useRef<any>();
    const otherWebCamRef = useRef<any>();
    const sectionCamRef = useRef<any>();

    const [videoOn, setVideoOn] = useState(false);
    const [audioOn, setAudioOn] = useState(false);
    const [otherWebcamOn, setOtherWebcamOn] = useState(false);
    const [connectionServerOn, setConnectionServerOn] = useState(false);
    const [socketClient, setSocketClient] = useState<WebSocket | undefined>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (videoOn == true || audioOn == true) {
            handleUpdateWebcam();
        }
        else 
        {
            handleDisconnectWebcam();
        }
    }, [videoOn, audioOn]);

    useEffect(() => {

        handleConnectServer();
        setShowMenu(false);

        return () => {
            handlePeerDisconnect();
            setShowMenu(true);
        };
    }, []);

    async function handleUpdateWebcam() {
        try {
            if (!WebRTC.localStream) {
                let stream = await navigator.mediaDevices.getUserMedia({
                    video: videoOn,
                    audio: audioOn,
                });

                WebRTC.setLocalStream(stream);

                playMyWebcam(stream); 
                
                if (connectionServerOn) {
                    WebRTC.addTransceiver(stream);
                }
            } else {
                const videoTrack = WebRTC.localStream.getVideoTracks()[0];
                const audioTrack = WebRTC.localStream.getAudioTracks()[0];
    
                if (videoTrack) {
                    videoTrack.enabled = videoOn;
                } else if (videoOn) {
                    const newVideoTrack = (await navigator.mediaDevices.getUserMedia({ video: true })).getVideoTracks()[0];
                    WebRTC.addTracksOnPeerConnection(newVideoTrack);
                }
    
                if (audioTrack) {
                    audioTrack.enabled = audioOn;
                } else if (audioOn) {
                    const newAudioTrack = (await navigator.mediaDevices.getUserMedia({ audio: true })).getAudioTracks()[0];
                    WebRTC.addTracksOnPeerConnection(newAudioTrack);
                }
            }
        } catch (error) {
            console.error('Erro ao atualizar mídia:', error);
        }
    }

    const handleConnectServer = () => {
        try
        {
            const uuid = setUuidOnSessionStorage();

            const endpointWebSocket = getEndpointSocket();

            const socketClient = new WebSocket(endpointWebSocket);
        
            socketClient.addEventListener('open', () => {
                socketClient.send(JSON.stringify({ type: 'register', data: uuid }));
            });
        
            socketClient.addEventListener('message', (event) => {
                const response = JSON.parse(event.data);
                
                if (response.type === 'open') {
                    WebRTC.createLocalConnection();
                    WebRTC.handleNegotiationNeeded((localDescription) => socketClient.send(JSON.stringify({type: 'offer', data: localDescription})));
                    WebRTC.handleICECandidateEvent((candidate) => socketClient.send(JSON.stringify({type: 'ice-candidate', data: candidate})));
                    WebRTC.handleICEConnectionStateChangeEvent(closeVideoCall);
                    WebRTC.handleTrackReceive((event) => {
                        if (event.streams[0]) {
                            PlayOtherWebcam(event.streams[0]);
                        }
                    });
                    WebRTC.handleSignalingStateChange(closeVideoCall);
                    setConnectionServerOn(true);
                    setIsLoading(false);
                }
                if (response.type === 'ice-candidate') {
                    WebRTC.addIceCandidate(response.data);
                }
                if (response.type === 'answer') {
                    WebRTC.setRemoteDescription(response.data);
                    WebRTC.addRemoteDescriptionAnswer();
                }
                if (response.type === 'offer') {
                    if (!WebRTC.localConnection) {
                        WebRTC.createLocalConnection();
                        WebRTC.handleNegotiationNeeded((localDescription) => socketClient.send(JSON.stringify({type: 'offer', data: localDescription})));
                        WebRTC.handleICECandidateEvent((candidate) => socketClient.send(JSON.stringify({type: 'ice-candidate', data: candidate})));
                        WebRTC.handleICEConnectionStateChangeEvent(closeVideoCall);
                        WebRTC.handleTrackReceive((event) => {
                            if (event.streams[0]) {
                                PlayOtherWebcam(event.streams[0]);
                            }
                        });
                        WebRTC.handleSignalingStateChange(closeVideoCall);
                    }   
                    
                    WebRTC.setRemoteDescription(response.data);
                    WebRTC.addRemoteDescriptionOffer((localDescription) => socketClient.send(JSON.stringify({ type: 'answer', data: localDescription })));
                }
                if (response.type === 'hang-up') {
                    closeVideoCall();
                }
                if (response.type === 'close-other-webcam') {
                    closeOtherWebcam();
                }
            });

            socketClient.addEventListener("close", () => {
                setConnectionServerOn(false);
                handlePeerDisconnect();
            });

            setSocketClient(socketClient);
        } 
        catch (e) 
        {
            alert('Não foi possível estabelecer conexão com o servidor');
        }
    }

    const getEndpointSocket = () : string => {
        switch (process.env.NODE_ENV) {
            case 'production':
                return process.env.NEXT_PUBLIC_ENDPOINT_SOCKET_WEBRTC ?? '';
            case 'test':
                return process.env.NEXT_PUBLIC_ENDPOINT_SOCKET_WEBRTC_DEV ?? '';
            case 'development':
                return process.env.NEXT_PUBLIC_ENDPOINT_SOCKET_WEBRTC_DEV ?? '';
            default:
                return '';
        }
    }

    const closeVideoCall = () => {
        closeOtherWebcam();
        WebRTC.disconnectedPeer();
    }

    const sendToServer = (message: any) => {
        if (socketClient && socketClient.readyState == 1) {
            socketClient.send(jsonFromString(message));
        }
    }

    const jsonFromString = (json: JSON) => {
        return JSON.stringify(json);
    }

    const handlePeerDisconnect = () => {
        closeVideoCall();
        sendToServer({type: 'hang-up'});
        closeSocket();
    }

    const closeSocket = () => {
        if (socketClient?.readyState == 1) {
            socketClient?.close();
        }
    }

    const PlayOtherWebcam = (stream: MediaStream) => {
        otherWebCamRef.current.srcObject = stream;
        setOtherWebcamOn(true);
    }

    const playMyWebcam = (stream: MediaStream) => {
        myWebCamRef.current.load();
        myWebCamRef.current.srcObject = stream;
    }

    function handleDisconnectWebcam() {
        if (WebRTC.localStream) {
            WebRTC.removeTracksMyStream();
            sendToServer({ type: 'close-other-webcam' });
        }
        closeMyWebcam();
    }

    const closeOtherWebcam = () => {
        if (otherWebCamRef.current){
            const mediaStream = otherWebCamRef.current.srcObject as MediaStream;
            if (mediaStream) {
                mediaStream
                .getTracks()
                .forEach(track => track.stop());
            }
            otherWebCamRef.current.removeAttribute("src");
            otherWebCamRef.current.removeAttribute("srcObject");
            setOtherWebcamOn(false);
        }
    }

    const closeMyWebcam = () => {
        if (myWebCamRef.current) {
            myWebCamRef.current.pause();
            const mediaStream = myWebCamRef.current.srcObject as MediaStream;
            if (mediaStream) {
                mediaStream
                .getTracks()
                .forEach(track => track.stop());
            }
            myWebCamRef.current.removeAttribute("src");
            myWebCamRef.current.removeAttribute("srcObject");
        }
    }

    const handleCloseVideoCall = () => {
        WebRTC.removeTracksMyStream();

        if (connectionServerOn) {
            handlePeerDisconnect();
        }
        
        setShow(false);
    }

    return (
        <SliderRightContainer className={show ? 'openFlap' : 'closeFlap'}>
            <CloseAreaRight
                closeClick={handleCloseVideoCall}
            />
            <div ref={sectionCamRef} className="flex-1 bg-[white] flex items-center justify-center relative p-2">
                {!isLoading &&
                    <div className="w-full h-full p-2">
                        <div className={`w-[20vw] h-[20svh] p-[2px] bg-zinc-600 flex justify-center rounded-md right-6 absolute bottom-[100px] z-10`}>
                            <div className="w-full h-full bg-zinc-900 inline-block overflow-hidden rounded-md">
                                <video
                                    ref={myWebCamRef}
                                    autoPlay
                                    muted
                                    className="relative top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-auto"
                                    style={{ display: videoOn ? 'block' : 'none' }}
                                >
                                </video>
                            </div>
                        </div>

                        <div className="w-full h-full bg-zinc-600 flex justify-center p-[2px] rounded-md">
                            <div className="w-full h-full bg-zinc-900 inline-block overflow-hidden rounded-md">
                                <video
                                    ref={otherWebCamRef}
                                    autoPlay
                                    className="relative top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-auto h-full"
                                    style={{ display: otherWebcamOn ? 'block' : 'none' }}
                                >
                                </video>
                            </div>
                        </div>
                    </div>
                }
                {isLoading &&
                    <>
                        <CircularProgress style={{ color: "#00A884" }} />
                    </>
                }
                <div className="flex justify-between items-center px-1 w-44 h-16 rounded-[40px] bg-zinc-600 border-2 absolute z-20 bottom-6">
                    <IconItem
                        type={videoOn == true ? 'NoPhotographyIcon' : 'MonochromePhotosOutlinedIcon'}
                        style={{
                            width: '45px',
                            height: '45px',
                            padding: '5px',
                            borderRadius: '25px',
                            color: '#fff',
                            cursor: 'pointer'
                        }}
                        onclick={() => setVideoOn(!videoOn)}
                    />

                    <IconItem
                        type={audioOn == true ? 'MicOffIcon' : 'KeyboardVoiceIcon'}
                        style={{
                            width: '45px',
                            height: '45px',
                            padding: '5px',
                            borderRadius: '25px',
                            color: '#fff',
                            cursor: 'pointer'
                        }}
                        onclick={() => setAudioOn(!audioOn)}
                    />

                    <IconItem
                        type='VideocamOff'
                        style={{
                            width: '45px',
                            height: '45px',
                            padding: '5px',
                            borderRadius: '25px',
                            color: 'red',
                            cursor: 'pointer'
                        }}
                        onclick={handleCloseVideoCall}
                    />

                </div>
            </div>
        </SliderRightContainer>
    )
}

export default VideoCall;