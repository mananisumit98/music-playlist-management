import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router';
import { DASHBOARD, SEARCH } from '../utils/routes';
import { PlaylistAddTwoTone, SearchOutlined } from '@mui/icons-material';

const Navigation = ({ from }) => {
    const navigate = useNavigate();
    return (
        <>
            <BottomNavigation
                showLabels
                style={{ width: "100%" }}
                onChange={(event, newValue) => {
                    if (from === "dashboard") {
                        navigate(SEARCH);
                    } else if (from === "search") {
                        navigate(DASHBOARD);
                    } else if (from === "song") {
                        if (newValue === 0) {
                            navigate(DASHBOARD);
                        } else if (newValue === 1) {
                            navigate(SEARCH);
                        }
                    }
                }}
            >
                {(from === "search" || from === "song") && <BottomNavigationAction label="Playlists" icon={<PlaylistAddTwoTone />} />}
                {(from === "dashboard" || from === "song") && <BottomNavigationAction label="Search Songs" icon={<SearchOutlined />} />}
            </BottomNavigation>
        </>
    )
}

export default Navigation;