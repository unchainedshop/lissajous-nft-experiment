/* eslint-disable react/display-name */
import Link from 'next/link';

import { MDXProvider } from '@mdx-js/react';
import { useAppContext } from './AppContextWrapper';
import formatEther from '../utils/formatEther';

const shortenAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

const components = {
  wrapper: (props) => (
    <div>
      <main {...props} />
      <style jsx>{`
        div {
          max-width: 30em;
        }
      `}</style>
    </div>
  ),
};

const Layout = (props) => {
  const {
    hasSigner,
    accounts,
    connect,
    totalSupply,
    balance,
  } = useAppContext();

  return (
    <MDXProvider components={components}>
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
              {!hasSigner && (
                // eslint-disable-next-line react/jsx-no-target-blank
                <a href="https://metamask.io" target="_blank" rel="noopener">
                  No MetaMask found :(
                </a>
              )}
            </div>
          </header>
        </div>

        <div className="content">{props.children}</div>

        <footer>
          <Link href="/about">
            <a>About</a>
          </Link>
          <Link href="/terms">
            <a>Terms</a>
          </Link>
          <a
            href="https://matrix.to/#/!SEGqAkImeHDZDviOHK:matrix.org?via=matrix.org"
            target="_blank"
            rel="noreferrer"
          >
            Chat
          </a>
          <a href="https://unchained.shop">
            <svg
              className="mr-3"
              height="24px"
              viewBox="0 0 620 680"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                id="Page-1"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <g
                  id="diamond-snake-one-color"
                  fill="#FFFFFF"
                  fillRule="nonzero"
                >
                  <path
                    d="M130,220 L177.1,191.8 C167.677774,209.45486 167.677774,230.64514 177.1,248.3 L130,220 Z M14.7,174.8 C8.49123845,204.613515 8.49123845,235.386485 14.7,265.2 L90,220 L14.7,174.8 Z M130,385 L130,280 L18.3,280 C31.110773,325.098728 57.9812724,364.931528 95,393.7 L70,400 L230,500 L230,360 L130,385 Z M230,280 L321.4,337.1 L230,360 L390,460 L390,280 L230,280 Z M70,540 L230,640 L230,500 L70,540 Z M230,500 L390,600 L390,460 L230,500 Z M230,640 L390,680 L390,600 L230,640 Z M70,680 L230,680 L230,640 L70,680 Z M0,470 C0,508.659932 31.3400675,540 70,540 L70,400 C31.3400675,400 0,431.340068 0,470 Z M0,610 C0,648.659932 31.3400675,680 70,680 L70,540 C31.3400675,540 0,571.340068 0,610 Z M550,280 L390,320 L550,420 C588.659932,420 620,388.659932 620,350 C620,311.340068 588.659932,280 550,280 L550,280 Z M550,420 L390,460 L550,560 C588.659932,560 620,528.659932 620,490 C620,451.340068 588.659932,420 550,420 L550,420 Z M550,560 L390,600 L550,680 C583.137085,680 610,653.137085 610,620 C610,586.862915 583.137085,560 550,560 Z M230,0 C129.3,0 44.4,67.7 18.3,160 L390,160 L450,100 C450,100 352.9,0 230,0 Z M310,70 C310,86.5685425 296.568542,100 280,100 C263.431458,100 250,86.5685425 250,70 C250,53.4314575 263.431458,40 280,40 C287.956495,40 295.587112,43.1607052 301.213203,48.7867966 C306.839295,54.4128879 310,62.0435053 310,70 L310,70 Z"
                    id="Shape"
                  ></path>
                </g>
              </g>
            </svg>{' '}
          </a>
        </footer>

        <style jsx>{`
          footer {
            position: fixed;
            bottom: 0;
            right: 0;
            margin: 0;
            margin-bottom: 5px;
            font-size: 0.9em;
          }

          footer a {
            font-family: lunchtype22light;
            margin-right: 1em;
          }
        `}</style>

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
            padding-top: 2em;
            padding-left: 1em;
            padding-right: 1em;
          }

          .link {
            text-decoration: underline;
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

          .animated {
            animation-duration: 0.5s;
            animation-fill-mode: both;
          }
          @keyframes zoomIn {
            from {
              opacity: 0;
              transform: scale3d(0.3, 0.3, 0.3);
            }

            50% {
              opacity: 1;
            }
          }
          .zoomIn {
            animation-name: zoomIn;
          }
        `}</style>
      </div>
    </MDXProvider>
  );
};

export default Layout;
