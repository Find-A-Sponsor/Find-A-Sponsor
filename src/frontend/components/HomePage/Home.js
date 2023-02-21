/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/order */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useRef, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import _, { sortBy } from "lodash";
import axios from "axios";

import userInformation from "../../services/userInformation";
import commentInformation from "../../services/commentInformation";
import postInformation from "../../services/postInformation";

import { storeUserInformation } from "../../reducers/storeInformationReducer";
import { numberOfCommentsRemaining } from "../../reducers/numberOfCommentsRemainingReducer";
import { createUsers } from "../../reducers/usersReducer";
import { createComment, storeComments } from "../../reducers/commentReducer";
import {
  configureLikes,
  storePostInformation,
  resetState,
  addImages,
  eraseNewContent,
  editPost as editSpecificPost,
  addGif,
  addVideo,
  removeContent,
  keepOriginalImages,
} from "../../reducers/storePostReducer";

import HomeTwoToneIcon from "@mui/icons-material/HomeTwoTone";
import { Avatar, Loading } from "@nextui-org/react";
import PageviewTwoToneIcon from "@mui/icons-material/PageviewTwoTone";
import GroupsTwoToneIcon from "@mui/icons-material/GroupsTwoTone";
import EmailTwoToneIcon from "@mui/icons-material/EmailTwoTone";
import SettingsApplicationsTwoToneIcon from "@mui/icons-material/SettingsApplicationsTwoTone";
import {
  Dialog,
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  InputAdornment,
  Box,
  MenuItem,
  Menu,
  TextField,
  Grid,
} from "@mui/material";
import FavoriteBorderTwoToneIcon from "@mui/icons-material/FavoriteBorderTwoTone";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import MessageIcon from "@mui/icons-material/Message";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import InfiniteScroll from "react-infinite-scroll-component";
import AddCommentTwoToneIcon from "@mui/icons-material/AddCommentTwoTone";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteTwoTone from "@mui/icons-material/DeleteTwoTone";

import Comment from "./Comment";
import ViewProfileBox from "./ViewProfileBox";
import AvatarPicture from "../../images/AvatarPicture.png";
import VectorIllustration from "./VectorIllustration";
import "../../style-sheets/Home.css";

function Home() {
  const state = useSelector((wholeState) => wholeState);
  const stateOfPosts = state.posts;
  const stateOfComments = state.comments.storage;
  const comments =
    stateOfComments !== undefined && [...stateOfComments].reverse();
  const groupedComments = _.partition(comments, (o) => o.belongsToComment);
  while (groupedComments[0].length > 0) {
    groupedComments[0].map((nestedComment, index) => {
      let i = 0;
      groupedComments[1].map((uniqueComment) => {
        if (nestedComment.belongsToComment === uniqueComment._id) {
          groupedComments[1].splice(i + 1, 0, nestedComment);
          groupedComments[0].splice(index, 1);
        }
        i++;
      });
    });
  }
  groupedComments.splice(0, 1);
  console.log(groupedComments);
  const posts = stateOfPosts !== undefined && [
    ...new Set(sortBy(stateOfPosts, "date").reverse()),
  ];
  const [savedUser, setSavedUser] = useState();
  const [mouseOver, setMouseOver] = useState();
  const [replies, setReplies] = useState(false);
  const [numberOfPosts, setNumberOfPosts] = useState(Array.from({ length: 5 }));
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [open, setOpen] = useState(false);
  const [editToggle, setEditToggle] = useState(false);
  const [imageToView, setImageToView] = useState("");
  const [deleteVideo, setDeleteVideo] = useState(false);
  const [deleteGif, setDeleteGif] = useState(false);
  const [deleteImage, setDeleteImage] = useState(false);
  const [lengthOfImages, setLengthOfImages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [contentUrl, setContentUrl] = useState("");
  const [disableComment, setDisableComment] = useState({
    specificComment: [],
  });
  const ITEM_HEIGHT = 48;
  const options = ["Delete Post", "Edit Post", "Pin Post"];
  const [comment, setComment] = useState();
  const changesToggleRef = useRef();
  const filesRef = useRef();
  const indexRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [control, setControl] = useState({
    anchorEl: null,
    menus: [],
  });
  const [editPost, setEditPost] = useState({
    specificPost: [],
  });
  const [newText, setNewText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  let height = 0;
  console.log(posts);
  // Try to figure out why replies are not being posted and how to sort comments with their replies so they can displayed next to eachother.

  useEffect(() => {
    const initializer = async () => {
      const user = await JSON.parse(
        window.localStorage.getItem("loggedAppUser")
      );
      setSavedUser(user);
      userInformation.setToken(user.token);
      const response = await userInformation.findUser(user.user.email);
      const arrayOfKeys = Object.keys(response.data.user);
      const arrayOfValues = Object.values(response.data.user);
      let i = 0;
      arrayOfKeys.forEach((element) => {
        dispatch(storeUserInformation(arrayOfValues[i], element));
        // eslint-disable-next-line no-plusplus
        i++;
      });
      const response2 = await userInformation.getAll();
      // eslint-disable-next-line no-shadow, array-callback-return
      response2.data.users.map((eachUser, i) => {
        dispatch(createUsers(eachUser, i));
      });
      // eslint-disable-next-line no-shadow
      const comments = await commentInformation.getComments(user);
      const storage = comments.data;
      const object = {
        storage,
      };
      dispatch(storeComments(object));
      const menus = posts.map(() => false);
      setControl({ menus });
    };
    initializer();
  }, [changesToggleRef]);

  useEffect(() => {
    const specificPost = posts.map(() => false);
    setEditPost({ specificPost });
  }, [editToggle]);

  useEffect(() => {
    const initialComments = [];
    posts.forEach(() => initialComments.push(Array.from({ length: 10 })));
    dispatch(numberOfCommentsRemaining(initialComments, "initial"));
    const specificComment = posts.map(() => false);
    setDisableComment({ specificComment });
  }, [state.posts]);

  const configurePost = async (postId) => {
    if (changesToggleRef.current) {
      const specificPost = posts.filter((post) => post._id === postId);
      dispatch(editSpecificPost(newText, specificPost));
      await postInformation.configurePost(
        posts[indexRef.current]._id,
        savedUser,
        newText,
        "editText"
      );
      await postInformation.configurePost(
        posts[indexRef.current]._id,
        savedUser,
        posts[indexRef.current].images,
        "addImage"
      );
      await postInformation.configurePost(
        posts[indexRef.current]._id,
        savedUser,
        posts[indexRef.current].video,
        "addVideo"
      );
      await postInformation.configurePost(
        posts[indexRef.current]._id,
        savedUser,
        posts[indexRef.current].gif,
        "addGif"
      );
      // eslint-disable-next-line no-plusplus
      if (deleteVideo) {
        await postInformation.configurePost(
          posts[indexRef.current]._id,
          savedUser,
          posts[indexRef.current].video,
          "deleteVideo"
        );
        dispatch(removeContent(indexRef.current, "video"));
        setDeleteVideo(false);
      } else if (deleteGif) {
        await postInformation.configurePost(
          posts[indexRef.current]._id,
          savedUser,
          posts[indexRef.current].gif,
          "deleteGif"
        );
        dispatch(removeContent(indexRef.current, "gif"));
        setDeleteGif(false);
      } else if (deleteImage) {
        await postInformation.configurePost(
          posts[indexRef.current]._id,
          savedUser,
          posts[indexRef.current].images,
          "deleteImages"
        );
        dispatch(removeContent(indexRef.current, "images"));
        setDeleteImage(false);
      }
    } else {
      dispatch(eraseNewContent(indexRef.current, lengthOfImages));
      if (Array.isArray(contentUrl)) {
        dispatch(keepOriginalImages(indexRef.current, contentUrl));
      } else if (contentUrl.slice(-3) === "gif") {
        dispatch(addGif(indexRef.current, contentUrl, true));
      } else if (contentUrl.slice(-3) === "mp4") {
        dispatch(addVideo(indexRef.current, contentUrl, true));
      }
    }
    setNewText("");
    setContentUrl("");
    setEditToggle(!editToggle);
    setLengthOfImages(0);
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    // eslint-disable-next-line no-unused-vars
    let i = 0;
    let j = 0;
    let k = 0;
    acceptedFiles.forEach((file) => {
      if (file.type.includes("gif")) {
        i++;
      } else if (file.type.includes("image")) {
        j++;
      } else if (file.type.includes("video")) {
        k++;
      }
    });

    if ((i > 0 && (j > 0 || k > 0)) || (j > 0 && (i > 0 || k > 0))) {
      setErrorMessage(
        "You cannot mix media types, you can only upload one media type per post"
      );
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return;
    }

    i = 0;
    acceptedFiles.forEach((file) => {
      if (!file.type.includes("gif") && file.type.includes("image")) {
        // eslint-disable-next-line no-plusplus
        i++;
      }
    });
    setLengthOfImages(i);
    setDeleteGif(false);
    setDeleteImage(false);
    setDeleteVideo(false);
    setLoading(true);
    const arrayOfVideoFiles = acceptedFiles.filter(
      (file) => file.type.indexOf("video") > -1
    );
    const arrayOfGifFiles = acceptedFiles.filter(
      (file) => file.type.indexOf("gif") > -1
    );
    filesRef.current =
      arrayOfVideoFiles.length > 0
        ? [arrayOfVideoFiles[0]]
        : arrayOfGifFiles.length > 0
        ? [arrayOfGifFiles[0]]
        : acceptedFiles;

    for (const element of filesRef.current) {
      const formData = new FormData();
      formData.append("file", element);
      formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
      formData.append("api_key", process.env.REACT_APP_CLOUDINARY_APIKEY);
      let response;
      if (
        (element.type.indexOf("gif") > -1 ||
          element.type.indexOf("image") > -1) &&
        element.size < 10485760
      ) {
        // eslint-disable-next-line no-await-in-loop
        response = await axios.post(
          process.env.REACT_APP_CLOUDINARY_IMAGE_URL,
          formData,
          { withCredentials: false }
        );

        element.type.indexOf("gif") > -1
          ? dispatch(addGif(indexRef.current, response.data.secure_url, true))
          : element.type.indexOf("image") > -1
          ? dispatch(
              addImages(indexRef.current, response.data.secure_url, true)
            )
          : "";
      } else if (
        element.type.indexOf("video") > -1 &&
        element.size < 104857600
      ) {
        response = await axios.post(
          process.env.REACT_APP_CLOUDINARY_VIDEO_URL,
          formData,
          { withCredentials: false }
        );
        dispatch(addVideo(indexRef.current, response.data.secure_url, true));
      }
    }
    setLoading(false);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const fetchMoreComments = (i) => {
    if (posts[i].comments - state.commentsRemaining[i].length >= 10) {
      dispatch(
        numberOfCommentsRemaining(Array.from({ length: 10 }), "concat", i)
      );
    } else if (posts[i].comments - state.commentsRemaining[i].length > 0) {
      dispatch(
        numberOfCommentsRemaining(
          Array.from({
            length: posts[i].comments - state.commentsRemaining[i].length,
          }),
          "concat",
          i
        )
      );
    }
  };

  const handleMenuClick = (event, index) => {
    const { menus } = control;
    menus[index] = true;
    indexRef.current = index;
    setControl({
      anchorEl: event.currentTarget,
      menus,
    });
    if (posts[index].images.length > 0) {
      setContentUrl(posts[index].images);
    } else if (posts[index].gif) {
      setContentUrl(posts[index].gif);
    } else if (posts[index].video) {
      setContentUrl(posts[index].video);
    }
  };

  const handleLike = async (message, index) => {
    const currentId = state.storage.id;
    const object = {
      index,
      message,
      currentId,
    };
    dispatch(configureLikes(object));

    await postInformation.configurePost(
      // eslint-disable-next-line no-underscore-dangle
      posts[index]._id,
      savedUser,
      posts[index].likes,
      message
    );
  };

  const handleOpen = (e) => {
    setOpen(true);
    setImageToView(e);
  };

  const handleReplies = async (index) => {
    // eslint-disable-next-line no-shadow
    setReplies((replies) => ({
      ...replies,
      [index]: !replies[index],
    }));
    const response = await commentInformation.getComments(savedUser);
    const storage = response.data;
    const object = {
      storage,
    };
    dispatch(storeComments(object));
  };

  const handleClose = () => setOpen(false);

  const handleCancelEdit = async (postId) => {
    const cancelEdit = window.confirm(
      "If you exit now, any changes you have made to this post will be discarded?"
    );
    if (cancelEdit) {
      setNewText("");
      if (deleteGif) {
        const checker = await postInformation.getSpecficPost(postId, savedUser);
        if (checker.data.gif === contentUrl) {
          dispatch(addGif(indexRef.current, contentUrl, true));
        }
      } else if (deleteImage) {
        const checker = await postInformation.getSpecficPost(postId, savedUser);
        if (checker.data.images.includes(contentUrl[0])) {
          dispatch(addImages(indexRef.current, contentUrl, true));
        }
      } else if (deleteVideo) {
        const checker = await postInformation.getSpecficPost(postId, savedUser);
        if (checker.data.video === contentUrl) {
          dispatch(addVideo(indexRef.current, contentUrl, true));
        }
      }
      setDeleteVideo(false);
      setDeleteGif(false);
      setDeleteImage(false);
      setEditToggle(!editToggle);
      changesToggleRef.current = false;
      configurePost();
    }
  };

  const handlePostingComment = async (e, postId, commentAmount) => {
    e.preventDefault();
    await commentInformation.postComment(comment, postId, savedUser, 1);
    await postInformation.configurePost(
      postId,
      savedUser,
      commentAmount,
      "increaseCommentCount"
    );
    const allPosts = await postInformation.getPosts(savedUser.token);
    const response = await commentInformation.getComments(savedUser);
    const storage = response.data;
    const object = {
      storage,
    };
    dispatch(resetState([]));
    // eslint-disable-next-line array-callback-return
    await allPosts.data.map((post, i) => {
      dispatch(storePostInformation(post, i));
    });
    dispatch(storeComments(object));
    setComment("");
  };

  const handleDeleteOfPost = async (postId) => {
    // eslint-disable-next-line no-alert
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    let response;
    if (shouldDelete) {
      response = await postInformation.removePost(postId, savedUser);
    } else {
      return;
    }
    const allPosts = await postInformation.getPosts(savedUser.token);
    const uniquePosts = [...new Set(allPosts.data)].reverse();
    dispatch(resetState([]));
    uniquePosts.forEach((post, i) => {
      dispatch(storePostInformation(post, i));
    });
    state.comments.storage.map(async (eachComment) => {
      if (eachComment.belongsToPost === postId) {
        await commentInformation.removeComment(eachComment._id, savedUser);
      }
    });
    dispatch(createComment("", "newComment"));
    // eslint-disable-next-line consistent-return
    return response;
  };

  const handleEditOfPost = async (postId, index) => {
    editPost.specificPost[index] = true;
    setNewText(posts[index].text);
  };

  const handleMenuClose = (e, option, postId, index) => {
    e.preventDefault();
    const { menus } = control;
    menus[index] = false;
    setControl({
      anchorEl: null,
      menus,
    });
    if (option === "Delete Post") {
      handleDeleteOfPost(postId);
    } else if (option === "Edit Post") {
      handleEditOfPost(postId, index);
    }
  };

  const fetchMorePosts = () => {
    if (
      Object.entries(state.posts).length - numberOfPosts.length >= 5 ||
      numberOfPosts.length < 5
    ) {
      setTimeout(() => {
        setNumberOfPosts(numberOfPosts.concat(Array.from({ length: 5 })));
      }, 1500);
    } else if (
      Object.entries(state.posts).length - numberOfPosts.length < 5 &&
      Object.entries(state.posts).length - numberOfPosts.length > 0
    ) {
      setTimeout(() => {
        setNumberOfPosts(
          numberOfPosts.concat(
            Array.from({
              length: Object.entries(state.posts).length - numberOfPosts.length,
            })
          )
        );
      }, 1500);
    } else {
      setTimeout(() => {
        setNumberOfPosts(
          numberOfPosts.concat(
            Array.from({
              length: Object.entries(state.posts).length - numberOfPosts.length,
            })
          )
        );
      }, 1500);
      setHasMorePosts(false);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "1920px",
        height: "1080px",
        background: "#F7F9FE",
      }}
    >
      <VectorIllustration />
      <h1
        style={{
          position: "absolute",
          width: "30%",
          height: "5%",
          left: "20%",
          top: "4%",
          fontFamily: "Outfit",
          fontStyle: "normal",
          fontWeight: "400",
          fontSize: "32px",
          lineHeight: "40px",
          color: "#000000",
        }}
      >
        Welcome {state.storage.name}!
      </h1>
      <Link
        to="/home"
        style={{
          position: "absolute",
          width: "10%",
          height: "6.5%",
          left: "2%",
          top: "20%",
          background:
            "linear-gradient(90deg, rgba(255, 255, 255, 0.47) 0%, rgba(255, 255, 255, 0) 93.56%)",
          textDecoration: "none",
          color: "#FFFFFF",
          display: "flex",
          textAlign: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        Home
      </Link>
      <HomeTwoToneIcon
        style={{
          position: "absolute",
          left: "3%",
          top: "21.5%",
          fontSize: "225%",
        }}
        color="primary"
      />
      <Avatar
        src={
          state.storage.profileImageURL
            ? state.storage.profileImageURL
            : AvatarPicture
        }
        style={{
          position: "absolute",
          left: "83.5%",
          top: "11%",
          height: "132px",
          width: "132px",
        }}
      />
      <Link
        to="/findasponsor"
        style={{
          position: "absolute",
          width: "10%",
          height: "6.5%",
          left: "3.5%",
          top: "29%",
          textDecoration: "none",
          color: "#FFFFFF",
          display: "flex",
          textAlign: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        Find A Sponsor
      </Link>
      <PageviewTwoToneIcon
        style={{
          position: "absolute",
          left: "3%",
          top: "30.5%",
          fontSize: "225%",
          opacity: "0.7",
        }}
      />
      <Link
        to="/Groups"
        style={{
          position: "absolute",
          width: "10%",
          height: "6.5%",
          left: "3.5%",
          top: "37%",
          textDecoration: "none",
          color: "#FFFFFF",
          display: "flex",
          textAlign: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        Groups
      </Link>
      <GroupsTwoToneIcon
        style={{
          position: "absolute",
          left: "3%",
          top: "38.6%",
          fontSize: "225%",
          opacity: "0.75",
        }}
      />
      <Link
        to="/Messsages"
        style={{
          position: "absolute",
          width: "10%",
          height: "6.5%",
          left: "3.5%",
          top: "45%",
          textDecoration: "none",
          color: "#FFFFFF",
          display: "flex",
          textAlign: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        Messages
      </Link>
      <EmailTwoToneIcon
        style={{
          position: "absolute",
          left: "3%",
          top: "46.5%",
          fontSize: "225%",
          opacity: "0.75",
        }}
      />
      <Link
        to="/Settings"
        style={{
          position: "absolute",
          width: "10%",
          height: "6.5%",
          left: "3.5%",
          top: "54%",
          textDecoration: "none",
          color: "#FFFFFF",
          display: "flex",
          textAlign: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        Settings
      </Link>
      <SettingsApplicationsTwoToneIcon
        style={{
          position: "absolute",
          left: "3%",
          top: "55.5%",
          fontSize: "225%",
          opacity: "0.75",
        }}
      />
      <h1
        style={{
          position: "absolute",
          width: "201px",
          height: "76px",
          left: "4%",
          top: "68%",
          fontFamily: "Outfit",
          fontStyle: "normal",
          fontWeight: "500",
          fontSize: "26px",
          lineHeight: "38px",
          textAlign: "center",
          color: "#1B1C1F",
          textDecoration: "underline",
        }}
      >
        Go Local
      </h1>
      <p
        style={{
          position: "absolute",
          width: "201px",
          height: "76px",
          left: "4%",
          top: "73%",
          fontFamily: "Outfit",
          fontStyle: "normal",
          fontWeight: "500",
          fontSize: "15px",
          textAlign: "center",
          color: "black",
        }}
      >
        Currently, you are viewing sponsors/ sponsees globally. Would you like
        to view only sponsors/sponsees in your country?
      </p>
      <Button
        style={{
          position: "absolute",
          left: "4.5%",
          top: "85%",
          background: "#FFFFFF",
          borderRadius: "16px",
        }}
      >
        No
      </Button>
      <Button
        style={{
          position: "absolute",
          left: "10.5%",
          top: "85%",
          background: "#FFFFFF",
          borderRadius: "16px",
        }}
        onClick={() => navigate("./Settings")}
      >
        Yes
      </Button>
      <h1 style={{ position: "absolute", top: "70%", left: "78%" }}>
        Trending Users
      </h1>
      <Link
        to="/home/:id"
        style={{ position: "absolute", top: "73.25%", left: "94%" }}
      >
        View all
      </Link>
      <p
        style={{
          position: "absolute",
          top: "20%",
          left: "79%",
          fontFamily: "Outfit",
          fontStyle: "normal",
          fontWeight: "600",
          fontSize: "20px",
          lineHeight: "25px",
          textAlign: "center",
        }}
      >
        {state.storage.followers}
      </p>
      <p
        style={{
          position: "absolute",
          top: "23%",
          left: "77.5%",
          fontFamily: "Outfit",
          fontStyle: "normal",
          fontWeight: "300",
          fontSize: "16px",
          lineHeight: "20px",
          textAlign: "center",
          color: "#A2ADBC",
        }}
      >
        Followers
      </p>
      <p
        style={{
          position: "absolute",
          top: "20%",
          left: "94.5%",
          fontFamily: "Outfit",
          fontStyle: "normal",
          fontWeight: "600",
          fontSize: "20px",
          lineHeight: "25px",
          textAlign: "center",
        }}
      >
        {state.storage.following}
      </p>
      <p
        style={{
          position: "absolute",
          top: "23%",
          left: "93%",
          fontFamily: "Outfit",
          fontStyle: "normal",
          fontWeight: "300",
          fontSize: "16px",
          lineHeight: "20px",
          textAlign: "center",
          color: "#A2ADBC",
        }}
      >
        Following
      </p>
      <h1
        style={{
          position: "absolute",
          top: "28%",
          left: "83.6%",
          fontFamily: "Outfit",
          fontStyle: "normal",
          fontWeight: "500",
          fontSize: "20px",
          lineHeight: "25px",
          textAlign: "center",
        }}
      >
        {state.storage.name}
      </h1>
      <p
        style={{
          position: "absolute",
          width: "360px",
          height: "54px",
          left: "77.6%",
          top: "33%",
          fontFamily: "Outfit",
          fontStyle: "normal",
          fontWeight: "300",
          fontSize: "14px",
          lineHeight: "18px",
          textAlign: "center",
          color: "#6D7683",
        }}
      >
        {state.storage.biography}
      </p>

      <ViewProfileBox
        savedUser={savedUser}
        setNumberOfPosts={setNumberOfPosts}
        numberOfPosts={numberOfPosts}
      />

      {Object.values(state.posts).length !== 0 ? (
        <InfiniteScroll
          height="100%"
          dataLength={numberOfPosts.length}
          next={fetchMorePosts}
          hasMore={hasMorePosts}
          loader={<Loading style={{ position: "absolute", left: "50%" }} />}
          id="all-post-container"
          scrollThreshold={0.5}
          endMessage={
            <p style={{ textAlign: "center" }}>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <b>That's all folks!</b>
            </p>
          }
          style={{
            position: "absolute",
            top: "25%",
            left: "20%",
            backgroundColor: "#F7F9FE",
            height: "72%",
            width: "54%",
            borderRadius: "30px",
          }}
        >
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignContent="center"
            spacing={15}
          >
            {state.commentsRemaining.length > 0 &&
              Object.values(state.comments).length > 0 &&
              disableComment.specificComment.length > 0 &&
              numberOfPosts.map((key, i) => {
                if (posts[i]) {
                  return (
                    <Grid container item>
                      <Grid
                        item
                        xs={12}
                        container
                        style={{
                          backgroundColor: "white",
                          paddingTop: "20px",
                        }}
                      >
                        {/* avatar, username, etc */}
                        <Grid
                          item
                          xs={1}
                          container
                          style={{ justifyContent: "center" }}
                        >
                          <Avatar src={AvatarPicture} />
                        </Grid>
                        <Grid item container xs={11} style={{ gap: "10px" }}>
                          <Grid item xs={11}>
                            @{posts[i]?.username}
                          </Grid>
                          <Grid item xs={11}>
                            {posts[i]?.location} {posts[i]?.date}
                          </Grid>
                          {editPost.specificPost[i] ? (
                            <IconButton
                              onClick={() => handleCancelEdit(posts[i]._id)}
                            >
                              <CancelIcon />
                            </IconButton>
                          ) : posts[i].owner === state.storage.id ? (
                            <Grid item xs={11}>
                              <IconButton
                                id={posts[i]._id}
                                aria-controls={
                                  control.menus[i] ? "long-menu" : undefined
                                }
                                aria-expanded={
                                  control.menus[i] ? "true" : undefined
                                }
                                aria-haspopup="true"
                                onClick={(e) => handleMenuClick(e, i)}
                                style={{
                                  position: "relative",
                                  left: "100%",
                                  bottom: "100%",
                                }}
                              >
                                <MoreHorizIcon />
                              </IconButton>
                              <Menu
                                id={posts[i]._id}
                                MenuListProps={{
                                  "aria-labelledby": posts[i]._id,
                                }}
                                anchorEl={control.anchorEl}
                                open={control.menus[i]}
                                onClose={(e) =>
                                  handleMenuClose(e, "", posts[i]._id, i)
                                }
                                PaperProps={{
                                  style: {
                                    maxHeight: ITEM_HEIGHT * 4.5,
                                    width: "20ch",
                                  },
                                }}
                              >
                                {options.map((option) => (
                                  <MenuItem
                                    key={option}
                                    onClick={(e) =>
                                      handleMenuClose(
                                        e,
                                        option,
                                        posts[i]._id,
                                        i
                                      )
                                    }
                                  >
                                    {option}
                                  </MenuItem>
                                ))}
                              </Menu>
                            </Grid>
                          ) : (
                            ""
                          )}
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        className="indent2"
                        style={{ backgroundColor: "white" }}
                      >
                        {/* post text */}
                        {editPost.specificPost[i] ? (
                          <TextField
                            value={newText}
                            multiline
                            fullWidth
                            onChange={(e) => {
                              setNewText(e.target.value);
                              indexRef.current = i;
                            }}
                          />
                        ) : (
                          <p
                            className="Post"
                            style={{
                              padding: "1em",
                              backgroundColor: "#FFFBEE",
                              borderRadius: "20px",
                              margin: "1%",
                              wordBreak: "break-all",
                            }}
                          >
                            {posts[i]?.text}
                          </p>
                        )}
                      </Grid>
                      {posts[i].video &&
                      editPost.specificPost[i] &&
                      deleteVideo === false ? (
                        <Grid
                          item
                          xs={12}
                          className="indent2"
                          style={{ backgroundColor: "white" }}
                        >
                          {/* post video */}
                          <IconButton
                            onClick={() => {
                              setDeleteVideo(true);
                              indexRef.current = i;
                              dispatch(removeContent(i, "video"));
                            }}
                          >
                            <DeleteTwoTone style={{ color: "red" }} />
                          </IconButton>
                          <ReactPlayer
                            url={posts[i].video}
                            controls
                            width="100%"
                          />
                        </Grid>
                      ) : posts[i].video && deleteVideo === false ? (
                        <Grid
                          item
                          xs={12}
                          className="indent2"
                          style={{ backgroundColor: "white" }}
                        >
                          <ReactPlayer
                            url={posts[i].video}
                            controls
                            width="100%"
                          />
                        </Grid>
                      ) : (
                        ""
                      )}
                      <Grid container wrap="nowrap">
                        {posts[i].gif &&
                        editPost.specificPost[i] &&
                        deleteGif === false ? (
                          <Grid
                            item
                            xs={12}
                            className="indent2"
                            style={{ backgroundColor: "white" }}
                          >
                            {/* post gif */}
                            <IconButton
                              onClick={() => {
                                setDeleteGif(true);
                                indexRef.current = i;
                                dispatch(removeContent(i, "gif"));
                              }}
                            >
                              <DeleteTwoTone style={{ color: "red" }} />
                            </IconButton>
                            <img
                              src={posts[i].gif}
                              style={{ objectFit: "contain" }}
                              alt="gif"
                            />
                          </Grid>
                        ) : posts[i].gif && deleteGif === false ? (
                          <Grid
                            item
                            xs={12}
                            className="indent2"
                            style={{ backgroundColor: "white" }}
                          >
                            <img
                              src={posts[i].gif}
                              style={{ objectFit: "contain" }}
                              alt="gif"
                            />
                          </Grid>
                        ) : (
                          ""
                        )}
                      </Grid>
                      <Grid container wrap="nowrap">
                        {posts[i].images.length > 0 &&
                        editPost.specificPost[i] &&
                        deleteImage === false ? (
                          <Grid
                            item
                            xs={12}
                            className="indent2"
                            style={{ backgroundColor: "white" }}
                          >
                            {/* post image */}
                            <IconButton
                              onClick={() => {
                                setDeleteImage(true);
                                indexRef.current = i;
                                dispatch(removeContent(i, "images"));
                              }}
                            >
                              <DeleteTwoTone style={{ color: "red" }} />
                            </IconButton>
                            <ImageList
                              sx={{ overflowX: "auto" }}
                              rowHeight={200}
                            >
                              <ImageListItem
                                sx={{ display: "flex", flexDirection: "row" }}
                              >
                                {posts[i].images.map((image) => (
                                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                                  <img
                                    src={image}
                                    alt="title"
                                    loading="lazy"
                                    style={{
                                      paddingRight: "1em",
                                      objectFit: "contain",
                                    }}
                                    onClick={(e) => handleOpen(e.target.src)}
                                  />
                                ))}
                                <Dialog
                                  open={open}
                                  onClose={handleClose}
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                  }}
                                  BackdropProps={{ invisible: true }}
                                >
                                  <img
                                    style={{ width: "auto", height: "100%" }}
                                    src={imageToView}
                                    alt="presentedImage"
                                  />
                                </Dialog>
                              </ImageListItem>
                            </ImageList>
                          </Grid>
                        ) : posts[i].images.length > 0 &&
                          deleteImage === false ? (
                          <Grid
                            item
                            xs={12}
                            className="indent2"
                            style={{ backgroundColor: "white" }}
                          >
                            <ImageList
                              sx={{ overflowX: "auto" }}
                              rowHeight={200}
                            >
                              <ImageListItem
                                sx={{ display: "flex", flexDirection: "row" }}
                              >
                                {posts[i].images.map((image) => (
                                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                                  <img
                                    src={image}
                                    alt="title"
                                    loading="lazy"
                                    style={{
                                      paddingRight: "1em",
                                      objectFit: "contain",
                                    }}
                                    onClick={(e) => handleOpen(e.target.src)}
                                  />
                                ))}
                                <Dialog
                                  open={open}
                                  onClose={handleClose}
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                  }}
                                  BackdropProps={{ invisible: true }}
                                >
                                  <img
                                    style={{ width: "auto", height: "100%" }}
                                    src={imageToView}
                                    alt="imageToView"
                                  />
                                </Dialog>
                              </ImageListItem>
                            </ImageList>
                          </Grid>
                        ) : (
                          ""
                        )}
                      </Grid>
                      {editPost.specificPost[i] ? (
                        <Grid
                          item
                          xs={12}
                          className="indent2"
                          style={{
                            backgroundColor: "white",
                            textAlign: "center",
                          }}
                        >
                          {errorMessage ? (
                            <div
                              style={{
                                textAlign: "center",
                                padding: "20px",
                                border: "3px dashed red",
                                backgroundColor: "#fafafa",
                                color: "red",
                                margin: "20px",
                              }}
                            >
                              <input
                                multiple
                                accept="image/*, video/mp4"
                                disabled
                                hidden
                              />
                              <p>{errorMessage}</p>
                            </div>
                          ) : (!posts[i].video || posts[i].video === "") &&
                            (!posts[i].gif || posts[i].gif === "") &&
                            posts[i].images.length === 0 ? (
                            <div
                              {...getRootProps()}
                              style={{
                                textAlign: "center",
                                padding: "20px",
                                border: "3px dashed #eeeeee",
                                backgroundColor: "#fafafa",
                                color: "#bdbdbd",
                                margin: "20px",
                              }}
                            >
                              <input
                                multiple
                                {...getInputProps()}
                                accept="image/*, video/mp4"
                              />
                              {isDragActive ? (
                                <p>Drop the files here ...</p>
                              ) : (
                                <p>
                                  Drag 'n' drop some files here, or click to
                                  select files. <br />
                                  (You can upload as many images as you want but
                                  are limited to only 1 video or 1 gif for each
                                  post)
                                </p>
                              )}
                            </div>
                          ) : (
                            ""
                          )}
                          {loading ? (
                            <Button
                              startIcon={<Loading />}
                              variant="outlined"
                              style={{
                                background: "gray",
                                color: "white",
                              }}
                              disabled
                            >
                              Loading
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              style={{
                                background: errorMessage
                                  ? "gray"
                                  : "linear-gradient(180deg, #2D87FF 0%, #6099E5 100%)",
                                color: "white",
                              }}
                              onClick={() => {
                                changesToggleRef.current = true;
                                configurePost(posts[i]._id);
                              }}
                              disabled={errorMessage}
                            >
                              Submit Changes
                            </Button>
                          )}
                        </Grid>
                      ) : (
                        ""
                      )}
                      <Grid
                        item
                        xs={12}
                        className="indent2"
                        style={{ backgroundColor: "white" }}
                      >
                        {/* icon bar */}
                        <Grid container style={{ padding: 12, gap: 20 }}>
                          <Grid item>
                            {mouseOver === i &&
                            posts[i]?.likedBy.includes(state.storage.id) ? (
                              <IconButton
                                // eslint-disable-next-line react/no-array-index-key
                                key={i}
                                onClick={() => handleLike("decrease", i)}
                                onMouseLeave={() => setMouseOver(-1)}
                                onMouseOver={() => setMouseOver(i)}
                              >
                                <HeartBrokenIcon style={{ color: "red" }} />
                              </IconButton>
                            ) : posts[i]?.likedBy.includes(state.storage.id) ? (
                              <IconButton
                                onMouseLeave={() => setMouseOver(-1)}
                                onMouseOver={() => setMouseOver(i)}
                              >
                                <FavoriteIcon style={{ color: "red" }} />
                              </IconButton>
                            ) : (
                              <IconButton
                                onClick={() => handleLike("increase", i)}
                              >
                                <FavoriteBorderTwoToneIcon color="primary" />
                              </IconButton>
                            )}{" "}
                            {posts[i]?.likes}
                          </Grid>
                          <Grid item>
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
                          </Grid>
                          <Grid item>
                            <IconButton>
                              <IosShareOutlinedIcon color="primary" />
                            </IconButton>{" "}
                            {posts[i]?.shares}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        className="indent2"
                        style={{
                          backgroundColor: "white",
                          borderRadius: "16px",
                        }}
                      >
                        {/* comment */}
                        <TextField
                          InputProps={{
                            startAdornment: (
                              <InputAdornment>
                                <Avatar
                                  src={state.storage.profileImageURL}
                                  style={{ marginRight: 12 }}
                                />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <IconButton
                                onClick={(e) => {
                                  handleReplies(i);
                                  handlePostingComment(
                                    e,
                                    posts[i]._id,
                                    posts[i].comments
                                  );
                                }}
                              >
                                <AddCommentTwoToneIcon color="primary" />
                              </IconButton>
                            ),
                            classes: {
                              notchedOutline: "notched-outline-border-radius",
                            },
                          }}
                          // eslint-disable-next-line react/jsx-no-duplicate-props
                          inputProps={{
                            maxLength: 500,
                          }}
                          value={comment}
                          multiline
                          disabled={disableComment.specificComment[i]}
                          // eslint-disable-next-line no-return-assign
                          onChange={(e) => setComment(e.target.value)}
                          placeholder={
                            disableComment.specificComment[i]
                              ? "Finish editing your comment before making another comment"
                              : "Write your comment"
                          }
                          style={{ width: "100%" }}
                          // eslint-disable-next-line no-return-assign
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                            }
                          }}
                          onKeyUp={(e) => {
                            if (e.key === "Enter") {
                              handlePostingComment(
                                e,
                                posts[i]._id,
                                posts[i].comments
                              ); // Fix functionality when user press 'Enter', the comment submits current text to database.
                            }
                          }}
                        />
                      </Grid>
                      <Grid
                        container
                        wrap="nowrap"
                        maxHeight="205px"
                        overflow="auto"
                      >
                        {groupedComments[0].forEach((cmt, index) => {
                          if (
                            groupedComments[0][index - 1] &&
                            cmt.nestedPosition >
                              groupedComments[0][index - 1].nestedPosition
                          ) {
                            height = 100 * index;
                          }
                        })}
                        <span
                          style={{
                            borderLeft: "3px solid lightgray",
                            height,
                          }}
                        />
                        <Grid
                          item
                          xs={12}
                          className="indent2"
                          style={{
                            backgroundColor: "white",
                            borderRadius: "16px",
                          }}
                          textAlign="center"
                        >
                          {posts[i].comments <= 10 && posts[i].comments > 0 ? (
                            groupedComments[0].map((eachComment) =>
                              eachComment.belongsToPost === posts[i]._id ? (
                                <Comment
                                  eachComment={eachComment}
                                  savedUser={savedUser}
                                  postInfo={posts[i]}
                                  disableComment={disableComment}
                                  index={i}
                                />
                              ) : (
                                ""
                              )
                            )
                          ) : posts[i].comments > 10 ? (
                            state.commentsRemaining[i].map(
                              (eachComment, index) =>
                                groupedComments[0][index].belongsToPost ===
                                posts[i]._id ? (
                                  <Comment
                                    eachComment={groupedComments[0][index]}
                                    savedUser={savedUser}
                                    postInfo={posts[i]}
                                    disableComment={disableComment}
                                    index={i}
                                  />
                                ) : (
                                  ""
                                )
                            )
                          ) : replies[i] ? (
                            <Box sx={{ display: "block" }}>
                              <h1>
                                There seems to be no comments on this post :/
                              </h1>
                            </Box>
                          ) : (
                            ""
                          )}
                          {posts[i].comments -
                            state.commentsRemaining[i].length >
                            0 &&
                          posts[i].comments -
                            state.commentsRemaining[i].length <=
                            10 &&
                          posts[i] ? (
                            <Button onClick={() => fetchMoreComments(i)}>
                              Show{" "}
                              {posts[i].comments -
                                state.commentsRemaining[i].length}{" "}
                              more comments
                            </Button>
                          ) : posts[i].comments -
                              state.commentsRemaining[i].length >
                              10 && posts[i] ? (
                            <Button onClick={() => fetchMoreComments(i)}>
                              Show 10 more comments
                            </Button>
                          ) : (
                            ""
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                }
              })}
          </Grid>
        </InfiniteScroll>
      ) : (
        <div
          id="content-loader"
          style={{
            position: "absolute",
            top: "25%",
            left: "20%",
            backgroundColor: "#F7F9FE",
            height: "72%",
            width: "54%",
            borderRadius: "30px",
          }}
        >
          <Loading
            size="lg"
            style={{ position: "absolute", left: "50%", top: "50%" }}
          />
        </div>
      )}
    </div>
  );
}

export default Home;
