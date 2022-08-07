import { useCallback, useEffect, useRef, useState } from "react";
import userInformation from "../../services/userInformation";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import VectorIllustration from "./VectorIllustration";
import AvatarPicture from '../../images/AvatarPicture.png'
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import { Avatar } from "@nextui-org/react";
import PageviewTwoToneIcon from '@mui/icons-material/PageviewTwoTone';
import GroupsTwoToneIcon from '@mui/icons-material/GroupsTwoTone';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';
import SettingsApplicationsTwoToneIcon from '@mui/icons-material/SettingsApplicationsTwoTone';
import { Button, IconButton, Input, InputAdornment } from "@mui/material";
import { TextField, Grid } from "@mui/material";
import ImageTwoToneIcon from '@mui/icons-material/ImageTwoTone';
import VideocamTwoToneIcon from '@mui/icons-material/VideocamTwoTone';
import AttachFileTwoToneIcon from '@mui/icons-material/AttachFileTwoTone';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import { useDispatch, useSelector } from "react-redux";
import { storeUserInformation } from "../../reducers/storeInformationReducer";
import { createPosts } from "../../reducers/postReducer";
import { Loading } from '@nextui-org/react'
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import CheckBoxTwoToneIcon from '@mui/icons-material/CheckBoxTwoTone';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import postInformation from "../../services/postInformation";
import '../../style-sheets/Home.css'
import FavoriteBorderTwoToneIcon from '@mui/icons-material/FavoriteBorderTwoTone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import MessageIcon from '@mui/icons-material/Message';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import { storePostInformation } from "../../reducers/storePostReducer";
import InfiniteScroll from 'react-infinite-scroll-component'

const Home = () => {
  const state = useSelector(state => state)
  const ref = useRef();
  const [savedUser, setSavedUser] = useState()
  const [errorMessage, setErrorMessage] = useState('')
  const [contentError, setContentError] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteItem, setDeleteItem] = useState(false)
  const [deleteVideo, setDeleteVideo] = useState(false)
  const [deleteDocument, setDeleteDocument] = useState(false)
  const [like, setLike] = useState(false)
  const [mouseOver, setMouseOver] = useState(false)
  const [reply, setReply] = useState(false)
  const [numberOfPosts, setNumberOfPosts] = useState(Array.from({ length: 5}))
  const [hasMore, setHasMore] = useState(true)
  const [arrayOfPosts, setArrayOfPosts] = useState()
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initializer = useCallback(async () => {
    const user = await JSON.parse(window.localStorage.getItem('loggedAppUser'))
    setSavedUser(user)
    userInformation.setToken(user.token)
    const response = await userInformation.findUser(user.user.email)
    const arrayOfKeys = Object.keys(response.data.user)
    const arrayOfValues = Object.values(response.data.user)
    let i = 0
    arrayOfKeys.forEach(element => {
      dispatch(storeUserInformation(arrayOfValues[i], element))
      i++
    });
    const posts = await postInformation.getPosts(user.token)
    await posts.data.map((post, i) => {
    dispatch(storePostInformation(post, i))
    })
  }, [])

      useEffect(() => {
        initializer()
      }, [initializer])

const handleNewPost = async (e) => {
  e.preventDefault();
  const arrayOfKeys = Object.keys(state.newPost)
  for (let i = 0; i <= arrayOfKeys.length; i++) {
    const formData = new FormData()
    if (arrayOfKeys[i] !== 'text' && ((arrayOfKeys[i] === 'image' && state.newPost[arrayOfKeys[i]].size < 10485760) || 
    (arrayOfKeys[i] === 'document' && state.newPost[arrayOfKeys[i]].size < 10485760))) {
      try {
        setLoading(true) 
        formData.append('file', state.newPost[arrayOfKeys[i]]);
        formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET)
        formData.append('api_key', process.env.REACT_APP_CLOUDINARY_APIKEY)
        const response = await axios.post(process.env.REACT_APP_CLOUDINARY_IMAGE_URL, formData).finally(el => {
          setLoading(false)
        })
        ref.current = await {...ref.current, [arrayOfKeys[i]]: response.data.secure_url}
      
    } catch (err) {
      setErrorMessage(err.message)
    }} else if (arrayOfKeys[i] === 'video' && state.newPost[arrayOfKeys[i]].size < 104857600) {
      try {
      setLoading(true)
      formData.append('file', state.newPost[arrayOfKeys[i]]);
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET)
      formData.append('api_key', process.env.REACT_APP_CLOUDINARY_APIKEY)
      const response = await axios.post(process.env.REACT_APP_CLOUDINARY_VIDEO_URL, formData).finally(el => {
        setLoading(false)
      })
      ref.current = {...ref.current, [arrayOfKeys[i]]: response.data.secure_url}
    } catch (err) {
      setErrorMessage(err.message)
    }
    } else if (arrayOfKeys[i] !== 'text' && state.newPost[arrayOfKeys[i]]){
      setErrorMessage('Video files must be 100MB or less, images and documents must be 10MB or less.')
      setContentError(arrayOfKeys[i])
      dispatch(createPosts('', 'text'))
      setTimeout(() => {
        setErrorMessage('')
        setContentError('')
      }, 5000)
    }
  }
  ref.current = await {...ref.current, 'text': state.newPost.text} //I need to figure out a way to make the text empty if the last else if statement is executed above
  await postInformation.makeAPost(ref.current, savedUser)
  arrayOfKeys.forEach((key) => {
    dispatch(createPosts('', key))
  })
  setLoading(false)
  ref.current = ''
  initializer()
  
}

const fetchMoreData = () => {
  console.log(arrayOfPosts.length)
  if (numberOfPosts.length >= arrayOfPosts.length) {
    setHasMore(false)
    return;
  }

  setTimeout(() => {
    setNumberOfPosts(numberOfPosts.concat(Array.from({length: 5})))
  }, 1500)
}


  return (
    <>
    <div style={{
      position: 'relative',
      width: '1920px',
      height: '1080px',
      background: '#F7F9FE'}}>
      <VectorIllustration />
      <h1 style={{position: 'absolute', width: '30%', height: '5%', left: '20%', top: '4%', fontFamily: 'Outfit', fontStyle: 'normal', fontWeight: '400', fontSize: '32px', lineHeight: '40px', color: '#000000'}}>Welcome {state.storage.name}!</h1>
      <Link to='/home' style={{position: 'absolute', width: '10%', height: '6.5%', left: '2%', top: '20%', background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.47) 0%, rgba(255, 255, 255, 0) 93.56%)', textDecoration: 'none', color: '#FFFFFF', display: 'flex', textAlign: 'center', justifyContent: 'center', flexDirection: 'column'}}>Home</Link>
      <HomeTwoToneIcon style={{position: 'absolute', left: "3%", top: '21.5%', fontSize: '225%'}} color='primary' />
      <Avatar src={state.storage.profileImageURL ? state.storage.profileImageURL : AvatarPicture} style={{position: 'absolute', left: '83.5%', top: '11%', height: '132px', width: '132px'}}></Avatar>
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
      <p style={{position: 'absolute', top: '20%', left: '79%', fontFamily: 'Outfit', fontStyle: 'normal', fontWeight: '600', fontSize: '20px', lineHeight: '25px', textAlign: 'center'}}>{state.storage.followers}</p>
      <p style={{position: 'absolute', top: '23%', left: '77.5%', fontFamily: 'Outfit', fontStyle: 'normal', fontWeight: '300', fontSize: '16px', lineHeight: '20px', textAlign: 'center', color: '#A2ADBC'}}>Followers</p>
      <p style={{position: 'absolute', top: '20%', left: '94.5%', fontFamily: 'Outfit', fontStyle: 'normal', fontWeight: '600', fontSize: '20px', lineHeight: '25px', textAlign: 'center'}}>{state.storage.following}</p>
      <p style={{position: 'absolute', top: '23%', left: '93%', fontFamily: 'Outfit', fontStyle: 'normal', fontWeight: '300', fontSize: '16px', lineHeight: '20px', textAlign: 'center', color: '#A2ADBC'}}>Following</p>      
      <h1 style={{position: 'absolute', top: '28%', left: '83.6%', fontFamily: 'Outfit', fontStyle: 'normal', fontWeight: '500', fontSize: '20px', lineHeight: '25px', textAlign: 'center'}}>{state.storage.name}</h1>
      <p style={{position: 'absolute', width: '360px', height: '54px', left: '77.6%', top: '33%', fontFamily: 'Outfit', fontStyle: 'normal', fontWeight: '300', fontSize: '14px', lineHeight: '18px', textAlign: 'center', color: '#6D7683'}}>{state.storage.biography}</p>
      
      <form onSubmit={handleNewPost}>
      {contentError ? <TextField disabled size="large" rows={5} inputProps={{maxLength: 500}} multiline style={{position: 'absolute', left: '77%', top: '38%', width: '20%', color: 'red'}} value={errorMessage} /> : <TextField required size="large" rows={5} inputProps={{maxLength: 500}} multiline style={{position: 'absolute', left: '77%', top: '38%', width: '20%'}} placeholder='How are you feeling?' value={state.newPost.text} disabled={loading} onChange={(e) => {
        dispatch(createPosts(e.target.value, 'text'))
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

      <InfiniteScroll height='100%' dataLength={numberOfPosts.length} next={fetchMoreData} hasMore={hasMore} loader={<Loading style={{position: 'absolute', left: '50%'}}/>}
       id='all-post-container' scrollThreshold={0.5} endMessage={<p style={{ textAlign: "center" }}>
       <b>That's all folks!</b>
     </p>}
       style={{position: 'absolute', top: '25%', left: '20%', backgroundColor: '#F7F9FE', height: '72%', width: "54%", borderRadius: '30px'}}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={45}
      >
      {numberOfPosts.map(key => {
      return (
        <Grid container item>
        <div id="post-container" style={{margin: '5%', position: 'absolute', width: '90%', height: '40%', backgroundColor: 'white', borderRadius: '30px', overflow: 'auto'}}>
          <Avatar src={<AvatarPicture/>} style={{position: 'absolute', left: '1%', top: '3%', height: '60px', width: '60px'}} size='lg'></Avatar>
          <p style={{position: 'absolute', left: '9%', top: '-5%', fontFamily: 'Outfit', fontStyle: 'normal', fontWeight: '500', fontSize: '20px', lineHeight: '25px', overflow: 'auto'}}>@{state.storage.username}</p>
          <p style={{position: 'absolute', left: '9%', top: '10%', fontFamily: 'Outfit', fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '20px', color: '#6D7683'}}>{state.storage.location}</p>
          <p style={{position: 'absolute', left: '20%', top: '10%', fontFamily: 'Outfit', fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '20px', color: '#2D87FF'}}>time</p>
          <div id="text-container" style={{position: 'absolute', top: '30%', left: '5%', backgroundColor: '#FFFBEE', height: '30%', width: '90%', borderRadius: '16px'}}></div>
          <TextField InputProps={{
            startAdornment: (
              <InputAdornment>
                <Avatar src={state.storage.profileImageURL} />
              </InputAdornment>
            ),
            classes: {
              notchedOutline: 'notched-outline-border-radius'
          }
          }} maxRows={10} inputProps={{maxLength: 500}} multiline style={{position: 'absolute', left: '5%', top: '78%', width: '90%', background: '#F8FAFF', border: '1px solid #D9E1F9', borderRadius: '16px'}} placeholder='Write your comment'></TextField>
          <IconButton onClick={() => setLike(!like)} style={{ position: 'absolute', top: '60%', left: '5%'}} onMouseLeave={() => setMouseOver(false)} onMouseOver={() => setMouseOver(true)}>{like && mouseOver ? <HeartBrokenIcon style={{color: 'red'}}/> : like ? <FavoriteIcon style={{color: 'red'}} /> : <FavoriteBorderTwoToneIcon /> }</IconButton>
          <p style={{position: 'absolute', top: '59%', left: '9%'}}>likes</p>
          <IconButton onClick={() => setReply(!reply)} style={{ position: 'absolute', top: '60%', left: '13%'}}>{reply ? <MessageIcon color="primary"/> : <MessageOutlinedIcon/>}</IconButton>
          <p style={{position: 'absolute', top: '59%', left: '17%'}}>replies</p>
          <IconButton style={{ position: 'absolute', top: '60%', left: '23%'}}><IosShareOutlinedIcon /></IconButton>
          <p style={{position: 'absolute', top: '59%', left: '27%'}}>shares</p>
        </div>
        </Grid>
      )})}
      </Grid>
      </InfiniteScroll>
      </div>
    </>
  )
}

export default Home;