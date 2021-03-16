import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { LissajousArgs } from '@private/contracts';

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
}: LissajousArgs) => {
  const canvasRef = useRef(null);

  const lineWidth = parseInt(lineWidthInput as any, 10);

  useEffect(() => {
    const svg = d3.select(canvasRef.current);
    svg.selectAll('path').remove();

    const boundingRect: DOMRect = canvasRef?.current?.getBoundingClientRect();

    const canvasHeight = 512;
    const canvasWidth = 512;

    const numberOfSteps = 16;
    const stepsUntilFull = 512;
    const absoluteStartStep = (stepsUntilFull / numberOfSteps) * startStep;
    const absoluteTotalSteps = (stepsUntilFull / numberOfSteps) * totalSteps;

    const figureHeight = 512 - lineWidth - 4;
    const figureWidht = 512 - lineWidth - 4;

    const amplitudeX = width / 16 / 2;
    const amplitudeY = height / 16 / 2;

    const translateX =
      lineWidth / 2 + (figureWidht - (figureWidht / 16) * width) / 2 + 1;
    const translateY =
      lineWidth / 2 + (figureHeight - (figureHeight / 16) * height) / 2 + 1;

    const speed = 0.03;

    const points = Array(absoluteTotalSteps)
      .fill(0)
      .map((_, index) => {
        const step = absoluteStartStep + index;

        return {
          x:
            translateX +
            figureWidht *
              amplitudeX *
              (1 + Math.sin(step * speed * frequenceX)),
          y:
            translateY +
            figureHeight *
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
      .attr('fill', 'none')
      .attr(
        'transform',
        `scale(${boundingRect.height / canvasHeight} ${
          boundingRect.width / canvasWidth
        })`,
      );
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
