import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Container, Grid, Input, TextField } from "@mui/material";
import { db } from "./Firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Camera from "./Camera";
import AddItem from "./AddItem";
import ModelPredictor from "./ModelPredictor";
import Item from "./Item";

function App() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "inventory"));
      const itemsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemsList);
    };

    fetchItems();
  }, []);

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "inventory", id));
    setItems(items.filter((item) => item.id !== id));
  };
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const img = new Image();
    img.onload = () => setImage(img);
    img.src = URL.createObjectURL(file);
  };
  const updateItemCount = async (id, newCount) => {
    if (
      isNaN(newCount) ||
      newCount === "" ||
      Number(newCount) <= 0 ||
      Number(newCount) >= 10000
    ) {
      setError("Count must be a number between 1 and 9999.");
      console.log(error);
      return;
    }
    const itemDoc = doc(db, "inventory", id);
    await updateDoc(itemDoc, { count: Number(newCount) });
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, count: Number(newCount) } : item
      )
    );
    setError("");
  };

  const handlePrediction = (predictedLabel) => {
    setPrediction(predictedLabel);
    const matchingItem = items.find((item) => item.name === prediction);
    if (matchingItem) {
      const newCount = matchingItem.count + 1;
      updateItemCount(matchingItem.id, newCount);
      setImage(null);
    } else {
      console.log(
        `No matching item found for predicted label: ${predictedLabel}`
      );
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 1,
          bgcolor: "primary.main",
          "&:hover": {
            bgcolor: "primary.dark",
          },
        }}
      >
        <Typography variant="h4" sx={{ padding: "10px" }}>
          Pantry Inventory
        </Typography>
        <TextField
          label="Search Items"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            marginBottom: "20px",
            width: "80%",
            bgcolor: "primary.main",
            "&:hover": {
              bgcolor: "primary.light",
            },
            borderRadius: "5%",
          }}
        />
        <Grid
          container
          spacing={1}
          sx={{
            width: "80%",
            justifyContent: "center",
            maxHeight: "40vh",
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "10px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "5px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#555",
            },
            margin: "2px",
            padding: "2px",
            bgcolor: "primary.main",
            "&:hover": {
              bgcolor: "primary.light",
            },
            borderRadius: "10px",
          }}
        >
          <Typography variant="h5" sx={{ padding: "10px" }}>
            Inventory Items
          </Typography>
          {filteredItems.map((item, index) => (
            <Item
              key={index}
              item={item}
              onDelete={deleteItem}
              onUpdate={updateItemCount}
            />
          ))}
        </Grid>
        <Box
          sx={{
            width: "80%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "solid grey",
            padding: "2%",
            borderRadius: "10px",
            bgcolor: "primary.main",
            "&:hover": {
              bgcolor: "grey",
            },
            margin: "2%",
          }}
        >
          <Grid
            sx={{
              padding: "2em",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ padding: "10px" }}>
                Scan to Add Item
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {!image && <Camera addImage={setImage} />}
            </Grid>
            <Grid item xs={12}>
              {!image && (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              {image && (
                <ModelPredictor
                  image={image}
                  prediction={prediction}
                  onPrediction={handlePrediction}
                  handleImage={setImage}
                />
              )}
            </Grid>
          </Grid>
        </Box>

        <AddItem items={items} onAddItem={setItems} />
      </Box>
    </Container>
  );
}

export default App;
