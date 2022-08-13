import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import userInformation from "../../services/userInformation";
import { Link, useNavigate } from "react-router-dom";
import ReactPlayer from 'react-player'
import { configureLikes } from "../../reducers/storePostReducer";

import VectorIllustration from "./VectorIllustration";
import AvatarPicture from '../../images/AvatarPicture.png'
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import { Avatar } from "@nextui-org/react";
import PageviewTwoToneIcon from '@mui/icons-material/PageviewTwoTone';
import GroupsTwoToneIcon from '@mui/icons-material/GroupsTwoTone';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';
import SettingsApplicationsTwoToneIcon from '@mui/icons-material/SettingsApplicationsTwoTone';
import { Dialog, Button, IconButton, ImageList, ImageListItem, InputAdornment, DialogTitle } from "@mui/material";
import { TextField, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { storeUserInformation } from "../../reducers/storeInformationReducer";
import { Loading } from '@nextui-org/react'
import '../../style-sheets/Home.css'
import FavoriteBorderTwoToneIcon from '@mui/icons-material/FavoriteBorderTwoTone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import MessageIcon from '@mui/icons-material/Message';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import InfiniteScroll from 'react-infinite-scroll-component'
import ViewProfileBox from "./ViewProfileBox";
import postInformation from "../../services/postInformation";

const Home = () => {
  const state = useSelector(state => state)
  const [savedUser, setSavedUser] = useState()
  const [like, setLike] = useState([])
  const [mouseOver, setMouseOver] = useState(false)
  const [replies, setReplies] = useState([])
  const [numberOfPosts, setNumberOfPosts] = useState(Array.from({ length: 5}))
  const [hasMore, setHasMore] = useState(true)
  const [open, setOpen] = useState(false)
  const [imageToView, setImageToView] = useState('')
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(state)


      useEffect(() => {
        const initializer = async () => {
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
      }
        initializer()
      }, [])

      useEffect(() => {
        setLike(numberOfPosts.map((post, i) => (like[i] === undefined ? false : like[i])))
        setReplies(numberOfPosts.map((post, i) => (replies[i] === undefined ? false : replies[i])))
      }, [numberOfPosts])

      const handleLike = useCallback(async (message, index) => { //I need to figure out why this function does not recognize state.posts[index]._id on the first iteration but it recognizes it on the second...
        const object = {
          index,
          message
        }
        if (message === 'increase') {
          setLike(like.map((val, i) => index === i ? !val : val));
          dispatch(configureLikes(object))
        } else if (message === 'decrease') {
          setLike(like.map((val, i) => index === i ? !val : val));
          dispatch(configureLikes(object))
        }

        await postInformation.configurePost(state.posts[index]._id, savedUser, state.posts[index].likes, message)
    }, [like])

    const handleReplies = (index) => {
      setReplies(replies.map((val, i) => index === i ? !val : val));
    }

    const handleOpen = (e) => {
      setOpen(true)
      setImageToView(e)
    }

    const handleClose = () => setOpen(false)
    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };


const fetchMoreData = () => {
    if ((Object.entries(state.posts)).length - numberOfPosts.length < 5) {
      setTimeout(() => {
        setNumberOfPosts(numberOfPosts.concat(Array.from({length: ((Object.entries(state.posts)).length - numberOfPosts)})))
      }, 1500)
      setHasMore(false)
      return;
    } else {
      setTimeout(() => {
        setNumberOfPosts(numberOfPosts.concat(Array.from({length: 5})))
      }, 1500)
    }
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

      <ViewProfileBox savedUser={savedUser} handleLike={handleLike}/>

      {(Object.values(state.posts)).length !== 0 ? 
      <InfiniteScroll height='100%' dataLength={numberOfPosts.length} next={fetchMoreData} hasMore={hasMore} loader={<Loading style={{position: 'absolute', left: '50%'}}/>}
       id='all-post-container' scrollThreshold={0.5} endMessage={<p style={{ textAlign: "center" }}>
       <b>That's all folks!</b>
     </p>}
       style={{position: 'absolute', top: '25%', left: '20%', backgroundColor: '#F7F9FE', height: '72%', width: "54%", borderRadius: '30px'}}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignContent="center"
        spacing={15}
      >
      {numberOfPosts.map((key, i) => {
      return (
        <Grid container item>
      <Grid item xs={12} container style={{backgroundColor: 'white', paddingTop: '20px'}}>
        {/* avatar, username, etc */}
        <Grid item xs={1} container style={{ justifyContent: "center" }}>
          <Avatar src={AvatarPicture} />
        </Grid>
        <Grid item container xs={11} style={{ gap: "10px" }}>
          <Grid item xs={11}>
            @{state.posts[i]?.username}
          </Grid>
          <Grid item xs={11}>
            {state.posts[i]?.location} {state.posts[i]?.date}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} className="indent2" style={{backgroundColor: 'white'}}>
        {/* post text */}
        <p
          className="Post"
          style={{
            padding: "1em",
            backgroundColor: "#FFFBEE",
            borderRadius: "20px",
            margin: '1%'
          }}
        >
          {state.posts[i]?.text}
        </p>
      </Grid>
      {state.posts[i].video && (
        <Grid item xs={12} className="indent2" style={{backgroundColor: 'white'}}>
          {/* post video */}
          <ReactPlayer url={state.posts[i].video} controls width='100%'/>
        </Grid>
      )}
      <Grid container wrap="nowrap">
      {state.posts[i].gif && (
        <Grid item xs={12} className="indent2" style={{backgroundColor: 'white'}}>
        {/* post gif */}
        <img src={state.posts[i].gif} style={{objectFit: 'contain'}} />
      </Grid>
      )}
      </Grid>
      <Grid container wrap="nowrap">
      {state.posts[i].images.length > 0 && (
        <Grid item xs={12} className="indent2" style={{backgroundColor: 'white'}}>
        {/* post image */}
        <ImageList sx={{overflowX: 'auto'}} rowHeight={200}>
        <ImageListItem sx={{display: 'flex', flexDirection: 'row'}}>
            {state.posts[i].images.map(image => {
              return (
                <img
                src={image}
                alt='title'
                loading='lazy'
                style={{paddingRight: '1em', objectFit: 'contain'}}
                onClick={(e) => handleOpen(e.target.src)}
                />
              )
            })}
            <Dialog
                  open={open}
                  onClose={handleClose}
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                  BackdropProps={{invisible: true}}
                >
                  <img
                    style={{ width: 'auto', height: '100%' }}
                    src={imageToView}
                    alt="image"
                  />
                </Dialog>
            </ImageListItem>
        </ImageList>
      </Grid>
      )}
      </Grid>
      <Grid item xs={12} className="indent2" style={{backgroundColor: 'white'}}>
        {/* icon bar */}
        <Grid container style={{ padding: 12, gap: 20 }}>
          <Grid item>
              {like[i]&& mouseOver ? (
                <IconButton
                onClick={() => handleLike('decrease', i)}
                onMouseLeave={() => setMouseOver(false)}
                onMouseOver={() => setMouseOver(true)}
              >
                <HeartBrokenIcon style={{ color: "red" }} />
                </IconButton>
              ) : like[i] ? (
                <IconButton
                  onMouseLeave={() => setMouseOver(false)}
                  onMouseOver={() => setMouseOver(true)}
                >
                <FavoriteIcon style={{ color: "red" }} />
                </IconButton>
              ) : (
                <IconButton onClick={() => handleLike('increase', i)}>
                <FavoriteBorderTwoToneIcon />
                </IconButton>
              )}
            {" "}
            {state.posts[i]?.likes}
          </Grid>
          <Grid item>
            <IconButton onClick={() => handleReplies(i)}>
              {replies[i] ? (
                <MessageIcon color="primary" />
              ) : (
                <MessageOutlinedIcon />
              )}
            </IconButton>{" "}
            {state.posts[i]?.comments}
          </Grid>
          <Grid item>
            <IconButton>
              <IosShareOutlinedIcon />
            </IconButton>{" "}
            {state.posts[i]?.shares}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} className="indent2" style={{backgroundColor: 'white', borderRadius: '16px'}}>
        {/* comment */}
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment>
                <Avatar src={state.storage.profileImageURL} style={{ marginRight: 12 }} />
              </InputAdornment>
            ),
            classes: {
              notchedOutline: "notched-outline-border-radius"
            },
            maxLength: 500
          }}
          maxRows={10}
          multiline
          placeholder="Write your comment"
          style={{ width: "100%" }}
        />
      </Grid>
    </Grid>
      )})}
      </Grid>
      </InfiniteScroll> : <div id='content-loader' style={{position: 'absolute', top: '25%', left: '20%', backgroundColor: '#F7F9FE', height: '72%', width: "54%", borderRadius: '30px'}}><Loading size='lg' style={{position: 'absolute', left: '50%', top: '50%'}}/></div>}
      </div>
    </>
  )
}

export default Home;