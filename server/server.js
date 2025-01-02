import express from 'express'
import {getUser, getUsers} from "./db.js";

import dotenv from 'dotenv'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/users', async (req, res) => {
    const users = await getUsers()
    res.send(users)
})

app.get('/users/:id', async (req, res) => {
    const id = req.params.id
    const user = await getUser(id);
    res.send(user)
})

app.get('/', (req, res) => {
    res.send('Сервер работает!');
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
