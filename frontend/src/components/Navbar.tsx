import { Link } from 'react-router-dom';

function Navbar({ year }: { year: number }) {
  return (
    <nav className="flex w-full px-6 py-2 gap-2">
      <Link className="hover:underline" to={`/${year - 1}`}>
        {year - 1}
      </Link>
      <Link className="hover:underline ml-auto mr-auto" to={`/`}>
        Home
      </Link>
      <Link className="hover:underline" to={`/${year + 1}`}>
        {year + 1}
      </Link>
    </nav>
  );
}

export default Navbar;
