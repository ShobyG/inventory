import Webcam from "react-webcam";
import React, { useState, useRef } from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

export default function Camera() {
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef(null);
  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(imageSrc);
  };
  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddBoxIcon />}
        onClick={() => setShowWebcam(!showWebcam)}
        sx={{ marginTop: 2 }}
      >
        {showWebcam ? "Hide Camera" : "Show Camera"}
      </Button>
      {showWebcam && (
        <Box sx={{ marginTop: 2 }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={300}
            height={200}
          />
          <Button
            variant="contained"
            onClick={handleCapture}
            sx={{ marginTop: 2 }}
          >
            Capture
          </Button>
        </Box>
      )}
    </>
  );
}
