import React, { useEffect } from 'react';
import * as d3 from 'd3';

const LissajousSvg = ({
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
  useEffect(() => {
    const svg = d3.select('svg');
    svg.selectAll('path').remove();

    const numberOfSteps = 16;
    const stepsUntilFull = 256;
    const absoluteStartStep = (stepsUntilFull / numberOfSteps) * startStep;
    const absoluteTotalSteps = (stepsUntilFull / numberOfSteps) * totalSteps;

    const canvasHeight = parseInt(svg.attr('height'), 10);
    const canvasWidth = parseInt(svg.attr('width'), 10);

    const amplitudeX = width / 16 / 2;
    const amplitudeY = height / 16 / 2;

    const translateX = (canvasWidth - (canvasWidth / 16) * width) / 2;
    const translateY = (canvasHeight - (canvasHeight / 16) * height) / 2;

    // //The data for our line
    // const lineData = [];

    // for (let i = 0; i < 256; i++) {
    //   lineData.push({
    //     x: 100 * Math.cos((15 * 2 * 3.14159 * i) / 180) + 512,
    //     y: 100 * Math.sin((16 * 2 * 3.14159 * i) / 180) + 512,
    //   });
    // }

    const speed = 1;

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

    console.table(points);

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
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
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
    <div className="App">
      <svg height={512} width={512}></svg>
    </div>
  );
};

export default LissajousSvg;
