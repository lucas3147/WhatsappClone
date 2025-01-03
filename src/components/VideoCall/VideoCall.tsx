import { VideoCallProps } from "@/types/VideoCall/VideoCallType";
import { SliderRightContainer } from "../StyledComponents/Containers/Slider"
import { CloseAreaRight } from "../Containers/CloseAreaRight";
import IconItem from "../Icons/IconItem";
import * as WebRTC from "@/communication/webrtc/WebRTC";
import { useEffect, useRef, useState } from "react";
import { generateId } from "@/utils/GenerateId";
import { delimitChildBoxDimensions } from "@/utils/BoxDimensions";

const VideoCall = ({show, setShow, otherUser} : VideoCallProps) => {
    
    const myWebCamRef = useRef<any>();
    const otherWebCamRef = useRef<any>();
    const sectionCamRef = useRef<any>();
    const otherVideoCamRef = useRef<any>();
    const myVideoCamRef = useRef<any>();

    const [videoOn, setVideoOn] = useState(false);
    const [audioOn, setAudioOn] = useState(false);
    const [otherWebcamOn, setOtherWebcamOn] = useState(false);
    const [connectionServerOn, setConnectionServerOn] = useState(false);
    const [socketClient, setSocketClient] = useState<WebSocket | undefined>();

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
        const handleResize = () => {
            redimensionarVideos();
        };

        redimensionarVideos();
        handleConnectServer();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            setVideoOn(false);
            setAudioOn(false);
            handlePeerDisconnect();
        };
    }, []);

    function redimensionarVideos() {
        const containerCamPaddingW = 20;
        
        const changedSizes = delimitChildBoxDimensions(
        {
            width: sectionCamRef.current.offsetWidth - containerCamPaddingW, 
            height: sectionCamRef.current.offsetHeight
        },
        {
            width: otherVideoCamRef.current.offsetWidth, 
            height: otherVideoCamRef.current.offsetHeight
        });

        const escalaIrma = myVideoCamRef.current.offsetWidth / otherVideoCamRef.current.offsetWidth;;
    
        otherVideoCamRef.current.style.width = `${changedSizes.width}px`;
        otherVideoCamRef.current.style.height = `${changedSizes.height}px`;

        myVideoCamRef.current.style.width = `${changedSizes.width * escalaIrma}px`;
        myVideoCamRef.current.style.height = `${changedSizes.height * escalaIrma}px`;
    }

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
            let clientId = localStorage.getItem('clientId');

            if (!clientId) {
                clientId = generateId(); 
                localStorage.setItem('clientId', clientId); 
            }

            const endpointWebSocket = getEndpointSocket();

            const socketClient = new WebSocket(endpointWebSocket);
        
            socketClient.addEventListener('open', () => {
                socketClient.send(JSON.stringify({ type: 'register', data: clientId }));
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
                    console.log('Meu client Id: ', response.data);
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

    const restartMyWebcam = () => {
        if (myWebCamRef.current && myWebCamRef.current.srcObject) {
            handleDisconnectWebcam();
        }
    }

    const playMyWebcam = (stream: MediaStream) => {
        myWebCamRef.current.load();
        myWebCamRef.current.srcObject = stream;
    }

    function handleDisconnectWebcam() {
        if (WebRTC.localStream) {
            // Desativa todas as tracks do stream sem reiniciar a conexão
            WebRTC.localStream.getTracks().forEach(track => track.stop());
            WebRTC.setLocalStream(null);
            sendToServer({ type: 'close-other-webcam' });
        }
        closeMyWebcam(); // Fechar visualização local
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
        <SliderRightContainer onLoad={() => console.log('Ativando...')} className={show ? 'openFlap' : 'closeFlap'}>
            <CloseAreaRight
                closeClick={() => {setShow(false);} }
            />
            <div ref={sectionCamRef} className="flex-1 bg-[white] flex items-center justify-center">
                <div className="absolute">
                    <div ref={myVideoCamRef} className={`w-[320px] h-[180px] p-[4px] bg-zinc-600 rounded-md flex justify-center absolute left-[20px] bottom-[-20px] z-10 border-2 ${connectionServerOn ? 'border-green-600' : 'border-none'}`}>
                        <div className="w-full h-full bg-zinc-900 relative rounded-md inline-block overflow-hidden">
                            <video
                                ref={myWebCamRef}
                                autoPlay
                                muted
                                className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-auto"
                                style={{ display: videoOn ? 'block' : 'none' }}
                            >
                            </video>
                        </div>
                    </div>
                    
                    <div ref={otherVideoCamRef} className="w-[1124px] h-[564px] bg-zinc-600 rounded-md flex justify-center p-1 relative top-[-50px]">
                        <div className="uppercase w-auto py-1 px-2 absolute top-0 text-center  bg-zinc-600 text-sm text-stone-50 rounded-bl-md rounded-br-md z-40">
                            {otherUser.displayName}
                            {otherWebcamOn &&
                                <div className="w-4 h-4 rounded-[8px] bg-green-600 absolute top-0 right-[-8px]"></div>
                            }
                        </div>
                        <div className="w-full h-full bg-zinc-900 rounded-md relative inline-block overflow-hidden">
                            <video
                                ref={otherWebCamRef}
                                autoPlay
                                className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-auto"
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