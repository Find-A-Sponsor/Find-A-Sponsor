import axios from "axios";
import { useState, useRef, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import postInformation from "../../services/postInformation";
import { resetState, storePostInformation } from "../../reducers/storePostReducer";

import { Loading } from '@nextui-org/react'
import { TextField, Button } from "@mui/material";
import ImageTwoToneIcon from '@mui/icons-material/ImageTwoTone';
import VideocamTwoToneIcon from '@mui/icons-material/VideocamTwoTone';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import CheckBoxTwoToneIcon from '@mui/icons-material/CheckBoxTwoTone';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import { createPosts } from "../../reducers/postReducer";
import MovieFilterIcon from '@mui/icons-material/MovieFilter';

const ViewProfileBox = ({ savedUser, setNumberOfPosts, numberOfPosts }) => {
  const ref = useRef()
  const state = useSelector(state => state)
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState('')
  const [contentError, setContentError] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteItem, setDeleteItem] = useState(false)
  const [deleteVideo, setDeleteVideo] = useState(false)
  const [deleteGif, setDeleteGif] = useState(false)

  useEffect(() => {
    console.log('use effect')
    const grabPosts = async () => {
      const user = await JSON.parse(window.localStorage.getItem('loggedAppUser'))
      const posts = await postInformation.getPosts(user.token)
      dispatch(resetState(''))
      await posts.data.map((post, i) => {
      dispatch(storePostInformation(post, i))
      })
      setNumberOfPosts(numberOfPosts.concat(Array.from({length: 1})))
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
}

  const handleNewPost = async (e) => {
    e.preventDefault();
    const arrayOfKeys = Object.keys(state.newPost)
    for (let i = 0; i <= arrayOfKeys.length; i++) {
      if (arrayOfKeys[i] === 'images') {
        const arrayOfFiles = Object.keys(state.newPost.images)
        for (let j = 0; j < arrayOfFiles.length; j++) {
          try {
          const formData = new FormData()
          formData.append('file', state.newPost.images[j]);
          formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET)
          formData.append('api_key', process.env.REACT_APP_CLOUDINARY_APIKEY)
          const response = await axios.post(process.env.REACT_APP_CLOUDINARY_IMAGE_URL, formData).finally(el => {
            setLoading(false)
        })
          ref.current = {'images': ref.current?.images ? ref.current.images.concat(response.data.secure_url) : [].concat(response.data.secure_url)}
      } catch (err) {
            setErrorMessage(err.message)
        }
      }} else if ((arrayOfKeys[i] === 'video' && state.newPost[arrayOfKeys[i]].size < 104857600)) {
          await uploadToServer(process.env.REACT_APP_CLOUDINARY_VIDEO_URL, arrayOfKeys, i)
      } else if ((arrayOfKeys[i] === 'gif' && state.newPost[arrayOfKeys[i]].size < 10485760)) {
        await uploadToServer(process.env.REACT_APP_CLOUDINARY_IMAGE_URL, arrayOfKeys, i)
      } else if (arrayOfKeys[i] !== 'text' && state.newPost[arrayOfKeys[i]]){
        setErrorMessage('Video files must be 100MB or less, images and gifs must be 10MB or less.')
        setContentError(arrayOfKeys[i])
        setTimeout(() => {
          setErrorMessage('')
          setContentError('')
        }, 5000)
      }
    }
    ref.current = {...ref.current, 'text': state.newPost.text}
    await postInformation.makeAPost(ref.current, savedUser)
    arrayOfKeys.forEach((key) => {
      dispatch(createPosts('', key))
    })
    setLoading(false)
    ref.current = ''
  }


  return (
  <form onSubmit={handleNewPost}>
        {contentError ? <TextField disabled size="large" rows={5} inputProps={{maxLength: 500}} multiline style={{position: 'absolute', left: '77%', top: '38%', width: '20%', color: 'red'}} value='' placeholder={errorMessage}/> : <TextField required size="large" rows={5} inputProps={{maxLength: 500}} multiline style={{position: 'absolute', left: '77%', top: '38%', width: '20%'}} placeholder='How are you feeling?' defaultValue='' disabled={loading} onBlur={(e) => dispatch(createPosts(e.target.value, 'text'))} />}
        

        {/* Add the ability to disable all buttons while loading is taking place, right now they still display while loading */}
        
        {state.newPost.images ? <Button onMouseOver={() => setDeleteItem(true)} onMouseLeave={() => setDeleteItem(false)} onClick={(e) => {
          e.preventDefault();
          dispatch(createPosts('', 'images'))
        }} startIcon={deleteItem ? <DeleteForeverTwoToneIcon /> : <CheckBoxTwoToneIcon />} disabled={loading || errorMessage || state.newPost.video || state.newPost.gif} variant='contained' color={deleteItem ? "error" : "success"} style={{position: 'absolute', left: '78%', top: '53%', borderRadius: '16px'}}>{state.newPost.images.length} Image/s</Button> : <Button startIcon={contentError === 'images' ? <ImageTwoToneIcon style={{color: 'red'}}/> : <ImageTwoToneIcon />} variant="outlined" style={{position: 'absolute', left: '77%', top: '53%', background: 'rgba(255, 255, 255, 0.32)', border: '1px solid rgba(45, 135, 255, 0.3)', borderRadius: '16px', color: contentError === 'images' ? 'red' : '', borderColor: contentError === 'images' ? 'red' : ''}} disabled={loading || errorMessage || state.newPost.video || state.newPost.gif} component='label'>Add Image <input multiple style={{pointerEvents: 'none'}} accept="image/*" type='file' hidden onChange={(e) => {
          setDeleteItem(false)
          const arrayOfImages = e.target.files
          dispatch(createPosts(arrayOfImages, 'images'))
        }}/></Button>}


        {state.newPost.video ? <Button onMouseLeave={() => setDeleteVideo(false)} onMouseOver={() => setDeleteVideo(true)} onClick={(e) => {
          e.preventDefault();
          dispatch(createPosts('', 'video'))
        }} startIcon={deleteVideo ? <DeleteForeverTwoToneIcon /> : <CheckBoxTwoToneIcon />} disabled={loading || errorMessage || state.newPost.images || state.newPost.gif} variant='contained' color={deleteVideo ? "error" : "success"} style={{position: 'absolute', left: '85%', top: '53%', borderRadius: '16px'}}>1 Video</Button> : <Button startIcon={contentError === 'video' ? <VideocamTwoToneIcon style={{color: 'red'}}/> : <VideocamTwoToneIcon />} variant="outlined" style={{position: 'absolute', left: '85%', top: '53%', background: 'rgba(255, 255, 255, 0.32)', border: '1px solid rgba(45, 135, 255, 0.3)', borderRadius: '16px', color: contentError === 'video' ? 'red' : '', borderColor: contentError === 'video' ? 'red' : ''}} disabled={loading || errorMessage || state.newPost.images || state.newPost.gif} component='label'>Add Video <input style={{pointerEvents: 'none'}} accept='video/*' type='file' hidden onChange={(e) => {
          setDeleteVideo(false)
          dispatch(createPosts(e.target.files[0], 'video'))
        }}/></Button>}

        {state.newPost.gif ? <Button onMouseLeave={() => setDeleteGif(false)} onMouseOver={() => setDeleteGif(true)} onClick={(e) => {
          e.preventDefault();
          dispatch(createPosts('', 'gif'))
        }} startIcon={deleteGif ? <DeleteForeverTwoToneIcon /> : <CheckBoxTwoToneIcon />} disabled={loading || errorMessage || state.newPost.images || state.newPost.video} variant='contained' color={deleteGif ? "error" : "success"} style={{position: 'absolute', left: '92.5%', top: '53%', borderRadius: '16px'}}>1 GIF</Button> : <Button startIcon={contentError === 'gif' ? <MovieFilterIcon style={{color: 'red'}}/> : <MovieFilterIcon color="primary"/>} variant="outlined" style={{position: 'absolute', left: '93%', top: '53%', background: 'rgba(255, 255, 255, 0.32)', border: '1px solid rgba(45, 135, 255, 0.3)', borderRadius: '16px', color: contentError === 'gif' ? 'red' : '', borderColor: contentError === 'gif' ? 'red' : ''}} disabled={loading || errorMessage || state.newPost.images || state.newPost.video} component='label'>Gif <input accept='image/gif' type='file' hidden onChange={(e) => {
          setDeleteGif(false)
          dispatch(createPosts(e.target.files[0], 'gif'))
        }}/></Button>}


        {loading ? <Button disabled startIcon={<Loading style={{fontSize: '175%'}} color='white'/>} variant="outlined" style={{position: 'absolute', left: '77%', top: '58%', background: 'linear-gradient(180deg, #2D87FF 0%, #6099E5 100%)', borderRadius: '60px', color: 'white', width: '20.5%', height: '5%'}}>Loading</Button> : errorMessage ? <Button disabled startIcon={<ErrorTwoToneIcon color="white"/>} variant="outlined" style={{position: 'absolute', left: '77%', top: '58%', background: 'linear-gradient(180deg, #2D87FF 0%, #6099E5 100%)', borderRadius: '60px', color: 'white', width: '20.5%', height: '5%'}}>Error</Button> : <Button type="submit" startIcon={<SendTwoToneIcon style={{fontSize: '175%'}} />} variant="outlined" style={{position: 'absolute', left: '77%', top: '58%', background: 'linear-gradient(180deg, #2D87FF 0%, #6099E5 100%)', borderRadius: '60px', color: 'white', width: '20.5%', height: '5%'}}>Post</Button>}
        </form>
  )
}


export default ViewProfileBox;