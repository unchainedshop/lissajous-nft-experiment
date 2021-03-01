import { useLayoutEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

import hslToRgb from '../utils/hslToRgb';

const rgbArrayToString = (rgbArray) =>
  `#${rgbArray.map((x) => Math.floor(x).toString(16)).join('')}`;

const Lissajous = () => {
  const { register, watch } = useForm({
    defaultValues: { x: 1, y: 1, phi: 0.5, h: 0.51, s: 1, l: 1 },
  });
  const canvasRef = useRef(null);

  const { x, y, h, s, l, phi } = watch();

  useLayoutEffect(() => {
    if (canvasRef?.current) {
      const canvas: HTMLCanvasElement = canvasRef.current;

      const boundingRect = canvas.getBoundingClientRect();

      canvas.height = boundingRect.height;
      canvas.width = boundingRect.width;

      const ctx: CanvasRenderingContext2D = canvas.getContext('2d', {
        alpha: true,
      });

      const speed = 0.001;
      const steps = 10000;

      console.log(h, s, l, hslToRgb(h, s, l));

      const before = new Date();
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Array(steps)
          .fill(0)
          .map((_, i) => {
            const currentX =
              5 + (canvas.width / 2 - 10) * (1 + Math.sin(i * speed * x));
            const currentY =
              5 +
              (canvas.height / 2 - 10) *
                (1 + Math.sin(i * speed * y + Math.PI * phi));

            ctx.strokeStyle = 'black'; // `hsl(${h},${s},${l})`; // 'black'; // rgbArrayToString(hslToRgb(h, s, l));

            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.arc(currentX, currentY, 1, 0, 1 * Math.PI);
            ctx.stroke();
          });
      }
      const after = new Date();

      console.log(after.getDate() - before.getDate());
    }
  }, [x, y, phi, h, s, l]);

  return (
    <div className="container">
      <div className="square">
        <canvas ref={canvasRef}></canvas>
        <form>
          <p>
            X:{' '}
            <input
              type="range"
              name="x"
              step={1}
              min={1}
              max={32}
              ref={register}
            />{' '}
            {x}
          </p>
          <p>
            Y:{' '}
            <input
              type="range"
              name="y"
              step={1}
              min={1}
              max={32}
              ref={register}
            />{' '}
            {y}
          </p>
          <p>
            Δφ:{' '}
            <input
              type="range"
              name="phi"
              step={0.0625}
              min={0}
              max={1}
              ref={register}
            />{' '}
            {phi}
          </p>
          <p>
            h:{' '}
            <input
              type="range"
              name="h"
              step={0.01}
              min={0}
              max={1}
              ref={register}
            />{' '}
            {h}
          </p>
          <p>
            s:{' '}
            <input
              type="range"
              name="s"
              step={0.01}
              min={0}
              max={1}
              ref={register}
            />{' '}
            {s}
          </p>
          <p>
            l:{' '}
            <input
              type="range"
              name="l"
              step={0.01}
              min={0}
              max={1}
              ref={register}
            />{' '}
            {l}
          </p>
        </form>
      </div>

      <style jsx>{`
        :global(html),
        :global(body) {
          background-color: white;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          color: black;
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
          background-color: white;
        }

        form {
          position: absolute;
          top: 10px;
          left: 50%;
        }
      `}</style>
    </div>
  );
};

export default Lissajous;
