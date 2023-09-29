import React, { useState, useEffect } from 'react';
import CrossIcon from './cross.png';
import axios from 'axios';

const PostPage = ({ switchToDashboard, users }) => {
    const colorNameMap = {
        '#88FD88B7': 'green',
        '#76fd76': 'green',
        '#AA89FFB7': 'purple',
        '#9b76ff': 'purple',
        '#FFF189B7': 'yellow',
        '#ffef76': 'yellow',
        '#FF8989B7': 'red',
        '#FF7676FF': 'red',
        '#89E7FFB7': 'blue',
        '#76cfff': 'blue',
        '#FC85BDB7': 'pink',
        '#ff76b3': 'pink',
    };
    const [newContent, setNewContent] = useState('');
    const [items, setItems] = useState([]);
    const [mentionedUsers, setMentionedUsers] = useState([]);
    const [suggestedMentionedUsers, setSuggestedMentionedUsers] = useState([]);
    const [selectedStickyNoteColorIndex, setSelectedStickyNoteColorIndex] = useState(0);
    const [showStickyNote, setShowStickyNote] = useState(true);

    const handleItemSubmit = async () => {
        if (newContent.trim() === '') {
            return;
        }

        const token = localStorage.getItem('token');

        // Extract mentioned user's name
        const mentionedUserMatch = newContent.match(/@(\w+)/);
        const mentionedUser = mentionedUserMatch ? mentionedUserMatch[1] : null; // If no mention, set it to null

        // Get the selected color name from colorNameMap
        const selectedColorShade = stickyNoteColors[selectedStickyNoteColorIndex];
        const colorCode = colorNameMap[selectedColorShade];

        // Create the payload based on whether a mentioned user is present
        const payload = {
            content: newContent,
            color_code: colorCode,
            date_posted: new Date().toISOString(),
            author: '', // Replace with actual user info
            stickyNoteColor: selectedStickyNoteColorIndex,
        };

        // Include mentioned_user field only if mentionedUser is not null
        if (mentionedUser !== null) {
            payload.mentioned_user = mentionedUser;
        }

        try {
            const response = await axios.post('http://192.168.1.196:8000/posts/', payload, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            // Assuming you have a function switchToDashboard that handles navigation
            switchToDashboard(); // Redirect to the dashboard

            // Rest of the code...
        } catch (error) {
            // Handle errors here
            console.error('Error posting item:', error);
        }
    };

    const fetchUserSuggestions = async (mentionInput) => {
        try {
            const response = await axios.get('http://192.168.1.196:8000/users/');
            const allUsers = response.data;
            const filteredUsers = allUsers.filter((user) =>
                user.username.toLowerCase().includes(mentionInput)
            );
            const uniqueSuggestions = filteredUsers.filter((user, index, self) =>
                index === self.findIndex((u) => u.username === user.username)
            );

            setSuggestedMentionedUsers(uniqueSuggestions);
        } catch (error) {
            console.error('Error fetching user suggestions:', error);
        }
    };

    const handleInputChange = (event) => {
        const inputText = event.target.value;
        setNewContent(inputText);

        if (inputText.length >= 3 && inputText.includes('@')) {
            const lastMentionStart = inputText.lastIndexOf('@');
            const mentionInput = inputText.substring(lastMentionStart + 1).toLowerCase();
            fetchUserSuggestions(mentionInput);
        } else {
            setSuggestedMentionedUsers([]);
        }
    };

    const handleMentionClick = (user) => {
        const mention = `@${user.username}`;
        const lastMentionStart = newContent.lastIndexOf('@');

        if (lastMentionStart >= 0) {
            const preMentionText = newContent.substring(0, lastMentionStart);
            const updatedContent = preMentionText + mention + ' ';
            setNewContent(updatedContent);
        } else {
            setNewContent(mention + ' ');
        }
        setMentionedUsers([...mentionedUsers, user]);
        setSuggestedMentionedUsers([]);
    };

    const getStickyNoteColor = () => {
        return stickyNoteColors[selectedStickyNoteColorIndex];
    };

    const getStickyNoteColor1 = () => {
        return stickyNoteColors1[selectedStickyNoteColorIndex];
    };

    const handleColorChange = (colorIndex) => {
        const shade1 = stickyNoteColors[colorIndex];
        const shade2 = stickyNoteColors1[colorIndex];
        const combinedColor = { shade1, shade2 };
        setSelectedStickyNoteColorIndex(colorIndex);
        const colorName = colorNameMap[shade1] || colorNameMap[shade2];
        // console.log(colorName);
    };

    useEffect(() => {
        const handleScroll = () => {
            setShowStickyNote(window.scrollY <= 0);
        };

        window.addEventListener('scroll', handleScroll);

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
        <div>
            <button onClick={switchToDashboard} style={{ position: 'absolute', top: '20px', left: '10px', background: 'none', border: 'none' }}>
                <img src={CrossIcon} alt="Close" style={{ width: '15px', height: '15px' }} />
            </button>
            <div style={{ marginTop: '110px' }}>
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
                            bottom: '-0px',
                            left: '27px',
                            width: '30px',
                            height: '30px',
                            background: getStickyNoteColor1(),
                            clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%, 0% 75%)',
                            zIndex: '0',
                            transform: 'rotate(-81deg)',
                            transformOrigin: 'bottom left',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%',
                            backgroundColor: getStickyNoteColor(),
                            opacity: '1%',
                            zIndex: '-1',
                            borderRadius: '11px',
                        }}
                    />
                    <textarea
                        placeholder="@mention Write your confession here..."
                        value={newContent}
                        onChange={handleInputChange}
                        rows={Math.min(10, newContent.split('\n').length + 1)}
                        style={{  position: 'relative', zIndex: '1',backgroundColor: 'transparent',resize: 'none', marginLeft: '25px',border: 'none',borderRadius:'11px',outline: 'none', lineHeight:'1.5',width: 'calc(100% - 25px)', fontSize: '20px' , fontFamily:'Helvetica'}}
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
                <button onClick={handleItemSubmit} style={{ position: 'fixed', top: '20px', right: '10px', background: '#000', color: '#fff', border: 'none', borderRadius: '11px', padding: '6px 12px', fontSize: '20px', cursor: 'pointer', fontFamily:'Helvetica' }}><b>Confess!</b></button>
            </div>
        </div>
    );
};

export default PostPage;
