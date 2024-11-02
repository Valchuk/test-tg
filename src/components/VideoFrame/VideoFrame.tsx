import './VideoFrame.css';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { useLaunchParams } from '@telegram-apps/sdk-react';

const FALLBACK_URL = 'sweeping-snail-new.ngrok-free.app';
const DEFAULT_FRAME_SIZE = 400;
const FRAME_SIZE_STEP = 100;

export function VideoFrame() {
  const lp = useLaunchParams();
  const videoEl = useRef<HTMLImageElement | null>(null);
  const [frameSize, setFrameSize] = useState<number>(DEFAULT_FRAME_SIZE);

  const handleFrameSize = (event: MouseEvent<HTMLButtonElement>) => {
    const action = (event.currentTarget as HTMLButtonElement).name;
    setFrameSize((prevState) =>
      action === 'decrease' ? prevState - FRAME_SIZE_STEP : prevState + FRAME_SIZE_STEP
    );
  };

  useEffect(() => {
    if (!videoEl.current) {
      return;
    }

    const ws = new WebSocket(`wss://${lp.startParam || FALLBACK_URL}/wfs`);

    console.log('Connecting to WebSocket server...');

    ws.onopen = function () {{
      console.log('WebSocket connection established');
    }};

    ws.onmessage = (event) => {
      console.log('Received message from WebSocket');

      const blob = new Blob([event.data], { type: 'image/jpeg' });

      if (videoEl.current instanceof HTMLImageElement) {
        videoEl.current.src = URL.createObjectURL(blob);
      }
    };

    ws.onclose = function () {{
      console.log('WebSocket connection closed');
    }};

    ws.onerror = function (error) {{
      console.error('WebSocket error:', error);
    }};

    return () => {
      ws.close();
      console.log('Cleaning up WebSocket connection');
    };
  }, []);

  return (
    <div className="video-frame__root">
      <div className="video-frame__content">
        {'lp.startParam'}:{lp.startParam}
        <br />
        <img
          id="videoStream"
          alt="alt"
          height={frameSize}
          width={frameSize}
          ref={(el) => (videoEl.current = el)}
        />
      </div>

      <div className="video-frame__controls">
        <p>Change frame size:</p>

        <button
          type="button"
          onClick={handleFrameSize}
          disabled={frameSize === DEFAULT_FRAME_SIZE}
          name="decrease"
          className="video-frame__button"
        >
          -
        </button>
        <button
          type="button"
          onClick={handleFrameSize}
          disabled={frameSize - FRAME_SIZE_STEP === window.innerWidth}
          name="increase"
          className="video-frame__button"
        >
          +
        </button>
      </div>
    </div>
  );
}
