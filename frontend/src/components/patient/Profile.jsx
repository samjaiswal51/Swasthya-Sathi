// frontend/src/components/patient/Profile.jsx

import React, { useState, useEffect } from 'react';
import patientService from '../../services/patientService';
import { useAuth } from '../../hooks/useAuth'; // Import useAuth to get user info

// Yeh component tab dikhega jab user ki profile nahi bani hogi lekin basic info hai
const PartialProfileView = ({ user, onEdit }) => (
  <div className="text-center p-6 bg-gray-50 rounded-lg border">
    <h3 className="text-lg font-semibold text-gray-800">Your Basic Information</h3>
    <div className="my-4 text-left inline-block">
      <p><strong className="text-gray-600">Email:</strong> {user?.email || 'Not available'}</p>
      <p><strong className="text-gray-600">User Role:</strong> {user?.role || 'Not available'}</p>
    </div>
    <p className="text-gray-500 my-3">It looks like you haven't completed your profile yet.</p>
    <button onClick={onEdit} className="w-full max-w-xs py-3 mt-4 text-white font-semibold bg-green-600 rounded-lg hover:bg-green-700 transition">
      Complete Your Profile
    </button>
  </div>
);

// Yeh component profile ki poori details dikhane ke liye hai
const ProfileView = ({ profile, onEdit }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <p><strong className="text-gray-600">First Name:</strong> {profile.firstName || 'Not set'}</p>
        <p><strong className="text-gray-600">Last Name:</strong> {profile.lastName || 'Not set'}</p>
        <p><strong className="text-gray-600">Date of Birth:</strong> {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not set'}</p>
        <p><strong className="text-gray-600">Gender:</strong> {profile.gender || 'Not set'}</p>
        <p><strong className="text-gray-600">Contact:</strong> {profile.contactNumber || 'Not set'}</p>
        <p><strong className="text-gray-600">Address:</strong> {profile.address || 'Not set'}</p>
      </div>
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Health Profile</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <p><strong className="text-gray-600">Blood Group:</strong> {profile.bloodGroup || 'Not set'}</p>
        <div>
          <strong className="text-gray-600">Allergies:</strong>
          <ul className="list-disc list-inside ml-4 mt-1">
            {profile.allergies?.length > 0 && profile.allergies[0] ? profile.allergies.map((allergy, i) => <li key={i}>{allergy}</li>) : <li>None specified</li>}
          </ul>
        </div>
      </div>
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Emergency Contacts</h3>
      {profile.emergencyContacts?.length > 0 && profile.emergencyContacts[0]?.name ? profile.emergencyContacts.map((contact, i) => (
        <div key={i} className="mb-2 p-3 bg-gray-50 rounded-lg border">
          <p><strong className="text-gray-600">Name:</strong> {contact.name}</p>
          <p><strong className="text-gray-600">Relationship:</strong> {contact.relationship}</p>
          <p><strong className="text-gray-600">Phone:</strong> {contact.phone}</p>
        </div>
      )) : <p>No emergency contacts set.</p>}
    </div>
    <button onClick={onEdit} className="w-full py-3 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
      Edit Profile
    </button>
  </div>
);


function Profile() {
  const { user } = useAuth(); // Get basic user info from context
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        const profileData = await patientService.getProfile();
        setProfile(profileData);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setProfile(null); // Profile nahi mila, toh null set karo
        } else {
          setError(err.message || 'Could not load profile.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setFormData({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
      gender: profile?.gender || 'Male',
      contactNumber: profile?.contactNumber || '',
      address: profile?.address || '',
      bloodGroup: profile?.bloodGroup || '',
      allergies: profile?.allergies?.length > 0 && profile.allergies[0] ? profile.allergies : [''],
      emergencyContacts: profile?.emergencyContacts?.length > 0 && profile.emergencyContacts[0]?.name ? profile.emergencyContacts : [{ name: '', relationship: '', phone: '' }],
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage('');
    setError('');
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAllergyChange = (index, value) => {
    const newAllergies = [...formData.allergies];
    newAllergies[index] = value;
    setFormData({ ...formData, allergies: newAllergies });
  };

  const addAllergyField = () => setFormData({ ...formData, allergies: [...formData.allergies, ''] });

  const removeAllergyField = (index) => {
    const newAllergies = formData.allergies.filter((_, i) => i !== index);
    setFormData({ ...formData, allergies: newAllergies });
  };

  const handleEmergencyContactChange = (index, e) => {
    const newContacts = [...formData.emergencyContacts];
    newContacts[index][e.target.name] = e.target.value;
    setFormData({ ...formData, emergencyContacts: newContacts });
  };

  const addEmergencyContactField = () => setFormData({ ...formData, emergencyContacts: [...formData.emergencyContacts, { name: '', relationship: '', phone: '' }] });

  const removeEmergencyContactField = (index) => {
    const newContacts = formData.emergencyContacts.filter((_, i) => i !== index);
    setFormData({ ...formData, emergencyContacts: newContacts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const finalFormData = {
          ...formData,
          allergies: formData.allergies.filter(a => a && a.trim() !== ''),
          emergencyContacts: formData.emergencyContacts.filter(c => c && c.name && c.name.trim() !== '')
      };
      const updatedProfile = await patientService.updateProfile(finalFormData);
      setProfile(updatedProfile);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="bg-white p-8 rounded-lg shadow-md text-center">Loading profile...</div>;
  }

  // Main render logic
  const renderContent = () => {
    if (isEditing) {
      // Edit/Create form
      return (
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="p-2 border rounded" required />
              <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="p-2 border rounded" />
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="p-2 border rounded" />
              <select name="gender" value={formData.gender} onChange={handleChange} className="p-2 border rounded">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Contact Number" className="p-2 border rounded" />
              <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="p-2 border rounded" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Health Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="Blood Group (e.g., A+)" className="p-2 border rounded" />
              <div className="space-y-2">
                <label className="font-medium">Allergies</label>
                {formData.allergies.map((allergy, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input value={allergy} onChange={(e) => handleAllergyChange(index, e.target.value)} placeholder={`Allergy #${index + 1}`} className="flex-grow p-2 border rounded" />
                    <button type="button" onClick={() => removeAllergyField(index)} className="px-2 py-1 text-white bg-red-500 rounded text-xs">X</button>
                  </div>
                ))}
                <button type="button" onClick={addAllergyField} className="text-sm text-blue-600 hover:underline">+ Add Allergy</button>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Emergency Contacts</h3>
            <div className="space-y-4">
              {formData.emergencyContacts.map((contact, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                  <input name="name" value={contact.name} onChange={(e) => handleEmergencyContactChange(index, e)} placeholder="Name" className="p-2 border rounded" />
                  <input name="relationship" value={contact.relationship} onChange={(e) => handleEmergencyContactChange(index, e)} placeholder="Relationship" className="p-2 border rounded" />
                  <input name="phone" value={contact.phone} onChange={(e) => handleEmergencyContactChange(index, e)} placeholder="Phone" className="p-2 border rounded" />
                  <button type="button" onClick={() => removeEmergencyContactField(index)} className="px-3 py-2 text-white bg-red-500 rounded">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addEmergencyContactField} className="text-sm text-blue-600 hover:underline">+ Add Contact</button>
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button type="button" onClick={handleCancel} className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      );
    }
    
    if (profile) {
      // Poori profile dikhayein
      return <ProfileView profile={profile} onEdit={handleEdit} />;
    } else if (user) {
      // Adhoori profile dikhayein
      return <PartialProfileView user={user} onEdit={handleEdit} />;
    } else {
      // Error state
      return <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error || "Could not load user data."}</div>;
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
        {isEditing ? (profile ? 'Update Your Profile' : 'Create Your Profile') : 'Your Profile'}
      </h2>
      
      {message && <p className="text-green-500 bg-green-100 p-3 rounded mb-4">{message}</p>}
      
      {renderContent()}
    </div>
  );
}

export default Profile;