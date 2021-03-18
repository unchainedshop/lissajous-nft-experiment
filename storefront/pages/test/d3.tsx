import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import LissajousSvg from '../../components/LissajousSvg';
import RangeInput from '../../components/RangeInput';
import { simulateLissajousArgs } from '@private/contracts';
import { parseEthFromInput } from '../../utils/parseEthFromInput';
import { useAppContext } from '../../components/AppContextWrapper';

let routerUpdateTimeout;

const defaultValues = {
  frequenceX: 3,
  frequenceY: 2,
  phaseShift: 0.5,
  strokeColor: '#FFD700',
  lineWidth: 8,
  height: 16,
  width: 16,
  totalSteps: 16,
  startStep: 0,
  rainbow: false,
  animated: false,
  gradient: false,
};

const LissajousTest = (): React.ReactElement => {
  const { rainbowFrequency } = useAppContext();
  const router = useRouter();

  const { register, watch, setValue, reset } = useForm({
    defaultValues,
  });

  const values = watch();

  // useEffect(() => {
  //   Object.entries(router.query).map(([key, value]) => {
  //     if (values[key] !== value && values[key] !== undefined) {
  //       setValue(key as any, value);
  //     }
  //   });
  // }, [router.query]);

  // useEffect(() => {
  //   clearTimeout(routerUpdateTimeout);
  //   routerUpdateTimeout = window.setTimeout(() => {
  //     router.replace({
  //       pathname: router.pathname,
  //       query: values,
  //     });
  //   }, 100);
  // }, Object.values(values));

  return (
    <>
      <div className="container">
        <div className="holder">
          <LissajousSvg {...values} />

          <hr />
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div className="figure" key={i} data-current={i === 1}>
                <LissajousSvg
                  {...{
                    ...simulateLissajousArgs(
                      i,
                      i === 1 ? parseEthFromInput('0.1') : undefined,
                      rainbowFrequency,
                    ),
                    gradient: i === 1,
                  }}
                />
              </div>
            ))}
        </div>
      </div>
      <form>
        <RangeInput
          name="frequenceX"
          register={register}
          values={values}
          step={1}
          min={1}
          max={16}
        />

        <RangeInput
          name="frequenceY"
          register={register}
          values={values}
          step={1}
          min={1}
          max={16}
        />

        <RangeInput
          name="phaseShift"
          register={register}
          values={values}
          step={1 / 24}
          min={0}
          max={1}
        />

        <RangeInput
          name="lineWidth"
          register={register}
          values={values}
          step={0.5}
          min={0.5}
          max={100}
        />

        <RangeInput
          name="height"
          register={register}
          values={values}
          step={1}
          min={1}
          max={16}
        />

        <RangeInput
          name="width"
          register={register}
          values={values}
          step={1}
          min={1}
          max={16}
        />

        <RangeInput
          name="totalSteps"
          register={register}
          values={values}
          step={1}
          min={1}
          max={16}
        />

        <RangeInput
          name="startStep"
          register={register}
          values={values}
          step={1}
          min={1}
          max={16}
        />

        <div>
          <label>
            <input type="checkbox" ref={register} name="rainbow" />
            Rainbow
          </label>
        </div>

        <div>
          <label>
            <input type="checkbox" ref={register} name="animated" />
            Animated
          </label>
        </div>

        <div>
          <label>
            <input type="checkbox" ref={register} name="gradient" />
            Gradient
          </label>
        </div>

        <button className="button" onClick={() => reset()}>
          Reset
        </button>
      </form>

      <style jsx>{`


        .holder {
          height: 512px;
          width: 512px;
        }

        .figure {
          position: relative;
          display: inline-block;
          height: 128px;
          width: 128px;
          margin: 5px;
          box-sizing: border-box;
        }

        .container {
          position: absolute;
          top: 0;
          left 0;
          width: calc(100% - 225px);
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        form {
          position: fixed;
          top: 20;
          right: 0;
          width: 225px;
        }
      `}</style>
    </>
  );
};

export default LissajousTest;
