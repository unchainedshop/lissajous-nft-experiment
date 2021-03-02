const FormInput = ({ register, name, values, ...rest }) => {
  return (
    <div>
      <div>{name}</div>
      <input name={name} ref={register} {...rest} /> {values[name]}
    </div>
  );
};

export default FormInput;
