import app from "./app";
import connectDB from "./config/database";

const PORT = process.env.PORT || 4000;

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
