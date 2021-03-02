import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Lissajous from '../components/Lissajous';

let routerUpdateTimeout;

const LissajousTest = (): React.ReactElement => {
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

  useEffect(() => {
    Object.entries(router.query).map(([key, value]) => {
      if (values[key] !== value && values[key] !== undefined) {
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

  return (
    <>
      <div className="container">
        <Lissajous {...values} />
      </div>
      <form>
        <div>
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
        </div>
        <div>
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
        </div>
        <div>
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
        </div>
        <div>
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
        </div>
        <div>
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
        </div>
        <div>
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
        </div>
        <div>
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
        </div>
        <div>
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
        </div>
        <div>
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
        </div>
      </form>

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
          width: 80%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        form {
          position: fixed;
          top: 0;
          right: 0;
        }
      `}</style>
    </>
  );
};

export default LissajousTest;
