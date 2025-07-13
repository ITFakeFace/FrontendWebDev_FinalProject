import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import RecipesShow from "../ProfilePages/RecipesChart";
import RecentActivityList from '../ProfilePages/RecentActivityList';
import PeopleLikeCarousel from '../ProfilePages/CommentCarousel';
import ProfileEditForm from '../ProfilePages/ProfileEditForm';
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService'; 

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    tagline: '',
    avatar: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
  setTimeout(() => {
    const user = getCurrentUser() || {
      username: 'Anonymous',
      email: '',
      tagline: '',
      avatar: '',
    };
    setProfile(user);
    setIsLoading(false);
  }, 500); // hoặc bỏ setTimeout nếu không cần loading delay
}, []);

  const navigate = useNavigate();

  if (isLoading) return <div className="loading-container"></div>;

  return (
    <div className="profile-page-container w-full">
      <div className="profile-background-gradient"></div>

      <div className="profile-content">
        {/* Sidebar */}
        <div className="profile-sidebar w-full md:w-1/4">
          <Card className="profile-card animate-slide-up">
            <div className="profile-header">
              <div className="avatar-container">
                <img
                  src={profile.avatar || 'https://www.w3schools.com/howto/img_avatar.png'}
                  alt="avatar"
                  className="profile-avatar"
                />
                <div className="avatar-ring"></div>
              </div>
              <div className="profile-info">
                <h2 className="profile-name">{profile.displayName || 'Anonymous'}</h2>
                <p className="profile-email">{profile.email}</p>
                <p className="profile-tagline">{profile.tagline}</p>
              </div>
              <Button
                label={isEditing ? "View Profile" : "Edit Profile"}
                className="edit-profile-btn"
                onClick={() => setIsEditing(prev => !prev)}
              />
            </div>
          </Card>

          <Card className="settings-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="settings-header"><h3>Profile Settings</h3></div>
            <div className="settings-menu">
              <div className="settings-item" onClick={() => navigate('/favorite-recipes')}>
                <span className="settings-icon">✨</span>
                <span>Favorite Recipes</span>
                <span className="settings-arrow">→</span>
              </div>
              <div className="settings-item">
                <span className="settings-icon">🥄</span>
                <span>Personal Recipes</span>
                <span className="settings-arrow">→</span>
              </div>
              <div className="settings-item">
                <span className="settings-icon">📊</span>
                <span>Analytics</span>
                <span className="settings-arrow">→</span>
              </div>
            </div>
          </Card>

          <Card className="chart-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="chart-container">
              <RecipesShow />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="profile-main-content w-full md:w-3/4">
          {isEditing ? (
            <ProfileEditForm
                inlineMode={true}
                onCancel={() => setIsEditing(false)}
                onSave={(updatedUser) => {
                    setProfile(updatedUser);        // ✅ cập nhật thông tin mới
                    setIsEditing(false);            // ✅ thoát form edit
                }}
            />
          ) : (
            <>
              <Card className="carousel-card animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="title-icon">💝</span>
                    People who likes your recipes
                  </h3>
                </div>
                <div className="carousel-container">
                  <PeopleLikeCarousel />
                </div>
              </Card>

              <Card className="activity-card animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="title-icon">📈</span>
                    Recent Activity
                  </h3>
                </div>
                <div className="activity-container">
                  <RecentActivityList />
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
