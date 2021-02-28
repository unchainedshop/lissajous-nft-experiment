import { useLayoutEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

const Lissajous = () => {
  const { register, watch } = useForm({ defaultValues: { x: 1, y: 1 } });
  const canvasRef = useRef(null);

  const { x, y } = watch();

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
      const steps = 10000;

      const before = new Date();
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Array(steps)
          .fill(0)
          .map((_, i) => {
            const currentX = 5 + radius * (1 + Math.cos(i * speed * x));
            const currentY = 5 + radius * (1 + Math.sin(i * speed * y));

            ctx.strokeStyle = '#ff9999';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(currentX, currentY, 1, 0, 1 * Math.PI);
            ctx.stroke();
          });
      }
      const after = new Date();

      console.log(after.getDate() - before.getDate());
    }
  }, [x, y]);

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
        </form>
      </div>

      <style jsx>{`
        :global(html),
        :global(body) {
          background-color: black;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          color: white;
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
