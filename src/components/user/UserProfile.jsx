import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserDashboard.css';
import { showSuccessToast, showErrorToast } from '../utils/toastConfig.js';

export const UserProfile = () => {
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
    });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState({});
    const userId = localStorage.getItem('id');
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`/user/${userId}`);
            console.log(response.data);
            const transformedData = {
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                email: response.data.email,
                role: response.data.role.name
            };
            setProfile(transformedData);
            setEditedProfile(transformedData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            showErrorToast('Failed to load profile data');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/user/${userId}`, editedProfile);
            // Update profile with the response data
            setProfile({
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                email: response.data.email,
                role: response.data.role.name
            });
            setIsEditing(false);
            showSuccessToast('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            showErrorToast('Failed to update profile');
        }
    };

    if (loading) {
        return <div className="profile-loading">Loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>My Profile</h1>
                <button 
                    className={`edit-button ${isEditing ? 'save-button' : ''}`}
                    onClick={() => !isEditing && setIsEditing(true)}
                >
                    {isEditing ? 'Editing...' : 'Edit Profile'}
                </button>
            </div>

            <div className="profile-content">
                <div className="profile-avatar">
                    <div className="avatar-circle">
                        {profile.firstName ? profile.firstName.charAt(0).toUpperCase() : '?'}
                    </div>
                    <h2>{profile.firstName} {profile.lastName}</h2>
                    <p className="role-badge">{profile.role}</p>
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={editedProfile.firstName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={editedProfile.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={editedProfile.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="button-group">
                            <button type="submit" className="save-button">Save Changes</button>
                            <button 
                                type="button" 
                                className="cancel-button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditedProfile(profile);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="profile-details">
                        <div className="detail-item">
                            <span className="detail-label">First Name</span>
                            <span className="detail-value">{profile.firstName}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Last Name</span>
                            <span className="detail-value">{profile.lastName}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Email</span>
                            <span className="detail-value">{profile.email}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
