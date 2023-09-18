import React, {useEffect, useState} from 'react';


    const ProfilePage = ({user , activeTab, handleTabClick,setUserData}) => {
        const [windowWidth, setWindowWidth] = useState(window.innerWidth);
        const [showStickyNote, setShowStickyNote] = useState(true);
        const formatTimeDifference = (postDate,mentionDate) => {
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
            const colors = ['rgba(252,133,189,0.72)', 'rgba(137,231,255,0.72)', 'rgba(255,137,137,0.72)', 'rgba(255,241,137,0.72)', 'rgba(170,137,255,0.72)', 'rgba(136,253,136,0.72)',];
            return colors[index % colors.length];
        };
        const getStickyNoteColor1 = (index) => {
            // Replace this logic with your color generation or predefined colors
            const colors = ['#ff76b3', '#76cfff', '#FF7676FF', '#ffef76', '#9b76ff', '#76fd76',];
            return colors[index % colors.length];
        };
        const handleUnfriend = (friendName) => {
            // Create a copy of the user data
            const updatedUserData = { ...user };

            // Find the index of the friend in the friends list
            const friendIndex = updatedUserData.friends.findIndex(
                (friend) => friend.name === friendName
            );

            // Remove the friend from the list
            if (friendIndex !== -1) {
                updatedUserData.friends.splice(friendIndex, 1);
                setUserData(updatedUserData);
            }
        };

        return (
            <div style={{ marginBottom: windowWidth <= 768 ? '60px' : '0' }}>
                <p style={{fontFamily: 'Helvetica', fontSize: '30px'}}><b>{user.name}</b> </p>
                <div>
                    <img src={user.profileImage} style={{width: '70px', height: '70px', borderRadius: '50%', position:'absolute', top: '20px', right: '14px'}}/>
                   <br/>
                    <p style={{fontFamily: 'Helvetica',position:'absolute', top: '60px'}}>{user.branch}</p>
                    <p style={{fontFamily: 'Helvetica',position:'absolute', top: '80px'}}>{user.bio}</p>
                </div>


                <div style={{ display: 'flex', marginTop: '20px' , justifyContent: 'space-between',width: '100%', }}>
                    <div
                        className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
                        onClick={() => handleTabClick('posts')}
                        style={{
                            flex: 1,
                            fontFamily: 'Helvetica', fontSize: '20px',
                            textAlign: 'center',
                            color: activeTab === 'posts' ? '#000' : '#c0c0c0',
                        }}
                    >
                        <b>Posts</b>
                    </div>
                    <div
                        className={`tab ${activeTab === 'mentioned' ? 'active' : ''}`}
                        onClick={() => handleTabClick('mentioned')}
                        style={{
                            flex: 1,
                            fontFamily: 'Helvetica', fontSize: '20px',
                            textAlign: 'center',
                            color: activeTab === 'mentioned' ? '#000' : '#c0c0c0',
                        }}

                    >
                        <b>Mentions</b>
                    </div>

                    <div
                        className={`tab ${activeTab === 'friends' ? 'active' : ''}`}
                        onClick={() => handleTabClick('friends')}
                        style={{
                                flex: 1,
                                fontFamily: 'Helvetica', fontSize: '20px',
                                textAlign: 'center',
                                color: activeTab === 'friends' ? '#000' : '#c0c0c0',}}
                    >
                        <b>Friends</b>
                    </div>

                </div>
                <hr />
                {activeTab === 'posts' && (
                    <>


                            {user.posts.map((post, index) => (
                                    <div key={index} style={{
                                        borderRadius: '11px',
                                        borderBottomLeftRadius: '30px',
                                        background: getStickyNoteColor(index),
                                        position: 'relative',
                                        top: '0',
                                        zIndex: 'auto',
                                        border: '1px solid #000',
                                        padding: '10px',
                                        margin: '10px',
                                        maxWidth: '100%',
                                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
                                    }}>
                                        <div
                                            style={{zIndex: '1', fontFamily: 'Helvetica', position: 'relative'}}>
                                            {post.mentioned_user !== null && <p style={{
                                                fontFamily: 'Helvetica',
                                                color: '#000',
                                                fontSize: '15px',
                                                position: 'relative',
                                                top: '-15px'
                                            }}><b>@{post.mentioned_user}</b></p>}
                                            <p style={{
                                                position: 'absolute',
                                                top: '-30px',
                                                right: '4px',
                                                color: '#000',
                                                fontFamily: 'Helvetica'
                                            }}>{formatTimeDifference(post.date_posted)}</p>
                                            <p style={{
                                                fontFamily: 'Helvetica',
                                                position: 'relative',
                                                left: '27px',
                                                top: '-30px'
                                            }}>{post.content}</p>
                                        </div>
                                        <div
                                            style={{
                                                borderBottom: '2px solid #000',
                                                borderRight: '1px solid #000',
                                                borderTopRightRadius: '0px',
                                                borderTopLeftRadius: '30px',
                                                borderBottomRightRadius: '11px',
                                                borderBottomLeftRadius: '0px',
                                                position: 'absolute',
                                                bottom: '-0px',
                                                left: '27px',
                                                width: '30px',
                                                height: '30px',
                                                background: getStickyNoteColor1(index),
                                                clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%, 0% 75%)',
                                                zIndex: '0',
                                                transform: 'rotate(-81deg)',
                                                transformOrigin: 'bottom left',
                                            }}
                                        />
                                    </div>
                                ))}
                    </>
                )}
                {activeTab === 'mentioned' && (
                    <>
                        {user.mentioned.map((mention, index) => (
                            <div key={index} style={{
                                borderRadius: '11px',
                                borderBottomLeftRadius: '30px',
                                background: getStickyNoteColor(index),
                                position: 'relative',
                                top: '0',
                                zIndex: 'auto',
                                border: '1px solid #000',
                                padding: '10px',
                                margin: '10px',
                                maxWidth: '100%',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
                            }}>
                                <div
                                    style={{zIndex: '1', fontFamily: 'Helvetica', position: 'relative'}}>
                                    {mention.mentioned_user !== null && <p style={{
                                        fontFamily: 'Helvetica',
                                        color: '#000',
                                        fontSize: '15px',
                                        position: 'relative',
                                        top: '-15px'
                                    }}><b>@{mention.mentioned_user}</b></p>}
                                    <p style={{
                                        position: 'absolute',
                                        top: '-30px',
                                        right: '4px',
                                        color: '#000',
                                        fontFamily: 'Helvetica'
                                    }}>{formatTimeDifference(mention.date_posted)}</p>
                                    <p style={{
                                        fontFamily: 'Helvetica',
                                        position: 'relative',
                                        left: '27px',
                                        top: '-30px'
                                    }}>{mention.content}</p>
                                </div>
                                <div
                                    style={{
                                        borderBottom: '2px solid #000',
                                        borderRight: '1px solid #000',
                                        borderTopRightRadius: '0px',
                                        borderTopLeftRadius: '30px',
                                        borderBottomRightRadius: '11px',
                                        borderBottomLeftRadius: '0px',
                                        position: 'absolute',
                                        bottom: '-0px',
                                        left: '27px',
                                        width: '30px',
                                        height: '30px',
                                        background: getStickyNoteColor1(index),
                                        clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%, 0% 75%)',
                                        zIndex: '0',
                                        transform: 'rotate(-81deg)',
                                        transformOrigin: 'bottom left',
                                    }}
                                />
                            </div>
                        ))}
                    </>
                )}
                {activeTab === 'friends' && (
                    <>
                        {user.friends.map((friend, index) => (

                                <div key={index} style={{ display: 'flex', alignItems: 'center',borderBottom: '1px solid #ccc', padding: '0px 0' }}>
                                    <img src={friend.image} style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
                                    <div style={{ flex: '1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ fontFamily: 'Helvetica', color: '#000', fontSize: '17px' ,position: 'relative',top:'4px', margin: '10px'}}><b>@{friend.username}</b></p>
                                            <p style={{ fontFamily: 'Helvetica',color: '#8f8f8f',position: 'relative',top:'-2px', fontSize: '17px', margin: '10px' }}>{friend.name}</p>
                                        </div>
                                        <button style={{ fontFamily: 'Helvetica',backgroundColor: 'white' ,padding: '6px 10px',border: '1.2px solid #ccc',borderRadius:'10px', fontSize: '17px'}} onClick={() => handleUnfriend(friend.name)}><b>Unfriend</b></button>
                                    </div>
                            </div>
                        ))}
                    </>
                )}
                {/*{activeTab === 'clubs' && (*/}
                {/*    <>*/}
                {/*        /!* Render clubs content here *!/*/}
                {/*    </>*/}
                {/*)}*/}




            </div>
        );
    };

export default ProfilePage;