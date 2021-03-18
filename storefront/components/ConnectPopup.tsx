import Link from 'next/link';

const ConnectPopup = ({ isOpen, connect }) => {
  return (
    isOpen && (
      <div className="holder">
        <div className="inner">
          <h1>Accept Terms and Conditions</h1>
          <p>
            By connecting my wallet to this webapp, I confirm that I have read
            and understood the{' '}
            <Link href="/terms">
              <a>Terms and Conditions</a>
            </Link>
            . In particular, I confirm that I know what I am doing and that I am
            not violating any governing jurisdictions law. The company Unchained
            Commerce GmbH or any of its employees can not be held liable for any
            loss of funds, hacks or other damages that might have happend by
            using this webapp.
            <button className="w-100 button--primary mt-3 " onClick={connect}>
              Confirm and Connect
            </button>
          </p>
        </div>
        <style jsx>{`
          .inner {
            position: absolute;
            // top: 30%;
            // left: 20%;
            // right: 20%;
            // bottom: 40%;
            background-color: black;
            width: 30em;
            max-width: 90%;
            padding: 1em;
            margin-top: -10%;
          }

          .holder {
            position: fixed;
            z-index: 10000;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.7);
          }
        `}</style>
      </div>
    )
  );
};

export default ConnectPopup;
