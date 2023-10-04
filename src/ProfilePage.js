import React, {useEffect, useRef, useState} from 'react';
import menuIcon from './menuicon.png';
import likeicon from "./likeicon.png";
import dislikeicon from "./dislikeicon.png";
import commenticon from "./commenticon.png";
import CrossIcon from './cross.png';
import postmenuIcon from "./postmenuicon.png";
import axios from 'axios';


const ProfilePage = ({user ,activeTab='confessions', handleTabClick,usersData}) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showStickyNote, setShowStickyNote] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [likeState, setLikeState] = useState({});
    const [isCommentDropdownOpen, setCommentDropdownOpen] = useState(false);
    const [selectedConfessionComments, setSelectedConfessionComments] = useState([]);
    const [selectedConfessionId, setSelectedConfessionId] = useState(null);
    const [commentCounts, setCommentCounts] = useState({});
    const [showAboutOptions, setShowAboutOptions] = useState(false);
    const [showEditProfileForm, setShowEditProfileForm] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const [confessions, setConfessions] = useState([]);
    const [mentions, setMentions] = useState([]);
    const token = localStorage.getItem('token');
    const [newComment, setNewComment] = useState('');
    const [userData, setUserData] = useState(null);
    const [newName, setNewName] = useState(user.name);
    const [newBio, setNewBio] = useState(user.bio);
    const [showpostDropdown, setShowpostDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const [posts, setPosts] = useState([]);
    const [selectedConfessionIdForMenu, setSelectedConfessionIdForMenu] = useState(null);
    const [username, setUsername] = useState('');
    const [friends, setFriends] = useState([]);
    const [confessionsCommentCounts, setConfessionsCommentCounts] = useState({});
    const [mentionsCommentCounts, setMentionsCommentCounts] = useState({});




    const fetchConfessions = async () => {
        try {
            // Retrieve the authentication token from local storage
            const token = localStorage.getItem('token');

            // Retrieve the username from local storage or wherever it's stored
            const username = localStorage.getItem('username'); // Replace with your actual way of getting the username

            // Create an Axios instance with the token in the headers
            const axiosInstance = axios.create({
                baseURL: 'https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/api/',
                headers: {
                    Authorization: `Token ${token}`, // Include the token in the headers
                },
            });

            // Make a GET request to your Django backend API using the Axios instance
            const response = await axiosInstance.get(`posts-by-author/${username}/`);

            // Extract the confessions data from the API response
            const confessionsData = response.data.map((confession) => ({
                ...confession,
                backgroundColor: getColorSet(confession.color_code)[0],
                post_id: confession.id,// Get the background color based on color_code
            }));

            // Once you have the modified data, you can set it to your component's state
            setConfessions(confessionsData);

            const commentCountPromises = confessionsData.map((post) => {
                return axios
                    .get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/comments/comments_on_post/${post.id}/`, {
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
                    setConfessionsCommentCounts(commentCountsObject); // Update the confessions comment counts
                })
                .catch((error) => {
                    console.error('Error fetching comment counts:', error);
                });

        } catch (error) {
            console.error('Error fetching confessions:', error);
        }
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
                setSelectedConfessionComments([...selectedConfessionComments, newCommentData]);

                // Step 2: Update the comment count for the selected post
                setCommentCounts((prevCounts) => ({
                    ...prevCounts,
                    [selectedConfessionId]: (prevCounts[selectedConfessionId] || 0) + 1,
                }));

                // Clear the comment input field
                setNewComment('');

                // Refresh the page to show the updated comments
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error posting comment:', error);
            });
    };

    const fetchUserId = () => {
        const username = localStorage.getItem('username');
        const apiUrl = `https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/users/by-username/${username}/`;

        axios
            .get(apiUrl)
            .then((response) => {
                // Extract the user ID from the response
                const userId = response.data.id;

                // Call the fetchFriends function with the obtained user ID
                fetchFriends(userId);
            })
            .catch((error) => {
                console.error('Error fetching user ID:', error);
            });
    };

    const handlepostmenuClick = (confessionId) => {
        // Toggle the dropdown menu
        setSelectedConfessionIdForMenu(confessionId);
        setShowpostDropdown(!showpostDropdown);
    };

    const toggleCommentDropdown = (confession) => {
        if (isCommentDropdownOpen) {
            // Close the comment section
            setCommentDropdownOpen(false);
            setSelectedConfessionComments([]);
            setSelectedConfessionId(null);
        } else {
            // Open the comment section
            axios
                .get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/comments/comments_on_post/${confession.id}/`, {
                    headers: {
                        Authorization: `Token ${token}`, // Include any required authentication headers
                    },
                })
                .then((response) => {
                    // Fetch user details for each comment
                    const commentPromises = response.data.map((comment) => {
                        return fetchUserDetails(comment.user_commented).then((userResponse) => {
                            return {
                                ...comment,
                                user_commented: userResponse.data, // Replace user_commented ID with user details
                            };
                        });
                    });

                    // Wait for all user detail requests to complete
                    Promise.all(commentPromises)
                        .then((commentsWithUsers) => {
                            setSelectedConfessionComments(commentsWithUsers);
                            setSelectedConfessionId(confession.id);
                            setCommentDropdownOpen(true);
                        })
                        .catch((error) => {
                            console.error('Error fetching comments:', error);
                        });
                })
                .catch((error) => {
                    console.error('Error fetching comments:', error);
                });
        }
    };

    const fetchUserDetails = (userId) => {
        return axios.get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/users/${userId}/`, {
            headers: {
                Authorization: `Token ${token}`,
            },
        });
    };

    useEffect(() => {
        const counts = {};
        user.confessions.forEach((confession) => {
            const comments = user.comments.filter((comment) => comment.post_id === confession.id);
            counts[confession.id] = comments.length;
        });
        setCommentCounts(counts);
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

    const handleCommentInputChange = (event) => {
        setNewComment(event.target.value);
    };

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');

            // First, fetch user data from the first endpoint
            const firstEndpointResponse = await axios.get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/profile-pics/by-username/${username}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            const userProfileData = firstEndpointResponse.data;

            // Then, use the 'user' ID from the first endpoint to fetch the user's name from the second endpoint
            const secondEndpointResponse = await axios.get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/users/${userProfileData.user}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            const userDataFromSecondEndpoint = secondEndpointResponse.data;

            // Combine the first and last name to create the fullName
            const fullName = `${userDataFromSecondEndpoint.first_name || ''} ${userDataFromSecondEndpoint.last_name || ''}`;

            // Update the state with the user profile data
            setUserData({
                id: userProfileData.id,
                bio: userProfileData.bio,
                branch: userProfileData.branch,
                profile_picture: userProfileData.profile_picture,
                user: userProfileData.user,
                fullName, // Use the corrected fullName
                // Add other fields as needed
            });
        } catch (error) {
            console.error('Error fetching user profile data:', error);
        }
    };

    const handleDeleteConfession = () => {
        if (selectedConfessionIdForMenu) {
            // Send a DELETE request to the endpoint for deleting the post
            axios
                .delete(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/posts/${selectedConfessionIdForMenu}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                })
                .then((response) => {
                    // Handle successful post deletion (e.g., remove it from the state)
                    // You can update the state here to remove the deleted post
                    const updatedConfessions = confessions.filter((confession) => confession.id !== selectedConfessionIdForMenu);
                    setConfessions(updatedConfessions);

                    // Optionally, close the dropdown or perform any other necessary actions
                    setShowpostDropdown(false);
                })
                .catch((error) => {
                    console.error('Error deleting post:', error);
                });
        }
    };



    // Fetch user profile data when the component mounts
    useEffect(() => {
        fetchUserData();
    }, []);



    const fetchMentions = async () => {
        try {
            // Retrieve the authentication token from local storage
            const token = localStorage.getItem('token');

            // Retrieve the username from local storage or wherever it's stored
            const username = localStorage.getItem('username'); // Replace with your actual way of getting the username

            // Create an Axios instance with the token in the headers
            const axiosInstance = axios.create({
                baseURL: 'https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/api/',
                headers: {
                    Authorization: `Token ${token}`, // Include the token in the headers
                },
            });

            // Make a GET request to your Django backend API using the Axios instance
            const response = await axiosInstance.get(`mentioned-posts/${username}/`);

            // Once you have the response, you can set it to your component's state
            const mentionsWithColors = response.data.map((mention, index) => ({
                ...mention,
                colors: getColorSet(mention.color_code),
                post_id: mention.id// Get the color set based on color_code
            }));

            setMentions(mentionsWithColors);

            const commentCountPromises = mentionsWithColors.map((post) => {
                return axios
                    .get(`https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/comments/comments_on_post/${post.id}/`, {
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
        } catch (error) {
            console.error('Error fetching mentions:', error);
        }
    };


    useEffect(() => {
        fetchMentions();
    }, []);


    useEffect(() => {
        fetchConfessions();
    }, []);

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



    const formatTimeDifference = (confessionDate,mentionDate) => {
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
        const colors = ['rgba(252,133,189,0.72)', 'rgba(137,231,255,0.72)', 'rgba(255,137,137,0.72)', 'rgba(255,241,137,0.72)', 'rgba(170,137,255,0.72)', 'rgba(136,253,136,0.72)',];
        return colors[index % colors.length];
    };
    const getStickyNoteColor1 = (index) => {
        // Replace this logic with your color generation or predefined colors
        const colors = ['#ff76b3', '#76cfff', '#FF7676FF', '#ffef76', '#9b76ff', '#76fd76',];
        return colors[index % colors.length];
    };
    const handleUnfriend = (friendshipId, friendName) => {
        // Send a PUT request to update the friendship status
        const apiUrl = `https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/friendships/${friendshipId}/`;

        axios
            .put(apiUrl, { status: 'unfriended' })
            .then((response) => {
                // Check if the PUT request was successful
                if (response.status === 200) {
                    // Remove the friend from the filteredFriends array
                    const updatedFilteredFriends = filteredFriends.filter((friend) => friend.fullName !== friendName);
                    setFilteredFriends(updatedFilteredFriends);
                } else {
                    console.error('Error unfriending friend:', response.statusText);
                }
            })
            .catch((error) => {
                console.error('Error unfriending friend:', error);
            });
    };

    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        filterFriends(query);
    };

    const filterFriends = (query) => {
        const filtered = friends.filter(
            (friend) =>
                friend.fullName.toLowerCase().includes(query.toLowerCase()) ||
                friend.username.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredFriends(filtered);
    };
    const handleSettingsClick = () => {
        // Toggle the dropdown menu
        setShowDropdown(!showDropdown);
    };

    const handleAboutClick = () => {
        // Toggle the About options
        setShowAboutOptions(!showAboutOptions);
    };

    const handleLogout = () => {
        // Implement your logout logic here
        // For example, clear user session, redirect, etc.
        console.log('Logout clicked');
    };

    const handleLikeDislike = (confessionId) => {
        const newLikeState = { ...likeState };
        newLikeState[confessionId] = !newLikeState[confessionId];
        setLikeState(newLikeState);
    };

    // Function to fetch friends data
    const fetchFriends = (userId) => {
        // Construct the URL with the user's ID
        const apiUrl = `https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/user-friends/${userId}/`;

        axios
            .get(apiUrl)
            .then((response) => {
                // Check if response.data is defined and is an array
                if (Array.isArray(response.data)) {
                    // Extract the list of friends from the response with a status of "accepted"
                    const friendsList = response.data
                        .filter((friendship) => friendship.status === 'accepted')
                        .map((friendship) => {
                            // Check if friendship object contains 'user' and 'friend' properties
                            if (friendship.user && friendship.friend) {
                                const friendUser =
                                    friendship.friend.id === userId ? friendship.user : friendship.friend;
                                // Check if friendUser object contains 'id', 'username', 'first_name', and 'last_name' properties
                                if (
                                    friendUser.id &&
                                    friendUser.username &&
                                    friendUser.first_name &&
                                    friendUser.last_name
                                ) {
                                    const fullName = friendUser.first_name + ' ' + friendUser.last_name;
                                    return {
                                        id: friendUser.id,
                                        username: friendUser.username,
                                        fullName,
                                        friendshipId: friendship.friendship_id, // Store the friendship_id
                                    };
                                } else {
                                    console.error('Error fetching friends: Invalid friendUser data', friendUser);
                                }
                            } else {
                                console.error('Error fetching friends: Invalid friendship data', friendship);
                            }
                        });

                    // Remove undefined items from the friendsList array
                    const filteredFriendsList = friendsList.filter((friend) => friend);

                    // Update the state with the list of friends
                    setFriends(filteredFriendsList);
                    // Also, initially set filteredFriends to the entire list
                    setFilteredFriends(filteredFriendsList);
                } else {
                    // Handle the case where response.data is not an array
                    console.error('Error fetching friends: Response data is not an array', response.data);
                }
            })
            .catch((error) => {
                console.error('Error fetching friends:', error);
            });
    };



    // Fetch friends data when the component is mounted
    useEffect(() => {
        fetchUserId();
    }, [username]);


    const handleEditProfileClick = () => {
        setShowEditProfileForm(true);
    };

    const handleEditProfileCancel = () => {
        setShowEditProfileForm(false);
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        // You can add code here to upload the selected profile picture to a server or display it on the page.
        setProfilePic(file);
    };

    const handleNameChange = (e) => {
        setNewName(e.target.value);
    };

    const handleBioChange = (e) => {
        setNewBio(e.target.value);
    };

    return (

        <div style={{ marginBottom: windowWidth <= 768 ? '60px' : '0' }}>
            <img src={menuIcon} alt="Settings" style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer',width: '30px', height: '30px' }} onClick={handleSettingsClick} /><br/>
            <p style={{fontFamily: 'Helvetica', fontSize: '30px'}}><b>{userData ? userData.fullName : 'Loading...'}</b> </p>
            <div style={{ position: 'relative' }}>
                <img src={userData ? userData.profile_picture : 'Loading...'} style={{boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',width: '70px', height: '70px', borderRadius: '50%', position:'absolute', top: '-60px', right: '14px'}}/>
                <br/>
                <p style={{fontFamily: 'Helvetica',position:'absolute', top: '-35px'}}>{userData ? userData.branch : 'Loading...'}</p>
                <p style={{fontFamily: 'Helvetica',position:'absolute', top: '-10px'}}>{userData ? userData.bio : 'Loading...'}</p>
            </div>

            {showDropdown && (
                <div style={{overflowY:'scroll',position: 'fixed', bottom: -1, left: 0, height:'50%',width: '100%', backgroundColor: 'white',  zIndex: '100',borderTopRightRadius:'20px',borderTopLeftRadius:'20px', border:'0px solid #000',boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)'}}>
                    <ul style={{ listStyle: 'none', padding: '0' }}>
                        <li style={{ padding: '15px', cursor: 'pointer',fontFamily: 'Helvetica', fontSize: '18px', color:'black' }} onClick={handleEditProfileClick}>Edit profile</li>
                        {showEditProfileForm && (
                            <form   style={{  overflowY:'scroll',position: 'fixed', bottom: -1, left: 0, height:'99%',width: '100%', backgroundColor: 'white',  zIndex: '100',borderTopRightRadius:'20px',borderTopLeftRadius:'20px', border:'0px solid #000',boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)' }}>
                                {/* Edit Profile Form */}
                                <img src={CrossIcon} style={{position: 'absolute', top: '20px', right: '20px', height:'20px',width:'20px'}} onClick={handleEditProfileCancel}/>

                                <input
                                    type="file"
                                    id="fileInput"
                                    accept="image/*"
                                    onChange={handleProfilePicChange}
                                    style={{
                                        display: 'none',

                                    }}
                                />
                                <label htmlFor="fileInput">
                                    <img
                                        src={profilePic || user.image}
                                        style={{
                                            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                            marginBottom: '15px',
                                            fontFamily: 'Helvetica',
                                            width: '150px',
                                            height: '150px',
                                            background: 'rgba(255, 252, 255, 0.5)',
                                            border: '1px solid #ccc',
                                            fontSize: '10px',
                                            zIndex: '1',
                                            borderRadius: '50%',
                                            position:'absolute',
                                            left: '50%',
                                            top: '15%',
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                    />
                                </label>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={newName}
                                    onChange={handleNameChange}
                                    style={{boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                        marginBottom: '15px',
                                        position:'absolute',
                                        left: '50%',
                                        top: '30%',
                                        transform: 'translate(-50%, -50%)',
                                        paddingLeft: '18px',
                                        fontFamily: 'Helvetica',
                                        width: 'calc(90% - 25px)',
                                        height: '40px',
                                        background: 'rgba(255, 255, 255, 0.5)',
                                        border: '1px solid #ccc',
                                        fontSize: '18px',
                                        zIndex: '1',
                                        borderRadius: '11px',}}
                                />
                                <textarea
                                    placeholder="Bio"
                                    value={newBio}
                                    onChange={handleBioChange}
                                    style={{boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                        marginBottom: '15px',
                                        paddingLeft: '18px',
                                        position:'absolute',
                                        left: '50%',
                                        top: '41%',
                                        transform: 'translate(-50%, -50%)',
                                        fontFamily: 'Helvetica',
                                        width: 'calc(90% - 25px)',
                                        height: '100px',
                                        background: 'rgba(255, 255, 255, 0.5)',
                                        border: '1px solid #ccc',
                                        fontSize: '18px',
                                        zIndex: '1',
                                        borderRadius: '11px',}}
                                />
                                {/* Include the code to submit the updated profile information */}
                                <button type="submit"
                                        style={{  position:'absolute', left: '50%', top: '52%',
                                            transform: 'translate(-50%, -50%)',boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',color:'#fff', fontFamily: 'Helvetica', width: '100px', height: '40px',background:'#000',border:'1px solid #ccc',fontSize:'18px',borderRadius: '11px',}}
                                >Save</button>
                            </form>
                        )}
                        <li style={{ padding: '15px', cursor: 'pointer', fontFamily: 'Helvetica', fontSize: '18px', color: 'black' }} onClick={handleAboutClick}>About</li>
                        {showAboutOptions && (
                            <div style={{position: 'relative', top: '0px', left: 0, height:'150px',width: '100%', backgroundColor: 'white',  zIndex: '100',borderRadius:'11px', border:'0px solid #000',boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)'}}>
                                <ul style={{ listStyle: 'none', padding: '0' }}>
                                    <li style={{ padding: '15px', cursor: 'pointer',fontFamily: 'Helvetica', fontSize: '18px', color:'black' }} onClick={handleLogout}>About RVConnect</li>
                                    <li style={{ padding: '15px', cursor: 'pointer',fontFamily: 'Helvetica', fontSize: '18px', color:'black' }} onClick={handleLogout}>Terms of Use</li>
                                    <li style={{ padding: '15px', cursor: 'pointer',fontFamily: 'Helvetica', fontSize: '18px', color:'black' }} onClick={handleLogout}>Privacy Policy</li>
                                </ul>
                            </div>
                        )}
                        <li style={{ padding: '15px', cursor: 'pointer',fontFamily: 'Helvetica', fontSize: '18px', color:'red' }} onClick={handleLogout}>Log out</li>
                        {/* Add other options here */}
                    </ul>
                </div>
            )}


            <div style={{ display: 'flex', marginTop: '20px' , justifyContent: 'space-between',width: '100%', }}>

                <div
                    className={`tab ${activeTab === 'confessions' ? 'active' : ''}`}
                    onClick={() => handleTabClick('confessions')}
                    style={{
                        flex: 1,
                        fontFamily: 'Helvetica', fontSize: '20px',
                        textAlign: 'center',
                        color: activeTab === 'confessions' ? '#000' : '#c0c0c0',
                    }}

                >
                    <b>Confessions</b>
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

            {activeTab === 'confessions' && (
                <>
                    {confessions.slice().reverse().map((confession, index) => {
                        // Get the color set based on the color code from the API response
                        const colorSet = getColorSet(confession.color_code);

                        // Destructure the color set to get the two colors
                        const [backgroundColor, backgroundColor1] = colorSet || [];

                        return (
                            <div key={index} style={{
                                borderRadius: '11px',
                                borderBottomLeftRadius: '30px',
                                background: backgroundColor || getStickyNoteColor(index),
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
                                display: selectedConfessionId === confession.id || !isCommentDropdownOpen ? 'block' : 'none',
                            }}>
                                <div style={{ zIndex: '1', fontFamily: 'Helvetica', position: 'relative' }}>
                                    <p style={{
                                        position: 'absolute',
                                        top: '-15px',
                                        right: '4px',
                                        color: '#000',
                                        fontFamily: 'Helvetica'
                                    }}>{formatTimeDifference(confession.date_posted)}</p>

                                    <button
                                        onClick={() => handlepostmenuClick(confession.id)}
                                        style={{ backgroundColor: 'transparent', border: 'none' }}
                                    >
                                        <img src={postmenuIcon} style={{ position: 'relative', cursor: 'pointer', width: '25px', height: '25px', marginRight: '10px' }} />
                                    </button>

                                    {showpostDropdown && (
                                        <div  ref={dropdownRef}
                                              style={{overflowY:'scroll',position: 'fixed', bottom: -1, left: 0, height:'50%',width: '100%', backgroundColor: 'white',  zIndex: '100',borderTopRightRadius:'20px',borderTopLeftRadius:'20px', border:'0px solid #000',boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)'}}>
                                            <ul style={{ listStyle: 'none', padding: '0' }}>
                                                <li style={{ padding: '15px', cursor: 'pointer',fontFamily: 'Helvetica', fontSize: '18px', color:'#ff4b4b' }}  onClick={() => handleDeleteConfession(confession.id)}><b>Delete</b></li>
                                            </ul>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => handleLikeDislike(confession.id)}
                                        style={{ backgroundColor: 'transparent', border: 'none' }}
                                    >
                                        {likeState[confession.id] ? <img src={likeicon} style={{ height: '25px', width: '25px' }} /> : <img src={dislikeicon} style={{ height: '25px', width: '25px' }} />}
                                    </button>
                                    <button
                                        onClick={() => toggleCommentDropdown(confession)}
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                        }}>
                                        <img src={commenticon} style={{ height: '25px', width: '25px' }} />
                                        <span style={{ marginLeft: '4px', fontFamily: 'Helvetica', position: 'relative', top: '-7px' }}>
                {formatCommentCount(confessionsCommentCounts[confession.id] || 0)}
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
                                                        }}><b>{comment.user_commented.first_name + comment.user_commented.last_name}</b></p>
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
                    __html: confession.content.replace(
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
                                    background: backgroundColor1 || getStickyNoteColor1(index),
                                    clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%, 0% 75%)',
                                    zIndex: '0',
                                    transform: 'rotate(-83.6deg)',
                                    transformOrigin: 'bottom left',
                                }}
                                />
                            </div>
                        );
                    })}
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
                                    onClick={() => handlepostmenuClick(mention.id)}
                                    style={{ backgroundColor: 'transparent', border: 'none' }}
                                >
                                    <img src={postmenuIcon} style={{ position: 'relative', cursor: 'pointer', width: '25px', height: '25px', marginRight: '10px' }} />
                                </button>

                                {showpostDropdown && (
                                    <div  ref={dropdownRef}
                                          style={{overflowY:'scroll',position: 'fixed', bottom: -1, left: 0, height:'50%',width: '100%', backgroundColor: 'white',  zIndex: '100',borderTopRightRadius:'20px',borderTopLeftRadius:'20px', border:'0px solid #000',boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)'}}>
                                        <ul style={{ listStyle: 'none', padding: '0' }}>
                                            <li style={{ padding: '15px', cursor: 'pointer',fontFamily: 'Helvetica', fontSize: '18px', color:'#ff4b4b' }}  onClick={() => handleDeleteConfession(mention.id)}><b>Delete</b></li>
                                        </ul>
                                    </div>
                                )}

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
                                                        <b>{comment.user_commented.first_name + comment.user_commented.last_name}</b>
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

                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={handleInputChange}
                            style={{paddingLeft:'18px', fontFamily: 'Helvetica', width:'calc(100% - 22px)', height: '40px',background:'#efefef',border:'1px solid #ccc',fontSize:'20px',borderRadius: '11px',}}

                        />
                        {filteredFriends.map((friend, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ccc', padding: '0px 0' }}>
                                <img src={friend.image} style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
                                <div style={{ flex: '1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontFamily: 'Helvetica', color: '#000', fontSize: '17px', position: 'relative', top: '4px', margin: '10px' }}><b>{friend.fullName}</b></p>
                                        <p style={{ fontFamily: 'Helvetica', color: '#8f8f8f', position: 'relative', top: '-2px', fontSize: '17px', margin: '10px' }}>@{friend.username}</p>
                                    </div>
                                    <button style={{ fontFamily: 'Helvetica', backgroundColor: 'white', padding: '6px 10px', border: '1.2px solid #ccc', borderRadius: '10px', fontSize: '17px' }} onClick={() => handleUnfriend(friend.friendshipId)}><b>Unfriend</b></button>
                                </div>
                            </div>
                        ))}
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

export default ProfilePage;