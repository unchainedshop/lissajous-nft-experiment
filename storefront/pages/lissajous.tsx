import { useLayoutEffect, useRef } from 'react';

const Lissajous = () => {
  const canvasRef = useRef(null);

  useLayoutEffect(() => {
    console.log(canvasRef);
    if (canvasRef?.current) {
      const canvas: HTMLCanvasElement = canvasRef.current;

      const boundingRect = canvas.getBoundingClientRect();

      canvas.height = boundingRect.height;
      canvas.width = boundingRect.width;

      const ctx: CanvasRenderingContext2D = canvas.getContext('2d', {
        alpha: false,
      });

      console.log(ctx);

      const radius = canvas.height / 2;
      const speed = 0.02;
      // const steps = 1000;

      let step = 0;
      let x = 0;
      let y = 0;

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      const draw = () => {
        if (ctx) {
          x = radius * (1 + Math.cos(step * speed * 0.2));
          y = radius * (1 + Math.sin(step * speed));

          // console.log({ x, y, step, speed });

          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, 2 * Math.PI);
          ctx.stroke();

          step++;

          window.requestAnimationFrame(draw);
        }
      };

      window.requestAnimationFrame(draw);
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
