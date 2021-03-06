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
    d3.select('.target').style('stroke-width', 5);

    //The data for our line
    const lineData = [];

    for (let i = 0; i < 256; i++) {
      lineData.push({
        x: 100 * Math.cos((15 * 2 * 3.14159 * i) / 180) + 125,
        y: 100 * Math.sin((16 * 2 * 3.14159 * i) / 180) + 125,
      });
    }

    console.log(lineData.length);
    console.table(lineData);

    // define the line
    const valueline = d3
      .line()
      .curve(d3.curveCatmullRomOpen)
      .x((d: any) => d.x)
      .y((d: any) => d.y);

    const svg = d3.select('svg');

    svg
      .append('path')
      .datum(lineData)
      .attr('d', valueline)
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
      .attr('fill', 'none');
  }, []);
  return (
    <div className="App">
      <svg height={512} width={512}></svg>
    </div>
  );
};

export default LissajousSvg;
