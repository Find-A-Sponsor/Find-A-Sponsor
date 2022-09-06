/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { useMemo } from "react"
import { MenuItem, TextField, InputAdornment } from "@mui/material"
import countryList from "react-select-country-list"
import AddLocationAltTwoToneIcon from "@mui/icons-material/AddLocationAltTwoTone"
import { useDispatch } from "react-redux"
import { createUsers } from "../../reducers/usersReducer"

function CountryOfOrigin({ state }) {
  const dispatch = useDispatch()
  const options = useMemo(() => countryList().getData(), [])

  const changeHandler = (e) => {
    e.preventDefault()
    dispatch(createUsers(e.target.value, "location"))
  }

  return (
    <TextField
      value={state.users?.location || ""}
      onChange={changeHandler}
      select
      className="users-location-input"
      required
      label="Location"
      InputProps={{
        // I will come back to this functionality to make the dropdown box smaller on the sign up page, it covers the whole screen and I do not want that.
        startAdornment: (
          <InputAdornment>
            <AddLocationAltTwoToneIcon color="primary" />
          </InputAdornment>
        ),
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.label}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}

export default CountryOfOrigin
