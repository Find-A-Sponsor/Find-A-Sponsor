import { Avatar, Card, CardActions, CardContent, CardHeader, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import FavoriteBorderTwoToneIcon from '@mui/icons-material/FavoriteBorderTwoTone';
import ReplyTwoToneIcon from '@mui/icons-material/Reply';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import { useState, useEffect } from "react";
import commentInformation from "../../services/commentInformation";
import { resetState, storeComments } from "../../reducers/commentReducer";
import { resetState as resetPosts, storePostInformation } from "../../reducers/storePostReducer";
import HeartBrokenTwoToneIcon from "@mui/icons-material/HeartBrokenTwoTone";
import AddCommentTwoToneIcon from '@mui/icons-material/AddCommentTwoTone';
import postInformation from "../../services/postInformation";



const Comment = ({eachComment, savedUser, postInfo}) => {
  const [mouseOver, setMouseOver] = useState(false)
  const [open, setOpen] = useState(false)
  const state = useSelector(state => state)
  const eachUser = useSelector(state => state.users)
  const dispatch = useDispatch()
  const arrayOfUsers = Object.values(eachUser)

  const handleIncreasedLike = async () => {
    await commentInformation.configureComment(eachComment._id, savedUser, eachComment.likes, 'increase')
    const response = await commentInformation.getComments(savedUser)
    const storage = response.data
    const object = {
        storage
    }
    dispatch(storeComments(object))
  }

  const handleDecreasedLike = async () => {
    await commentInformation.configureComment(eachComment._id, savedUser, eachComment.likes, 'decrease')
    const response = await commentInformation.getComments(savedUser)
    const storage = response.data
    const object = {
        storage
    }
    dispatch(storeComments(object))
  }

  const handlePostingReply = async () => {

  }

  const handleDeleteOfComment = async (e, commentId) => {
    e.preventDefault()
    const shouldDelete = window.confirm('Are you sure you want to delete this comment?')
    if (shouldDelete) {
      await commentInformation.removeComment(commentId, savedUser)
      await postInformation.configurePost(postInfo._id, savedUser, postInfo.comments, 'decreaseCommentCount')
      dispatch(resetState(''))
      dispatch(resetPosts(''))
      const response = await commentInformation.getComments(savedUser)
      const storage = response.data
      const object = {
        storage
      }
      dispatch(storeComments(object))
      const posts = await postInformation.getPosts(savedUser.token)
      await posts.data.map((post, i) => {
      dispatch(storePostInformation(post, i))
      })
    }
  }
  
  
  return (
    <>
      <Card style={{margin: '10px'}}>
        <CardHeader
        avatar={
          <Avatar src={arrayOfUsers.filter(user => user._id === eachComment.owner)[0].profileImageURL}>
          </Avatar>
        }
        title={eachComment.date}
        />
        <CardContent>
          <Typography variant='body2' color='InfoText'>
            {eachComment.text}
          </Typography>
        </CardContent>
        <CardActions>
          {eachComment.likedBy.includes(state.storage.id) ? 
          <>
          <IconButton onClick={handleDecreasedLike} onMouseOver={() => setMouseOver(true)} onMouseLeave={() => setMouseOver(false)}> 
            {mouseOver ? 
            <HeartBrokenTwoToneIcon sx={{color: 'red'}}/>: <FavoriteTwoToneIcon sx={{color: 'red'}}/>}

          </IconButton>
          <p>{eachComment.likes}</p>
          </> : 
          <>
          <IconButton onClick={handleIncreasedLike}>
            <FavoriteBorderTwoToneIcon color="primary" />
          </IconButton>
          <p>{eachComment.likes}</p>
          </>
          }
          <IconButton onClick={() => setOpen(!open)}>
            <ReplyTwoToneIcon color="primary" />
          </IconButton>
          <IconButton>
            <EditTwoToneIcon color='primary' />
          </IconButton>
          <IconButton onClick={(e) => handleDeleteOfComment(e, eachComment._id)}>
            <DeleteTwoToneIcon sx={{color: 'red'}} />
          </IconButton>
        </CardActions>
      </Card>
      {open ? 
      <TextField inputProps={{maxLength: 500}} InputProps={{
        startAdornment: (
          <InputAdornment>
            <Avatar src={state.storage.profileImageURL}>
            </Avatar>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment onClick={handlePostingReply}>
            <AddCommentTwoToneIcon color='primary' />
          </InputAdornment>
        )
      }} multiline placeholder='Write your reply' sx={{width: '50%'}}/> : ''}
      </>
  )
}

export default Comment;