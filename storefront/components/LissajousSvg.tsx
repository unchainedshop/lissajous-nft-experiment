import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LissajousSvg = ({
  frequenceX,
  frequenceY,
  phaseShift,
  lineWidth: lineWidthInput,
  height,
  width,
  strokeColor = '#FFD700',
  startStep = 1,
  totalSteps = 16,
}) => {
  const canvasRef = useRef(null);

  const lineWidth = parseInt(lineWidthInput, 10);

  useEffect(() => {
    const svg = d3.select(canvasRef.current);
    svg.selectAll('path').remove();

    const boundingRect = canvasRef?.current?.getBoundingClientRect();

    const numberOfSteps = 16;
    const stepsUntilFull = 256;
    const absoluteStartStep = (stepsUntilFull / numberOfSteps) * startStep;
    const absoluteTotalSteps = (stepsUntilFull / numberOfSteps) * totalSteps;

    const canvasHeight = boundingRect.width - lineWidth - 4;
    const canvasWidth = boundingRect.height - lineWidth - 4;

    const amplitudeX = width / 16 / 2;
    const amplitudeY = height / 16 / 2;

    const translateX =
      lineWidth / 2 + (canvasWidth - (canvasWidth / 16) * width) / 2 + 1;
    const translateY =
      lineWidth / 2 + (canvasHeight - (canvasHeight / 16) * height) / 2 + 1;

    const speed = 0.03;

    const points = Array(absoluteTotalSteps)
      .fill(0)
      .map((_, index) => {
        const step = absoluteStartStep + index;

        return {
          x:
            translateX +
            canvasWidth *
              amplitudeX *
              (1 + Math.sin(step * speed * frequenceX)),
          y:
            translateY +
            canvasHeight *
              amplitudeY *
              (1 + Math.sin(step * speed * frequenceY + Math.PI * phaseShift)),
        };
      });

    // define the line
    const valueline = d3
      .line()
      .curve(d3.curveCatmullRomOpen)
      .x((d: any) => d.x)
      .y((d: any) => d.y);

    svg
      .append('path')
      .datum(points)
      .attr('d', valueline as any)
      .attr('stroke', strokeColor)
      .attr('stroke-width', lineWidth + 1)
      .attr('fill', 'none');
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
      <svg ref={canvasRef}></svg>
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

        svg {
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

export default LissajousSvg;
