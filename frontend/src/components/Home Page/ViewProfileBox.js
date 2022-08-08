import axios from "axios";
import { useState, useRef, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import postInformation from "../../services/postInformation";
import { storePostInformation } from "../../reducers/storePostReducer";

import { Loading } from '@nextui-org/react'
import { TextField, Button } from "@mui/material";
import ImageTwoToneIcon from '@mui/icons-material/ImageTwoTone';
import VideocamTwoToneIcon from '@mui/icons-material/VideocamTwoTone';
import AttachFileTwoToneIcon from '@mui/icons-material/AttachFileTwoTone';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import CheckBoxTwoToneIcon from '@mui/icons-material/CheckBoxTwoTone';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import { createPosts } from "../../reducers/postReducer";

const ViewProfileBox = ({ savedUser }) => {
  const ref = useRef()
  const state = useSelector(state => state)
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState('')
  const [contentError, setContentError] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteItem, setDeleteItem] = useState(false)
  const [deleteVideo, setDeleteVideo] = useState(false)
  const [deleteDocument, setDeleteDocument] = useState(false)
  const [textInput, setTextInput] = useState('')

  useEffect(() => {
    const grabPosts = async () => {
      const user = await JSON.parse(window.localStorage.getItem('loggedAppUser'))
      const posts = await postInformation.getPosts(user.token)
      await posts.data.map((post, i) => {
      dispatch(storePostInformation(post, i))
      })
    }
  grabPosts()
  }, [state.newPost.text])

  const uploadToServer = async (URL, arrayOfKeys, i) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', state.newPost[arrayOfKeys[i]]);
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET)
      formData.append('api_key', process.env.REACT_APP_CLOUDINARY_APIKEY)
      const response = await axios.post(URL, formData).finally(el => {
        setLoading(false)
      })
      ref.current = {...ref.current, [arrayOfKeys[i]]: response.data.secure_url}
    
  } catch (err) {
    setErrorMessage(err.message)
  }
  ref.current = {...ref.current, 'text': textInput}
    await postInformation.makeAPost(ref.current, savedUser)
    arrayOfKeys.forEach((key) => {
      dispatch(createPosts('', key))
    })
    setTextInput('')
    setLoading(false)
    ref.current = ''
}

  const handleNewPost = async (e) => {
    e.preventDefault();
    dispatch(createPosts(textInput, 'text'))
    const arrayOfKeys = Object.keys(state.newPost)
    for (let i = 0; i <= arrayOfKeys.length; i++) {
      if (arrayOfKeys[i] !== 'text' && ((arrayOfKeys[i] === 'image' && state.newPost[arrayOfKeys[i]].size < 10485760) || 
      (arrayOfKeys[i] === 'document' && state.newPost[arrayOfKeys[i]].size < 10485760))) {
        uploadToServer(process.env.REACT_APP_CLOUDINARY_IMAGE_URL, arrayOfKeys, i)
      } else if (arrayOfKeys[i] === 'video' && state.newPost[arrayOfKeys[i]].size < 104857600) {
          uploadToServer(process.env.REACT_APP_CLOUDINARY_VIDEO_URL, arrayOfKeys, i)
      } else if (arrayOfKeys[i] !== 'text' && state.newPost[arrayOfKeys[i]]){
        setErrorMessage('Video files must be 100MB or less, images and documents must be 10MB or less.')
        setContentError(arrayOfKeys[i])
        setTextInput('')
        dispatch(createPosts('', 'text'))
        setTimeout(() => {
          setErrorMessage('')
          setContentError('')
        }, 5000)
      }
      setTextInput('')
    }
  }


  return (
  <form onSubmit={handleNewPost}>
        {contentError ? <TextField disabled size="large" rows={5} inputProps={{maxLength: 500}} multiline style={{position: 'absolute', left: '77%', top: '38%', width: '20%', color: 'red'}} value={errorMessage} /> : <TextField required size="large" rows={5} inputProps={{maxLength: 500}} multiline style={{position: 'absolute', left: '77%', top: '38%', width: '20%'}} placeholder='How are you feeling?' value={textInput} disabled={loading} onChange={(e) => {
          setTextInput(e.target.value)
          }} />}  

        {/* Add the ability to disable all buttons while loading is taking place, right now they still display while loading */}
        
        {state.newPost.image ? <Button onMouseOver={() => setDeleteItem(true)} onMouseLeave={() => setDeleteItem(false)} onClick={(e) => {
          e.preventDefault();
          dispatch(createPosts('', 'image'))
        }} startIcon={deleteItem ? <DeleteForeverTwoToneIcon /> : <CheckBoxTwoToneIcon />} disabled={loading || errorMessage} variant='contained' color={deleteItem ? "error" : "success"} style={{position: 'absolute', left: '78%', top: '53%', borderRadius: '16px'}}>1 Image</Button> : <Button startIcon={contentError === 'image' ? <ImageTwoToneIcon style={{color: 'red'}}/> : <ImageTwoToneIcon />} variant="outlined" style={{position: 'absolute', left: '77%', top: '53%', background: 'rgba(255, 255, 255, 0.32)', border: '1px solid rgba(45, 135, 255, 0.3)', borderRadius: '16px', color: contentError === 'image' ? 'red' : '', borderColor: contentError === 'image' ? 'red' : ''}} disabled={loading || errorMessage} component='label'>Add Image <input style={{pointerEvents: 'none'}} accept="image/*" type='file' hidden onChange={(e) => {
          setDeleteItem(false)
          dispatch(createPosts(e.target.files[0], 'image'))
        }}/></Button>}


        {state.newPost.video ? <Button onMouseLeave={() => setDeleteVideo(false)} onMouseOver={() => setDeleteVideo(true)} onClick={(e) => {
          e.preventDefault();
          dispatch(createPosts('', 'video'))
        }} startIcon={deleteVideo ? <DeleteForeverTwoToneIcon /> : <CheckBoxTwoToneIcon />} disabled={loading || errorMessage} variant='contained' color={deleteVideo ? "error" : "success"} style={{position: 'absolute', left: '85%', top: '53%', borderRadius: '16px'}}>1 Video</Button> : <Button startIcon={contentError === 'video' ? <VideocamTwoToneIcon style={{color: 'red'}}/> : <VideocamTwoToneIcon />} variant="outlined" style={{position: 'absolute', left: '85%', top: '53%', background: 'rgba(255, 255, 255, 0.32)', border: '1px solid rgba(45, 135, 255, 0.3)', borderRadius: '16px', color: contentError === 'video' ? 'red' : '', borderColor: contentError === 'video' ? 'red' : ''}} disabled={loading || errorMessage} component='label'>Add Video <input style={{pointerEvents: 'none'}} accept='video/*' type='file' hidden onChange={(e) => {
          setDeleteVideo(false)
          dispatch(createPosts(e.target.files[0], 'video'))
        }}/></Button>}

        {state.newPost.document ? <Button onMouseLeave={() => setDeleteDocument(false)} onMouseOver={() => setDeleteDocument(true)} onClick={(e) => {
          e.preventDefault();
          dispatch(createPosts('', 'document'))
        }} startIcon={deleteDocument ? <DeleteForeverTwoToneIcon /> : <CheckBoxTwoToneIcon />} disabled={loading || errorMessage} variant='contained' color={deleteDocument ? "error" : "success"} style={{position: 'absolute', left: '92.5%', top: '53%', borderRadius: '16px'}}>1 File</Button> : <Button startIcon={contentError === 'document' ? <AttachFileTwoToneIcon style={{color: 'red'}}/> : <AttachFileTwoToneIcon />} variant="outlined" style={{position: 'absolute', left: '93%', top: '53%', background: 'rgba(255, 255, 255, 0.32)', border: '1px solid rgba(45, 135, 255, 0.3)', borderRadius: '16px', color: contentError === 'document' ? 'red' : '', borderColor: contentError === 'document' ? 'red' : ''}} disabled={loading || errorMessage} component='label'>File <input accept=".pdf" type='file' hidden onChange={(e) => {
          setDeleteDocument(false)
          dispatch(createPosts(e.target.files[0], 'document'))
        }}/></Button>}


        {loading ? <Button disabled startIcon={<Loading style={{fontSize: '175%'}} color='white'/>} variant="outlined" style={{position: 'absolute', left: '77%', top: '58%', background: 'linear-gradient(180deg, #2D87FF 0%, #6099E5 100%)', borderRadius: '60px', color: 'white', width: '20.5%', height: '5%'}}>Loading</Button> : errorMessage ? <Button disabled startIcon={<ErrorTwoToneIcon color="white"/>} variant="outlined" style={{position: 'absolute', left: '77%', top: '58%', background: 'linear-gradient(180deg, #2D87FF 0%, #6099E5 100%)', borderRadius: '60px', color: 'white', width: '20.5%', height: '5%'}}>Error</Button> : <Button type="submit" startIcon={<SendTwoToneIcon style={{fontSize: '175%'}} />} variant="outlined" style={{position: 'absolute', left: '77%', top: '58%', background: 'linear-gradient(180deg, #2D87FF 0%, #6099E5 100%)', borderRadius: '60px', color: 'white', width: '20.5%', height: '5%'}}>Post</Button>}
        </form>
  )
}


export default ViewProfileBox;