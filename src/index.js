import express from 'express';
import veterinaryRouter from './routes/veterinarys.routes.js'
const app = express();
app.use(express.json())

const PORT = 3000;
app.listen(PORT,  console.log('server running on port ', PORT));

app.use('/api',veterinaryRouter)