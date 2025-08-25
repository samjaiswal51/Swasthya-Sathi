// frontend/src/components/patient/Profile.jsx

import React, { useState, useEffect } from 'react';
import patientService from '../../services/patientService';

// A sub-component to display the profile information in a clean, read-only format.
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
        <div key={i} className="mb-2 p-3 bg-gray-50 rounded-lg">
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
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Fetch profile data when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await patientService.getProfile();
        setProfile(profileData);
      } catch (err) {
        if (!err.message.includes('Profile not found')) {
          setError(err.message);
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
      gender: profile?.gender || '',
      contactNumber: profile?.contactNumber || '',
      address: profile?.address || '',
      bloodGroup: profile?.bloodGroup || '',
      allergies: profile?.allergies?.length > 0 ? profile.allergies : [''],
      emergencyContacts: profile?.emergencyContacts?.length > 0 ? profile.emergencyContacts : [{ name: '', relationship: '', phone: '' }],
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage('');
    setError('');
  };

  // --- Handlers for form changes ---
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleAllergyChange = (index, value) => {
    const newAllergies = [...formData.allergies];
    newAllergies[index] = value;
    setFormData({ ...formData, allergies: newAllergies });
  };
  const addAllergyField = () => setFormData({ ...formData, allergies: [...formData.allergies, ''] });
  const removeAllergyField = (index) => setFormData({ ...formData, allergies: formData.allergies.filter((_, i) => i !== index) });
  const handleEmergencyContactChange = (index, e) => {
    const newContacts = [...formData.emergencyContacts];
    newContacts[index][e.target.name] = e.target.value;
    setFormData({ ...formData, emergencyContacts: newContacts });
  };
  const addEmergencyContactField = () => setFormData({ ...formData, emergencyContacts: [...formData.emergencyContacts, { name: '', relationship: '', phone: '' }] });
  const removeEmergencyContactField = (index) => setFormData({ ...formData, emergencyContacts: formData.emergencyContacts.filter((_, i) => i !== index) });

  // --- Handler for form submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const updatedProfile = await patientService.updateProfile(formData);
      setProfile(updatedProfile); // Update the main profile view
      setMessage('Profile updated successfully!');
      setIsEditing(false); // Switch back to view mode
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return <div className="text-center p-4">Loading profile...</div>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditing ? 'Update Your Profile' : 'Your Profile'}
      </h2>
      
      {message && <p className="text-green-500 bg-green-100 p-3 rounded mb-4">{message}</p>}
      
      {isEditing ? (
        // FORM VIEW
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
          {/* Personal Info */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="w-full px-3 py-2 border rounded-lg" />
              <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="w-full px-3 py-2 border rounded-lg" />
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                <option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
              </select>
              <input name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Contact Number" className="w-full px-3 py-2 border rounded-lg" />
              <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          {/* Health Profile */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Health Profile</h3>
            <input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="Blood Group (e.g., A+)" className="w-full px-3 py-2 border rounded-lg md:w-1/2" />
            <div className="mt-4">
              <label className="block font-medium mb-2">Allergies</label>
              {formData.allergies.map((allergy, index) => (
                <div key={index} className="flex items-center mb-2"><input value={allergy} onChange={(e) => handleAllergyChange(index, e.target.value)} placeholder="e.g., Peanuts" className="w-full px-3 py-2 border rounded-lg" /><button type="button" onClick={() => removeAllergyField(index)} className="ml-2 px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">-</button></div>
              ))}
              <button type="button" onClick={addAllergyField} className="mt-2 px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600">Add Allergy</button>
            </div>
          </div>
          {/* Emergency Contacts */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Emergency Contacts</h3>
            {formData.emergencyContacts.map((contact, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-lg">
                <input name="name" value={contact.name} onChange={(e) => handleEmergencyContactChange(index, e)} placeholder="Name" className="w-full px-3 py-2 border rounded-lg" />
                <input name="relationship" value={contact.relationship} onChange={(e) => handleEmergencyContactChange(index, e)} placeholder="Relationship" className="w-full px-3 py-2 border rounded-lg" />
                <input name="phone" value={contact.phone} onChange={(e) => handleEmergencyContactChange(index, e)} placeholder="Phone Number" className="w-full px-3 py-2 border rounded-lg" />
                <button type="button" onClick={() => removeEmergencyContactField(index)} className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addEmergencyContactField} className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600">Add Contact</button>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={handleCancel} className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-300">{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      ) : (
        // DISPLAY VIEW
        <ProfileView profile={profile || {}} onEdit={handleEdit} />
      )}
    </div>
  );
}

export default Profile;