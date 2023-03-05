/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
// import {
//   Avatar,
//   Card,
//   CardActions,
//   CardContent,
//   CardHeader,
//   IconButton,
//   InputAdornment,
//   TextField,
//   Typography,
//   Button,
//   Dialog,
// } from "@mui/material";
// import WarningTwoToneIcon from "@mui/icons-material/WarningTwoTone";
// import { useDispatch, useSelector } from "react-redux";
// import FavoriteBorderTwoToneIcon from "@mui/icons-material/FavoriteBorderTwoTone";
// import ReplyTwoToneIcon from "@mui/icons-material/Reply";
// import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
// import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
// import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
// import { useEffect, useState } from "react";
// import HeartBrokenTwoToneIcon from "@mui/icons-material/HeartBrokenTwoTone";
// import AddCommentTwoToneIcon from "@mui/icons-material/AddCommentTwoTone";
// import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
// import { CancelTwoTone } from "@mui/icons-material";
// import AddPhotoAlternateTwoToneIcon from "@mui/icons-material/AddPhotoAlternateTwoTone";
// import axios from "axios";
// import commentInformation from "../../services/commentInformation";
// import {
//   addImageOrGif,
//   changeCommentStatus,
//   deleteMedia,
//   resetState,
//   storeComments,
// } from "../../reducers/commentReducer";
// import {
//   storePostInformation,
//   resetState as resetPosts,
// } from "../../reducers/storePostReducer";
// import postInformation from "../../services/postInformation";
import {
  Card,
  CardHeader,
  Avatar,
  Modal,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  CardContent,
  CardMedia,
  Grid,
  TextField,
} from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import { styled } from "@mui/material/styles";

import "../../style-sheets/Comment.css";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sortBy } from "lodash";
import moment from "moment/moment";

import commentInformation from "../../services/commentInformation";
import { storeComments } from "../../reducers/commentReducer";
import LightboxGallery from "./LightboxGallery";

const CommentBoxContainer = styled(Grid)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  backgroundColor: "#f5f5f5",
  borderRadius: theme.spacing(1),
  "& .MuiAvatar-root": {
    marginRight: theme.spacing(2),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
  },
}));

const CommentTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    borderRadius: `${theme.spacing(1) / 16}em`,
    padding: `${theme.spacing(1.5) / 16}em ${theme.spacing(2) / 16}em`,
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.875em",
      padding: `${theme.spacing(1) / 16}em ${theme.spacing(1.5) / 16}em`,
    },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline::before": {
      borderBottom: "none",
    },
  },
}));

// eslint-disable-next-line no-unused-vars
function Comment({ eachComment, savedUser, postInfo, disableComment, i }) {
  const [showComments, setShowComments] = useState(false);
  const [replies, setReplies] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const publicOrPrivate = "Public";
  const dispatch = useDispatch();
  const state = useSelector((wholeState) => wholeState);
  const stateOfPosts = state.posts;
  const posts = stateOfPosts !== undefined && [
    ...new Set(sortBy(stateOfPosts, "date").reverse()),
  ];

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenModal(true);
  };
  // const [mouseOver, setMouseOver] = useState(false);
  // const [open, setOpen] = useState(false);
  // const [editCommentToggle, setEditCommentToggle] = useState(false);
  // const [valueOfTextField, setValueOfTextField] = useState();
  // const [viewOpen, setViewOpen] = useState(false);
  // // const [contentUrl, setContentUrl] = useState("");
  // const [addedMedia, setAddedMedia] = useState("");
  // const [errorMessage, setErrorMessage] = useState("");
  // const [replyText, setReplyText] = useState("");
  // const state = useSelector((wholeState) => wholeState);
  // const eachUser = state.users;
  // const dispatch = useDispatch();
  // // const arrayOfUsers = Object.values(eachUser);
  // // const positioning = eachComment.nestedPosition * 10;
  console.log(postInfo);
  console.log(eachComment);
  console.log(disableComment);
  console.log(i);

  // useEffect(() => {
  //   const getInitialComments = async () => {
  //     const comments = await commentInformation.getComments(savedUser);
  //     const storage = comments.data;
  //     const object = {
  //       storage,
  //     };
  //     dispatch(storeComments(object));
  //   };
  //   getInitialComments();
  // }, [editCommentToggle]);

  const handleDialogClose = async (event, reason) => {
    if (reason === "backdropClick") {
      setShowComments(false);
      setOpenDialog(false);
      setReplies((prevReplies) => ({ ...prevReplies, [i]: false }));
    }
  };

  const handleReplies = async (index) => {
    if (replies[index]) {
      // If replies are currently being shown, hide them and reset state
      setShowComments(false);
      setReplies((prevReplies) => ({
        ...prevReplies,
        [index]: false,
      }));
    } else {
      // Otherwise, show replies for the clicked post
      setShowComments(true);
      setReplies((prevReplies) => ({
        ...prevReplies,
        [index]: true,
      }));
    }
    setOpenDialog(true);
    const response = await commentInformation.getComments(savedUser);
    const storage = response.data;
    const object = {
      storage,
    };
    dispatch(storeComments(object));
  };

  // const handlePostingComment = async (e, postId, commentAmount) => {
  //   e.preventDefault();
  //   await commentInformation.postComment(comment, postId, savedUser, 1);
  //   await postInformation.configurePost(
  //     postId,
  //     savedUser,
  //     commentAmount,
  //     "increaseCommentCount"
  //   );
  //   const allPosts = await postInformation.getPosts(savedUser.token);
  //   const response = await commentInformation.getComments(savedUser);
  //   const storage = response.data;
  //   const object = {
  //     storage,
  //   };
  //   dispatch(resetState([]));
  //   // eslint-disable-next-line array-callback-return
  //   await allPosts.data.map((post, i) => {
  //     dispatch(storePostInformation(post, i));
  //   });
  //   dispatch(storeComments(object));
  //   setComment("");
  // };

  // const handleIncreasedLike = async () => {
  //   await commentInformation.configureComment(
  //     eachComment._id,
  //     savedUser,
  //     eachComment.likes,
  //     "increase"
  //   );
  //   const response = await commentInformation.getComments(savedUser);
  //   const storage = response.data;
  //   const object = {
  //     storage,
  //   };
  //   dispatch(storeComments(object));
  // };

  // const handleOpen = () => {
  //   setViewOpen(true);
  // };

  // const handleClose = () => setViewOpen(false);

  // const handleDecreasedLike = async () => {
  //   await commentInformation.configureComment(
  //     eachComment._id,
  //     savedUser,
  //     eachComment.likes,
  //     "decrease"
  //   );
  //   const response = await commentInformation.getComments(savedUser);
  //   const storage = response.data;
  //   const object = {
  //     storage,
  //   };
  //   dispatch(storeComments(object));
  // };

  // const handlePostingReply = async (e) => {
  //   e.preventDefault();
  //   await commentInformation.postComment(
  //     replyText,
  //     eachComment._id,
  //     savedUser,
  //     eachComment.nestedPosition + 1,
  //     postInfo._id
  //   );
  //   await postInformation.configurePost(
  //     postInfo._id,
  //     savedUser,
  //     postInfo.comments,
  //     "increaseCommentCount"
  //   );
  //   dispatch(resetState([]));
  //   const response = await commentInformation.getComments(savedUser);
  //   const storage = response.data;
  //   const object = {
  //     storage,
  //   };
  //   dispatch(storeComments(object));
  // };

  // const handleDeleteOfMedia = async (event, type) => {
  //   event.preventDefault();
  //   dispatch(deleteMedia(eachComment._id, type));
  //   await commentInformation.configureComment(
  //     eachComment._id,
  //     savedUser,
  //     type,
  //     "removeMedia"
  //   );
  // };

  // const handleDeleteOfComment = async (evt, commentId) => {
  //   evt.preventDefault();
  //   const shouldDelete = window.confirm(
  //     "Are you sure you want to delete this comment?"
  //   );
  //   if (shouldDelete) {
  //     await commentInformation.removeComment(commentId, savedUser);
  //     await postInformation.configurePost(
  //       postInfo._id,
  //       savedUser,
  //       postInfo.comments,
  //       "decreaseCommentCount"
  //     );
  //     dispatch(resetState([]));
  //     dispatch(resetPosts([]));
  //     const response = await commentInformation.getComments(savedUser);
  //     const storage = response.data;
  //     const object = {
  //       storage,
  //     };
  //     dispatch(storeComments(object));
  //     const posts = await postInformation.getPosts(savedUser.token);
  //     // eslint-disable-next-line array-callback-return
  //     await posts.data.map((post, i) => {
  //       dispatch(storePostInformation(post, i));
  //     });
  //   }
  // };

  // const handleEditingOfComment = async (buttonClick) => {
  //   buttonClick.preventDefault();
  //   // if (eachComment.images.length > 0) {
  //   //   setContentUrl(eachComment.images[0]);
  //   // } else {
  //   //   setContentUrl(eachComment.gif);
  //   // }
  //   // eslint-disable-next-line no-param-reassign
  //   disableComment.specificComment[index] = true;
  //   setValueOfTextField(eachComment.text);
  //   setEditCommentToggle(!editCommentToggle);
  // };

  return (
    <>
      {replies[i] ? (
        <IconButton onClick={() => handleReplies(i)}>
          <MessageIcon color="primary" />
        </IconButton>
      ) : (
        <IconButton onClick={() => handleReplies(i)}>
          <MessageOutlinedIcon color="primary" />
        </IconButton>
      )}{" "}
      {posts[i]?.comments}
      {showComments && replies[i] && (
        <Dialog
          open={openDialog}
          onClose={handleDialogClose}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DialogTitle
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            {`${postInfo.username}'s post`}
          </DialogTitle>
          <DialogContent>
            <Card style={{ width: "100%", height: "100%" }}>
              <CardHeader
                avatar={
                  <Avatar src={savedUser.user.profileImageURL.toString()} />
                }
                title={
                  <Typography
                    variant="subtitle1"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {`@${postInfo.username}\n`}
                    <span style={{ display: "flex", alignItems: "center" }}>
                      {moment(postInfo.date).format("MMMM Do YYYY [at] h:mm a")}
                      <span
                        style={{ marginLeft: "0.5em", marginRight: "0.5em" }}
                      >
                        {"\u2022"}
                      </span>
                      <span style={{ display: "flex", alignItems: "center" }}>
                        {publicOrPrivate === "Public" ? (
                          <PublicIcon fontSize="small" />
                        ) : (
                          <LockIcon fontSize="small" />
                        )}
                      </span>
                    </span>
                  </Typography>
                }
              />
              <CardContent>
                <Typography
                  style={{
                    fontSize: "1.2rem",
                    backgroundColor: "#FFFBEE",
                    marginBottom: "2rem",
                  }}
                >
                  {postInfo.text}
                </Typography>
                {postInfo.images.length > 0 ? (
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <img
                        src={postInfo.images[0]}
                        alt="post image"
                        onClick={() => handleImageClick(postInfo.images[0])}
                        onLoad={(e) => {
                          const { naturalHeight, naturalWidth } = e.target;
                          if (naturalHeight > naturalWidth) {
                            e.target.classList.add("portrait"); // adds the 'portrait' class if the image is taller than it is wide
                          } else {
                            e.target.classList.add("landscape"); // adds the 'landscape' class if the image is wider than it is tall
                          }
                        }}
                        style={{
                          cursor: "pointer",
                          maxWidth: "100%", // ensures the image doesn't exceed the width of its container
                          height: "auto", // allows the image to scale proportionally
                        }}
                      />
                    </Grid>
                  </Grid>
                ) : (
                  ""
                )}
                <Modal
                  open={openModal}
                  onClose={() => setOpenModal(false)}
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.85)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                  }}
                >
                  <DialogContent
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "0",
                    }}
                  >
                    {selectedImage != null && (
                      <LightboxGallery imageUrl={selectedImage} />
                    )}
                  </DialogContent>
                </Modal>

                {postInfo.gif && (
                  <img
                    src={postInfo.gif}
                    alt="gif"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                )}
                {postInfo.video && (
                  <CardMedia
                    component="video"
                    src={postInfo.video}
                    controls
                    autoPlay={false}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </DialogContent>
          <CommentBoxContainer container wrap="nowrap" alignItems="center">
            <Grid item>
              <Avatar
                src={savedUser.user.profileImageURL.toString()}
                alt="User Avatar"
              />
            </Grid>
            <Grid item xs>
              <CommentTextField
                id="outlined-multiline-static"
                label="Write your comment"
                multiline
                variant="outlined"
                fullWidth
              />
            </Grid>
          </CommentBoxContainer>
        </Dialog>
      )}
    </>
  );
}

export default Comment;
