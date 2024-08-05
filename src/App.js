import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, Container, Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
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

function App() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

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

  return (
    <Container>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
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
        <Grid
          container
          spacing={1}
          sx={{
            width: "80%",
            justifyContent: "center",
            maxHeight: "40%",
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
          {items.map((item, index) => (
            <Item
              key={index}
              item={item}
              onDelete={deleteItem}
              onUpdate={updateItemCount}
            />
          ))}
        </Grid>
        <AddItem items={items} onAddItem={setItems} />
        <Camera />
      </Box>
    </Container>
  );
}

function Item({ item, onDelete, onUpdate }) {
  const handleIncrement = () => {
    const newCount = item.count + 1;
    onUpdate(item.id, newCount);
  };

  const handleDecrement = () => {
    const newCount = item.count - 1;
    if (newCount > 0) {
      onUpdate(item.id, newCount);
    }
  };

  return (
    <Box
      sx={{
        width: "80%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "8px 0",
        padding: 2,
        backgroundColor: "white",
        borderRadius: 1,
        boxShadow: 1,
      }}
    >
      <Typography
        sx={{
          width: "20%",
          textAlign: "center",
          backgroundColor: "#808080",
          borderRadius: 1,
          padding: "4px",
          boxShadow: 1,
        }}
      >
        {item.name}
      </Typography>
      <Button
        startIcon={<ArrowDropDownIcon />}
        onClick={handleDecrement}
      ></Button>
      <Typography>{item.count}</Typography>
      <Button
        startIcon={<ArrowDropUpIcon />}
        onClick={handleIncrement}
      ></Button>
      <Button
        variant="outlined"
        startIcon={<DeleteIcon />}
        onClick={() => onDelete(item.id)}
      >
        Remove
      </Button>
    </Box>
  );
}

export default App;
