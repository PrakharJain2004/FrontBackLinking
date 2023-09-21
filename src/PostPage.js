import React, { useState,useEffect } from 'react';
import CrossIcon from './cross.png';
import axios from "axios";
const PostPage = ({ switchToDashboard, users }) => {
    const [newPostContent, setNewPostContent] = useState('');
    const [posts, setPosts] = useState([]);
    const [mentionedUsers, setMentionedUsers] = useState([]);
    const [suggestedMentionedUsers, setSuggestedMentionedUsers] = useState([]);
    const [selectedStickyNoteColorIndex, setSelectedStickyNoteColorIndex] = useState(0);


    const [showStickyNote, setShowStickyNote] = useState(true);
    const handlePostSubmit = async () => {
        if (newPostContent.trim() === '') {
            return;
        }

        const token = localStorage.getItem('token');

        const newPost = {
            content: newPostContent,
            date_posted: new Date().toISOString(),
            author: 'User123', // Replace with actual user info
            mentioned_users: mentionedUsers.map((user) => user.name),
            stickyNoteColor: selectedStickyNoteColorIndex,
        };

        try {
            const response = await axios.post('http://192.168.1.196:8000/posts/', newPost, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            // Assuming you have a function switchToDashboard that handles navigation
            switchToDashboard(); // Redirect to the dashboard

            // Rest of the code...
        } catch (error) {
            // Error handling code...
        }
    };


    const fetchUserSuggestions = async (mentionInput) => {
        try {
            const response = await axios.get('http://192.168.1.196:8000/users/');

            // Assuming the response data is an array of user objects
            const allUsers = response.data;

            // Filter users whose usernames contain the mention input
            const filteredUsers = allUsers.filter((user) =>
                user.username.toLowerCase().includes(mentionInput)
            );

            // Remove duplicates from suggestions
            const uniqueSuggestions = filteredUsers.filter((user, index, self) =>
                index === self.findIndex((u) => u.username === user.username)
            );

            setSuggestedMentionedUsers(uniqueSuggestions);
        } catch (error) {
            // Handle errors here
            console.error('Error fetching user suggestions:', error);
        }
    };


    const handleInputChange = (event) => {
        const inputText = event.target.value;
        setNewPostContent(inputText);

        if (inputText.length >= 3 && inputText.includes('@')) {
            const lastMentionStart = inputText.lastIndexOf('@');
            const mentionInput = inputText.substring(lastMentionStart + 1).toLowerCase();

            // Use the fetchUserSuggestions function to get user suggestions
            fetchUserSuggestions(mentionInput);
        } else {
            setSuggestedMentionedUsers([]);
        }
    };




    const handleMentionClick = (user) => {
        const mention = `@${user.username}`; // Use `user.username` instead of `user.name`
        const lastMentionStart = newPostContent.lastIndexOf('@');

        if (lastMentionStart >= 0) {
            const preMentionText = newPostContent.substring(0, lastMentionStart);
            const updatedContent = preMentionText + mention + ' ';
            setNewPostContent(updatedContent);
        } else {
            setNewPostContent(mention + ' ');
        }
        setMentionedUsers([...mentionedUsers, user]);
        setSuggestedMentionedUsers([]);
    };

    // Get the selected color from the selected index
    const getStickyNoteColor = () => {
        return stickyNoteColors[selectedStickyNoteColorIndex];
    };

    const getStickyNoteColor1 = () => {
        return stickyNoteColors1[selectedStickyNoteColorIndex];
    };

    // Handle color change
    const handleColorChange = (colorIndex) => {
        setSelectedStickyNoteColorIndex(colorIndex);
    };

    useEffect(() => {
        // Show sticky note background when scrolling up
        const handleScroll = () => {
            setShowStickyNote(window.scrollY <= 0);
        };

        window.addEventListener('scroll', handleScroll);

        // Clean up event listener on unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    const stickyNoteColors = [
        '#FC85BDB7',
        '#89E7FFB7',
        '#FF8989B7',
        '#FFF189B7',
        '#AA89FFB7',
        '#88FD88B7',
    ];
    const stickyNoteColors1 = [
        '#ff76b3',
        '#76cfff',
        '#FF7676FF',
        '#ffef76',
        '#9b76ff',
        '#76fd76',
    ];


    return (
        <div >
            <button onClick={switchToDashboard} style={{ position: 'absolute', top: '20px', left: '10px', background: 'none', border: 'none' }}>
                <img src={CrossIcon} alt="Close" style={{ width: '15px', height: '15px' }} />
            </button>
            <div style={{ marginTop: '110px' }}>
                {/* Add color selection options */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    {stickyNoteColors1.map((color, index) => (
                        <div
                            key={index}
                            onClick={() => handleColorChange(index)}
                            style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: color,
                                borderRadius: '50%',
                                margin: '0 5px',
                                cursor: 'pointer',
                                border: selectedStickyNoteColorIndex === index ? '2px solid #000' : 'none',
                            }}
                        />
                    ))}


                </div>
                <div
                    style={{
                        background: getStickyNoteColor(),
                        borderRadius: '11px',
                        borderBottomLeftRadius: '30px',
                        position: showStickyNote ? 'sticky' : 'relative',
                        top: showStickyNote ? '0' : 'initial',
                        zIndex: showStickyNote ? '10' : 'auto',
                        border: '1px solid #000',
                        padding: '10px',
                        margin: '10px',
                        maxWidth: '100%',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <div
                        style={{

                            borderBottom:'2px solid #000',

                            borderRight:'1px solid #000',
                            borderTopRightRadius: '0px',
                            borderTopLeftRadius: '30px',
                            borderBottomRightRadius: '11px',
                            borderBottomLeftRadius: '0px',
                            position: 'absolute',
                            bottom: '-0px', // Adjust as needed
                            left: '27px', // Adjust as needed
                            width: '30px', // Adjust as needed
                            height: '30px', // Adjust as needed
                            background: getStickyNoteColor1(), // Use the same color as sticky note
                            clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%, 0% 75%)', // Create fold effect
                            zIndex: '0',
                            transform: 'rotate(-81deg)', // Rotate the folded corner
                            transformOrigin: 'bottom left', // Set the rotation origin
                        }}
                    />
                    <textarea
                        placeholder =" @mention
                     Write your post here..."
                        value={newPostContent}
                        onChange={handleInputChange}
                        rows={Math.min(10, newPostContent.split('\n').length + 1)}
                        style={{  resize: 'none', marginLeft: '25px',border: 'none',borderRadius:'11px',outline: 'none', lineHeight:'1.5',width: 'calc(100% - 25px)', fontSize: '20px' , fontFamily:'Helvetica'}}
                    />

                </div>
                <div>
                    {suggestedMentionedUsers.length > 0 && (

                        <ul>
                            {suggestedMentionedUsers.map((user, index) => (
                                <li key={index} style={{ display: 'flex', alignItems: 'center',borderBottom: '1px solid #ccc', padding: '0px 0',position: 'relative',left: '-20px' }} onClick={() => handleMentionClick(user)}>
                                    <img src={user.image} style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
                                    <div style={{ flex: '1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ fontFamily: 'Helvetica', color: '#000', fontSize: '17px' ,position: 'relative',top:'4px', margin: '10px'}}><b>@{user.username}</b></p>
                                            <p style={{ fontFamily: 'Helvetica',color: '#8f8f8f',position: 'relative',top:'-2px', fontSize: '17px', margin: '10px' }}>{user.name}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button onClick={handlePostSubmit} style={{ position: 'fixed', top: '20px', right: '10px', background: '#000', color: '#fff', border: 'none', borderRadius: '11px', padding: '6px 12px', fontSize: '20px', cursor: 'pointer', fontFamily:'Helvetica' }}><b>Post</b></button>
            </div>
        </div>
    );
};

export default PostPage;