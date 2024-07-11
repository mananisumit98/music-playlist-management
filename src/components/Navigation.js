import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router';
import { DASHBOARD, SEARCH, SIGNIN } from '../utils/routes';
import { ExitToAppOutlined, LogoutOutlined, PlaylistAddTwoTone, SearchOutlined } from '@mui/icons-material';

const Navigation = ({ from }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log("INNNNNNNNNNNNNNNNNNNNNNNNN");
        localStorage.clear();
        navigate(SIGNIN);
    }

    return (
        <>
            <BottomNavigation
                showLabels
                style={{ width: "100%" }}
            >
                {(from === "search" || from === "song") && <BottomNavigationAction label="Playlists" onClick={() => navigate(DASHBOARD)} icon={<PlaylistAddTwoTone />} />}
                {(from === "dashboard" || from === "song") && <BottomNavigationAction label="Search Songs" onClick={() => navigate(SEARCH)} icon={<SearchOutlined />} />}
                <BottomNavigationAction onClick={handleLogout} label="Logout" icon={<ExitToAppOutlined />} />
            </BottomNavigation>
        </>
    )
}

export default Navigation;