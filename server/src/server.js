import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import filesRoutes from './routes/filesRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(
    cors({
        origin: `${process.env.FRONT_URL}`,
        credentials: true,
    }),
);

app.use('/users', userRoutes);
app.use('/orders', orderRoutes, filesRoutes);

app.get('/api', (req, res) => {
    res.send('Сервер работает!');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
}

export default app;
