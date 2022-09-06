/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/react-in-jsx-scope */
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"
import { keyframes } from "@mui/system"

import "../../style-sheets/LoginForm.css"
import { TextField, InputAdornment, Button, IconButton } from "@mui/material"
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone"
import VisibilityOffTwoToneIcon from "@mui/icons-material/VisibilityOffTwoTone"
import EmailTwoToneIcon from "@mui/icons-material/EmailTwoTone"
import VectorIllustration from "./VectorIllustration"
import loginInformaion from "../../services/loginInformation"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
}

const shake = keyframes`
  0% { transform: translateX(0) }
  25% { transform: translateX(5px) }
  50% { transform: translateX(-5px) }
  75% { transform: translateX(5px) }
  100% { transform: translateX(0) }`

function LoginForm() {
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [emailRecoveryLink, setEmailRecoveryLink] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleMouseDownPassword = () => setShowPassword(!showPassword)
  const handleEmailRecoveryLink = (e) => {
    e.preventDefault()
    setEmailSent(true)
    setTimeout(() => {
      setEmailSent(false)
    }, 5000)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const object = {
      email,
      password,
    }
    try {
      const user = await loginInformaion.login(object)
      window.localStorage.setItem(
        "loggedAppUser",
        JSON.stringify(user.data) // Setting localStorage allows user to make posts on account later and the posts requests will be sent to different route and that route will contain a verify function to verify that the user is authenticated to make posts. This implementation will occur whenever I get the home page up and running and I can grab the token via a localstore.getItem()
      )
      if (user) {
        navigate("/home")
      }
    } catch (err) {
      setErrorMessage(err.response.data.error)
      setTimeout(() => {
        setErrorMessage("")
      }, 3000)
    }
  }

  return (
    <div className="log-in-page-container">
      <VectorIllustration />
      <div className="log-in-page-form-container">
        <h1 className="log-in-text">Log in</h1>
        {errorMessage ? (
          <p
            style={{
              position: "absolute",
              top: "30%",
              left: "35%",
              color: "red",
            }}
          >
            {errorMessage}
          </p>
        ) : (
          ""
        )}
        <form id="login-handler" onSubmit={handleLogin}>
          <TextField
            sx={
              errorMessage
                ? {
                    position: "absolute",
                    top: "35%",
                    left: "15%",
                    width: "70%",
                    animation: `${shake} 0.1s`,
                    animationIterationCount: "4",
                  }
                : {
                    position: "absolute",
                    top: "35%",
                    left: "15%",
                    width: "70%",
                  }
            }
            value={email}
            required
            label="Email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {errorMessage ? (
                    <EmailTwoToneIcon style={{ color: "red" }} />
                  ) : (
                    <EmailTwoToneIcon color="primary" />
                  )}
                </InputAdornment>
              ),
              classes: {
                notchedOutline: errorMessage
                  ? "users-username-input-warning-message"
                  : "",
              },
            }}
            InputLabelProps={{
              style: errorMessage ? { color: "red" } : {},
            }}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            sx={
              errorMessage
                ? {
                    position: "absolute",
                    top: "45%",
                    left: "15%",
                    width: "70%",
                    animation: `${shake} 0.1s`,
                    animationIterationCount: "4",
                  }
                : {
                    position: "absolute",
                    top: "45%",
                    left: "15%",
                    width: "70%",
                  }
            }
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={password}
            required
            label="Password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword && errorMessage ? (
                      <VisibilityTwoToneIcon style={{ color: "red" }} />
                    ) : !showPassword && !errorMessage ? (
                      <VisibilityOffTwoToneIcon color="primary" />
                    ) : errorMessage ? (
                      <VisibilityOffTwoToneIcon style={{ color: "red" }} />
                    ) : (
                      <VisibilityTwoToneIcon color="primary" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
              classes: {
                notchedOutline: errorMessage
                  ? "users-username-input-warning-message"
                  : "",
              },
            }}
            InputLabelProps={{
              style: errorMessage ? { color: "red" } : {},
            }}
            onChange={(e) => setPassword(e.target.value)}
          />
        </form>
        <Button
          form="login-handler"
          className="submit-button-log-in"
          sx={{ color: "white" }}
          type="submit"
          disabled={errorMessage}
        >
          Log in
        </Button>
        <Button
          onClick={handleOpen}
          style={{ position: "absolute", top: "50%", left: "65%" }}
        >
          Forgot Password?
        </Button>
        <Modal
          hideBackdrop
          open={open}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style, width: 600, height: "20%" }}>
            {emailSent ? (
              <h3>If this email is registered, an email was just sent!</h3>
            ) : (
              <h3>
                Please enter your email address associated with your account and
                we will email you a Reset Password link.
              </h3>
            )}
            <TextField
              value={emailRecoveryLink}
              variant="outlined"
              style={{ width: "100%" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment>
                    <EmailTwoToneIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => setEmailRecoveryLink(e.target.value)}
            />
            <Button
              className="close-button-modal"
              sx={{ color: "white" }}
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              className="submit-button-send-email"
              sx={{ color: "white" }}
              onClick={handleEmailRecoveryLink}
              disabled={emailSent}
            >
              Send
            </Button>
          </Box>
        </Modal>
        <p
          className="no-account-text"
          style={{
            position: "absolute",
            top: "60%",
            left: "41%",
            height: "20px",
            width: "225px",
          }}
        >
          Don't have an account?
        </p>{" "}
        <Link
          style={{
            position: "absolute",
            top: "61.525%",
            left: "60%",
            color: "#398CF9",
          }}
          to="/signup"
        >
          Sign Up
        </Link>
      </div>
    </div>
  )
}

export default LoginForm
