import app from "./app";
import connectDB from "./config/database";

const PORT = process.env.PORT || 4000;

connectDB();

app.get("/", (req, res) => {
  res.send("Hello from User Service!");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
