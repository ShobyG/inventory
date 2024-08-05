import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { Box } from "@mui/material";

const ModelPredictor = ({ image }) => {
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const labels = ["Apples", "Bananas", "Bread", "Eggs"];
  useEffect(() => {
    const loadModel = async () => {
      const modelUrl = "js_model/model.json";
      const loadedModel = await tf.loadGraphModel(modelUrl);
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  useEffect(() => {
    if (model && image) {
      const predict = async () => {
        const imgTensor = tf.browser
          .fromPixels(image)
          .resizeNearestNeighbor([100, 100])
          .toFloat()
          .expandDims();
        const predictions = await model.predict(imgTensor).data();
        const predictionArray = Array.from(predictions);

        const maxIndex = predictionArray.indexOf(Math.max(...predictionArray));
        console.log(labels[maxIndex]);
        setPrediction(labels[maxIndex]);
      };
      predict();
    }
  }, [model, image, labels]);

  return (
    <Box>
      {!prediction && <pre>Scanning in progress</pre>}
      {prediction && (
        <Box>
          <h3>Predictions:</h3>
          <img
            srcSet={`${image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            src={`${image}?w=164&h=164&fit=crop&auto=format`}
            alt={"pantry item"}
            loading="lazy"
          />
          <pre>{prediction}</pre>
        </Box>
      )}
    </Box>
  );
};

export default ModelPredictor;
