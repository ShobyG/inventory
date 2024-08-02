import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { Button, Box, TextField, Typography, Grid } from "@mui/material";
import { db } from "./Firebase";
import AddBoxIcon from "@mui/icons-material/AddBox";

export default function AddItem({ items, onAddItem }) {
  const [newItemName, setNewItemName] = useState("");
  const [newItemCount, setNewItemCount] = useState("");
  const [error, setError] = useState("");

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
    onAddItem([...items, { ...newItem, id: docRef.id }]);
    setNewItemName("");
    setNewItemCount("");
    setError("");
  };

  return (
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
      }}
    >
      <Grid container spacing={2} sx={{ width: "50%" }}>
        <Grid item xs={12}>
          <TextField
            label="Item Name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            fullWidth
            sx={{ padding: "2px", bgcolor: "white" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Item Count"
            value={newItemCount}
            onChange={(e) => setNewItemCount(e.target.value)}
            type="number"
            fullWidth
            sx={{ padding: "2px", bgcolor: "white" }}
          />
        </Grid>
        {error && (
          <Grid item xs={12}>
            <Typography color="error" sx={{ marginBottom: 2 }}>
              {error}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            startIcon={<AddBoxIcon />}
            onClick={addItem}
          >
            Add Item
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
