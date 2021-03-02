const RangeInput = ({ register, name, values, step, min, max }) => {
  return (
    <div>
      <div>{name}</div>
      <input type="range" ref={register} {...{ step, min, max, name }} />{' '}
      {values[name]}
    </div>
  );
};

export default RangeInput;
