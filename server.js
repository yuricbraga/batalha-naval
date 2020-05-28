const express = require("express");
const app = express();

app.get("/", (req,res) => {
    return res.status(200).send({msg: "Hello world"});
})

const PORT = 9000;
app.listen(PORT,() => console.log(`Server listening on port ${PORT}`));