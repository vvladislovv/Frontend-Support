import { Link } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
  isAuth: boolean;
  isAdmin: boolean;
  onLogout: () => void;
  hideNavbar?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAuth, isAdmin, onLogout, hideNavbar }) => {
  if (hideNavbar) return null;
  return (
    <nav className="flex items-center justify-between py-4 px-6 bg-white shadow mb-6">
      <div className="flex items-center gap-4">
        <div className="font-bold text-xl text-blue-600" />
        {isAuth && <Link to="/dashboard" className="text-gray-700 hover:underline">Dashboard</Link>}
        {isAuth && isAdmin && <Link to="/admin" className="text-gray-700 hover:underline">Admin</Link>}
      </div>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        {isAuth ? (
          <button onClick={onLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 