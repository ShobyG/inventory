import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, Container, Grid, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { db } from "./Firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

function App() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCount, setNewItemCount] = useState("");
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

  const addItem = async () => {
    if (newItemName === "") {
      setError("Item name is required.");
      return;
    }

    if (
      isNaN(newItemCount) ||
      newItemCount === "" ||
      Number(newItemCount) <= 0 ||
      Number(newItemCount) >= 10000
    ) {
      setError("Count must be a number between 1 and 9999.");
      return;
    }

    const existingItem = items.find(
      (item) => item.name.toLowerCase() === newItemName.toLowerCase()
    );
    if (existingItem) {
      setError("Item already exists.");
      return;
    }

    const newItem = { name: newItemName, count: Number(newItemCount) };
    const docRef = await addDoc(collection(db, "inventory"), newItem);
    setItems([...items, { ...newItem, id: docRef.id }]);
    setNewItemName("");
    setNewItemCount("");
    setError("");
  };

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
          width: "80%",
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
        <Grid container spacing={1} justifyContent="center">
          {items.map((item, index) => (
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
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextField
            label="Item Name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            sx={{ marginBottom: 2, width: "300px" }}
          />
          <TextField
            label="Item Count"
            value={newItemCount}
            onChange={(e) => setNewItemCount(e.target.value)}
            sx={{ marginBottom: 2, width: "300px" }}
            type="number"
          />
          {error && (
            <Typography color="error" sx={{ marginBottom: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            startIcon={<AddBoxIcon />}
            onClick={addItem}
          >
            Add Item
          </Button>
        </Box>
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
