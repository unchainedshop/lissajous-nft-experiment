import Link from 'next/link';

const Layout = (props) => {
  return (
    <div className="page-layout">
      <div>
        <Link href="/">
          <a>home</a>
        </Link>
      </div>
      {props.children}
      <style jsx global>{`
        html,
        body {
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
      `}</style>
    </div>
  );
};

export default Layout;
