import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { SIGNIN } from './routes';
import { isAuth } from './auth';

export const PrivateRoute = () => {
  const navigate = useNavigate();
  const auth = isAuth();

  useEffect(() => {
    if (!auth) {
      navigate(SIGNIN);
    }
  }, [auth, navigate]);
  return auth ? <Outlet /> : null;
}

export default PrivateRoute;