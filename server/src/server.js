import express from 'express';

import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import photosRoutes from './routes/photosRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/users', userRoutes);
app.use('/orders', orderRoutes, photosRoutes);

app.get('/', (req, res) => {
    res.send('Сервер работает!');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
