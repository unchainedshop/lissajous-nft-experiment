import { useLayoutEffect, useRef } from 'react';

const Lissajous = ({
  frequenceX,
  frequenceY,
  phaseShift,
  lineWidth,
  height,
  width,
  strokeColor = '#FFD700',
  startStep = 1,
  totalSteps = 16,
}) => {
  const canvasRef = useRef(null);

  const numberOfSteps = 16;
  const stepsUntilFull = 6384;
  const absoluteStartStep = (stepsUntilFull / numberOfSteps) * startStep;
  const absoluteTotalSteps = (stepsUntilFull / numberOfSteps) * totalSteps;

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

      const translateX = (canvas.width - (canvas.width / 16) * width) / 2;
      const translateY = (canvas.height - (canvas.height / 16) * height) / 2;

      const speed = 0.001;

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Array(absoluteTotalSteps)
          .fill(0)
          .map((_, index) => {
            const step = absoluteStartStep + index;

            const currentX =
              translateX +
              canvas.width *
                amplitudeX *
                (1 + Math.sin(step * speed * frequenceX));
            const currentY =
              translateY +
              canvas.height *
                amplitudeY *
                (1 +
                  Math.sin(step * speed * frequenceY + Math.PI * phaseShift));

            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.arc(currentX, currentY, 1, 0, 1 * Math.PI);
            ctx.stroke();
          });
      }
    }
  }, [
    frequenceX,
    frequenceY,
    strokeColor,
    phaseShift,
    lineWidth,
    height,
    width,
    totalSteps,
    startStep,
  ]);

  return (
    <div className="square">
      <canvas ref={canvasRef}></canvas>
      <style jsx>{`
        .square {
          position: relative;
          width: 100%;
          max-height: 100%;
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
          // background-color: white;
          border: 1px solid black;
        }
      `}</style>
    </div>
  );
};

export default Lissajous;
