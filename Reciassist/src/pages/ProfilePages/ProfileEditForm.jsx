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
    { name: 'Guten-free', code: 'Gf' },
    { name: 'Omnivore', code: 'O' },
    { name: 'Keto', code: 'K' },
    { name: 'Flexitarian', code: 'F' }
  ]);

  const [dropdownDiet, setDropdownDiet] = useState([]);
  const [customDiet, setCustomDiet] = useState([]);
  const [loading, setLoading] = useState(false);

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
      localStorage.setItem('user', JSON.stringify(updated)); // optional
      setSession(updated); // ✅ cập nhật session để các trang khác nhận được
      setProfile(updated);
      setLoading(false);
      alert('Profile saved!');
      if (onSave) onSave(updated);
    }, 1500);
  };

  return (
    <div className="flex flex-col md:flex-row gap-5 p-5">
      {/* Only show sidebar if not inline mode */}
      {!inlineMode && (
        <div className="w-full md:w-1/4">
          <Card className="text-center p-4">
            <img
              src={profile.avatar || 'https://www.w3schools.com/howto/img_avatar.png'}
              alt="avatar"
              className="w-24 h-24 mx-auto rounded-full mb-3"
            />
            <p className="font-semibold">{profile.email}</p>
            <Button label="View Profile" className="mt-3 w-full" onClick={onCancel} />
          </Card>
        </div>
      )}

      {/* Form Content */}
      <div className={`w-full ${inlineMode ? '' : 'md:w-3/4'}`}>
        <Card title="Profile Settings">
          <p className="text-sm text-gray-500 mb-3">
            The information on this page will be displayed on your profile, which is visible to other users.
          </p>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Display Name</label>
            <InputText
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="w-full border-2 border-blue-400 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1 text-gray-800">
              Your Dietary Preferences <span className="ml-1 text-xs text-gray-500">(Press Enter to add custom)</span>
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
            className="w-full border-2 border-blue-400"
            filter
          />

          <InputText
            className="mt-2 w-full border-2 border-dashed border-gray-400 p-2 rounded"
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

          <div className="mb-4">
            <label className="block font-semibold mb-2">Describe About Yourself</label>
            <InputTextarea
              name="tagline"
              rows={5}
              value={profile.tagline}
              onChange={handleChange}
              placeholder="Write down something..."
              className="w-full border-2 border-blue-400 rounded"
            />
          </div>

          <div className="mb-6 flex justify-center">
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

          <div className="flex justify-center gap-3">
            
            <Button
              label={loading ? 'Saving...' : 'Save Changes'}
              className="edit-profile-btn"
              onClick={handleSave}
              disabled={loading}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfileEditForm;
