import React from "react";

const ProfileHeader = ({ profilePhoto, username, handlePhotoChange, handlePhotoUpload, photoFile, onLogout }) => (
  <div className="flex flex-row bg-white rounded-lg shadow-md p-8 items-center mb-9">
    <div className="relative">
      <img
        src={profilePhoto ? profilePhoto : "https://ui-avatars.com/api/?name=" + username}
        alt="Profile"
        className="w-28 h-28 rounded-full object-cover border-4 border-blue-300"
      />
      <input
        type="file"
        accept="image/*"
        id="profile-photo-input"
        className="hidden"
        onChange={handlePhotoChange}
      />
      <button
        className="absolute bottom-0 right-0 bg-blue-500 text-white px-2 py-1 rounded text-xs"
        style={{ zIndex: 3 }}
        onClick={() => document.getElementById('profile-photo-input').click()}
      >
        Select Photo
      </button>
      {photoFile && (
        <button
          className="absolute bottom-0 left-0 bg-green-500 text-white px-2 py-1 rounded text-xs"
          style={{ zIndex: 3 }}
          onClick={handlePhotoUpload}
        >
          Upload
        </button>
      )}
    </div>
    <div className="mt-2 font-bold text-lg ml-8">{username}</div>
    <button
      className="ml-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      onClick={onLogout}
    >
      Logout
    </button>
  </div>
);

export default ProfileHeader;