import { useRouter } from 'next/router';
import {
  LissajousToken__factory,
  simulateLissajousArgs,
} from '@private/contracts';
import { useAppContext } from '../../components/AppContextWrapper';

const Address = () => {
  const router = useRouter();
  const { contractAddress, provider } = useAppContext();

  const contract = LissajousToken__factory.connect(contractAddress, provider);

  return <div>{router.query.address}</div>;
};

export default Address;
