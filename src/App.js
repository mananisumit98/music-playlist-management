import { Fragment } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SIGNUP, SIGNIN, DASHBOARD, SEARCH, PLAYLIST } from "./utils/routes";
import PublicRoute from "./utils/publicRoutes";
import PrivateRoute from "./utils/privateRoute";
import Dashboard from "./components/dashboard";
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
            <Route path={SIGNIN} element={<Login />} />
            <Route path={SIGNUP} element={<Registration />} />
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