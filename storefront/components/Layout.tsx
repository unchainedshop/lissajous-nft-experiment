import Link from 'next/link';
import { useAppContext } from './AppContextWrapper';

const Layout = (props) => {
  const { hasSigner, accounts, connect, totalSupply } = useAppContext();

  return (
    <div className="page-layout">
      <header>
        <nav>
          <Link href="/">
            <a>Lissajous Token</a>
          </Link>{' '}
          |{' '}
          <Link href="/gallery">
            <a>Gallery ({totalSupply})</a>
          </Link>
        </nav>
        <div className="right">
          {accounts[0] && (
            <Link href={`/address/${accounts[0]}`}>
              <a className="account">{accounts[0]}</a>
            </Link>
          )}
          {!accounts[0] && hasSigner && (
            <button onClick={connect}>Connect</button>
          )}
          {!hasSigner && 'No MetaMask found :('}
        </div>
      </header>
      <div className="content">{props.children}</div>
      <style jsx global>{`
        html,
        body {
          font-family: lunchtype22light;
          background-color: black;
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
          position: fixed;
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 2px 5px;
          background-color: rgba(0, 0, 0, 0.5);
        }

        .account {
          font-family: monospace;
        }

        .content {
          padding-top: 2em;
          padding-left: 1em;
          padding-right: 1em;
        }

        .right {
          left: -1em;
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default Layout;
