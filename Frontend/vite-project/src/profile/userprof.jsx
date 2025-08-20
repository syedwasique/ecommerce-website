// src/UserProfile/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Authcontext';
import styles from './userprof.module.css';

const UserProfile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData({
        displayName: currentUser.displayName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || ''
      });
      setLoading(false);
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await updateUserProfile({
        displayName: formData.displayName,
        phone: formData.phone,
        address: formData.address
      });
      setSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      setError(`Failed to update profile: ${err.message}`);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <h1>Your Profile</h1>
        <p>Manage your account settings and view order history</p>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.profileCard}>
          <div className={styles.cardHeader}>
            <h2>Account Information</h2>
            {!editMode && (
              <button 
                className={styles.editButton}
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}
          
          {editMode ? (
            <form className={styles.profileForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled
                />
                <p className={styles.note}>Email cannot be changed</p>
              </div>
              
              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Default Shipping Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your full address"
                  rows="3"
                ></textarea>
              </div>
              
              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.saveButton}
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.profileInfo}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Full Name:</span>
                <span className={styles.infoValue}>
                  {formData.displayName || 'Not provided'}
                </span>
              </div>
              
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{formData.email}</span>
              </div>
              
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Phone:</span>
                <span className={styles.infoValue}>
                  {formData.phone || 'Not provided'}
                </span>
              </div>
              
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Address:</span>
                <span className={styles.infoValue}>
                  {formData.address || 'Not provided'}
                </span>
              </div>
              
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Account Created:</span>
                <span className={styles.infoValue}>
                  {currentUser.metadata.creationTime 
                    ? new Date(currentUser.metadata.creationTime).toLocaleDateString() 
                    : 'Unknown'}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.actionsCard}>
          <h2>Quick Actions</h2>
          
          <div className={styles.actionItem}>
            <i className="fas fa-history"></i>
            <div>
              <h3>Order History</h3>
              <p>View and manage your past orders</p>
            </div>
            <button 
              className={styles.actionButton}
              onClick={() => navigate('/order-history')}
            >
              View
            </button>
          </div>
          
          <div className={styles.actionItem}>
            <i className="fas fa-map-marker-alt"></i>
            <div>
              <h3>Address Book</h3>
              <p>Manage your shipping addresses</p>
            </div>
            <button 
              className={styles.actionButton}
              onClick={() => alert('Address book feature coming soon!')}
            >
              Manage
            </button>
          </div>
          
          <div className={styles.actionItem}>
            <i className="fas fa-credit-card"></i>
            <div>
              <h3>Payment Methods</h3>
              <p>Add or remove payment options</p>
            </div>
            <button 
              className={styles.actionButton}
              onClick={() => alert('Payment methods feature coming soon!')}
            >
              Manage
            </button>
          </div>
          
          <div className={styles.actionItem}>
            <i className="fas fa-shield-alt"></i>
            <div>
              <h3>Security</h3>
              <p>Change password and security settings</p>
            </div>
            <button 
              className={styles.actionButton}
              onClick={() => alert('Security settings feature coming soon!')}
            >
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;