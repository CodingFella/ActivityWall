import { useEffect, useRef } from 'react';
import rough from 'roughjs';
import type { Point } from 'roughjs/bin/geometry';
import './Paper.css';

interface PaperProps {
  year: number;
  route: Point[];
}

function Paper({ year, route }: PaperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);


  // Drawing logic
  useEffect(() => {
    if (canvasRef.current && route.length > 0) {
      const canvas = canvasRef.current;
      const rc = rough.canvas(canvas);
      const context = canvas.getContext('2d');

      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }

      rc.linearPath(route, {
        stroke: '#333',
        strokeWidth: 1.5,
        roughness: 1.2,
        bowing: 1,
      });
    }
  }, [route]);

  return (
    <a
      className="calendar flex flex-col items-center justify-center block h-[16rem] w-[12rem] bg-[url('paper.png')] bg-no-repeat bg-contain bg-center cursor-pointer relative"
    >
      <span className="sr-only">Open {year} calendar</span>

      <canvas
        ref={canvasRef}
        width={300}
        height={400}
        className="pointer-events-none"
        style={{ width: '80%', height: 'auto', marginTop: '32px' }}
      />
    </a>
  );
}

export default Paper;
