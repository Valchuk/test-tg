import { useState, useRef } from 'react';

export const useWebRTCSession = () => {
  const [localSD, setLocalSD] = useState<string>('');
  const [remoteSD, setRemoteSD] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [isPublisher, setIsPublisher] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  const log = (msg: string) => setLogs((prev) => [...prev, msg]);

  const createSession = (publisher: boolean) => {
    setIsPublisher(publisher);

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.oniceconnectionstatechange = () => log(pc.iceConnectionState);
    pc.onicecandidate = (event) => {
      if (event.candidate === null) {
        setLocalSD(btoa(JSON.stringify(pc.localDescription)));
      }
    };

    if (publisher) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          stream.getTracks().forEach((track) => pc.addTrack(track, stream));
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          return pc.createOffer();
        })
        .then((offer) => pc.setLocalDescription(offer))
        .catch((error) => log(`Error: ${error.message}`));
    } else {
      pc.addTransceiver('video');
      pc
        .createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .catch((error) => log(`Error: ${error.message}`));

      pc.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
          videoRef.current.autoplay = true;
          videoRef.current.controls = true;
        }
      };
    }

    pcRef.current = pc;
  };

  const startSession = () => {
    if (!remoteSD) {
      alert('Session Description must not be empty');
      return;
    }

    try {
      const parsedSD = JSON.parse(atob(remoteSD));
      pcRef.current?.setRemoteDescription(new RTCSessionDescription(parsedSD));
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const resetSession = () => {
    setIsPublisher(null);
    setLocalSD('');
    setRemoteSD('');
    setLogs([]);
    pcRef.current?.close();
    pcRef.current = null;
  };

  return {
    localSD,
    remoteSD,
    logs,
    videoRef,
    isPublisher,
    setRemoteSD,
    createSession,
    startSession,
    resetSession,
  };
};
