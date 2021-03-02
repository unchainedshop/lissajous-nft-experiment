import { useEffect, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { hsl } from 'd3-color';

let routerUpdateTimeout;

const Lissajous = (): React.ReactElement => {
  const router = useRouter();

  const { register, watch, setValue } = useForm({
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

  const values = watch();

  const canvasRef = useRef(null);

  useEffect(() => {
    Object.entries(router.query).map(([key, value]) => {
      if (values[key] !== value && values[key] !== undefined) {
        console.log('setValue', key, value);
        setValue(key as any, value);
      }
    });
  }, [router.query]);

  useEffect(() => {
    clearTimeout(routerUpdateTimeout);
    routerUpdateTimeout = window.setTimeout(() => {
      router.replace({
        pathname: router.pathname,
        query: values,
      });
    }, 100);
  }, Object.values(values));

  useLayoutEffect(() => {
    if (canvasRef?.current) {
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
      } = values;

      const canvas: HTMLCanvasElement = canvasRef.current;

      const boundingRect = canvas.getBoundingClientRect();

      canvas.width = boundingRect.width;
      canvas.height = boundingRect.height;

      const ctx: CanvasRenderingContext2D = canvas.getContext('2d', {
        alpha: true,
      });

      const amplitudeX = width / 16 / 2;
      const amplitudeY = height / 16 / 2;

      const translateX = (canvas.width - (canvas.width / 16) * width) / 2;
      const translateY = (canvas.height - (canvas.height / 16) * height) / 2;

      const speed = 0.001;
      const steps = 10000;

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Array(steps)
          .fill(0)
          .map((_, i) => {
            const currentX =
              translateX +
              canvas.width *
                amplitudeX *
                (1 + Math.sin(i * speed * frequenceX));
            const currentY =
              translateY +
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
    }
  }, Object.values(values));

  return (
    <div className="container">
      <div className="square">
        <canvas ref={canvasRef}></canvas>
        <form>
          <p>
            f<sub>x</sub>:{' '}
            <input
              type="range"
              name="frequenceX"
              step={1}
              min={1}
              max={32}
              ref={register}
            />{' '}
            {values.frequenceX}
          </p>
          <p>
            f<sub>y</sub>:{' '}
            <input
              type="range"
              name="frequenceY"
              step={1}
              min={1}
              max={32}
              ref={register}
            />{' '}
            {values.frequenceY}
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
            {values.phaseShift}
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
            {values.hue}
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
            {values.saturation}
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
            {values.lightness}
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
            {values.lineWidth}
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
            {values.height}
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
            {values.width}
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
          box-sizing: border-box;
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background-color: white;
          border: 1px solid black;
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
