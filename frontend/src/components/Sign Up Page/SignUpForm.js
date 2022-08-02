import { useDispatch, useSelector } from 'react-redux'
import { createUsers } from "../../reducers/usersReducer";
import { useState } from 'react';
import userInformation from "../../services/userInformation";
import moment from 'moment'
import { Link, useNavigate } from 'react-router-dom'
import validator from 'validator'

import { VectorIllustration } from "./VectorIllustration"
import '../../style-sheets/SignUpForm.css'
import CountryOfOrigin from "./CountryOfOrigin";

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { Button, InputAdornment, TextField } from '@mui/material';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import AlternateEmailSharpIcon from '@mui/icons-material/AlternateEmailSharp';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';
import Dangerous from "@mui/icons-material/Dangerous";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import { IconButton } from '@mui/material';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';



const SignUpForm = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const navigate = useNavigate()

  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleMouseDownPassword = () => setShowPassword(!showPassword)

  const handleClickShowPassword2 = () => setShowPassword2(!showPassword2)
  const handleMouseDownPassword2 = () => setShowPassword2(!showPassword2)

  const handleUsernameCheck = async (e) => {
    dispatch(createUsers(e.target.value, 'username'))
    const checkIfUserExists = await userInformation.newUser(e.target.value, 'username')
    if (checkIfUserExists === 'Username is already taken') {
      dispatch(createUsers(true, 'usernameExists'))
    } else {
      dispatch(createUsers(false, 'usernameExists'))
    }
  }

  const handleEmailCheck = async (e) => {
    dispatch(createUsers(e.target.value, 'email'))
    const checkIfEmailExists = await userInformation.newUser(e.target.value, 'email')
    if (checkIfEmailExists === 'Email is already in use') {
      dispatch(createUsers(true, 'emailExists'))
    } else {
      dispatch(createUsers(false, 'emailExists'))
    }
  }

  return (
    <div className="sign-up-page-container">
      <VectorIllustration />
      <div className="sign-up-form-container">
        <h1 className="sign-up-text">Sign Up</h1>
        <form id="signup-handler" onSubmit={() => navigate('/signup/1')}>

          {state.users.usernameExists ? <p className="users-username-input-warning-message">Username is already taken, please choose a different one</p> : ''}

          <TextField value={state.users?.username} required={true} className='users-username-input' label='Username' InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                {state.users.usernameExists ? <AlternateEmailSharpIcon sx={{color: 'red'}}/> : <AlternateEmailSharpIcon color="primary"/>}
              </InputAdornment>
            ),
            endAdornment: (
              state.users.usernameExists ? <Dangerous sx={{color: 'red'}} /> : ''
            ),
            classes: {
              notchedOutline: state.users.usernameExists ? 'users-username-input-warning-message' : ''
            }
          }} InputLabelProps={{
            style: state.users.usernameExists ? {color: 'red'} : {}
          }} onChange={handleUsernameCheck} />

          <TextField value={state.users?.name} className="users-name-input" required={true} label='Name' InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <AccountCircleTwoToneIcon color="primary"/>
              </InputAdornment>
            )
          }} onChange={(e) => dispatch(createUsers(e.target.value, 'name'))}/>

          {state.users.emailExists ? <p className="users-email-input-warning-message">Email is already in use, please enter a different one</p> : state.users.email && !validator.isEmail(state.users.email) ? <p className="users-email-input-valid-email-message">Please enter a valid email address</p> : ''}

          <TextField value={state.users?.email} className="users-email-input" required={true} label='Email' InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                {state.users.emailExists || (state.users.email && !validator.isEmail(state.users.email)) ? <EmailTwoToneIcon sx={{ color: 'red'}}/> : <EmailTwoToneIcon color="primary"/>}
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment>
                {state.users.emailExists || (state.users.email && !validator.isEmail(state.users.email))  ? <Dangerous sx={{ color: 'red' }}/> : ''}
              </InputAdornment>
            ),
            classes: {
              notchedOutline: state.users.emailExists ? 'users-email-input-warning-message' : state.users.email && !validator.isEmail(state.users?.email) ? 'users-email-input-valid-email-message' : ''
            }
          }} InputLabelProps={{
            style: state.users.emailExists || (state.users.email && !validator.isEmail(state.users.email)) ? {color: 'red'} : {}
          }} onChange={handleEmailCheck}/>

          <TextField type={showPassword ? "text" : "password"} value={state.users?.password} className="users-password-input" required={true} label='Password' InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <IconButton
                aria-label='toggle password visibility'
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}>
                  {showPassword ? <LockOpenTwoToneIcon color='primary' /> : !showPassword ? <LockTwoToneIcon color='primary' /> : <LockOpenTwoToneIcon color='primary' />}
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment>
                {state.users.password && state.users.password.length >= 12 ? <CheckCircleIcon color="success" /> : 'The password must be at least 12 characters long!'}
              </InputAdornment>
            )
          }} onChange={(e) => dispatch(createUsers(e.target.value, 'password'))}/>

          <TextField type={showPassword2 ? "text" : "password"} value={state.users?.confirmationPassword} className="users-confirmation-password-input" required={true} label='Confirm Password' InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <IconButton
                aria-label='toggle password visibility'
                onClick={handleClickShowPassword2}
                onMouseDown={handleMouseDownPassword2}>
                  {showPassword2 ? <LockOpenTwoToneIcon color='primary' /> : !showPassword2 ? <LockTwoToneIcon color='primary' /> : <LockOpenTwoToneIcon color='primary' />}
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {state.users.password === state.users.confirmationPassword && state.users.confirmationPassword?.length >= 12 ? <CheckCircleIcon color="success"/> : state.users.confirmationPassword ? <Dangerous sx={{ color: 'red' }}/> : ''}
              </InputAdornment>
            )
          }} onChange={(e) => dispatch(createUsers(e.target.value, 'confirmationPassword'))}/>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker minDate={moment('01/01/1900').toDate()} renderInput={(params) => <TextField required={true} {...params} className='users-date-of-birth-input' sx={{ svg: {color: '#1976d2'}}} onChange={(e) => {
              if (e.currentTarget.value.length === 10) {
              dispatch(createUsers((new Date(e.currentTarget.value)).toString(), 'dateOfBirth'))}}} value={state.users?.dateOfBirth} />} components={{
                OpenPickerIcon: CalendarMonthTwoToneIcon
              }} inputFormat='MM/dd/yyyy' value={state.users.dateOfBirth} onChange={(e) => {
                if (e?.getFullYear() >= 1900) {
                dispatch(createUsers(e.toString(), 'dateOfBirth'))}}} label='Date of birth' InputAdornmentProps={{ position: 'start' }} InputProps={{
              endAdornment: (
                <InputAdornment>
                  {state.users.dateOfBirth && (new Date(state.users.dateOfBirth)).getFullYear() + 18 > (new Date()).getFullYear() ? 'Must be 18 years or older to register' : ''}
                </InputAdornment>
              )
            }} />
          </LocalizationProvider>

          <CountryOfOrigin state={state}/>
          </form>
          <Button form='signup-handler' className="submit-button" sx={{ color: 'white' }} type="submit" disabled={state.users.password?.length >= 12 && state.users.usernameExists === false && state.users.emailExists === false && state.users.password === state.users.confirmationPassword && (new Date(state.users.dateOfBirth)).getFullYear() + 18 <= (new Date()).getFullYear() && (new Date(state.users.dateOfBirth)).getFullYear() >= 1900 && validator.isEmail(state.users.email) && state.users.location ? false : true} >Continue</Button>
          <p className="already-have-an-account-text">Already have an account? <Link className="bolded-log-in-link" to='/'>Log in</Link></p>
      </div>
    </div>
  )
}

export default SignUpForm;