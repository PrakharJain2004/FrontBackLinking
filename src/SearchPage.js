import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (searchQuery.trim().length >= 2) {
            setIsLoading(true);

            // Remove spaces and convert the search query to lowercase for case-insensitive and space-insensitive search
            const cleanedQuery = searchQuery.trim().toLowerCase().replace(/\s/g, '');

            // Make a GET request to your API endpoint
            axios.get(`http://p8u4dzxbx2uzapo8hev0ldeut0xcdm.pythonanywhere.com/users/`)
                .then((response) => {
                    // Filter the results based on the cleaned search query
                    const filteredUsers = response.data.filter((user) =>
                        user.username.toLowerCase().replace(/\s/g, '').includes(cleanedQuery) ||
                        user.first_name.toLowerCase().replace(/\s/g, '').includes(cleanedQuery) ||
                        user.last_name.toLowerCase().replace(/\s/g, '').includes(cleanedQuery)
                    );

                    setSearchResults(filteredUsers);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setIsLoading(false);
                });
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
    };

    // Function to format the matched part of a string with bold
    const formatMatchingText = (text, query) => {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.split(regex).map((part, index) =>
            regex.test(part) ? <b key={index}>{part}</b> : part
        );
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleInputChange}
                style={{
                    paddingLeft: '18px',
                    fontFamily: 'Helvetica',
                    width: 'calc(100% - 22px)',
                    height: '40px',
                    background: '#efefef',
                    border: '1px solid #ccc',
                    fontSize: '20px',
                    borderRadius: '11px',
                }}
            />
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                searchResults.map((user) => (
                    <div
                        key={user.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: '1px solid #ccc',
                            padding: '0px 0',
                        }}
                    >
                        <img
                            src={user.image} // Replace with the actual image field
                            alt={user.username} // Add alt text
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                marginRight: '10px',
                            }}
                        />
                        <div
                            style={{
                                flex: '1',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div>
                                <p
                                    style={{
                                        fontFamily: 'Helvetica',
                                        color: '#000',
                                        fontSize: '17px',
                                        position: 'relative',
                                        top: '4px',
                                        margin: '10px',
                                    }}
                                >
                                    <b>@{formatMatchingText(user.username, searchQuery)}</b>
                                </p>
                                <p
                                    style={{
                                        fontFamily: 'Helvetica',
                                        color: '#8f8f8f',
                                        position: 'relative',
                                        top: '-2px',
                                        fontSize: '17px',
                                        margin: '10px',
                                    }}
                                >
                                    {formatMatchingText(user.first_name, searchQuery)} {formatMatchingText(user.last_name, searchQuery)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default SearchPage;
