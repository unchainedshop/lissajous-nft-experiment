import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { LissajousArgs } from '@private/contracts';

// Sample the SVG path uniformly with the specified precision.
function samples(path, precision) {
  let n = path.getTotalLength(),
    t = [0],
    i = 0,
    dt = precision;
  while ((i += dt) < n) t.push(i);
  t.push(n);
  return t.map(function (t) {
    const p = path.getPointAtLength(t),
      a = [p.x, p.y];
    a.t = t / n;
    return a;
  });
}

// Compute quads of adjacent points [p0, p1, p2, p3].
function quads(points) {
  return d3.range(points.length - 1).map(function (i) {
    const a = [points[i - 1], points[i], points[i + 1], points[i + 2]];
    a.t = (points[i].t + points[i + 1].t) / 2;
    return a;
  });
}

// Compute stroke outline for segment p12.
function lineJoin(p0, p1, p2, p3, width) {
  let u12 = perp(p1, p2),
    r = width / 2,
    a = [p1[0] + u12[0] * r, p1[1] + u12[1] * r],
    b = [p2[0] + u12[0] * r, p2[1] + u12[1] * r],
    c = [p2[0] - u12[0] * r, p2[1] - u12[1] * r],
    d = [p1[0] - u12[0] * r, p1[1] - u12[1] * r];

  if (p0) {
    // clip ad and dc using average of u01 and u12
    var u01 = perp(p0, p1),
      e = [p1[0] + u01[0] + u12[0], p1[1] + u01[1] + u12[1]];
    a = lineIntersect(p1, e, a, b);
    d = lineIntersect(p1, e, d, c);
  }

  if (p3) {
    // clip ab and dc using average of u12 and u23
    var u23 = perp(p2, p3),
      e = [p2[0] + u23[0] + u12[0], p2[1] + u23[1] + u12[1]];
    b = lineIntersect(p2, e, a, b);
    c = lineIntersect(p2, e, d, c);
  }

  return 'M' + a + 'L' + b + ' ' + c + ' ' + d + 'Z';
}

// Compute intersection of two infinite lines ab and cd.
function lineIntersect(a, b, c, d) {
  const x1 = c[0],
    x3 = a[0],
    x21 = d[0] - x1,
    x43 = b[0] - x3,
    y1 = c[1],
    y3 = a[1],
    y21 = d[1] - y1,
    y43 = b[1] - y3,
    ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
  return [x1 + ua * x21, y1 + ua * y21];
}

// Compute unit vector perpendicular to p01.
function perp(p0, p1) {
  const u01x = p0[1] - p1[1],
    u01y = p1[0] - p0[0],
    u01d = Math.sqrt(u01x * u01x + u01y * u01y);
  return [u01x / u01d, u01y / u01d];
}

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

    const figureHeight = canvasHeight - lineWidth - 4;
    const figureWidht = canvasWidth - lineWidth - 4;

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
      .x((d: any) => {
        return d.x;
      })
      .y((d: any) => d.y);

    const hslStart = d3.hsl(strokeColor);
    const hslEnd = d3.hsl(hslStart.h - 120, hslStart.s, hslStart.l - 0.1);

    console.log(hslStart);

    console.log(hslEnd.formatHex(), strokeColor);

    const interpolateHsl = d3.interpolateHslLong(hslEnd, strokeColor);
    points.map((point, i) =>
      svg
        .append('path')
        .datum(points.slice(i, i + 4))
        .attr('d', valueline as any)
        .style('stroke', interpolateHsl(i / absoluteTotalSteps))
        .attr('stroke-width', lineWidth + 1)
        .style('fill', interpolateHsl(i / absoluteTotalSteps))
        .attr(
          'transform',
          `scale(${(boundingRect.height - 2) / canvasHeight} ${
            (boundingRect.width - 2) / canvasWidth
          })`,
        ),
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
        }
      `}</style>
    </div>
  );
};

export default LissajousSvg;
