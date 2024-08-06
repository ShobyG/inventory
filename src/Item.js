import { Box, Button, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function Item({ item, onDelete, onUpdate }) {
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
