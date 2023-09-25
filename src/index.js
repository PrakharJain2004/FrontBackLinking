import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './Dashboard';
import PostPage from './PostPage';
import ProfilePage from './ProfilePage';
import SearchPage from './SearchPage';
import LoginForm from "./LoginForm";
import homeIcon from './homeicon.png';
import postIcon from './posticon.png';
import profileIcon from './profileicon.png';
import searchIcon from './searchicon.png';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [activeTab, setActiveTab] = useState('mentioned');

    const [userData, setUserData] = useState({
        name: 'Friend1',
        profileImage: '.profileicon',
        branch: 'CSE26',
        bio: 'A passionate blogger and explorer!',


        confessions: [
            {mentioned_user:'', content: '@abc Hello, @rvc' + '!', date_posted: "2023-08-06T15:15:57Z",},
            {mentioned_user:'', content: '@abc Hello, @rvc' + '!', date_posted: "2023-08-06T15:15:57Z",},
            {mentioned_user:'', content: '@abc Hello, rvc' + '!', date_posted: "2023-08-06T15:15:57Z",},
            {mentioned_user:'', content: '@abc Hello, rvc' + '!', date_posted: "2023-08-06T15:15:57Z",},
            {mentioned_user:'', content: '@abc Hello, rvc' + '!', date_posted: "2023-08-06T15:15:57Z",},
            {mentioned_user:'', content: '@abc Hello, rvc' + '!', date_posted: "2023-08-06T15:15:57Z",},
            // ... other posts
        ],


        mentioned: [
            { content: 'Hello, rvc' + '!', date_posted: "2023-08-06T15:15:57Z",},
            { content: 'Another day, another post.',date_posted: "2023-08-06T15:15:57Z", },
            { content: 'Another day, another post.',date_posted: "2023-08-06T15:15:57Z", },
            { content: 'Another day, another post.',date_posted: "2023-08-06T15:15:57Z", },
            { content: 'Another day, another post.' ,date_posted: "2023-08-06T15:15:57Z",},
            { content: 'Another day, another post.',date_posted: "2023-08-06T15:15:57Z", },
            { content: 'Another day, another post.' ,date_posted: "2023-08-06T15:15:57Z",}


            // ... other posts
        ],

        friends: [
            { name: 'Friend1', username:'abc',image: 'C:/Users/Prakhar Jain/OneDrive/Pictures/Harshit.png'},
            { name: 'Friend2',username:'abc',image: 'C:/Users/Prakhar Jain/OneDrive/Pictures/Harshit.png' },
            { name: 'Friend3',username:'abc',image: 'C:/Users/Prakhar Jain/OneDrive/Pictures/Harshit.png' },
            { name: 'Friend1', username:'abc',image: 'C:/Users/Prakhar Jain/OneDrive/Pictures/Harshit.png'},
            { name: 'Friend2',username:'abc',image: 'C:/Users/Prakhar Jain/OneDrive/Pictures/Harshit.png' },
            { name: 'Friend3',username:'abc',image: 'C:/Users/Prakhar Jain/OneDrive/Pictures/Harshit.png' },
            { name: 'Friend1', username:'abc',image: 'C:/Users/Prakhar Jain/OneDrive/Pictures/Harshit.png'},
            { name: 'Friend2',username:'abc',image: 'C:/Users/Prakhar Jain/OneDrive/Pictures/Harshit.png' },
            { name: 'Friend3',username:'abc',image: 'C:/Users/Prakhar Jain/OneDrive/Pictures/Harshit.png' },
            // Add more friends as needed
        ],
    });

    const [usersData, setUsersData] = useState([
        { name: 'Friend1',username:'abc',image: 'C:/Users/Prakhar Jain/OneDrive/Pictures/Harshit.png' },
        { name: 'Friend2',username:'abc', image: 'C:\\Users\\Prakhar Jain\\WebstormProjects\\front-end\\Front-End\\Front-End\\My.jpg' },
        { name: 'Friend3',username:'abc',image: 'C://Users//Prakhar Jain//WebstormProjects//front-end//Front-End//Front-End//My.jpg' },
        // ... other users
    ]);

    const switchToPostPage = () => {
        setCurrentPage('PostPage');
    };

    const switchToDashboard = () => {
        setCurrentPage('dashboard');
    };

    const switchToProfilePage = () => {
        setCurrentPage('profilePage');
    };

    const switchToSearchPage = () => {
        setCurrentPage('searchPage');
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };


    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };

        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }

    }, []);
    return (
        <div>
            <nav>
                {isAuthenticated && windowWidth <= 768 && (
                    <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '33px', borderTop: '1px solid #808080', padding: '13px', position: 'fixed', bottom: '0', left: '0', right: '0', backgroundColor: '#ffffff', zIndex: '100', width: '100%',
                        boxSizing: 'border-box', }}>
                        <img src={homeIcon} onClick={switchToDashboard} style={{ width: '31px', height: '31px' }} />
                        <img src={searchIcon} onClick={switchToSearchPage} style={{ width: '31px', height: '31px' }} />
                        <img src={postIcon} onClick={switchToPostPage} style={{ width: '31px', height: '31px' }} />
                        <img src={profileIcon} onClick={switchToProfilePage} style={{ width: '31px', height: '31px' }} />

                    </div>
                )}
                {/* Other navigation elements */}
            </nav>
            {isAuthenticated ? (
                // Render other pages when the user is authenticated
                <>
                    {currentPage === 'dashboard' && <Dashboard switchToPostPage={switchToPostPage} />}
                    {currentPage === 'PostPage' && <PostPage switchToDashboard={switchToDashboard} users={usersData} />}
                    {currentPage === 'profilePage' && <ProfilePage user={userData} activeTab={activeTab} handleTabClick={handleTabClick} setUserData={setUserData} />}
                    {currentPage === 'searchPage' && <SearchPage usersData={usersData} />}
                </>
            ) : (
                // Render the login form when the user is not authenticated
                <LoginForm setIsAuthenticated={setIsAuthenticated} />
            )}
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));


