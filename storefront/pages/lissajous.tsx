import { useLayoutEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { hsl } from 'd3-color';

const Lissajous = () => {
  const { register, watch } = useForm({
    defaultValues: {
      frequenceX: 1,
      frequenceY: 1,
      phaseShift: 0.5,
      hue: 57,
      saturation: 1,
      lightness: 0.5,
      lineWidth: 10,
      height: 16,
      width: 16,
    },
  });
  const canvasRef = useRef(null);

  const {
    frequenceX,
    frequenceY,
    hue,
    saturation,
    lightness,
    phaseShift,
    lineWidth,
    height,
    width,
  } = watch();

  useLayoutEffect(() => {
    if (canvasRef?.current) {
      const canvas: HTMLCanvasElement = canvasRef.current;

      const boundingRect = canvas.getBoundingClientRect();

      canvas.width = boundingRect.width;
      canvas.height = boundingRect.height;

      const ctx: CanvasRenderingContext2D = canvas.getContext('2d', {
        alpha: true,
      });

      const amplitudeX = width / 16 / 2;
      const amplitudeY = height / 16 / 2;

      const speed = 0.001;
      const steps = 10000;

      const before = new Date();
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Array(steps)
          .fill(0)
          .map((_, i) => {
            const currentX =
              canvas.width *
              amplitudeX *
              (1 + Math.sin(i * speed * frequenceX));
            const currentY =
              canvas.height *
              amplitudeY *
              (1 + Math.sin(i * speed * frequenceY + Math.PI * phaseShift));

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
    frequenceX,
    frequenceY,
    phaseShift,
    hue,
    saturation,
    lightness,
    lineWidth,
    height,
    width,
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
              name="frequenceX"
              step={1}
              min={1}
              max={32}
              ref={register}
            />{' '}
            {frequenceX}
          </p>
          <p>
            Y:{' '}
            <input
              type="range"
              name="frequenceY"
              step={1}
              min={1}
              max={32}
              ref={register}
            />{' '}
            {frequenceY}
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
          <p>
            height:{' '}
            <input
              type="range"
              name="height"
              step={1}
              min={1}
              max={16}
              ref={register}
            />{' '}
            {height}
          </p>
          <p>
            width:{' '}
            <input
              type="range"
              name="width"
              step={1}
              min={1}
              max={16}
              ref={register}
            />{' '}
            {width}
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
