import { useEffect, useState } from "react";
import userInformation from "../../services/userInformation";
import { Link, useNavigate } from "react-router-dom";
import { createUsers, storeUser } from "../../reducers/usersReducer";

import VectorIllustration from "./VectorIllustration";
import AvatarPicture from '../../images/AvatarPicture.png'
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import { Avatar } from "@nextui-org/react";
import PageviewTwoToneIcon from '@mui/icons-material/PageviewTwoTone';
import GroupsTwoToneIcon from '@mui/icons-material/GroupsTwoTone';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';
import SettingsApplicationsTwoToneIcon from '@mui/icons-material/SettingsApplicationsTwoTone';
import { Button, InputLabel } from "@mui/material";
import { TextField } from "@mui/material";
import ImageTwoToneIcon from '@mui/icons-material/ImageTwoTone';
import VideocamTwoToneIcon from '@mui/icons-material/VideocamTwoTone';
import AttachFileTwoToneIcon from '@mui/icons-material/AttachFileTwoTone';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import { useDispatch, useSelector } from "react-redux";
import { storeUserInformation } from "../../reducers/storeInformationReducer";

const Home = () => {
  const state = useSelector(state => state.storage)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem('loggedAppUser'))
    console.log(user)
    async function findUserWithToken() {
      userInformation.setToken(user.token)
      const response = await userInformation.findUser(user.user.email)
      const arrayOfKeys = Object.keys(response.data.user)
      const arrayOfValues = Object.values(response.data.user)
      let i = 0
      arrayOfKeys.forEach(element => {
        dispatch(storeUserInformation(arrayOfValues[i], element))
        i++
      });
    }
    findUserWithToken()
}, [])

const handleNewPost = () => {

}

const handleFilePost = () => {

}


  return (
    <>
    <div style={{
      position: 'relative',
      width: '1920px',
      height: '1080px',
      background: '#F7F9FE'}}>
      <VectorIllustration />
      <h1 style={{position: 'absolute', width: '30%', height: '5%', left: '20%', top: '4%', fontFamily: 'Outfit', fontStyle: 'normal', fontWeight: '400', fontSize: '32px', lineHeight: '40px', color: '#000000'}}>Welcome {state.name}!</h1>
      <Link to='/home' style={{position: 'absolute', width: '10%', height: '6.5%', left: '2%', top: '20%', background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.47) 0%, rgba(255, 255, 255, 0) 93.56%)', textDecoration: 'none', color: '#FFFFFF', display: 'flex', textAlign: 'center', justifyContent: 'center', flexDirection: 'column'}}>Home</Link>
      <HomeTwoToneIcon style={{position: 'absolute', left: "3%", top: '21.5%', fontSize: '225%'}} color='primary' />
      <Avatar src={state.profileImageURL ? state.profileImageURL : AvatarPicture} style={{position: 'absolute', left: '83.5%', top: '11%', height: '132px', width: '132px'}}></Avatar>
      <Link to='/findasponsor' style={{position: 'absolute', width: '10%', height: '6.5%', left: '3.5%', top: '29%', textDecoration: 'none', color: '#FFFFFF', display: 'flex', textAlign: 'center', justifyContent: 'center', flexDirection: 'column'}}>Find A Sponsor</Link>
      <PageviewTwoToneIcon style={{position: 'absolute', left: "3%", top: '30.5%', fontSize: '225%', opacity: '0.7'}} />
      <Link to='/Groups' style={{position: 'absolute', width: '10%', height: '6.5%', left: '3.5%', top: '37%', textDecoration: 'none', color: '#FFFFFF', display: 'flex', textAlign: 'center', justifyContent: 'center', flexDirection: 'column'}}>Groups</Link>
      <GroupsTwoToneIcon style={{position: 'absolute', left: "3%", top: '38.6%', fontSize: '225%', opacity: '0.75'}}  />
      <Link to='/Messsages' style={{position: 'absolute', width: '10%', height: '6.5%', left: '3.5%', top: '45%', textDecoration: 'none', color: '#FFFFFF', display: 'flex', textAlign: 'center', justifyContent: 'center', flexDirection: 'column'}}>Messages</Link>
      <EmailTwoToneIcon style={{position: 'absolute', left: "3%", top: '46.5%', fontSize: '225%', opacity: '0.75'}} />
      <Link to='/Settings' style={{position: 'absolute', width: '10%', height: '6.5%', left: '3.5%', top: '54%', textDecoration: 'none', color: '#FFFFFF', display: 'flex', textAlign: 'center', justifyContent: 'center', flexDirection: 'column'}}>Settings</Link>
      <SettingsApplicationsTwoToneIcon style={{position: 'absolute', left: "3%", top: '55.5%', fontSize: '225%', opacity: '0.75'}} />
      <h1 style={{position: 'absolute', width: '201px', height: '76px', left: '4%', top: '68%', fontFamily: 'Outfit', fontStyle: 'normal', fontWeight: '500', fontSize: '26px', lineHeight: '38px', textAlign: 'center', color: '#1B1C1F', textDecoration: 'underline'}}>Go Local</h1>
      <p style={{position: 'absolute', width: '201px', height: '76px', left: '4%', top: '73%', fontFamily: 'Outfit', fontStyle: 'normal', fontWeight: '500', fontSize: '15px', textAlign: 'center', color: 'black'}}>Currently, you are viewing sponsors/ sponsees globally. Would you like to view only sponsors/sponsees in your country?</p>
      <Button style={{position: 'absolute', left: '4.5%', top: '85%', background: '#FFFFFF', borderRadius: '16px'}}>No</Button>
      <Button style={{position: 'absolute', left: '10.5%', top: '85%', background: '#FFFFFF', borderRadius: '16px'}} onClick={(e) => navigate('./Settings')}>Yes</Button>
      <h1 style={{position: 'absolute', top: '70%', left: '78%'}}>Trending Users</h1>
      <Link to='/home/:id' style={{position: 'absolute', top: '73.25%', left: '94%'}}>View all</Link>
      <p style={{position: 'absolute', top: '20%', left: '79%', fontFamily: 'Outfit', fontStyle: 'normal', fontWeight: '600', fontSize: '20px', lineHeight: '25px', textAlign: 'center'}}>{state.followers}</p>
      <p style={{position: 'absolute', top: '23%', left: '77.5%', fontFamily: 'Outfit', fontStyle: 'normal', fontWeight: '300', fontSize: '16px', lineHeight: '20px', textAlign: 'center', color: '#A2ADBC'}}>Followers</p>
      <p style={{position: 'absolute', top: '20%', left: '94.5%', fontFamily: 'Outfit', fontStyle: 'normal', fontWeight: '600', fontSize: '20px', lineHeight: '25px', textAlign: 'center'}}>{state.following}</p>
      <p style={{position: 'absolute', top: '23%', left: '93%', fontFamily: 'Outfit', fontStyle: 'normal', fontWeight: '300', fontSize: '16px', lineHeight: '20px', textAlign: 'center', color: '#A2ADBC'}}>Following</p>      
      <h1 style={{position: 'absolute', top: '28%', left: '83.6%', fontFamily: 'Outfit', fontStyle: 'normal', fontWeight: '500', fontSize: '20px', lineHeight: '25px', textAlign: 'center'}}>{state.name}</h1>
      <p style={{position: 'absolute', width: '360px', height: '54px', left: '77.6%', top: '33%', fontFamily: 'Outfit', fontStyle: 'normal', fontWeight: '300', fontSize: '14px', lineHeight: '18px', textAlign: 'center', color: '#6D7683'}}>{state.biography}</p>
      
      <form onSubmit={handleNewPost}>
      <TextField size="large" rows={5} inputProps={{maxLength: 500}} multiline style={{position: 'absolute', left: '77%', top: '38%', width: '20%'}} placeholder='How are you feeling?' />    
      <Button startIcon={<ImageTwoToneIcon />} variant="outlined" style={{position: 'absolute', left: '77%', top: '53%', background: 'rgba(255, 255, 255, 0.32)', border: '1px solid rgba(45, 135, 255, 0.3)', borderRadius: '16px'}}>Add Image</Button>
      <Button startIcon={<VideocamTwoToneIcon />} variant="outlined" style={{position: 'absolute', left: '85%', top: '53%', background: 'rgba(255, 255, 255, 0.32)', border: '1px solid rgba(45, 135, 255, 0.3)', borderRadius: '16px'}}>Add Video</Button>
      <Button startIcon={<AttachFileTwoToneIcon />} variant="outlined" style={{position: 'absolute', left: '93%', top: '53%', background: 'rgba(255, 255, 255, 0.32)', border: '1px solid rgba(45, 135, 255, 0.3)', borderRadius: '16px'}}>File</Button>      
      <Button type="submit" startIcon={<SendTwoToneIcon style={{fontSize: '175%'}} />} variant="outlined" style={{position: 'absolute', left: '77%', top: '58%', background: 'linear-gradient(180deg, #2D87FF 0%, #6099E5 100%)', borderRadius: '60px', color: 'white', width: '20.5%', height: '5%'}}>Post</Button>
      </form>
      </div>
    </>
  )
}

export default Home;