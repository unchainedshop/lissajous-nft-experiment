const Address = ({ url }) => {
  console.log(url.query);
  return <div>{url.query.address}</div>;
};

export default Address;
