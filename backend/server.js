const express = require('express');
const app = express();
const port = 4201;
app.get('/', (req, res) => {
res.send('Toimib!!!!');
});

app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});