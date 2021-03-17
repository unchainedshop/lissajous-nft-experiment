import React from 'react';
import * as d3 from 'd3';

const ColorRange = () => {
  const startColorHsl = d3.hsl(359, 1, 0.25);
  const startColor = startColorHsl.formatHex(); // '#B30001'; //
  const endColor = '#FFD700';

  const interpolateHsl = d3.interpolateHslLong(startColor, endColor);
  const interpolateCubehelix = d3.interpolateCubehelixLong(endColor, endColor);

  const hslStart = d3.hsl(startColor);
  const hslEnd = d3.hsl(endColor);

  console.log(startColorHsl, startColor, hslStart);

  // console.log({ hslStart, hslEnd });

  const length = 360 - (hslEnd.h - hslStart.h);

  // console.log('gold', d3.color('#FFD700').formatHsl());
  // console.log('red', d3.color('#FF0000').formatHsl());
  // console.log(d3.color('hsl(359, 100%, 50%)').formatHex());

  const colorsNeeded = 28;
  const fractions = colorsNeeded - 1;

  return (
    <div className="holder">
      <div className="inner">
        <h1>CubehelixLong</h1>
        {Array(colorsNeeded)
          .fill(0)
          .map((_, i) => {
            const fraction = (fractions - i) / fractions;

            return (
              <div
                key={i}
                className="color"
                style={{ backgroundColor: interpolateCubehelix(fraction) }}
              >
                {i}: {interpolateCubehelix(fraction)}{' '}
                {d3.color(interpolateCubehelix(fraction)).formatHex()}
              </div>
            );
          })}
      </div>
      <div className="inner">
        <h1>HSL</h1>
        {Array(colorsNeeded)
          .fill(0)
          .map((_, i) => {
            const fraction = (fractions - i) / fractions;

            return (
              <div
                key={i}
                className="color"
                style={{ backgroundColor: interpolateHsl(fraction) }}
              >
                {i}: {interpolateHsl(fraction)}{' '}
                {d3.color(interpolateHsl(fraction)).formatHex()}
              </div>
            );
          })}
      </div>
      <div className="inner">
        <h1>Manual HSL</h1>
        {Array(colorsNeeded)
          .fill(0)
          .map((_, i) => {
            const fraction = (fractions - i) / fractions;

            const h = hslStart.h - length * fraction;

            const color = d3.hsl(h, 1, 0.5);

            return (
              <div
                key={i}
                className="color"
                style={{ backgroundColor: color.toString() }}
              >
                {i}: {color.toString()} {color.formatHex()}
              </div>
            );
          })}
      </div>
      <style jsx>{`
        .holder {
          display: flex;
          justify-content: space-between;
        }
        .color {
          padding: 5px;
          margin: 5px;
        }
      `}</style>
    </div>
  );
};

// {d3.color(interpolate(i)).formatHex()}
export default ColorRange;
