import { VideoCallProps } from "@/types/VideoCall/VideoCallType";
import { SliderRightContainer } from "../StyledComponents/Containers/Slider"
import { CloseAreaRight } from "../Containers/CloseAreaRight";
import IconItem from "../Icons/IconItem";
import * as WebRTC from "@/communication/webrtc/WebRTC";
import { useEffect, useRef, useState } from "react";

const VideoCall = ({show, setShow} : VideoCallProps) => {
    
    const myWebCamRef = useRef<any>();
    const otherWebCamRef = useRef<any>();

    const [videoOn, setVideoOn] = useState(false);
    const [audioOn, setAudioOn] = useState(false);
    const [otherWebcamOn, setOtherWebcamOn] = useState(false);
    const [connectionServerOn, setConnectionServerOn] = useState(false);
    const [socketClient, setSocketClient] = useState<WebSocket | undefined>();

    useEffect(() => {
        if (videoOn == true || audioOn == true) {
            handleConnectWebcam();
        }
        else 
        {
            handleDisconnectWebcam();
        }
    }, [videoOn, audioOn])

    async function handleConnectWebcam()  {
        try {
            restartMyWebcam();
            const stream = await navigator.mediaDevices.getUserMedia({video: videoOn, audio: audioOn});
            playMyWebcam(stream);

            if (connectionServerOn) {
                WebRTC.addTransceiver(stream);
            }

        } catch (error) {
            console.error('Erro ao enviar mídia:', error);
        }
    }

    const handleConnectServer = () => {
        try
        {
            const endpointSocket = 'ws://localhost:3001';
            //const endpointSocket = 'wss://socket-webrtc.onrender.com';
            const socketClient = new WebSocket(endpointSocket);
        
            socketClient.addEventListener('open', () => {
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
            });
        
            socketClient.addEventListener('message', (event) => {
                const response = JSON.parse(event.data);
                
                if (response.type === 'open') {
                    setConnectionServerOn(true);
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
            console.log('Não foi possível estabelecer conexão com o servidor', e);
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

    const restartMyWebcam = () => {
        if (myWebCamRef.current && myWebCamRef.current.srcObject) {
            handleDisconnectWebcam();
        }
    }

    const playMyWebcam = (stream: MediaStream) => {
        myWebCamRef.current.load();
        myWebCamRef.current.srcObject = stream;
    }

    const handleDisconnectWebcam = () => {
        closeMyWebcam();
        sendToServer({type: 'close-other-webcam'});
    }

    const closeOtherWebcam = () => {
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

    const closeMyWebcam = () => {
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

    return (
        <SliderRightContainer className={show ? 'openFlap' : 'closeFlap'}>
            <CloseAreaRight
                closeClick={() => setShow(false)}
            />
            <div className="flex-1 bg-[white] flex items-center justify-center">
                <div className="absolute">
                    <div className={`w-[410px] h-[200px] bg-zinc-600 rounded-md flex p-1 absolute left-[-20px] bottom-[-100px] z-10 border-2 ${connectionServerOn ? 'border-green-600' : 'border-none'}`}>
                        <div
                            className="w-[400px] h-[190px] bg-zinc-900 relative rounded-md flex justify-center"
                        >
                            <div className="uppercase w-16 h-8 absolute top-0 bg-zinc-600 text-stone-50 rounded-bl-md rounded-br-md flex items-center justify-center z-20">
                                you
                                {videoOn && connectionServerOn &&
                                    <div className="w-4 h-4 rounded-[8px] bg-green-600 absolute top-0 right-[-8px]"></div>
                                }
                            </div>
                            <video
                                ref={myWebCamRef}
                                width={420}
                                height={210}
                                autoPlay
                                muted
                                style={{ display: videoOn ? 'block' : 'none' }}
                            >
                            </video>
                        </div>
                    </div>
                    
                    <div className={`w-[1124px] h-[564] bg-zinc-600 rounded-md flex p-1 relative top-[-50px]`}>

                        <div
                            className="w-[1120px] h-[560px] bg-zinc-900 rounded-md relative flex justify-center z-0"
                        >
                            <div className="uppercase w-16 h-8 absolute top-0 bg-zinc-600 text-stone-50 rounded-bl-md rounded-br-md flex items-center justify-center z-40">
                                other
                                {otherWebcamOn &&
                                    <div className="w-4 h-4 rounded-[8px] bg-green-600 absolute top-0 right-[-8px]"></div>
                                }
                            </div>
                            <video
                                ref={otherWebCamRef}
                                width={1120}
                                height={560}
                                autoPlay
                                style={{ display: otherWebcamOn ? 'block' : 'none' }}
                            >
                            </video>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-between items-center px-1 w-44 h-16 rounded-[40px] bg-[#F5F5F5] border-2 absolute bottom-8 shadow-[1px_1px_12px_4px_#ddd]">
                    <IconItem
                        type={videoOn == true ? 'NoPhotographyIcon' : 'MonochromePhotosOutlinedIcon'}
                        style={{
                            width: '45px',
                            height: '45px',
                            padding: '5px',
                            borderRadius: '25px',
                            color: '#91918F',
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
                            color: '#91918F',
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
                            color: '#a7004ef6',
                            cursor: 'pointer'
                        }}
                        onclick={handlePeerDisconnect}
                    />

                </div>
            </div>
        </SliderRightContainer>
    )
}

export default VideoCall;