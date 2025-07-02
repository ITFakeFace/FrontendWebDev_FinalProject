import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { useNavigate } from 'react-router-dom';
const ProfileEditForm = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    tagline: '',
    avatar: '',
  });

  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/userProfile');
  }

  const [loading, setLoading] = useState(false); // ✅ Moved inside component

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')) || {
      username: 'Anonymous',
      email: 'anonymous@reciassist.com',
      tagline: '',
      avatar: '',
    };
    setProfile(user);
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setLoading(true); // ✅ Show loading
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify(profile));
      setLoading(false);
      alert('Profile saved!');
    }, 1500); // delay time
  };

  const [dietary, setDietary] = useState(null);
      const diet = [
          { name: 'Vegetarian', code: 'Vegan' },
          { name: 'Guten-free', code: 'Gf' },
          { name: 'Omnivore', code: 'O' },
          { name: 'Keto', code: 'K' },
          { name: 'Flexitarian', code: 'F' }
      ];

  return (
    <div className="flex flex-col md:flex-row gap-5 p-5">
      {/* Sidebar */}
      <div className="w-full md:w-1/4">
        <Card className="text-center p-4">
          <img
            src={profile.avatar || 'https://www.w3schools.com/howto/img_avatar.png'}
            alt="avatar"
            className="w-24 h-24 mx-auto rounded-full mb-3"
          />
          <p className="font-semibold">{profile.email}</p>
          <Button label="View Profile" className="mt-3 w-full" onClick={handleClick}/>
        </Card>

        <div className="mt-4 border rounded-md">
          <div className="p-3 border-b font-bold text-black-700">Profile Settings</div>
          <div className="p-3 border-b hover:bg-blue-50 cursor-pointer">✨ Favorite Recipes</div>
          <div className="p-3 hover:bg-blue-50 cursor-pointer">🥄 Personal Recipes</div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full md:w-3/4">
        <Card title="Profile Settings">
          <p className="text-sm text-gray-500 mb-3">
            The information on this page will be displayed on your profile, which is visible to other users.
          </p>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Display Name</label>
            <InputText name="username" value={profile.username} onChange={handleChange} className="w-full border-2 border-blue-400 rounded" />
          </div>

          <div className="card flex justify-content-center">
              <Dropdown value={dietary} onChange={(e) => setDietary(e.value)} options={diet} optionLabel="name" 
                editable placeholder="Select your diet type" className="w-full border-2 border-blue-400 rounded" />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Describe About Yourself</label>
            <InputTextarea name="tagline" rows={5} value={profile.tagline} onChange={handleChange} placeholder="Write down something..." className="w-full border-2 border-blue-400 rounded" />
          </div>

          <div className="mb-6">
            <div className="flex flex-col items-center">
              <label htmlFor="avatar-upload" className="cursor-pointer bg-gray-100 rounded-md border border-blue-500 p-6 w-48 h-48 flex flex-col justify-center items-center hover:bg-gray-200 transition">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="avatar" className="w-24 h-24 rounded-full mb-3" />
                ) : (
                  <div className="border-2 border-blue-500 rounded-full w-24 h-24 flex items-center justify-center mb-3">
                    <i className="pi pi-camera text-blue-500 text-2xl"></i>
                  </div>
                )}
                <span className="text-sm font-semibold text-black">Profile Photo</span>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setProfile({ ...profile, avatar: e.target.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/*  Save Button with loading */}
          <div className="flex justify-center">
  <Button
  label="Save Changes"
  icon="pi pi-check"
  loading={loading}
  onClick={() => {
    setLoading(true);
    setTimeout(() => {
      handleSave();
      setLoading(false);
    }, 1500);
  }}
  className="mt-5 w-48 bg-sky-400 text-white font-semibold hover:bg-sky-300 rounded-lg gap-2 px-5 py-2 shadow-md hover:shadow-lg transition-all flex items-center justify-center"


/>
</div>

        </Card>
      </div>
    </div>
  );
};

export default ProfileEditForm;
