import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const { language, setLanguage, t, availableLanguages } = useLanguage();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [gender, setGender] = useState(user?.gender || '');
    const [notifications, setNotifications] = useState(true);

    // Image upload state
    const [profileImage, setProfileImage] = useState(user?.avatar || 'https://via.placeholder.com/150');
    const fileInputRef = useRef(null);

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Sync local state with user context when user changes (e.g., page revisit)
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setGender(user.gender || '');
            setProfileImage(user.avatar || 'https://via.placeholder.com/150');
        }
    }, [user]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageData = reader.result;
                setProfileImage(imageData);
                // Save immediately to user context
                updateUser({ avatar: imageData });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleSave = (e) => {
        e.preventDefault();
        // Save all profile data
        updateUser({
            name,
            email,
            gender,
            avatar: profileImage
        });
        alert(t('profileUpdated'));
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert(t('passwordMismatch'));
            return;
        }
        // Mock password update
        alert(t('passwordUpdated'));
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">{t('accountSettings')}</h1>

            {/* Profile Information Section */}
            <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-medium text-gray-900">{t('profileInformation')}</h2>
                    <p className="mt-1 text-sm text-gray-500">{t('updateProfileInfo')}</p>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Profile Image Upload */}
                        <div className="flex items-center space-x-6">
                            <div className="shrink-0 relative">
                                <img
                                    className="h-20 w-20 object-cover rounded-full cursor-pointer hover:opacity-80 transition-opacity border-2 border-gray-200"
                                    src={profileImage}
                                    alt="Current profile photo"
                                    onClick={handleImageClick}
                                />
                                <div
                                    className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer hover:bg-blue-700"
                                    onClick={handleImageClick}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={handleImageClick}
                                    className="text-sm text-primary hover:text-blue-700 font-medium"
                                >
                                    {t('chooseProfilePhoto')}
                                </button>
                                <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF up to 10MB</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('fullName')}</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('emailAddress')}</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">{t('gender')}</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md border"
                                >
                                    <option value="">{t('selectGender')}</option>
                                    <option value="male">{t('male')}</option>
                                    <option value="female">{t('female')}</option>
                                    <option value="other">{t('other')}</option>
                                    <option value="prefer-not-to-say">{t('preferNotToSay')}</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                {t('saveChanges')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Change Password Section */}
            <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-medium text-gray-900">{t('changePassword')}</h2>
                    <p className="mt-1 text-sm text-gray-500">{t('updatePassword')}</p>
                </div>
                <div className="p-6">
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">{t('currentPassword')}</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    id="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">{t('newPassword')}</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">{t('confirmNewPassword')}</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                {t('updatePasswordBtn')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-medium text-gray-900">{t('preferences')}</h2>
                    <p className="mt-1 text-sm text-gray-500">{t('managePreferences')}</p>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700">{t('language')}</label>
                        <select
                            id="language"
                            name="language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md border"
                        >
                            {availableLanguages.map((lang) => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="notifications"
                                name="notifications"
                                type="checkbox"
                                checked={notifications}
                                onChange={(e) => setNotifications(e.target.checked)}
                                className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="notifications" className="font-medium text-gray-700">{t('emailNotifications')}</label>
                            <p className="text-gray-500">{t('receiveUpdates')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white shadow-sm rounded-xl border border-red-100 overflow-hidden">
                <div className="p-6 bg-red-50 border-b border-red-100">
                    <h2 className="text-lg font-medium text-red-800">{t('dangerZone')}</h2>
                </div>
                <div className="p-6">
                    <p className="text-sm text-gray-600 mb-4">{t('deleteAccountWarning')}</p>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        {t('deleteAccount')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
