import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();

mongoose.connect('mongodb://localhost:27017/apitesting');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', routes);

app.use('*', (req, res) => {
    res.status(404).json({ error: 'API not found' });
});

app.listen(5000, () => {
    console.log('Listening on port 5000');
});
