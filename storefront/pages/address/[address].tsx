import { useRouter } from 'next/router';

const Address = () => {
  const router = useRouter();
  // console.log(router);
  return <div>{router.query.address}</div>;
};

export default Address;
