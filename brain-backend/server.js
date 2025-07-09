const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const commandRoutes = require('./routes/commands');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/command', commandRoutes);

app.get('/', (req, res) => {
    res.send('EchoMind Backend is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
