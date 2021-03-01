import { useLayoutEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { hsl } from 'd3-color';

const Lissajous = () => {
  const { register, watch } = useForm({
    defaultValues: {
      xFrequence: 1,
      yFrequence: 1,
      phaseShift: 0.5,
      hue: 57,
      saturation: 1,
      lightness: 0.5,
      lineWidth: 10,
    },
  });
  const canvasRef = useRef(null);

  const {
    xFrequence,
    yFrequence,
    hue,
    saturation,
    lightness,
    phaseShift,
    lineWidth,
  } = watch();

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

      const before = new Date();
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Array(steps)
          .fill(0)
          .map((_, i) => {
            const currentX =
              5 +
              (canvas.width / 2 - 10) * (1 + Math.sin(i * speed * xFrequence));
            const currentY =
              5 +
              (canvas.height / 2 - 10) *
                (1 + Math.sin(i * speed * yFrequence + Math.PI * phaseShift));

            ctx.strokeStyle = hsl(hue, saturation, lightness).formatHex();
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.arc(currentX, currentY, 1, 0, 1 * Math.PI);
            ctx.stroke();
          });
      }
      const after = new Date();

      console.log(after.getDate() - before.getDate());
    }
  }, [
    xFrequence,
    yFrequence,
    phaseShift,
    hue,
    saturation,
    lightness,
    lineWidth,
  ]);

  return (
    <div className="container">
      <div className="square">
        <canvas ref={canvasRef}></canvas>
        <form>
          <p>
            X:{' '}
            <input
              type="range"
              name="xFrequence"
              step={1}
              min={1}
              max={32}
              ref={register}
            />{' '}
            {xFrequence}
          </p>
          <p>
            Y:{' '}
            <input
              type="range"
              name="yFrequence"
              step={1}
              min={1}
              max={32}
              ref={register}
            />{' '}
            {yFrequence}
          </p>
          <p>
            Δφ:{' '}
            <input
              type="range"
              name="phaseShift"
              step={1 / 24}
              min={0}
              max={1}
              ref={register}
            />{' '}
            {phaseShift}
          </p>
          <p>
            hue:{' '}
            <input
              type="range"
              name="hue"
              step={1}
              min={0}
              max={360}
              ref={register}
            />{' '}
            {hue}
          </p>
          <p>
            saturation:{' '}
            <input
              type="range"
              name="saturation"
              step={0.01}
              min={0}
              max={1}
              ref={register}
            />{' '}
            {saturation}
          </p>
          <p>
            lightness:{' '}
            <input
              type="range"
              name="lightness"
              step={0.01}
              min={0}
              max={1}
              ref={register}
            />{' '}
            {lightness}
          </p>
          <p>
            lineWidth:{' '}
            <input
              type="range"
              name="lineWidth"
              step={0.5}
              min={0.5}
              max={100}
              ref={register}
            />{' '}
            {lineWidth}
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
