import React, { useState, useEffect } from 'react';
import axios from 'axios';
import rvclogo from './rvclogo.png';
import CrossIcon from "./cross.png";

function LoginForm({ setIsAuthenticated }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const checkTokenOnPageLoad = () => {
        const token = localStorage.getItem('token');
        if (token) {
            // Check if the token is valid (you may need to implement token validation logic)
            // If it's valid, set the authentication status to true
            setIsAuthenticated(true);
        }
    };

    const [signupData, setSignupData] = useState({
        email: '',
        firstname: '',
        lastname: '',
        password: '',
        confirmpassword: '',
    });

    const [error, setError] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [isOTPVerified, setIsOTPVerified] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const handleSignupChange = (e) => {
        const { name, value } = e.target;
        setSignupData({
            ...signupData,
            [name]: value,
        });
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();

        try {
            // Check if password and confirm password match
            if (signupData.password !== signupData.confirmpassword) {
                setError('Passwords do not match. Please try again.');
                return;
            }

            // Extract username from email
            const username = signupData.email.split('@')[0];

            // Send a POST request to the signup endpoint
            const response = await axios.post(
                'https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/users/',
                {
                    username: username,
                    first_name: signupData.firstname,
                    last_name: signupData.lastname,
                    password: signupData.password,
                    email: signupData.email
                }
            );

            // Check the status code to determine if the signup was successful
            if (response.status === 201) {
                // Clear error message
                setError('');

                window.location.reload()

                // Reset the signup form fields
                setIsSignup(false);
                setSignupData({
                    email: '',
                    firstname: '',
                    lastname: '',
                    password: '',
                    confirmpassword: '',
                });
            } else {
                setError('Signup failed. Please try again.');
            }
        } catch (error) {
            // Handle errors here...
            setError('Signup failed. Please try again.');
        }
    };



    const handleTabChange = (isSignup) => {
        setIsSignup(isSignup);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send a POST request to the authentication endpoint
            const response = await axios.post(
                'https://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/api-token-auth/',
                {
                    username: formData.username,
                    password: formData.password,
                }
            );

            // Extract the token from the response data
            const { token } = response.data;

            // Store the token and username in local storage
            localStorage.setItem('token', token);
            localStorage.setItem('username', formData.username);

            console.log('Token and username stored in local storage:', token, formData.username);

            // Update the authentication status
            setIsAuthenticated(true);

            // Clear error message
            setError('');
        } catch (error) {
            if (error.response) {
                // The request was made, but the server responded with an error
                console.error('Server Error:', error.response.data);
                setError('Wrong username or password. Please try again.'); // Set error message
            } else if (error.request) {
                // The request was made, but no response was received
                console.error('No Response:', error.request);
                setError('No response from the server. Please try again later.'); // Set error message
            } else {
                // Something else went wrong
                console.error('Error:', error.message);
                setError('An error occurred. Please try again.'); // Set error message
            }
        }
    };

    useEffect(() => {
        // Disable scrolling when the component mounts
        document.body.style.overflow = 'hidden';

        // Check for a valid token when the component mounts
        checkTokenOnPageLoad();

        // Re-enable scrolling when the component unmounts
        return () => {
            document.body.style.overflow = 'visible'; // or 'auto' if you want to enable scrolling
        };
    }, []);

    const toggleForgotPassword = () => {
        setShowForgotPassword(!showForgotPassword); // Step 3
    };
    const closeDropdown = () => {
        setShowForgotPassword(false);
    };
    const handleVerifyOTP = () => {
        // Add your logic to verify the OTP here
        setIsOTPVerified(true); // Set isOTPVerified to true upon successful OTP verification
    };

    // const handleSignupSubmit = async (e) => {
    //     e.preventDefault();
    //
    //     try {
    //         // Check if password and confirm password match
    //         if (signupData.password !== signupData.confirmpassword) {
    //             setError('Passwords do not match. Please try again.');
    //             return;
    //         }
    //
    //         // Send a POST request to the authentication endpoint for signup...
    //         // Update the authentication status
    //         setIsAuthenticated(true);
    //         // Clear error message
    //         setError('');
    //     } catch (error) {
    //         // Handle errors here...
    //     }
    // };

    const shadowAnimation = {

        animation: 'shadowMove linear 5s infinite',
    };

    const gradientShadowAnimation = `@keyframes shadowMove {
  0% {
    box-shadow:  0 0 20px rgba(106, 90, 205, 0.4), inset 0 0 1000px rgba(106, 90, 205, 0.4);
  }
  20% {
    box-shadow:  0 0 20px rgba(60, 179, 113, 0.4), inset 0 0 1000px rgba(60, 179, 113, 0.4);
  }
  40% {
    box-shadow: 0 0 20px rgba(255, 118, 179, 0.4), inset 0 0 1000px rgba(255, 118, 179, 0.4);
  }
  60% {
    box-shadow:  0 0 20px rgba(255, 0, 0, 0.4), inset 0 0 1000px rgba(255, 0, 0, 0.4);
  }
  60% {
    box-shadow:  0 0 20px rgba(255, 165, 0, 0.4), inset 0 0 1000px rgba(255, 165, 0, 0.4);
  }
  100% {
    box-shadow:  0 0 20px rgba(0, 225, 255, 0.4),inset 0 0 1000px rgba(0, 225, 255, 0.4);
  }
}`;

    return (
        <div style={{backgroundColor:'#fff',display: 'flex', flexDirection: 'column', justifyContent:'center', alignItems: 'center' }} >
            <style>{gradientShadowAnimation}</style>

            <img src={rvclogo} style={{height:'250px', width: '250px', marginBottom: '-10px',marginTop: '-30px', justifyContent:'center', alignItems: 'center', position: 'relative', }} />
            <div style={{position:'relative', top:'-30px',  }}>
                <button style={{ marginRight: '20px', fontSize: '15px',fontFamily: 'Helvetica' ,  padding: '0.7em 1.7em', fontsize: '18px', borderRadius: '0.5em', background: '#e8e8e8', border: '1px solid #e8e8e8', boxShadow: '6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff', backgroundColor: isSignup ? '' : '#000', color: isSignup ? '' : 'white', }} onClick={() => handleTabChange(false)}><b>Log In</b></button>
                <button style={{  fontSize: '15px',fontFamily: 'Helvetica' ,  padding: '0.7em 1.7em', fontsize: '18px', borderRadius: '0.5em', background: '#e8e8e8', border: '1px solid #e8e8e8', boxShadow: '6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff',backgroundColor: isSignup ? '#000' : '', color: isSignup ? 'white' : '', }} onClick={() => handleTabChange(true)}><b>Sign Up</b></button>
            </div>

            {isSignup ? (
                <form onSubmit={handleSignupSubmit}   style={{   paddingTop:'15px', height:'350px', width: '85%', maxWidth: '400px', textAlign: 'center', padding: '0 20px', position: 'relative',  borderRadius: '11px', ...shadowAnimation,  }}>

                    <div>
                        <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            value={signupData.email}
                            onChange={handleSignupChange}
                            style={{
                                boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                marginBottom: '15px',
                                paddingLeft: '18px',
                                fontFamily: 'Helvetica',
                                width: 'calc(100% - 25px)',
                                height: '40px',
                                background: 'rgba(255, 255, 255, 0.5)',

                                border: '1px solid #ccc',
                                fontSize: '18px',
                                zIndex: '1',
                                borderRadius: '11px',
                            }}
                            pattern="^[a-zA-Z0-9._%+-]+@(rvce.edu.in|rvu.edu.in)$"
                            title="Please enter a valid email address ending with @rvce.edu.in or @rvu.edu.in"
                        />
                    </div>



                    <div>
                        <input
                            type="text"
                            name="firstname"
                            placeholder="First name"
                            value={signupData.firstname}
                            onChange={handleSignupChange}
                            style={{
                                boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                marginBottom: '15px',
                                paddingLeft: '18px',
                                fontFamily: 'Helvetica',
                                width: 'calc(100% - 25px)',
                                height: '40px',
                                background: 'rgba(255, 255, 255, 0.5)',
                                border: '1px solid #ccc',
                                fontSize: '18px',
                                zIndex: '1',
                                borderRadius: '11px',

                            }}
                        />

                    </div>
                    <div>
                        <input
                            type="text"
                            name="lastname"
                            placeholder="Last name"
                            value={signupData.lastname}
                            onChange={handleSignupChange}
                            style={{
                                boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                marginBottom: '15px',
                                paddingLeft: '18px',
                                fontFamily: 'Helvetica',
                                width: 'calc(100% - 25px)',
                                height: '40px',
                                background: 'rgba(255, 255, 255, 0.5)',
                                border: '1px solid #ccc',
                                fontSize: '18px',
                                zIndex: '1',
                                borderRadius: '11px',

                            }}
                        />

                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={signupData.password}
                            onChange={handleSignupChange}
                            style={{
                                boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                marginBottom: '15px',
                                paddingLeft: '18px',
                                fontFamily: 'Helvetica',
                                width: 'calc(100% - 25px)',
                                height: '40px',
                                background: 'rgba(255, 255, 255, 0.5)',
                                border: '1px solid #ccc',
                                fontSize: '18px',
                                zIndex: '1',
                                borderRadius: '11px',

                            }}
                        />

                    </div>
                    <div>
                        <input
                            type="text"
                            name="confirmpassword"
                            placeholder="Confirm password"
                            value={signupData.confirmpassword}
                            onChange={handleSignupChange}
                            style={{
                                boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                marginBottom: '15px',
                                paddingLeft: '18px',
                                fontFamily: 'Helvetica',
                                width: 'calc(100% - 25px)',
                                height: '40px',
                                background: 'rgba(255, 255, 255, 0.5)',
                                border: '1px solid #ccc',
                                fontSize: '18px',
                                zIndex: '1',
                                borderRadius: '11px',

                            }}
                        />

                    </div>


                    <button type="submit" style={{
                        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',color:'#fff', fontFamily: 'Helvetica', width: 'calc(100% - 25px)', height: '40px',background:'#000',border:'1px solid #ccc',fontSize:'18px',borderRadius: '50px',
                    }}>
                        Sign Up
                    </button>
                </form>
            ) : (

                <form  onSubmit={handleSubmit} style={{...shadowAnimation, marginBottom:'0px', paddingTop:'16px', height:'200px', width: '85%', maxWidth: '400px', textAlign: 'center', padding: '0 20px', position: 'relative', background: 'transparent', borderRadius: '11px',  }}>

                    <div>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            style={{boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                marginBottom: '15px',
                                paddingLeft: '18px',
                                fontFamily: 'Helvetica',
                                width: 'calc(100% - 25px)',
                                height: '40px',
                                background: 'rgba(255, 255, 255, 0.5)',
                                border: '1px solid #ccc',
                                fontSize: '18px',
                                zIndex: '1',
                                borderRadius: '11px',}}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            style={{  boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                marginBottom: '15px',
                                paddingLeft: '18px',
                                fontFamily: 'Helvetica',
                                width: 'calc(100% - 25px)',
                                height: '40px',
                                background: 'rgba(255, 255, 255, 0.5)',
                                border: '1px solid #ccc',
                                fontSize: '18px',
                                zIndex: '1',
                                borderRadius: '11px',}}
                        />
                    </div>
                    <button type="submit"
                            style={{  boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',color:'#fff', fontFamily: 'Helvetica', width: 'calc(100% - 25px)', height: '40px',background:'#000',border:'1px solid #ccc',fontSize:'18px',borderRadius: '50px',}}
                    >Log In</button>
                    <div>
                        <a href="#" onClick={toggleForgotPassword} style={{ fontFamily: 'Helvetica', textDecoration: 'underline', cursor: 'pointer', color: '#000', position: 'relative', top: '18px' }}>
                            Forgot Password?
                        </a>
                    </div>

                    {showForgotPassword ? (
                        <div style={{ overflowY: 'scroll', position: 'fixed', bottom: -1, left: 0, height: '99%', width: '100%', backgroundColor: 'white', zIndex: '100', borderTopRightRadius: '20px', borderTopLeftRadius: '20px', border: '0px solid #000', boxShadow: '0px 3px 9px rgba(0, 0, 0, 1)' }}>
                            <img src={CrossIcon} alt="Close" onClick={closeDropdown} style={{ width: '15px', height: '15px' ,float:'left',position:'absolute',top:'20px',left:'20px'}} />
                            {isOTPVerified ? (
                                <div>
                                    <p style={{ fontFamily: 'Helvetica', fontSize: '30px' }}><b>Create New Password</b></p>
                                    <p style={{ fontFamily: 'Helvetica' }}>Enter your new password:</p>
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        // Add onChange and value attributes as needed
                                        style={{
                                            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                            marginBottom: '15px',
                                            paddingLeft: '18px',
                                            fontFamily: 'Helvetica',
                                            width: 'calc(90% - 25px)',
                                            height: '40px',
                                            background: 'rgba(255, 255, 255, 0.5)',
                                            border: '1px solid #ccc',
                                            fontSize: '18px',
                                            zIndex: '1',
                                            borderRadius: '11px',
                                        }}
                                    />
                                    <p style={{ fontFamily: 'Helvetica' }}>Confirm your new password:</p>
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        // Add onChange and value attributes as needed
                                        style={{
                                            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                            marginBottom: '15px',
                                            paddingLeft: '18px',
                                            fontFamily: 'Helvetica',
                                            width: 'calc(90% - 25px)',
                                            height: '40px',
                                            background: 'rgba(255, 255, 255, 0.5)',
                                            border: '1px solid #ccc',
                                            fontSize: '18px',
                                            zIndex: '1',
                                            borderRadius: '11px',
                                        }}
                                    />
                                    <div style={{ textAlign: 'center' }}>
                                        <button style={{
                                            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                            color: '#fff',
                                            fontFamily: 'Helvetica',
                                            width: '150px',
                                            height: '40px',
                                            background: '#000',
                                            border: '1px solid #ccc',
                                            fontSize: '15px',
                                            borderRadius: '11px',
                                        }}>
                                            Change
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p style={{ fontFamily: 'Helvetica', fontSize: '30px' }}><b>Forgot Password</b></p>
                                    <p style={{ fontFamily: 'Helvetica' }}>Enter your email address to reset your password:</p>
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        // Add onChange and value attributes as needed
                                        style={{
                                            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                            marginBottom: '15px',
                                            paddingLeft: '18px',
                                            fontFamily: 'Helvetica',
                                            width: 'calc(90% - 25px)',
                                            height: '40px',
                                            background: 'rgba(255, 255, 255, 0.5)',
                                            border: '1px solid #ccc',
                                            fontSize: '18px',
                                            zIndex: '1',
                                            borderRadius: '11px',
                                        }}
                                    />
                                    <p style={{ fontFamily: 'Helvetica' }}>Enter the OTP sent to your email:</p>
                                    <input
                                        type="text"
                                        placeholder="OTP"
                                        // Add onChange and value attributes as needed
                                        style={{
                                            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                            marginBottom: '15px',
                                            paddingLeft: '18px',
                                            fontFamily: 'Helvetica',
                                            width: 'calc(90% - 25px)',
                                            height: '40px',
                                            background: 'rgba(255, 255, 255, 0.5)',
                                            border: '1px solid #ccc',
                                            fontSize: '18px',
                                            zIndex: '1',
                                            borderRadius: '11px',
                                        }}
                                    />
                                    <div style={{ textAlign: 'center' }}>
                                        <button onClick={handleVerifyOTP}  style={{
                                            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.9)',
                                            color: '#fff',
                                            fontFamily: 'Helvetica',
                                            width: '150px',
                                            height: '40px',
                                            background: '#000',
                                            border: '1px solid #ccc',
                                            fontSize: '15px',
                                            borderRadius: '11px',
                                        }}>
                                            Verify OTP
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}
                </form>
            )}

            {error && <div style={{ color: 'red' }}>{error}</div>}

        </div>

    );
}


export default LoginForm;
