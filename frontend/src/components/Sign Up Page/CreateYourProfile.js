import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { VectorIllustration } from "./VectorIllustration";
import { Avatar, Text, Loading } from '@nextui-org/react'
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import '../../style-sheets/CreateYourProfile.css'
import { createUsers } from "../../reducers/usersReducer";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import AvatarPicture from '../../images/AvatarPicture.png'
import DescriptionIcon from '@mui/icons-material/Description';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import userInformation from "../../services/userInformation";
import { useState } from "react";

const CreateYourProfile = () => {
  const [loading, setLoading] = useState(false)
  const state = useSelector(state => state)
  const dispatch = useDispatch()
  const animatedComponents = makeAnimated();
  console.log(state)

  const handleImageSubmit = async (e) => {
    setLoading(true)
    const formData = new FormData()
    formData.append('file', e.target.files[0]);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET)
    formData.append('api_key', process.env.REACT_APP_CLOUDINARY_APIKEY)
    const response = await axios.post(process.env.REACT_APP_CLOUDINARY_URL, formData).finally(() => {
      setLoading(false)
    })
    dispatch(createUsers(response.data.secure_url, 'profileImageURL'))
  }

  const handlePostUserToServer = async () => {
    const response = await userInformation.newUser(state.users)
    console.log(response)
  }

  const listOfAddictions = [{value: 'Alcohol', label: 'Alcohol'}, {value: 'Lust (Porn, sex, etc.)', label: 'Lust (Porn, sex, etc.)'}, {value:'Gambling', label: 'Gambling'}, {value: 'Food', label: 'Food'}, {value: 'Drugs', label: 'Drugs'}, {value: 'Nicotine', label: 'Nicotine'}, {value: 'Work', label: 'Work'}, {value: 'Pills', label: 'Pills'},
{value: 'Cocaine', label: 'Cocaine'}, {value: 'Crystal Meth', label: 'Crystal Meth'}, {value: 'Emotions', label: 'Emotions'}, {value: 'Marijuana', label: 'Marijuana'}, {value: 'Narcotics', label: 'Narcotics'}]

  const listOfGroups = [{value: 'Alcoholics Anonymous', label: 'Alcoholics Anonymous'}, {value: 'Cocaine Anonymous', label: 'Cocaine Anonymous'}, {value: 'Crystal Meth Anonymous', label: 'Crystal Meth Anonymous'}, {value: 'Emotions Anonymous', label: 'Emotions Anonymous' },{value: 'Eating Disorder Anonymous', label: 'Eating Disorder Anonymous'}, {value: 'Food Addicts in Recovery Anonymous', label: 'Food Addicts in Recovery Anonymous'},
 {value: 'Food Addicts Anonymous', label: 'Food Addicts Anonymous'}, {value: 'Gamblers Anonymous', label: 'Gamblers Anonymous'}, {value: 'Heroin Anonymous', label: 'Heroin Anonymous'}, {value: 'Love Addicts Anonymous', label: 'Love Addicts Anonymous'}, {value: 'Marijuana Anonymous', label: 'Marijuana Anonymous'}, {value: 'Narcotics Anonymous', label: 'Narcotics Anonymous'}, {value: 'Neurotics Anonymous', label: 'Neurotics Anonymous'}, {value: 'Nicotine Anonymous', label: 'Nicotine Anonymous'},
 {value: 'Overeaters Anonymous', label: 'Overeaters Anonymous'}, {value: 'Pills Anonymous', label: 'Pills Anonymous'}, {value: 'Racists Anonymous', label: 'Racists Anonymous'}, {value: 'Sexaholics Anonymous', label: 'Sexaholics Anonymous'}, {value: 'Sex Addicts Anonymous', label: 'Sex Addicts Anonymous'}, {value: 'Sexual Compulsives Anonymous', label: 'Sexual Compulsives Anonymous'}, {value: 'Sex and Love Addicts Anonymous', label: 'Sex and Love Addicts Anonymous'}, {value: 'Sexual Recovery Anonymous', label: 'Sexual Recovery Anonymous'},
 {value: 'Workaholics Anonymous', label: 'Workaholics Anonymous'}, {value: 'Racists Anonymous', label: 'Racists Anonymous'}]

  return (
    <div className="create-profile-page-container">
      <VectorIllustration />
      <div className="create-profile-form-container">   
          <input
            accept="image/*"
            id="contained-button-file"
            type="file"
            hidden
            aria-disabled={true}
            onChange={handleImageSubmit}
          />
        <label htmlFor="contained-button-file">
          <IconButton style={{left: '40%', top: '10%'}} component='span'>
            {loading ? <Loading size="xl" style={{width: '132px', height: '132px'}}/> : state.users.profileImageURL ? <Avatar src={state.users.profileImageURL} text={state.users.name} style={{width: '132px', height: '132px'}}/> : <Avatar src={AvatarPicture} text={state.users.name} style={{width: '132px', height: '132px'}}/>}
          </IconButton>
          <Button component='span' startIcon={<AddAPhotoIcon />} size='medium' style={{position: 'absolute', left: '35%', top: '25%'}}>Upload Profile Picture</Button>
        </label>
        <TextField multiline rows={5} label='Briefly Describe Yourself' style={{position: 'absolute', top: '35%', left: '32%', width: '300px', backgroundColor: 'white'}} inputProps={{
          maxLength: 250
        }} InputProps={{
          endAdornment: (
            <InputAdornment>
              <DescriptionIcon color="primary"/>
            </InputAdornment>
          )
        }}  onChange={(e) => {
          dispatch(createUsers(e.target.value, 'biography'))
        }}/>
        <Text style={{position: 'absolute', top: '54.5%', left: '31%', fontFamily: 'cursive'}} b size={24}>What do you struggle with?</Text>
        <Select
          closeMenuOnScroll={false}
          components={animatedComponents}
          defaultValue=''
          isMulti
          options={listOfAddictions}
          closeMenuOnSelect={false}
          className='addiction-selector'
          onChange={(e) => {
            dispatch(createUsers(e.map(addiction => addiction?.value), 'addictions'))}}
        />
        <Text style={{position: 'absolute', top: '67%', left: '24%', fontFamily: 'cursive'}} b size={24}>Do you belong to any of these groups?</Text>
        <Select
          closeMenuOnScroll={false}
          components={animatedComponents}
          defaultValue=''
          isMulti
          options={listOfGroups}
          closeMenuOnSelect={false}
          className='group-selector'
          onChange={(e) => dispatch(createUsers(e.map(group => group?.value), 'groups'))}
        />
        <Button className="submit-button" sx={{ position: 'absolute', color: 'white', top: '90%' }} type='submit' onClick={handlePostUserToServer}>Submit</Button>
        </div>
    </div>
  )
}

export default CreateYourProfile;