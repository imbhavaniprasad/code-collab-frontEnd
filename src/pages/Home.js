import React from 'react'
import {
    Navigate,
    useNavigate
} from 'react-router-dom';
import { ROOMIDS } from '../Actions';

export const Home = () => {
    const navigate = useNavigate();
    const navigateTo = () => navigate(`/editor/${ROOMIDS["htmlmixed"]}`);
    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: "center" }}>
            <div>
                <button className="intro-button" onClick={navigateTo}>Let's Code</button>
                <p style={{ marginTop: '20px', textAlign: 'center', marginLeft: "-38px" }}>Developed by <span style={{ fontSize: "20px" }}><b><a href="https://linkedin.com/in/imbhavaniprasad">Bhavani Prasad</a></b></span></p>
            </div>
        </div>
    )
}
export default Home