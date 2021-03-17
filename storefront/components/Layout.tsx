import Link from 'next/link';

import { useAppContext } from './AppContextWrapper';
import formatEther from '../utils/formatEther';

const shortenAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

const Layout = (props) => {
  const {
    hasSigner,
    accounts,
    connect,
    totalSupply,
    balance,
  } = useAppContext();

  console.log(balance);

  return (
    <div className="page-layout">
      <div className="container">
        <header>
          <nav>
            <Link href="/">
              <a>Lissajous Token</a>
            </Link>{' '}
            |{' '}
            <Link href="/gallery">
              <a className="dimmed">Gallery ({totalSupply})</a>
            </Link>
          </nav>

          <div>
            {accounts[0] && (
              <Link href={`/address/${accounts[0]}`}>
                <a className="account">
                  {balance && `Ξ ${formatEther(balance)}`}{' '}
                  {shortenAddress(accounts[0])}
                </a>
              </Link>
            )}
            {!accounts[0] && hasSigner && (
              <button onClick={connect}>Connect</button>
            )}
            {!hasSigner && 'No MetaMask found :('}
          </div>
        </header>
      </div>

      <div className="content">{props.children}</div>

      <style jsx>{``}</style>

      <style jsx global>{`
        html,
        body {
          font-family: lunchtype22light;
          background-color: rgba(18, 18, 18);
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          color: white;
        }

        h1 {
          font-weight: 700;
        }
        p {
          margin-bottom: 10px;
        }

        a {
          color: white;
          text-decoration: none;
          font-family: lunchtype22regular;
        }

        header {
          z-index: 10;
          width: calc(100% - 30px);
          position: fixed;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          padding: 5px 15px;
          margin: 0;
          background-color: rgba(0, 0, 0, 0.25);
        }

        .account {
          font-family: monospace;
        }

        .content {
          padding-top: 2.5em;
          padding-left: 1em;
          padding-right: 1em;
        }

        button {
          display: inline-block;
          padding: 0.625em 1em;
          position: relative;
          background-color: rgba(255, 255, 255, 0.4);
          font-family: inherit;
          font-weight: bold;
          text-align: center;
          border: 1px solid #000000;
          border-radius: 0;
          background-color: white;
          outline: 0;
          z-index: 1000;
          cursor: pointer;
          -webkit-appearance: none;
          transform-origin: 50% 50%;
          transition: all 100ms cubic-bezier(0.4, 0, 0.6, 1);
        }
        .d-block {
          display: block;
        }
        .w-100 {
          width: 100%;
        }
        .button--primary {
          font-size: 1rem;
        }
        .mr-3 {
          margin-right: 1rem;
        }
        .mt-2 {
          margin-top: 0.5rem;
        }
        .mt-3 {
          margin-top: 1rem;
        }
        .mb-3 {
          margin-bottom: 1rem;
        }
        .text-center {
          text-align: center;
        }
        .dimmed {
          opacity: 0.5;
        }
        .dimmed:hover {
          opacity: 1;
        }
        .d-flex {
          display: flex;
        }
        .justify-content-between {
          justify-content: space-between;
        }
        .justify-content-around {
          justify-content: space-around;
        }
        .align-items-center {
          align-items: center;
        }
        .flex-wrap {
          flex-wrap: wrap;
        }
        .flex-column {
          flex-direction: column;
        }
      `}</style>
    </div>
  );
};

export default Layout;
