import React, { useState } from 'react';
import axios from 'axios';
import './UserSidebar.css';
import { showSuccessToast, showErrorToast } from '../utils/toastConfig';

export const Setting = () => {
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        bookingReminders: true,
        promotionalEmails: false
    });

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showErrorToast('New passwords do not match');
            return;
        }
    
        try {
            const userId = localStorage.getItem('id');
            if (!userId) {
                showErrorToast('Please log in to change your password.');
                return;
            }
    
            await axios.post('http://localhost:8000/changepassword', {
                userId: userId,
                oldPassword: passwordData.currentPassword,
                password: passwordData.newPassword
            });
            
            showSuccessToast('Password changed successfully');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error('Error changing password:', error);
            showErrorToast(
                error.response?.data?.detail || 'Failed to change password. Please check your current password.'
            );
        }
    };
    // const handlePasswordChange = async (e) => {
    //     e.preventDefault();
        
    //     if (passwordData.newPassword !== passwordData.confirmPassword) {
    //         showErrorToast('New passwords do not match');
    //         return;
    //     }

    //     try {
    //         const userId = localStorage.getItem('id');
    //         await axios.put(`/user/${userId}/change-password`, {
    //             currentPassword: passwordData.currentPassword,
    //             newPassword: passwordData.newPassword
    //         });
            
    //         showSuccessToast('Password changed successfully');
    //         setPasswordData({
    //             currentPassword: '',
    //             newPassword: '',
    //             confirmPassword: ''
    //         });
    //     } catch (error) {
    //         console.error('Error changing password:', error);
    //         showErrorToast('Failed to change password. Please check your current password.');
    //     }
    // };

    const handleNotificationChange = async (setting) => {
        try {
            const userId = localStorage.getItem('id');
            const updatedSettings = {
                ...notifications,
                [setting]: !notifications[setting]
            };

            await axios.put(`/user/${userId}/notifications`, {
                notifications: updatedSettings
            });

            setNotifications(updatedSettings);
            showSuccessToast('Notification settings updated');
        } catch (error) {
            console.error('Error updating notifications:', error);
            showErrorToast('Failed to update notification settings');
        }
    };

    return (
        <div className="settings-container">
            <h1>Settings</h1>

            <section className="settings-section">
                <h2>Change Password</h2>
                <form onSubmit={handlePasswordChange} className="password-form">
                    <div className="form-group">
                        <label>Current Password</label>
                        <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({
                                ...passwordData,
                                currentPassword: e.target.value
                            })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({
                                ...passwordData,
                                newPassword: e.target.value
                            })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({
                                ...passwordData,
                                confirmPassword: e.target.value
                            })}
                            required
                        />
                    </div>
                    <button type="submit" className="save-button">Change Password</button>
                </form>
            </section>

            {/* <section className="settings-section">
                <h2>Notification Preferences</h2>
                <div className="notification-settings">
                    <div className="notification-option">
                        <label className="toggle-label">
                            <input
                                type="checkbox"
                                checked={notifications.emailNotifications}
                                onChange={() => handleNotificationChange('emailNotifications')}
                            />
                            <span className="toggle-slider"></span>
                            Email Notifications
                        </label>
                        <p className="setting-description">Receive important updates about your bookings</p>
                    </div>

                    <div className="notification-option">
                        <label className="toggle-label">
                            <input
                                type="checkbox"
                                checked={notifications.bookingReminders}
                                onChange={() => handleNotificationChange('bookingReminders')}
                            />
                            <span className="toggle-slider"></span>
                            Booking Reminders
                        </label>
                        <p className="setting-description">Get reminders before your parking slot booking</p>
                    </div>

                    <div className="notification-option">
                        <label className="toggle-label">
                            <input
                                type="checkbox"
                                checked={notifications.promotionalEmails}
                                onChange={() => handleNotificationChange('promotionalEmails')}
                            />
                            <span className="toggle-slider"></span>
                            Promotional Emails
                        </label>
                        <p className="setting-description">Receive updates about special offers and promotions</p>
                    </div>
                </div>
            </section> */}
        </div>
    );
}; 