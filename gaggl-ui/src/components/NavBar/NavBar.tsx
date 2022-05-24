import { Link, useNavigate } from 'react-router-dom';
import React from 'react';

import { useAuth } from '../../auth';

type Props = any;

const NavBar: React.FC<Props> = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    try {
      auth.signOut(() => navigate('/'));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-warning mb-5">
      <Link to={'/'} className="navbar-brand">
        gaggl
      </Link>

      {auth?.user && (
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={'/search'} className="nav-link">
              search
            </Link>
          </li>
          <li className="nav-item">
            <Link to={'/matches'} className="nav-link">
              matches
            </Link>
          </li>
        </div>
      )}

      {auth?.user ? (
        <div className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to={'/profile'} className="nav-link">
              profile
            </Link>
          </li>
          <li className="nav-item">
            <a href="/login" className="nav-link" onClick={signOut}>
              log out
            </a>
          </li>
        </div>
      ) : (
        <div className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to={'/login'} className="nav-link">
              log in
            </Link>
          </li>

          <li className="nav-item">
            <Link to={'/register'} className="nav-link">
              sign up
            </Link>
          </li>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
