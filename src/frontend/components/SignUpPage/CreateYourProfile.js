/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/react-in-jsx-scope */
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { useReward } from "react-rewards"
import { useNavigate } from "react-router"

import { Avatar, Text, Loading } from "@nextui-org/react"
import {
  Button,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material"
import "../../style-sheets/CreateYourProfile.css"
import AddAPhotoTwoToneIcon from "@mui/icons-material/AddAPhotoTwoTone"
import DescriptionTwoToneIcon from "@mui/icons-material/DescriptionTwoTone"
import Select from "react-select"
import makeAnimated from "react-select/animated"
import { useState } from "react"
import userInformation from "../../services/userInformation"
import AvatarPicture from "../../images/AvatarPicture.png"
import { createUsers, resetState } from "../../reducers/usersReducer"
import { VectorIllustration } from "./VectorIllustration"

function CreateYourProfile() {
  const { reward, isAnimating } = useReward("rewardId", "confetti")
  const [loading, setLoading] = useState(false)
  const state = useSelector((wholeState) => wholeState)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const animatedComponents = makeAnimated()

  const handleImageSubmit = async (e) => {
    setLoading(true)
    const formData = new FormData()
    formData.append("file", e.target.files[0])
    formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET)
    formData.append("api_key", process.env.REACT_APP_CLOUDINARY_APIKEY)
    const response = await axios
      .post(process.env.REACT_APP_CLOUDINARY_IMAGE_URL, formData)
      .finally(() => {
        setLoading(false)
      })
    dispatch(createUsers(response.data.secure_url, "profileImageURL"))
  }

  const handlePostUserToServer = async () => {
    const user = await userInformation.newUser(state.users)
    window.localStorage.setItem(
      "loggedAppUser",
      JSON.stringify(user.data) // Setting localStorage allows user to make posts on account later and the posts requests will be sent to different route and that route will contain a verify function to verify that the user is authenticated to make posts. This implementation will occur whenever I get the home page up and running and I can grab the token via a localstore.getItem()
    )
    dispatch(resetState())
    navigate("/home")
  }

  const listOfAddictions = [
    { value: "Alcohol", label: "Alcohol" },
    { value: "Lust (Porn, sex, etc.)", label: "Lust (Porn, sex, etc.)" },
    { value: "Gambling", label: "Gambling" },
    { value: "Food", label: "Food" },
    { value: "Drugs", label: "Drugs" },
    { value: "Nicotine", label: "Nicotine" },
    { value: "Work", label: "Work" },
    { value: "Pills", label: "Pills" },
    { value: "Cocaine", label: "Cocaine" },
    { value: "Crystal Meth", label: "Crystal Meth" },
    { value: "Emotions", label: "Emotions" },
    { value: "Marijuana", label: "Marijuana" },
    { value: "Narcotics", label: "Narcotics" },
  ]

  const listOfGroups = [
    { value: "Alcoholics Anonymous", label: "Alcoholics Anonymous" },
    { value: "Cocaine Anonymous", label: "Cocaine Anonymous" },
    { value: "Crystal Meth Anonymous", label: "Crystal Meth Anonymous" },
    { value: "Emotions Anonymous", label: "Emotions Anonymous" },
    { value: "Eating Disorder Anonymous", label: "Eating Disorder Anonymous" },
    {
      value: "Food Addicts in Recovery Anonymous",
      label: "Food Addicts in Recovery Anonymous",
    },
    { value: "Food Addicts Anonymous", label: "Food Addicts Anonymous" },
    { value: "Gamblers Anonymous", label: "Gamblers Anonymous" },
    { value: "Heroin Anonymous", label: "Heroin Anonymous" },
    { value: "Love Addicts Anonymous", label: "Love Addicts Anonymous" },
    { value: "Marijuana Anonymous", label: "Marijuana Anonymous" },
    { value: "Narcotics Anonymous", label: "Narcotics Anonymous" },
    { value: "Neurotics Anonymous", label: "Neurotics Anonymous" },
    { value: "Nicotine Anonymous", label: "Nicotine Anonymous" },
    { value: "Overeaters Anonymous", label: "Overeaters Anonymous" },
    { value: "Pills Anonymous", label: "Pills Anonymous" },
    { value: "Racists Anonymous", label: "Racists Anonymous" },
    { value: "Sexaholics Anonymous", label: "Sexaholics Anonymous" },
    { value: "Sex Addicts Anonymous", label: "Sex Addicts Anonymous" },
    {
      value: "Sexual Compulsives Anonymous",
      label: "Sexual Compulsives Anonymous",
    },
    {
      value: "Sex and Love Addicts Anonymous",
      label: "Sex and Love Addicts Anonymous",
    },
    { value: "Sexual Recovery Anonymous", label: "Sexual Recovery Anonymous" },
    { value: "Workaholics Anonymous", label: "Workaholics Anonymous" },
    { value: "Racists Anonymous", label: "Racists Anonymous" },
  ]

  return (
    <div className="create-profile-page-container">
      <VectorIllustration />
      <div className="create-profile-form-container">
        <input
          accept="image/*"
          id="contained-button-file"
          type="file"
          hidden
          onChange={handleImageSubmit}
        />
        <InputLabel
          htmlFor="contained-button-file"
          style={{ padding: "13.45%", pointerEvents: "none" }}
        >
          <IconButton
            style={{ left: "37%", top: "10%", pointerEvents: "auto" }}
            component="span"
          >
            {loading ? (
              <Loading size="xl" style={{ width: "132px", height: "132px" }} />
            ) : state.users.profileImageURL ? (
              <Avatar
                src={state.users.profileImageURL}
                text={state.users.name}
                style={{ width: "132px", height: "132px" }}
              />
            ) : (
              <Avatar
                src={AvatarPicture}
                text={state.users.name}
                style={{ width: "132px", height: "132px" }}
              />
            )}
          </IconButton>
          <Button
            component="span"
            startIcon={<AddAPhotoTwoToneIcon />}
            size="medium"
            style={{
              position: "absolute",
              left: "36%",
              top: "80%",
              pointerEvents: "auto",
            }}
          >
            Upload Profile Picture
          </Button>
        </InputLabel>
        <TextField
          multiline
          rows={5}
          label="Briefly Describe Yourself"
          style={{
            position: "absolute",
            top: "35%",
            left: "32%",
            width: "300px",
            backgroundColor: "white",
          }}
          inputProps={{
            maxLength: 250,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment>
                <DescriptionTwoToneIcon color="primary" />
              </InputAdornment>
            ),
          }}
          onChange={(e) => {
            dispatch(createUsers(e.target.value, "biography"))
          }}
        />
        <Text
          style={{
            position: "absolute",
            top: "54.5%",
            left: "31%",
            fontFamily: "cursive",
          }}
          b
          size={24}
        >
          What do you struggle with?
        </Text>
        <Select
          closeMenuOnScroll={false}
          components={animatedComponents}
          defaultValue=""
          isMulti
          options={listOfAddictions}
          closeMenuOnSelect={false}
          className="addiction-selector"
          onChange={(e) => {
            dispatch(
              createUsers(
                e.map((addiction) => addiction?.value),
                "addictions"
              )
            )
          }}
        />
        <Text
          style={{
            position: "absolute",
            top: "67%",
            left: "24%",
            fontFamily: "cursive",
          }}
          b
          size={24}
        >
          Do you belong to any of these groups?
        </Text>
        <Select
          closeMenuOnScroll={false}
          components={animatedComponents}
          defaultValue=""
          isMulti
          options={listOfGroups}
          closeMenuOnSelect={false}
          className="group-selector"
          onChange={(e) =>
            dispatch(
              createUsers(
                e.map((group) => group?.value),
                "groups"
              )
            )
          }
        />
        <Button
          id="rewardId"
          className="submit-button"
          sx={{ position: "absolute", color: "white", top: "90%" }}
          type="submit"
          onClick={(e) => {
            handlePostUserToServer(e)
            reward()
          }}
          disabled={loading ? true : !!isAnimating}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}

export default CreateYourProfile
