import * as d3 from 'd3';
import { JSDOM } from 'jsdom';
import { LissajousArgs } from '@private/contracts';

const generateSvg = (lissajousArguments: LissajousArgs): string => {
  const dom = new JSDOM(`<div id="holder"><svg></svg></div>`);

  const svg = d3.select(dom.window.document).select('svg');

  const phaseShift = 16 / lissajousArguments.phaseShift;

  const lineWidth = 10;

  let interpolateHsl;
  const backgroundColor = d3.hsl('black');

  if (lissajousArguments.rainbow) {
    interpolateHsl = d3.interpolateTurbo;
    // backgroundColor = d3.hsl('black');
  } else {
    const hslStart = d3.hsl(lissajousArguments.strokeColor);

    const hslEnd = d3.hsl(hslStart.h - 70, hslStart.s, hslStart.l - 0.1);

    interpolateHsl = d3.interpolateHslLong(
      hslEnd,
      lissajousArguments.strokeColor,
    );
    // backgroundColor = d3.hsl(
    //   (hslStart.h + 180) % 360,
    //   hslStart.s,
    //   hslStart.l - 0.25,
    // );
  }

  const canvasHeight = 512;
  const canvasWidth = 512;

  const numberOfSteps = 16;
  const stepsUntilFull = 256;
  const absoluteStartStep =
    (stepsUntilFull / numberOfSteps) * lissajousArguments.startStep;
  const absoluteTotalSteps =
    (stepsUntilFull / numberOfSteps) * lissajousArguments.totalSteps;

  const figureHeight = canvasHeight - lineWidth - 32;
  const figureWidht = canvasWidth - lineWidth - 32;

  const amplitudeX = lissajousArguments.width / 16 / 2;
  const amplitudeY = lissajousArguments.height / 16 / 2;

  const translateX =
    lineWidth / 2 +
    (figureWidht - (figureWidht / 16) * lissajousArguments.width) / 2 +
    16;
  const translateY =
    lineWidth / 2 +
    (figureHeight - (figureHeight / 16) * lissajousArguments.height) / 2 +
    16;

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
            (1 + Math.sin(step * speed * lissajousArguments.frequenceX)),
        y:
          translateY +
          figureHeight *
            amplitudeY *
            (1 +
              Math.sin(
                step * speed * lissajousArguments.frequenceY +
                  Math.PI * phaseShift,
              )),
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

  const count = 0;

  svg
    .attr('style', `background-color: ${backgroundColor}`)
    // .attr('width', '512px')
    // .attr('height', '512px')
    .attr('viewBox', '0 0 512 512')
    .attr('version', '1.1')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink');

  points.map((_, i) => {
    const walkingI = (i + count) % absoluteTotalSteps;
    const color = interpolateHsl(walkingI / absoluteTotalSteps);

    return svg
      .append('path')
      .datum(points.slice(i, i + 4))
      .attr('d', valueline as any)
      .style('stroke', color)
      .attr('stroke-width', lineWidth + 1);
  });

  const htmlString = dom.serialize();

  const newDom = new JSDOM(htmlString);

  return `<?xml version="1.0" encoding="UTF-8"?>${
    newDom.window.document.getElementById('holder').innerHTML
  }`;
};

export default generateSvg;
