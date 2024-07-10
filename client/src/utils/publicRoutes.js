import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { DASHBOARD } from './routes';
import { isAuth } from './auth';
const PublicRoute = () => {
    const navigate = useNavigate();
    const auth = isAuth();

    useEffect(() => {
        if (auth) {
            navigate(DASHBOARD);
        }
    }, [auth, navigate]);

    return auth ? null : <Outlet />;
}

export default PublicRoute;