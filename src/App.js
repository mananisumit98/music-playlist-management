import { Fragment } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SIGNUP, SIGNIN, DASHBOARD, SEARCH, PLAYLIST } from "./utils/routes";
import PublicRoute from "./utils/publicRoutes";
import PrivateRoute from "./utils/privateRoute";
import Dashboard from "./components/dashboard";
import AuthenticateUser from "./components/AuthenticateUser";
import Login from "./components/login";
import Registration from "./components/registration";
import SearchSongs from "./components/searchSongs";
import Playlist from "./components/playlist";
import './App.css';

function App() {

  return (
    <Fragment>
      <BrowserRouter>

        <Routes>
          <Route path="/" element={<PublicRoute />}>
            <Route path={SIGNIN} element={<AuthenticateUser authType="login" />} />
            <Route path={SIGNUP} element={<AuthenticateUser authType="register" />} />
            <Route path="/" element={<Navigate to={SIGNIN} replace />} />
            <Route path="*" element={<Navigate to={SIGNIN} replace />} />
          </Route>

          <Route path="/" element={<PrivateRoute />}>
            <Route path={DASHBOARD} element={<Dashboard />} />
            <Route path={SEARCH} element={<SearchSongs />} />
            <Route path={PLAYLIST} element={<Playlist />} />
            <Route path="/" element={<Navigate to={DASHBOARD} replace />} />
            <Route path="*" element={<Navigate to={DASHBOARD} replace />} />
          </Route>
        </Routes>

      </BrowserRouter>
    </Fragment>
  );
}

export default App;