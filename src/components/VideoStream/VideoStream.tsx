import type { FC } from 'react';
import {useWebRTCSession} from "@/hooks/useWebRTCSession";

const VideoStream: FC = () => {
  const {
    localSD,
    remoteSD,
    logs,
    videoRef,
    isPublisher,
    setRemoteSD,
    createSession,
    startSession,
    resetSession,
  } = useWebRTCSession();

  return (
    <div>
      {isPublisher === null ? (
        <div>
          <button onClick={() => createSession(true)}>Publish a Broadcast</button>
          <button onClick={() => createSession(false)}>Join a Broadcast</button>
        </div>
      ) : (
        <div id="signalingContainer">
          <div>
            <label>Browser Base64 Session Description</label>
            <br />
            <textarea
              id="localSessionDescription"
              readOnly
              value={localSD}
            />
            <br />
          </div>
          <div>
            <label>Golang Base64 Session Description</label>
            <br />
            <textarea
              id="remoteSessionDescription"
              value={remoteSD}
              onChange={(e) => setRemoteSD(e.target.value)}
            />
            <br />
            <button onClick={startSession}>Start Session</button>
          </div>
          <button onClick={resetSession}>Reset</button>
        </div>
      )}

      <div>
        <h3>Video</h3>
        {isPublisher && <video id="video1" width={160} height={120} autoPlay muted ref={videoRef} />}
      </div>

      <div>
        <h3>Logs</h3>
        <div id="logs">
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoStream;
