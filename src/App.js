import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import items from "./item_inventory.json";
import { Button, Container, Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

function App() {
  console.log(items);
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
            <Item key={index} item={item} />
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

function Item({ item }) {
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
          width: "60%",
          textAlign: "center",
          backgroundColor: "#808080",
          borderRadius: 1,
          padding: "4px",
          boxShadow: 1,
        }}
      >
        {item.name}
      </Typography>
      <Button startIcon={<ArrowDropDownIcon />}></Button>
      <Typography>{item.count}</Typography>
      <Button startIcon={<ArrowDropUpIcon />}></Button>
      <Button variant="outlined" startIcon={<DeleteIcon />}>
        Remove
      </Button>
    </Box>
  );
}

export default App;
