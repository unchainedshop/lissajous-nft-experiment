import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { LissajousArgs } from '@private/contracts';

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
  animated = false,
  gradient = false,
}: LissajousArgs) => {
  let animationFrame;
  const canvasRef = useRef(null);

  const shouldAnimate = typeof window !== 'undefined' && animated;

  const lineWidth = parseInt(lineWidthInput as any, 10);

  const hslStart = d3.hsl(strokeColor);
  const hslEnd = d3.hsl(hslStart.h - 70, hslStart.s, hslStart.l - 0.1);

  const interpolateHsl = d3.interpolateHslLong(hslEnd, strokeColor);

  const backgroundColor = d3.hsl(
    (hslStart.h + 180) % 360,
    hslStart.s,
    hslStart.l - 0.25,
  );

  useEffect(() => {
    const svg = d3.select(canvasRef.current);
    svg.selectAll('path').remove();

    const boundingRect: DOMRect = canvasRef?.current?.getBoundingClientRect();

    const canvasHeight = 512;
    const canvasWidth = 512;

    const numberOfSteps = 16;
    const stepsUntilFull = 256;
    const absoluteStartStep = (stepsUntilFull / numberOfSteps) * startStep;
    const absoluteTotalSteps = (stepsUntilFull / numberOfSteps) * totalSteps;

    const figureHeight = canvasHeight - lineWidth - 32;
    const figureWidht = canvasWidth - lineWidth - 32;

    const amplitudeX = width / 16 / 2;
    const amplitudeY = height / 16 / 2;

    const translateX =
      lineWidth / 2 + (figureWidht - (figureWidht / 16) * width) / 2 + 16;
    const translateY =
      lineWidth / 2 + (figureHeight - (figureHeight / 16) * height) / 2 + 16;

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
      .x((d: any) => {
        return d.x;
      })
      .y((d: any) => d.y);

    let count = 0;
    const draw = () => {
      svg.selectAll('path').remove();

      // if (count % 2 !== 0) return;

      if (gradient || animated) {
        points.map((_, i) => {
          const walkingI = (i + count) % absoluteTotalSteps;
          const color = interpolateHsl(walkingI / absoluteTotalSteps);

          return svg
            .append('path')
            .datum(points.slice(i, i + 4))
            .attr('d', valueline as any)
            .style('stroke', color)
            .attr('stroke-width', lineWidth + 1)
            .attr(
              'transform',
              `scale(${(boundingRect.height - 2) / canvasHeight} ${
                (boundingRect.width - 2) / canvasWidth
              })`,
            );
        });

        count += 1;
      } else {
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
      }

      if (shouldAnimate) {
        window.requestAnimationFrame(draw);
      }
    };

    if (shouldAnimate) {
      animationFrame = window.requestAnimationFrame(draw);
    } else {
      draw();
    }

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
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
    animated,
  ]);

  useEffect(() => {
    if (!animated && animationFrame) {
      window.cancelAnimationFrame(animationFrame);
    }
  }, [animated]);

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
          background-color: ${backgroundColor.formatHex()};
        }
      `}</style>
    </div>
  );
};

export default LissajousSvg;
