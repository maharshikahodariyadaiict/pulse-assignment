// const express = require('express')
import express from 'express';
import routes from './routes/reviews.js';

const app = express()
const port = 3000

app.get('/health-check', (req, res) => {
    res.send('Health check')
})

app.use('/v1', routes);

app.listen(port, () => {
    console.log(`Web Scraper app listening on port ${port}`)
})