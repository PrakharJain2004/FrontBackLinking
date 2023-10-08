import React, {useEffect, useState} from 'react';
import menuIcon from './menuicon.png';
import likeicon from "./likeicon.png";
import dislikeicon from "./dislikeicon.png";
import commenticon from "./commenticon.png";
import CrossIcon from './cross.png';
import axios from 'axios';
import postmenuIcon from "./postmenuicon.png";
const UserprofilePage = ({ activeTab = 'mentioned', handleTabClick, setUserData, usersData, switchToSearchPage }) => {
    const [user, setUser] = useState({});
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showStickyNote, setShowStickyNote] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredFriends, setFilteredFriends] = useState(user.friends);
    const [showDropdown, setShowDropdown] = useState(false);
    const [likeState, setLikeState] = useState({});
    const [isCommentDropdownOpen, setCommentDropdownOpen] = useState(false);
    const [selectedConfessionComments, setSelectedConfessionComments] = useState([]);
    const [selectedConfessionId, setSelectedConfessionId] = useState(null);
    const [commentCounts, setCommentCounts] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [friendshipStatus, setFriendshipStatus] = useState('Friends');
    const [userName, setUserName] = useState('');
    const [profileData, setProfileData] = useState({});
    const [mentions, setMentions] = useState([]);
    const [mentionsCommentCounts, setMentionsCommentCounts] = useState({});
    const [newComment, setNewComment] = useState('');
    const token = localStorage.getItem('token');

    const getColorSet = (colorCode) => {
        const colorMap = {
            pink: ['#FC85BDB7', '#ff76b3'],
            blue: ['#89E7FFB7', '#76cfff'],
            red: ['#FF8989B7', '#FF7676FF'],
            yellow: ['#FFF189B7', '#ffef76'],
            purple: ['#AA89FFB7', '#9b76ff'],
            green: ['#88FD88B7', '#76fd76'],
        };

        return colorMap[colorCode] || colorMap['default']; // Provide a default color set if colorCode is not found
    };


    const handleUserClick = (user) => {
        setSelectedUser(user);
        setShowUserProfile(true);
    };

    const handleCommentInputChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleCommentSubmit = () => {
        if (newComment.trim() === '') {
            return; // Prevent posting empty comments
        }

        const commentData = {
            comment: newComment,
            post_id: selectedConfessionId, // Use the selected post's ID
        };

        // Make a POST request to the API endpoint with token authentication
        axios
            .post('https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/comments/', commentData, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            })
            .then((response) => {
                // Handle successful comment submission
                // console.log('Comment posted successfully:', response.data);

                // Step 1: Add the new comment to the selectedConfessionComments state
                const newCommentData = {
                    ...response.data,
                    user_commented: user, // Add user details to the comment
                };

                // Check if user.comments is defined before using it
                if (user && user.comments) {
                    const updatedComments = [...user.comments, newCommentData];
                    setUser((prevUser) => ({ ...prevUser, comments: updatedComments }));
                }

                // Step 2: Update the comment count for the selected post
                setCommentCounts((prevCounts) => ({
                    ...prevCounts,
                    [selectedConfessionId]: (prevCounts[selectedConfessionId] || 0) + 1,
                }));

                // Clear the comment input field
                setNewComment('');

                // Refresh the page to show the updated comments
                // window.location.reload();
            })
            .catch((error) => {
                console.error('Error posting comment:', error);
            });
    };

    useEffect(() => {
        // Fetch the user's data using the username
        const searchId = localStorage.getItem('searchId');

        if (searchId) {
            // Make an Axios GET request to fetch user details
            axios.get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/users/${searchId}/`)
                .then(response => {
                    // Extract user data from the response
                    const userData = response.data;
                    const username = userData.username

                    // Set the user data in the state
                    setUser(userData);

                    // Set the first name and last name as the name to be displayed
                    const fullName = `${userData.first_name} ${userData.last_name}`;
                    setUserName(fullName);

                    // Now that you have the username, you can fetch the profile picture
                    axios.get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/profile-pics/by-username/${username}/`)
                        .then(profileResponse => {
                            // Extract profile picture data from the response
                            const profileData = profileResponse.data;

                            // Set the profile picture data in the state
                            setProfileData(profileData);
                        })
                        .catch(profileError => {
                            // Handle error if the request for profile picture data fails
                            console.error('Error fetching profile picture data:', profileError);
                        });
                })
                .catch(error => {
                    // Handle error if the request for user data fails
                    console.error('Error fetching user data:', error);
                });
        }
    }, []);

    const fetchMentions = async () => {
        try {
            // Retrieve the authentication token from local storage

            // Retrieve the username from local storage or wherever it's stored
            const searchId = localStorage.getItem('searchId'); // Replace with your actual way of getting the username

            if (searchId) {
                // Make an Axios GET request to fetch user details
                const response = await axios.get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/users/${searchId}/`);
                // Extract user data from the response
                const userData = response.data;
                const username = userData.username;

                // Create an Axios instance with the token in the headers
                const axiosInstance = axios.create({
                    baseURL: 'https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/',
                    headers: {
                        Authorization: `Token ${token}`, // Include the token in the headers
                    },
                });

                // Make a GET request to your Django backend API using the Axios instance
                const mentionsResponse = await axiosInstance.get(`api/mentioned-posts/${username}/`);

                // Once you have the response, you can set it to your component's state
                const mentionsWithColors = mentionsResponse.data.map((mention, index) => ({
                    ...mention,
                    colors: getColorSet(mention.color_code), // Assuming getColorSet is defined
                    post_id: mention.id, // Get the color set based on color_code
                }));

                setMentions(mentionsWithColors);

                const commentCountPromises = mentionsWithColors.map((post) => {
                    return axiosInstance
                        .get(`comments/comments_on_post/${post.id}/`, {
                            headers: {
                                Authorization: `Token ${token}`,
                            },
                        })
                        .then((response) => {
                            const count = response.data.length;
                            return { postId: post.id, count };
                        })
                        .catch((error) => {
                            console.error('Error fetching comment count:', error);
                            return { postId: post.id, count: 0 };
                        });
                });

                Promise.all(commentCountPromises)
                    .then((counts) => {
                        const commentCountsObject = {};
                        counts.forEach((countObj) => {
                            commentCountsObject[countObj.postId] = countObj.count;
                        });
                        setMentionsCommentCounts(commentCountsObject); // Update the mentions comment counts
                    })
                    .catch((error) => {
                        console.error('Error fetching comment counts:', error);
                    });
            }
        } catch (error) {
            console.error('Error fetching mentions:', error);
        }
    };

    useEffect(() => {
        fetchMentions();
    }, []);




    const formatTimeDifference = (confessionDate,mentionDate,handleTabClick) => {
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

    // Create a user object with the extracted values


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

        // Find the index of the friend to unfriend in the user's friends array
        const friendIndex = updatedUserData.friends.findIndex((friend) => friend.name === friendName);

        // Find the index of the friend to unfriend in the filteredFriends array
        const filteredFriendIndex = filteredFriends.findIndex((friend) => friend.name === friendName);

        // Remove the friend from the user's friends array if found
        if (friendIndex !== -1) {
            updatedUserData.friends.splice(friendIndex, 1);
        }

        // Remove the friend from the filteredFriends array if found
        if (filteredFriendIndex !== -1) {
            const updatedFilteredFriends = [...filteredFriends];
            updatedFilteredFriends.splice(filteredFriendIndex, 1);
            setFilteredFriends(updatedFilteredFriends);
        }

        // Update the user data with the modified friends list
        setUserData(updatedUserData);
    };
    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        filterFriends(query);
    };

    const filterFriends = (query) => {
        // Access the 'user' state variable here
        const filtered = user.friends.filter((friend) =>
            friend.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredFriends(filtered);
    };

    const handleLikeDislike = (confessionId) => {
        const newLikeState = { ...likeState };
        newLikeState[confessionId] = !newLikeState[confessionId];
        setLikeState(newLikeState);
    };

    const toggleCommentDropdown = (mention) => {
        if (selectedConfessionId === mention.id && isCommentDropdownOpen) {
            // If the comment dropdown is already open for this post, close it
            setCommentDropdownOpen(false);
            setSelectedConfessionId(null);
            setSelectedConfessionComments([]); // Clear the selected comments
        } else {
            // If the comment dropdown is not open for this post, open it
            setSelectedConfessionId(mention.id);
            setCommentDropdownOpen(true);

            // Fetch comments for the selected post (mention)
            fetchCommentsForPost(mention.id);
        }
    };

    // Inside your toggleCommentDropdown function, after fetching comments, fetch user details for each comment
    const fetchCommentsForPost = (postId) => {
        // Make an Axios GET request to fetch comments for the selected post
        axios
            .get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/comments/comments_on_post/${postId}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            })
            .then(async (response) => {
                const comments = response.data;
                // Create an array to store promises for fetching user details
                const commentPromises = [];

                // Iterate through the comments and fetch user details for each comment
                for (const comment of comments) {
                    const userId = comment.user_commented;
                    const userResponse = await axios.get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/users/${userId}/`);
                    const userData = userResponse.data;

                    // Update the comment object with user details
                    comment.user_commented = userData;

                    // Add the updated comment to the selectedConfessionComments state
                    setSelectedConfessionComments((prevComments) => [...prevComments, comment]);
                }
            })
            .catch((error) => {
                console.error('Error fetching comments for post:', error);
            });
    };





    useEffect(() => {
        if (user.confessions && user.comments) {
            const counts = {};
            user.confessions.forEach((confession) => {
                const comments = user.comments.filter((comment) => comment.post_id === confession.id);
                counts[confession.id] = comments.length;
            });
            setCommentCounts(counts);
        }
    }, [user.confessions, user.comments]);


    const formatCommentCount = (count) => {
        if (count < 1000) {
            return count.toString();
        } else if (count < 1000000) {
            return (count / 1000).toFixed(1) + 'K';
        } else {
            return (count / 1000000).toFixed(1) + 'M';
        }

    };


    const handleFriendButtonClick = () => {
        if (friendshipStatus === 'Friends') {
            // Send a friend request here (you can implement this logic)
            setFriendshipStatus('Request Sent');
        } else if (friendshipStatus === 'Request Sent') {
            // Cancel the friend request here (you can implement this logic)
            setFriendshipStatus('Friends');
        } else if (friendshipStatus === 'Unfriend') {
            // Unfriend logic here (you can implement this logic)
            setFriendshipStatus('Friends');
        }
    };




    return (

        <div style={{ marginBottom: windowWidth <= 768 ? '60px' : '0' }}>
            <img src={CrossIcon} alt="Close" onClick={switchToSearchPage} style={{ width: '15px', height: '15px',marginLeft:'10px',marginBottom:'-10px' }} />

            <p style={{ fontFamily: 'Helvetica', fontSize: '30px' }}>
                <b>{userName}</b>
            </p>
            <div style={{ position: 'relative' }}>
                <img src={profileData.profile_picture} style={{boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',width: '70px', height: '70px', borderRadius: '50%', position:'absolute', top: '-80px', right: '14px'}}/>
                <br/>
                <p style={{fontFamily: 'Helvetica',position:'absolute', top: '-35px'}}>{profileData.branch}</p>
                <p style={{fontFamily: 'Helvetica',position:'absolute', top: '-10px'}}>{profileData.bio}</p>
                <button style={{ fontFamily: 'Helvetica', backgroundColor: '#000',color:'white', border: '1.2px solid #ccc', borderRadius: '10px', fontSize: '17px',marginTop: '25px',height:'35px',width:'100%'}}onClick={() => handleFriendButtonClick()}><b>{friendshipStatus}</b></button>


            </div>

            <div style={{ display: 'flex', marginTop: '20px' , justifyContent: 'space-between',width: '100%', }}>

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




            {activeTab === 'mentioned' && (
                <>
                    {mentions.slice().reverse().map((mention, index) => (
                        <div key={index} style={{
                            borderRadius: '11px',
                            borderBottomLeftRadius: '30px',
                            background: mention.colors[0], // Use the first color from the colors array
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
                            display: selectedConfessionId === mention.id || !isCommentDropdownOpen ? 'block' : 'none',
                        }}>
                            <div style={{ zIndex: '1', fontFamily: 'Helvetica', position: 'relative' }}>
                                <p style={{
                                    position: 'absolute',
                                    top: '-15px',
                                    right: '4px',
                                    color: '#000',
                                    fontFamily: 'Helvetica'
                                }}>{formatTimeDifference(mention.date_posted)}</p>

                                <button
                                    onClick={() => handleLikeDislike(mention.id)}
                                    style={{ backgroundColor: 'transparent', border: 'none', }}
                                >
                                    {likeState[mention.id] ? <img src={likeicon} style={{ height: '25px', width: '25px' }} /> : <img src={dislikeicon} style={{ height: '25px', width: '25px' }} />}
                                </button>
                                <button
                                    onClick={() => toggleCommentDropdown(mention)}
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                    }}>
                                    <img src={commenticon} style={{ height: '25px', width: '25px' }} />
                                    <span style={{ marginLeft: '4px', fontFamily: 'Helvetica', position: 'relative', top: '-7px' }}>
                            {formatCommentCount(mentionsCommentCounts[mention.id] || 0)}
                        </span>
                                </button>
                                {isCommentDropdownOpen && selectedConfessionComments.length > 0 && (
                                    <div style={{
                                        bottom: 60,
                                        overflowY: 'scroll',
                                        position: 'fixed',
                                        left: 0,
                                        height: '43%',
                                        width: '100%',
                                        backgroundColor: 'white',
                                        zIndex: '100',
                                        borderTopRightRadius: '20px',
                                        borderTopLeftRadius: '20px',
                                        border: '0px solid #000',
                                        boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)',
                                    }}>
                                        {selectedConfessionComments.map((comment) => (
                                            <div style={{
                                                padding: '0px 0',
                                                borderBottom: '1px solid #ccc',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}>
                                                <img src={comment.user_commented.profilepic} style={{
                                                    minWidth: '40px',
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    marginLeft: '15px',
                                                    backgroundColor: '#000',
                                                    position: 'relative',
                                                    top: '-50px'
                                                }} />
                                                <div key={comment.id} style={{
                                                    padding: '15px',
                                                    whiteSpace: 'pre-line',
                                                    overflow: 'hidden',
                                                    overflowWrap: 'break-word',
                                                }}>
                                                    <p style={{
                                                        fontFamily: 'Helvetica',
                                                        color: '#000',
                                                        fontSize: '17px',
                                                        position: 'relative',
                                                        top: '4px',
                                                    }}>
                                                        <b>{comment.user_commented.first_name} {comment.user_commented.last_name}</b>
                                                    </p>
                                                    <p style={{
                                                        fontFamily: 'Helvetica',
                                                        color: '#8f8f8f',
                                                        position: 'relative',
                                                        top: '-10px',
                                                        fontSize: '17px',
                                                    }}>@{comment.user_commented.username}</p>
                                                    <p style={{
                                                        fontFamily: 'Helvetica',
                                                        position: 'relative',
                                                        top: '-10px',
                                                        fontSize: '17px',
                                                        maxWidth: '90%',
                                                    }}>{comment.comment}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <p style={{
                                        fontFamily: 'Helvetica',
                                        position: 'relative',
                                        left: '27px',
                                        top: '-10px',
                                        maxWidth: '87%',
                                    }}>
                            <span dangerouslySetInnerHTML={{
                                __html: mention.content.replace(
                                    /@(\w+)/g,
                                    (match, username) => `<b>@${username}</b>`
                                )
                            }} />
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
                                background: mention.colors[1], // Use the second color from the colors array
                                clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%, 0% 75%)',
                                zIndex: '0',
                                transform: 'rotate(-83.6deg)',
                                transformOrigin: 'bottom left',
                            }}
                            />
                        </div>
                    ))}
                </>
            )}


            {/* Bottom Navigation */}
            {isCommentDropdownOpen ? (
                <div style={{ zIndex: '100', position: 'fixed', bottom: '10px', left: '0px', right: '0px' }}>
                    <div style={{ background: '#fff', boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)', borderRadius: '11px', height: '155px', zIndex: '100', width: '100%', position: 'relative', top: '70px' }}>
                        <textarea
                            type="text"
                            placeholder="Enter your comment"
                            style={{
                                resize: 'none',
                                whiteSpace: 'pre-wrap',
                                overflowWrap: 'break-word',
                                paddingBottom: '0px',
                                paddingLeft: '18.5px',
                                fontFamily: 'Helvetica',
                                width: 'calc(100% - 21px)',
                                height: '40px',
                                background: 'transparent',
                                border: '0px solid #ccc',
                                fontSize: '20px',
                                borderRadius: '0px',
                                position: 'relative',
                                top: '10px',
                            }}
                            value={newComment} // Bind the value to the state
                            onChange={handleCommentInputChange} // Step 2: Attach the event handler
                        />
                        <button
                            onClick={handleCommentSubmit} // Step 3: Attach the event handler
                            style={{ float: 'right', right: '10px', position: 'relative', bottom: '-12px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '11px', padding: '6px 12px', fontSize: '15px', cursor: 'pointer', fontFamily: 'Helvetica' }}
                        >
                            <b>Comment</b>
                        </button>
                    </div>
                </div>
            ) : (
                // Render your bottom navigation when the dropdown is closed
                <div style={{ position: 'fixed', bottom: '0', left: '0', right: '0', backgroundColor: '#333' }}>
                </div>
            )}



            {activeTab === 'friends' && (
                <>
                    <div >

                        {/*<input*/}
                        {/*    type="text"*/}
                        {/*    placeholder="Search"*/}
                        {/*    value={searchQuery}*/}
                        {/*    onChange={handleInputChange}*/}
                        {/*    style={{paddingLeft:'18px', fontFamily: 'Helvetica', width:'calc(100% - 22px)', height: '40px',background:'#efefef',border:'1px solid #ccc',fontSize:'20px',borderRadius: '11px',}}*/}

                        {/*/>*/}
                        {/*{filteredFriends.map((friend, index) => (*/}
                        {/*    <div key={index} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ccc', padding: '0px 0' }}>*/}
                        {/*        <img src={friend.image} style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />*/}
                        {/*        <div style={{ flex: '1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>*/}
                        {/*            <div>*/}
                        {/*                <p style={{ fontFamily: 'Helvetica', color: '#000', fontSize: '17px', position: 'relative', top: '4px', margin: '10px' }}><b>{friend.name}</b></p>*/}
                        {/*                <p style={{ fontFamily: 'Helvetica', color: '#8f8f8f', position: 'relative', top: '-2px', fontSize: '17px', margin: '10px' }}>@{friend.username}</p>*/}
                        {/*            </div>*/}
                        {/*            <button style={{ fontFamily: 'Helvetica', backgroundColor: 'white', padding: '6px 10px', border: '1.2px solid #ccc', borderRadius: '10px', fontSize: '17px' }} onClick={() => handleUnfriend(friend.name)}><b>Unfriend</b></button>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*))}*/}
                    </div>
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

export default UserprofilePage;