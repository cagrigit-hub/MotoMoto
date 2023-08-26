import express from 'express';

const app = express();
app.use(express.json());

app.get("/", (req,res) => {
    res.send("Hello World");
})

app.listen(4001, () => {
    console.log("Server is listening on port 4001");
});