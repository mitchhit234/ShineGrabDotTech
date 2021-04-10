var app = require('express')();
app.get("/", (req, res) => { res.send("Hello World"); });
app.listen(8080, () => { console.log("Server online on http://localhost:8080"); });