import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditProfileHeader from '../../components/EditProfile/EditProfileHeader';
import EditProfileForm from '../../components/EditProfile/EditProfileForm';

function ProfilePage() {
    return (
        <>
            <div className="container">
                <EditProfileHeader />
                <EditProfileForm />
            </div>
            
        </>
        
    );
}

export default ProfilePage;