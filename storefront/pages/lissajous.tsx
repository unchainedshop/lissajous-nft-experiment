import { useLayoutEffect, useRef } from 'react';

const Lissajous = () => {
  const canvasRef = useRef(null);

  useLayoutEffect(() => {
    if (canvasRef?.current) {
      const canvas: HTMLCanvasElement = canvasRef.current;

      const boundingRect = canvas.getBoundingClientRect();

      canvas.height = boundingRect.height;
      canvas.width = boundingRect.width;

      const ctx: CanvasRenderingContext2D = canvas.getContext('2d', {
        alpha: false,
      });

      const radius = canvas.height / 2 - 10;
      const speed = 0.001;
      const steps = 100000;

      const before = new Date();
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Array(steps)
          .fill(0)
          .map((_, i) => {
            const x = 5 + radius * (1 + Math.cos(i * speed * 16));
            const y = 5 + radius * (1 + Math.sin(i * speed * 15));

            ctx.strokeStyle = '#ff9999';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, 1 * Math.PI);
            ctx.stroke();
          });
      }
      const after = new Date();

      console.log(after.getDate() - before.getDate());
    }
  });

  return (
    <div className="container">
      <div className="square">
        <canvas ref={canvasRef}></canvas>
      </div>

      <style jsx>{`
        :global(html),
        :global(body) {
          background-color: black;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }

        .container {
          position: absolute;
          top: 0;
          left 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .square {
          position: relative;
          width: 100vmin;
        }

        .square:after {
          content: '';
          display: block;
          padding-bottom: 100%;
        }

        canvas {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default Lissajous;
