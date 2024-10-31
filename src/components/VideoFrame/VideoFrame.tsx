import './VideoFrame.css';
import { useEffect } from 'react';

export function VideoFrame() {
  useEffect(() => {
    const videoEl:HTMLElement | null = document.getElementById('videoStream');

    if (!videoEl) {
      return;
    }

    const ws = new WebSocket('wss://sweeping-snail-new.ngrok-free.app/ws');

    console.log('Connecting to WebSocket server...');

    ws.onopen = function () {{
      console.log('WebSocket connection established');
    }};

    ws.onmessage = (event) => {
      console.log('Received message from WebSocket');
      const blob = new Blob([event.data], { type: 'image/jpeg' });

      if (videoEl instanceof HTMLImageElement) {
        videoEl.src = URL.createObjectURL(blob);
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
    <div>
      <img id="videoStream" alt="alt" />
    </div>
  );
}
