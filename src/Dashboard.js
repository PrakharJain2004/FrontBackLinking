import React, { useState, useEffect } from 'react';
import homeIcon from './homeicon.png';
import searchIcon from './searchicon.png';
import postIcon from './posticon.png';
import profileIcon from './profileicon.png';

const Dashboard = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showStickyNote, setShowStickyNote] = useState(true);
    const jsonData = [
        {
            "content": "hello welocome to rvc ",
            "date_posted": "2023-08-06T15:15:31Z",
            "author": 3,
            "mentioned_user": 2
        },
        {
            "content": "Lorem Ipsum...",
            "date_posted": "2023-08-06T15:15:57Z",
            "author": 2,
            "mentioned_user": 3
        },

        {
            "content": "Lorem Ipsum...",
            "date_posted": "2023-08-06T15:15:31Z",
            "author": 3,
            "mentioned_user": 2
        },
        {
            "content": "Lorem Ipsum...",
            "date_posted": "2023-08-06T15:15:57Z",
            "author": 2,
            "mentioned_user": 3
        },
        {
            "post id" : 2,
            "content": "Lorem Ipsum...",
            "date_posted": "2023-08-06T15:15:31Z",
            "author": 3,
            "mentioned_user": 2
        },
        {
            "content": "Lorem Ipsum...",
            "date_posted": "2023-08-06T15:15:57Z",
            "author": 2,
            "mentioned_user": 3
        },
        {
            "content": "Lorem Ipsum...",
            "date_posted": "2023-08-06T15:15:57Z",
            "author": 2,
            "mentioned_user": 3
        },
        {
            "content": "Lorem Ipsum...",
            "date_posted": "2023-08-06T15:15:57Z",
            "author": 2,
            "mentioned_user": 3
        },
        {
            "content": "Lorem Ipsum...",
            "date_posted": "2023-08-06T15:15:57Z",
            "author": 2,
            "mentioned_user": 3
        },
        {
            "content": "Lorem Ipsum...",
            "date_posted": "2023-08-06T15:15:57Z",
            "author": 2,
            "mentioned_user": 3
        },
    ];

    const formatTimeDifference = (postDate) => {
        const currentDate = new Date();
        const timeDifference = currentDate - new Date(postDate);

        if (timeDifference < 60000) { // Less than 1 minute
            return Math.floor(timeDifference / 1000) + " s";
        } else if (timeDifference < 3600000) { // Less than 1 hour
            return Math.floor(timeDifference / 60000) + " m";
        } else if (timeDifference < 86400000) { // Less than 1 day
            return Math.floor(timeDifference / 3600000) + " h";
        } else { // More than 1 day
            return Math.floor(timeDifference / 86400000) + " d";
        }
    };

    useEffect(() => {
        // Update window width on resize
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);



            const handleScroll = () => {
                setShowStickyNote(window.scrollY <= 0); // Show sticky note when scrolling up
            };

            window.addEventListener('scroll', handleScroll);

            // Clean up event listener on unmount
            return () => {
                window.removeEventListener('resize', handleResize);
                window.removeEventListener('scroll', handleScroll);
        };
    }, []);
        const getStickyNoteColor = (index) => {
            // Replace this logic with your color generation or predefined colors
            const colors = ['#FC85BDB7', '#89E7FFB7','#FF8989B7', '#FFF189B7','#AA89FFB7',  '#88FD88B7',];
            return colors[index % colors.length];
        };
    const getStickyNoteColor1 = (index) => {
        // Replace this logic with your color generation or predefined colors
        const colors = ['#ff76b3', '#76cfff','#FF7676FF','#ffef76','#9b76ff','#76fd76', ];
        return colors[index % colors.length];
    };

    return (
        <div style={{ marginBottom: windowWidth <= 768 ? '60px' : '0' }}>
            {/* Top Bar */}
            <div style={{ display: 'flex', alignItems: 'center',justifyContent:'center', padding: '13px', borderBottom: '1px solid #808080' }}>
                <div>
                    {/* Logo */}
                    <img src="path_to_your_logo.png" alt="RV Connected" style={{ height: '50px'}} />
                </div>

            </div>
            {jsonData.map((post, index) => (
                <div key={index} style={{  borderRadius:'11px', borderBottomLeftRadius:'30px', background: getStickyNoteColor(index), position: showStickyNote ? 'sticky' : 'relative', top: showStickyNote ? '0' : 'initial', zIndex: showStickyNote ? '10' : 'auto',border: '1px solid #000', padding: '10px', margin: '10px' , maxWidth:'100%', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    <div
                        style={{  zIndex: '1', fontFamily: 'Helvetica',position: 'relative',}}>
                    {post.mentioned_user !== null && <p style={{  fontFamily:'Helvetica',color: '#000',fontSize:'15px',position: 'relative',top: '-15px' }}><b>@{post.mentioned_user}</b></p>}
                    <p style={{ position: 'absolute', top: '-30px', right: '4px' , color: '#000', fontFamily:'Helvetica' }}>{formatTimeDifference(post.date_posted)}</p>
                    <p style={{fontFamily:'Helvetica',position: 'relative',left: '27px',top: '-30px'}}>{post.content}</p>
                </div>
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
                            background: getStickyNoteColor1(index), // Use the same color as sticky note
                            clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%, 0% 75%)', // Create fold effect
                            zIndex: '0',
                            transform: 'rotate(-81deg)', // Rotate the folded corner
                            transformOrigin: 'bottom left', // Set the rotation origin
                        }}
                    />
                </div>
            ))}


        </div>
    );
};

export default Dashboard;
