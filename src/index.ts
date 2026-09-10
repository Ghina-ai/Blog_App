import express from 'express';
import authRouter from './routes/auth/auth.routes'

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/v1/auth' , authRouter)

app.get('/' , (req, res) => {
    res.send("hellow word");
})

app.listen(PORT , () => {
    console.log(`server running on http://localhost:${PORT}`);
})