/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Button,
  Dialog,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import FavoriteBorderTwoToneIcon from "@mui/icons-material/FavoriteBorderTwoTone";
import ReplyTwoToneIcon from "@mui/icons-material/Reply";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import { useEffect, useState } from "react";
import HeartBrokenTwoToneIcon from "@mui/icons-material/HeartBrokenTwoTone";
import AddCommentTwoToneIcon from "@mui/icons-material/AddCommentTwoTone";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import { CancelTwoTone } from "@mui/icons-material";
import AddPhotoAlternateTwoToneIcon from "@mui/icons-material/AddPhotoAlternateTwoTone";
import axios from "axios";
import commentInformation from "../../services/commentInformation";
import {
  addImageOrGif,
  changeCommentStatus,
  deleteMedia,
  storeComments,
} from "../../reducers/commentReducer";
import { storePostInformation } from "../../reducers/storePostReducer";
import postInformation from "../../services/postInformation";

function Comment({ eachComment, savedUser, postInfo }) {
  const [mouseOver, setMouseOver] = useState(false);
  const [open, setOpen] = useState(false);
  const [editCommentToggle, setEditCommentToggle] = useState(false);
  const [valueOfTextField, setValueOfTextField] = useState();
  const [viewOpen, setViewOpen] = useState(false);
  const [contentUrl, setContentUrl] = useState("");
  const [addedMedia, setAddedMedia] = useState("");
  const state = useSelector((wholeState) => wholeState);
  const eachUser = state.users;
  const dispatch = useDispatch();
  const arrayOfUsers = Object.values(eachUser);

  useEffect(() => {
    const getInitialComments = async () => {
      const comments = await commentInformation.getComments(savedUser);
      const storage = comments.data;
      const object = {
        storage,
      };
      dispatch(storeComments(object));
    };
    getInitialComments();
  }, [editCommentToggle]);

  const handleIncreasedLike = async () => {
    await commentInformation.configureComment(
      eachComment._id,
      savedUser,
      eachComment.likes,
      "increase"
    );
    const response = await commentInformation.getComments(savedUser);
    const storage = response.data;
    const object = {
      storage,
    };
    dispatch(storeComments(object));
  };

  const handleOpen = () => {
    setViewOpen(true);
  };

  const handleClose = () => setViewOpen(false);

  const handleDecreasedLike = async () => {
    await commentInformation.configureComment(
      eachComment._id,
      savedUser,
      eachComment.likes,
      "decrease"
    );
    const response = await commentInformation.getComments(savedUser);
    const storage = response.data;
    const object = {
      storage,
    };
    dispatch(storeComments(object));
  };

  const handlePostingReply = async () => {};

  const handleDeleteOfMedia = async (event, type) => {
    event.preventDefault();
    dispatch(deleteMedia(eachComment._id, type));
    await commentInformation.configureComment(
      eachComment._id,
      savedUser,
      type,
      "removeMedia"
    );
  };

  const handleDeleteOfComment = async (evt, commentId) => {
    evt.preventDefault();
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (shouldDelete) {
      await commentInformation.removeComment(commentId, savedUser);
      await postInformation.configurePost(
        postInfo._id,
        savedUser,
        postInfo.comments,
        "decreaseCommentCount"
      );
      const response = await commentInformation.getComments(savedUser);
      const storage = response.data;
      const object = {
        storage,
      };
      dispatch(storeComments(object));
      const posts = await postInformation.getPosts(savedUser.token);
      // eslint-disable-next-line array-callback-return
      await posts.data.map((post, i) => {
        dispatch(storePostInformation(post, i));
      });
    }
  };

  const handleEditingOfComment = (buttonClick) => {
    buttonClick.preventDefault();
    if (eachComment.images.length > 0) {
      setContentUrl(eachComment.images[0]);
    } else {
      setContentUrl(eachComment.gif);
    }
    setValueOfTextField(eachComment.text);
    setEditCommentToggle(!editCommentToggle);
  };

  return editCommentToggle ? (
    <Card style={{ margin: "10px" }}>
      <CardHeader
        avatar={
          <Avatar
            src={
              arrayOfUsers.filter((user) => user._id === eachComment.owner)[0]
                .profileImageURL
            }
          />
        }
      />
      Edit your comment here, add a GIF or image with your reply as well if you
      so desire. (Text is required)
      <CardContent>
        {valueOfTextField ? (
          <>
            <IconButton
              onClick={async () => {
                if (addedMedia) {
                  await commentInformation.configureComment(
                    eachComment._id,
                    savedUser,
                    addedMedia.includes("gif") ? "gif" : "images",
                    "removeMedia"
                  );
                }
                await commentInformation.configureComment(
                  eachComment._id,
                  savedUser,
                  {
                    url: contentUrl,
                    type: eachComment.images.length > 0 ? "images" : "gif",
                  },
                  "addMedia"
                );
                setEditCommentToggle(!editCommentToggle);
              }}
            >
              <CancelTwoTone fontSize="large" sx={{ color: "red" }} />
            </IconButton>
            <IconButton
              onClick={async () => {
                await commentInformation.configureComment(
                  eachComment._id,
                  savedUser,
                  valueOfTextField,
                  "editComment"
                );
                dispatch(changeCommentStatus(eachComment._id, "edited"));

                setEditCommentToggle(!editCommentToggle);
              }}
            >
              <CheckCircleTwoToneIcon color="success" fontSize="large" />
            </IconButton>
            <br />
            <TextField
              value={valueOfTextField}
              onChange={(evnt) => setValueOfTextField(evnt.target.value)}
            />
            <br />
            {eachComment.images.length > 0 ? (
              <>
                <IconButton
                  onClick={(evt) => handleDeleteOfMedia(evt, "images")}
                >
                  <DeleteTwoToneIcon />
                </IconButton>
                <img
                  style={{
                    paddingRight: "1em",
                    objectFit: "contain",
                    margin: "10px",
                  }}
                  height="200"
                  alt="commentPicture"
                  src={eachComment.images[0]}
                />
              </>
            ) : eachComment.gif ? (
              <>
                <IconButton onClick={(evt) => handleDeleteOfMedia(evt, "gif")}>
                  <DeleteTwoToneIcon />
                </IconButton>
                <img
                  style={{
                    paddingRight: "1em",
                    objectFit: "contain",
                    margin: "10px",
                  }}
                  height="200"
                  alt="commentPicture"
                  src={eachComment.gif}
                />
              </>
            ) : (
              ""
            )}
            <br />
            {eachComment.images.length > 0 || eachComment.gif ? (
              ""
            ) : (
              <Button
                startIcon={<AddPhotoAlternateTwoToneIcon />}
                variant="outlined"
                sx={{ margin: "10px" }}
                component="label"
              >
                Add GIF/IMG
                <input
                  style={{ pointerEvents: "none" }}
                  accept="image/*"
                  type="file"
                  hidden
                  onChange={async (file) => {
                    const formData = new FormData();
                    formData.append("file", file.target.files[0]);
                    formData.append(
                      "upload_preset",
                      process.env.REACT_APP_CLOUDINARY_PRESET
                    );
                    formData.append(
                      "api_key",
                      process.env.REACT_APP_CLOUDINARY_APIKEY
                    );
                    let serverResponse;
                    if (
                      (file.target.files[0].type.indexOf("gif") > -1 ||
                        file.target.files[0].type.indexOf("image") > -1) &&
                      file.target.files[0].size < 10485760
                    ) {
                      // eslint-disable-next-line no-await-in-loop
                      serverResponse = await axios.post(
                        process.env.REACT_APP_CLOUDINARY_IMAGE_URL,
                        formData,
                        { withCredentials: false }
                      );
                      dispatch(
                        addImageOrGif(
                          eachComment._id,
                          serverResponse.data.secure_url,
                          file.target.files[0].type
                        )
                      );
                      await commentInformation.configureComment(
                        eachComment._id,
                        savedUser,
                        {
                          url: serverResponse.data.secure_url,
                          type: file.target.files[0].type,
                        },
                        "addMedia"
                      );
                    }
                    setAddedMedia(serverResponse.data.secure_url);
                  }}
                />
              </Button>
            )}
          </>
        ) : (
          <>
            <IconButton
              onClick={async () => {
                if (addedMedia) {
                  await commentInformation.configureComment(
                    eachComment._id,
                    savedUser,
                    addedMedia.includes("gif") ? "gif" : "images",
                    "removeMedia"
                  );
                }
                await commentInformation.configureComment(
                  eachComment._id,
                  savedUser,
                  {
                    url: contentUrl,
                    type: eachComment.images.length > 0 ? "images" : "gif",
                  },
                  "addMedia"
                );
                setEditCommentToggle(!editCommentToggle);
              }}
            >
              <CancelTwoTone fontSize="large" sx={{ color: "red" }} />
            </IconButton>
            <br />
            <TextField
              value={valueOfTextField}
              onChange={(value) => setValueOfTextField(value.target.value)}
            />
            <br />
            {eachComment.images.length > 0 ? (
              <>
                <IconButton
                  onClick={(evt) => handleDeleteOfMedia(evt, "images")}
                >
                  <DeleteTwoToneIcon />
                </IconButton>
                <img
                  style={{
                    paddingRight: "1em",
                    objectFit: "contain",
                    margin: "10px",
                  }}
                  height="200"
                  alt="commentPicture"
                  src={eachComment.images[0]}
                />
              </>
            ) : eachComment.gif ? (
              <>
                <IconButton onClick={(evt) => handleDeleteOfMedia(evt, "gif")}>
                  <DeleteTwoToneIcon />
                </IconButton>
                <img
                  style={{
                    paddingRight: "1em",
                    objectFit: "contain",
                    margin: "10px",
                  }}
                  height="200"
                  alt="commentPicture"
                  src={eachComment.gif}
                />
              </>
            ) : (
              ""
            )}
            <br />
            <Button
              startIcon={<AddPhotoAlternateTwoToneIcon />}
              variant="outlined"
              sx={{ margin: "10px" }}
              component="label"
            >
              Add GIF/IMG
              <input
                style={{ pointerEvents: "none" }}
                accept="image/*"
                type="file"
                hidden
                onChange={async (file) => {
                  const formData = new FormData();
                  formData.append("file", file.target.files[0]);
                  formData.append(
                    "upload_preset",
                    process.env.REACT_APP_CLOUDINARY_PRESET
                  );
                  formData.append(
                    "api_key",
                    process.env.REACT_APP_CLOUDINARY_APIKEY
                  );
                  let serverResponse;
                  if (
                    (file.target.files[0].type.indexOf("gif") > -1 ||
                      file.target.files[0].type.indexOf("image") > -1) &&
                    file.target.files[0].size < 10485760
                  ) {
                    // eslint-disable-next-line no-await-in-loop
                    serverResponse = await axios.post(
                      process.env.REACT_APP_CLOUDINARY_IMAGE_URL,
                      formData,
                      { withCredentials: false }
                    );
                    dispatch(
                      addImageOrGif(
                        eachComment._id,
                        serverResponse.data.secure_url,
                        file.target.files[0].type
                      )
                    );
                    await commentInformation.configureComment(
                      eachComment._id,
                      savedUser,
                      {
                        url: serverResponse.data.secure_url,
                        type: file.target.files[0].type,
                      },
                      "addMedia"
                    );
                  }
                  setAddedMedia(serverResponse.data.secure_url);
                }}
              />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  ) : (
    <>
      <Card style={{ margin: "10px" }}>
        <CardHeader
          avatar={
            <Avatar
              src={
                arrayOfUsers.filter((user) => user._id === eachComment.owner)[0]
                  .profileImageURL
              }
            />
          }
          title={
            eachComment.status === "edited"
              ? `${eachComment.date} (edited)`
              : eachComment.date
          }
        />
        <CardContent>
          <Typography variant="body2" color="InfoText">
            {eachComment.text}
          </Typography>
          {eachComment.images.length > 0 ? (
            <>
              {eachComment.images.map((image) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                <img
                  src={image}
                  alt="title"
                  loading="lazy"
                  style={{
                    paddingRight: "1em",
                    objectFit: "contain",
                    margin: "10px",
                  }}
                  onClick={handleOpen}
                  height="200"
                />
              ))}
              <Dialog
                open={viewOpen}
                onClose={handleClose}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
                BackdropProps={{ invisible: true }}
              >
                <img
                  style={{ width: "auto", height: "100%" }}
                  src={eachComment.images[0]}
                  alt="presentedImage"
                />
              </Dialog>
            </>
          ) : eachComment.gif ? (
            <>
              <img
                src={eachComment.gif}
                alt="title"
                loading="lazy"
                style={{
                  paddingRight: "1em",
                  objectFit: "contain",
                  margin: "10px",
                }}
                onClick={handleOpen}
                height="200"
              />

              <Dialog
                open={viewOpen}
                onClose={handleClose}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
                BackdropProps={{ invisible: true }}
              >
                <img
                  style={{ width: "auto", height: "100%" }}
                  src={eachComment.gif}
                  alt="presentedGif"
                />
              </Dialog>
            </>
          ) : (
            ""
          )}
        </CardContent>
        <CardActions>
          {eachComment.likedBy.includes(state.storage.id) ? (
            <>
              <IconButton
                onClick={handleDecreasedLike}
                onMouseOver={() => setMouseOver(true)}
                onMouseLeave={() => setMouseOver(false)}
              >
                {mouseOver ? (
                  <HeartBrokenTwoToneIcon sx={{ color: "red" }} />
                ) : (
                  <FavoriteTwoToneIcon sx={{ color: "red" }} />
                )}
              </IconButton>
              <p>{eachComment.likes}</p>
            </>
          ) : (
            <>
              <IconButton onClick={handleIncreasedLike}>
                <FavoriteBorderTwoToneIcon color="primary" />
              </IconButton>
              <p>{eachComment.likes}</p>
            </>
          )}
          <IconButton onClick={() => setOpen(!open)}>
            <ReplyTwoToneIcon color="primary" />
          </IconButton>
          <IconButton
            onClick={(buttonClick) =>
              handleEditingOfComment(buttonClick, eachComment._id)
            }
          >
            <EditTwoToneIcon color="primary" />
          </IconButton>
          <IconButton
            onClick={(buttonClick) =>
              handleDeleteOfComment(buttonClick, eachComment._id)
            }
          >
            <DeleteTwoToneIcon sx={{ color: "red" }} />
          </IconButton>
        </CardActions>
      </Card>
      {open ? (
        <TextField
          inputProps={{ maxLength: 500 }}
          InputProps={{
            startAdornment: (
              <InputAdornment>
                <Avatar src={state.storage.profileImageURL} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment onClick={handlePostingReply}>
                <AddCommentTwoToneIcon color="primary" />
              </InputAdornment>
            ),
          }}
          multiline
          placeholder="Write your reply"
          sx={{ width: "50%" }}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default Comment;
