import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import RecipesShow from "../layouts/components/RecipesChart";
import RecentActivityList from '../layouts/components/RecentActivityList';
import PeopleLikeCarousel from '../layouts/components/CommentCarousel';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    tagline: '',
    avatar: '',
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')) || {
      username: 'Anonymous',
      email: 'anonymous@reciassist.com',
      tagline: '',
      avatar: '',
    };
    setProfile(user);
  }, []);
  
  const navigate = useNavigate();

  const handleClick = () =>{
    navigate('/userEdit');
  }
  

  return (
    <div className="flex flex-col md:flex-row gap-5 p-5">
  {/* Sidebar on the left */}
  <div className="w-full md:w-1/4 flex flex-col gap-4">
    <Card className="text-center p-4">
      <img
        src={profile.avatar || 'https://www.w3schools.com/howto/img_avatar.png'}
        alt="avatar"
        className="w-24 h-24 mx-auto rounded-full mb-3"
      />
      <p className="font-semibold">{profile.email}</p>
      <Button label="Edit Profile" className="mt-3 w-full" onClick={handleClick} />
    </Card>

    <div className="border rounded-md">
      <div className="p-3 border-b font-bold text-black-700">Profile Settings</div>
      <div className="p-3 border-b hover:bg-blue-50 cursor-pointer">✨ Favorite Recipes</div>
      <div className="p-3 hover:bg-blue-50 cursor-pointer">🥄 Personal Recipes</div>
    </div>

    <Card>
      <RecipesShow />
    </Card>
  </div>

  {/* Main content on the right */}
  <div className="w-full md:flex-1">
    <Card title="People who likes your recipes" className="mb-5">  
      <PeopleLikeCarousel/>
      <br/>
      <div className="w-full md:w-4/4">
        <Card title="Recent Activity" className="mb-5">          
          <RecentActivityList/>
        </Card>
      </div>
      
    </Card>
  </div>
</div>

  );
};

export default ProfilePage;
