import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Lissajous from '../components/Lissajous';
import FormInput from '../components/FormInput';

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
        <FormInput
          name="frequenceX"
          register={register}
          values={values}
          type="range"
          step={1}
          min={1}
          max={32}
        />

        <FormInput
          name="frequenceY"
          register={register}
          values={values}
          type="range"
          step={1}
          min={1}
          max={32}
        />

        <FormInput
          name="phaseShift"
          register={register}
          values={values}
          type="range"
          step={1 / 24}
          min={0}
          max={1}
        />

        <FormInput
          name="phaseShift"
          register={register}
          values={values}
          type="range"
          step={1 / 24}
          min={0}
          max={1}
        />

        <FormInput
          name="hue"
          register={register}
          values={values}
          type="range"
          step={1}
          min={0}
          max={360}
        />

        <FormInput
          name="saturation"
          register={register}
          values={values}
          type="range"
          step={0.01}
          min={0}
          max={1}
        />

        <FormInput
          name="lightness"
          register={register}
          values={values}
          type="range"
          step={0.01}
          min={0}
          max={1}
        />

        <FormInput
          name="lineWidth"
          register={register}
          values={values}
          type="range"
          step={0.5}
          min={0.5}
          max={100}
        />

        <FormInput
          name="height"
          register={register}
          values={values}
          type="range"
          step={1}
          min={1}
          max={16}
        />

        <FormInput
          name="width"
          register={register}
          values={values}
          type="range"
          step={1}
          min={1}
          max={16}
        />
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
