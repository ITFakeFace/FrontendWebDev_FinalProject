import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { MultiSelect } from 'primereact/multiselect';
import { setSession } from '../../services/authService';

const ProfileEditForm = ({ onCancel, onSave, inlineMode = false }) => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    tagline: '',
    avatar: '',
    dietary: []
  });

  const [dietaryOptions] = useState([
    { name: 'Vegetarian', code: 'V' },
    { name: 'Gluten-free', code: 'Gf' },
    { name: 'Omnivore', code: 'O' },
    { name: 'Keto', code: 'K' },
    { name: 'Flexitarian', code: 'F' }
  ]);

  const [dropdownDiet, setDropdownDiet] = useState([]);
  const [customDiet, setCustomDiet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')) || {
      username: 'Anonymous',
      email: 'anonymous@reciassist.com',
      tagline: '',
      avatar: '',
      dietary: []
    };

    setProfile(user);

    const existing = [], custom = [];
    user.dietary?.forEach(d => {
      const found = dietaryOptions.find(opt => opt.name === d);
      found ? existing.push(found) : custom.push(d);
    });
    setDropdownDiet(existing);
    setCustomDiet(custom);
  }, [dietaryOptions]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!profile.username.trim()) {
      alert('Display Name is required.');
      return;
    }

    const allDiet = [
      ...dropdownDiet.map(d => d.name),
      ...customDiet
    ];

    const updated = { ...profile, dietary: allDiet };
    setLoading(true);

    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify(updated));
      setSession(updated);
      setProfile(updated);
      setLoading(false);
      alert('Profile saved!');
      if (onSave) onSave(updated);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Profile Card */}
          {!inlineMode && (
            <div className="w-full lg:w-1/3">
              <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 relative">
                  <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                </div>
                <div className="px-6 pb-6 -mt-16 relative z-10">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <img
                        src={profile.avatar || 'https://www.w3schools.com/howto/img_avatar.png'}
                        alt="avatar"
                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                        <i className="pi pi-check text-white text-xs"></i>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{profile.username}</h3>
                    <p className="text-gray-600 text-sm mb-4">{profile.email}</p>
                    
                    {/* Profile Stats */}
                    <div className="flex justify-around w-full mb-6 bg-gray-50 rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">12</div>
                        <div className="text-xs text-gray-600">Recipes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">28</div>
                        <div className="text-xs text-gray-600">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">15</div>
                        <div className="text-xs text-gray-600">Following</div>
                      </div>
                    </div>

                    <Button 
                      label="View Profile" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 border-0 rounded-lg py-3 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                      onClick={onCancel}
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Main Form */}
          <div className={`w-full ${inlineMode ? '' : 'lg:w-2/3'}`}>
            <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white mb-2">Profile Settings</h2>
                <p className="text-blue-100 text-sm">
                  Customize your profile information and preferences
                </p>
              </div>

              <div className="p-8">
                {/* Display Name */}
                <div className="mb-8">
                  <label className="block text-gray-700 font-semibold mb-3 flex items-center">
                    <i className="pi pi-user text-blue-600 mr-2"></i>
                    Display Name
                  </label>
                  <InputText
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    placeholder="Enter your display name"
                  />
                </div>

                {/* Dietary Preferences */}
                <div className="mb-8">
                  <label className="block text-gray-700 font-semibold mb-3 flex items-center">
                    <i className="pi pi-heart text-red-500 mr-2"></i>
                    Dietary Preferences
                    <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      Press Enter to add custom
                    </span>
                  </label>

                  <MultiSelect
                    value={[...dropdownDiet, ...customDiet.map(d => ({ name: d, code: 'custom' }))]}
                    onChange={(e) => {
                      const selected = e.value || [];
                      const existing = [], custom = [];

                      selected.forEach(d => {
                        if (dietaryOptions.find(opt => opt.name === d.name)) {
                          existing.push(d);
                        } else {
                          custom.push(d.name);
                        }
                      });

                      setDropdownDiet(existing);
                      setCustomDiet(custom);
                    }}
                    options={[...dietaryOptions, ...customDiet.map(d => ({ name: d, code: 'custom' }))]}
                    optionLabel="name"
                    display="chip"
                    placeholder="Select or type your dietary preferences"
                    className="w-full border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-all duration-300"
                    filter
                  />

                  <InputText
                    className="mt-3 w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    placeholder="Type and press Enter to add custom tag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        e.preventDefault();
                        const newTag = e.target.value.trim();

                        if (
                          !customDiet.includes(newTag) &&
                          !dietaryOptions.some(opt => opt.name.toLowerCase() === newTag.toLowerCase())
                        ) {
                          setCustomDiet(prev => [...prev, newTag]);
                        }

                        e.target.value = '';
                      }
                    }}
                  />
                </div>

                {/* About Section */}
                <div className="mb-8">
                  <label className="block text-gray-700 font-semibold mb-3 flex items-center">
                    <i className="pi pi-info-circle text-green-600 mr-2"></i>
                    About Yourself
                  </label>
                  <InputTextarea
                    name="tagline"
                    rows={5}
                    value={profile.tagline}
                    onChange={handleChange}
                    placeholder="Tell us about yourself, your cooking style, favorite cuisines..."
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 resize-none"
                  />
                </div>

                {/* Profile Photo */}
                <div className="mb-8">
                  <label className="block text-gray-700 font-semibold mb-3 flex items-center">
                    <i className="pi pi-camera text-purple-600 mr-2"></i>
                    Profile Photo
                  </label>
                  <div className="flex justify-center">
                    <label 
                      htmlFor="avatar-upload" 
                      className="cursor-pointer group"
                      onMouseEnter={() => setIsImageHovered(true)}
                      onMouseLeave={() => setIsImageHovered(false)}
                    >
                      <div className="relative w-48 h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-500 transition-all duration-300 flex flex-col justify-center items-center group-hover:shadow-xl">
                        {profile.avatar ? (
                          <>
                            <img 
                              src={profile.avatar} 
                              alt="avatar" 
                              className="w-32 h-32 rounded-full object-cover shadow-lg"
                            />
                            <div className={`absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center transition-opacity duration-300 ${isImageHovered ? 'opacity-100' : 'opacity-0'}`}>
                              <i className="pi pi-camera text-white text-2xl"></i>
                            </div>
                          </>
                        ) : (
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-3 mx-auto">
                              <i className="pi pi-camera text-white text-xl"></i>
                            </div>
                            <span className="text-sm font-semibold text-gray-700">Upload Photo</span>
                            <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                          </div>
                        )}
                      </div>
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

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 pt-6 border-t border-gray-200">
                  {onCancel && (
                    <Button
                      label="Cancel"
                      className="px-8 py-3 bg-gray-100 text-gray-700 border-0 rounded-lg hover:bg-gray-200 transition-all duration-300"
                      onClick={onCancel}
                    />
                  )}
                  <Button
                    label={loading ? 'Saving...' : 'Save Changes'}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 border-0 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={handleSave}
                    disabled={loading}
                    icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditForm;