import { useState, Fragment } from 'react';
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import '../../style-sheets/LoginForm.css'
import VectorIllustration from './VectorIllustration';
import { TextField, InputAdornment, Button, IconButton, FormControl } from '@mui/material'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import EmailSharpIcon from '@mui/icons-material/EmailSharp';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const LoginForm = () => {
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [emailRecoveryLink, setEmailRecoveryLink] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleMouseDownPassword = () => setShowPassword(!showPassword)
  const handleEmailRecoveryLink = (e) => {
    e.preventDefault()
    setEmailSent(true)
    setTimeout(() => {
      setEmailSent(false)
    }, 5000)
  }


  return (
    <div className='log-in-page-container'>
      <VectorIllustration />
      <div className='log-in-page-form-container'>
        <h1 className='log-in-text'>Log in</h1>
        <form id='login-handler' onSubmit={(e) => e.preventDefault()}>
          <FormControl style={{position: 'absolute', top: '35%', left: '15%', width: '70%'}}>
        <TextField value={email} required={true} label='Email' InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <EmailSharpIcon color="primary"/>
              </InputAdornment>
            )
          }} onChange={(e) => setEmail(e.target.value)}/>
          </FormControl>
          <FormControl style={{position: 'absolute', top: '45%', left: '15%', width: '70%'}}>
          <TextField variant='outlined' type={showPassword ? "text" : "password"} value={password} required={true} label='Password' InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <IconButton
                aria-label='toggle password visibility'
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}>
                  {showPassword ? <Visibility color='primary' /> : <VisibilityOff color='primary' />}
                </IconButton>
              </InputAdornment>
            )
          }} onChange={(e) => setPassword(e.target.value)}/>
          </FormControl>
          </form>
          <Button form='login-handler' className='submit-button-log-in' sx={{ color: 'white' }} type="submit">Log in</Button>
          <Fragment>
            <Button onClick={handleOpen} style={{position: 'absolute', top: '50%', left: '65%'}}>Forgot Password?</Button>
            <Modal
            hideBackdrop
            open={open}
            onClose={handleClose}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
            >
            <Box sx={{ ...style, width: 600, height: '20%' }}>
            {emailSent ? <h3>If this email is registered, an email was just sent!</h3> : <h3>Please enter your email address associated with your account and we will email you a Reset Password link.</h3>}
            <TextField value={emailRecoveryLink} variant='outlined' style={{width: '100%'}} InputProps={{
              startAdornment: (
                <InputAdornment>
                  <EmailSharpIcon color='primary'/>
                </InputAdornment>
              )
            }} onChange={(e) => setEmailRecoveryLink(e.target.value)}/>
            <Button className='close-button-modal' sx={{color: 'white'}} onClick={handleClose}>Close</Button>
            <Button className='submit-button-send-email' sx={{color: 'white'}} onClick={handleEmailRecoveryLink} disabled={emailSent}>Send</Button>
            </Box>
            </Modal>
          </Fragment>
          <p className='no-account-text' style={{position: 'absolute', top: '60%', left: '41%', height: '20px', width: '225px'}}>Don't have an account?</p> <Link style={{position: 'absolute', top: '61.525%', left: '60%', color: '#398CF9'}} to='/signup'>Sign Up</Link>

      </div>
    </div>
  )
}

export default LoginForm;