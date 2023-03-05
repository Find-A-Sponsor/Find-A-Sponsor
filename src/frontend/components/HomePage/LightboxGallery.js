/* eslint-disable react/prop-types */
import React from "react";
import { useImage } from "react-image";

function LightboxGallery({ imageUrl }) {
  const { src } = useImage({
    srcList: imageUrl,
    useSuspense: false,
  });

  const imgStyle = {
    maxWidth: "100vw", // Set a maximum width of 100% of viewport width
    maxHeight: "100vh", // Set a maximum height of 100% of viewport height
    width: "auto", // Set the width to auto to maintain aspect ratio
    height: "auto", // Set the height to auto to maintain aspect ratio
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  return <img src={src} alt="lightbox" style={imgStyle} />;
}

export default LightboxGallery;
