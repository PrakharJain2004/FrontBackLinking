import React, { useState, useEffect } from 'react';
import homeIcon from './homeicon.png';
import searchIcon from './searchicon.png';
import postIcon from './posticon.png';
import profileIcon from './profileicon.png';
import rvclogo from './rvclogo.png';
import likeicon from './likeicon.png';
import dislikeicon from './dislikeicon.png';
import commenticon from './commenticon.png';


const Dashboard = ({ user,   }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showStickyNote, setShowStickyNote] = useState(true);
    const [likeState, setLikeState] = useState({});




    const formatTimeDifference = (confessionDate) => {
        const currentDate = new Date();
        const timeDifference = currentDate - new Date(confessionDate);

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

    const handleLikeDislike = (confessionId) => {
        const newLikeState = { ...likeState };
        newLikeState[confessionId] = !newLikeState[confessionId];
        setLikeState(newLikeState);
    };


    return (
        <div style={{ marginBottom: windowWidth <= 768 ? '60px' : '0' }}>
            {/* Top Bar */}
            <div style={{height:'50px', display: 'flex', alignItems: 'center',justifyContent:'center', padding: '15px', }}>
                <div>
                    {/* Logo */}
                    <img src={rvclogo} alt="RV Connected" style={{  paddingTop:'10px', height: '150px',width:'150px'}} />
                </div>

            </div>
            {user.confessions.map((confession, index) => (

                <div key={index} style={{
                    borderRadius: '11px',
                    borderBottomLeftRadius: '30px',
                    background: getStickyNoteColor(index),
                    position: 'relative',
                    top: '0',
                    zIndex: 'auto',
                    border: '0px solid #000',
                    padding: '10px',
                    margin: '10px',
                    maxWidth: '100%',
                    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                    whiteSpace: 'pre-line', /* Allow text to wrap to the next line */
                    overflow: 'hidden', /* Hide overflowing text */
                    overflowWrap: 'break-word',

                }}>

                    <div style={{ zIndex: '1', fontFamily: 'Helvetica', position: 'relative'  }}>


                        <p style={{
                            position: 'absolute',
                            top: '-15px',
                            right: '4px',
                            color: '#000',
                            fontFamily: 'Helvetica'
                        }}>{formatTimeDifference(confession.date_posted)}</p>
                        <button
                            onClick={() => handleLikeDislike(confession.id)}
                            style={{ backgroundColor:'transparent',border:'none',}}
                        >
                            {likeState[confession.id] ? <img src={likeicon} style={{height:'25px',width:'25px'}}/>  : <img src={dislikeicon} style={{height:'25px',width:'25px'}}/> }
                        </button>
                        <button

                            style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                            }}
                        >
                            {/* Add your comment icon here */}
                            <img src={commenticon} style={{ height: '25px', width: '25px' }} />
                        </button>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                            <p style={{
                                fontFamily: 'Helvetica',
                                position: 'relative',
                                left: '27px',
                                top: '-10px',
                                maxWidth: '87%',
                            }}>
                            <span dangerouslySetInnerHTML={{ __html: confession.content.replace(
                                    /@(\w+)/g, // Regular expression to find mentioned users
                                    (match, username) => `<b>@${username}</b>`
                                ) }} />

                            </p>

                        </div>
                    </div>

                    <div style={{
                        borderBottom: '3px solid #000',
                        borderRight: '1px solid #000',
                        borderTopRightRadius: '0px',
                        borderTopLeftRadius: '30px',
                        borderBottomRightRadius: '11px',
                        borderBottomLeftRadius: '2px',
                        position: 'absolute',
                        bottom: '-0.4px',
                        left: '30.5px',
                        width: '30px',
                        height: '31px',
                        background: getStickyNoteColor1(index),
                        clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%, 0% 75%)',
                        zIndex: '0',
                        transform: 'rotate(-83.6deg)',
                        transformOrigin: 'bottom left',
                    }}
                    />
                </div>

            ))}
        </div>
    );
};

export default Dashboard;
