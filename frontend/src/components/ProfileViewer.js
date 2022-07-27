import { useState } from 'react';
import '../style-sheets/ProfileViewer.css'

const ProfileViewer = () => {
  const [updateStatus, setUpdateStatus] = useState()
  return (
    <div className='profile-container'>
      <div className='profile-header'>
        <button className='profile-viewer-button'>View My Profile</button>
        <h1 className='profile-viewer-image'>image here</h1>
      </div>
      <h6 className='amount-of-followers'><b>1000</b></h6>
      <p className='followers-text'>Followers</p>
      <h6 className='amount-following'><b>500</b></h6>
      <p className='following-text'>Following</p>
      <h4 className='users-name'>USER</h4>
      <p className='users-bio'>DESCRIPTION/ BIO</p>
      <textarea className='users-update' placeholder='How are you feeling?' onChange={(e) => setUpdateStatus(e.target.value)}/>
      <button className='add-image-button'>Add image</button>
    </div>
  )
}

export default ProfileViewer;