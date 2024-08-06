import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";

const isMobileOrTablet = () => {
  const userAgent = navigator.userAgent || window.opera;
  return (
    /android|iPad|iPhone|iPod/i.test(userAgent) ||
    (window.innerWidth <= 800 && window.innerHeight <= 1280)
  );
};

export default function Camera({ addImage }) {
  const [showWebcam, setShowWebcam] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const webcamRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileOrTablet());
  }, []);

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        addImage(img);
      };
    }
  };

  const toggleCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddBoxIcon />}
        onClick={() => setShowWebcam(!showWebcam)}
        sx={{ marginTop: 2 }}
      >
        {showWebcam ? "Hide Camera" : "Scan Using Camera"}
      </Button>
      {showWebcam && (
        <Box sx={{ marginTop: 2 }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={300}
            height={200}
            videoConstraints={{ facingMode }}
          />
          <Button
            variant="contained"
            onClick={handleCapture}
            sx={{ marginTop: 2 }}
          >
            Capture
          </Button>
          {isMobile && (
            <Button
              variant="contained"
              startIcon={<FlipCameraAndroidIcon />}
              onClick={toggleCamera}
              sx={{ marginTop: 2, marginLeft: 2 }}
            >
              Flip Camera
            </Button>
          )}
        </Box>
      )}
    </>
  );
}
