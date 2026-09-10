import express from 'express';
import authRouter from './routes/auth/auth.routes'
import postsRouter from "./routes/posts/posts.raoutes";
import usersRouter from './routes/users/users.routes';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/v1/auth' , authRouter);
app.use('/api/v1/posts' , postsRouter);
app.use('/api/v1/users' , usersRouter); //ngambil postinngannya berdasarkan id usernya

app.get('/' , (req, res) => {
    res.send("hellow word");
})

app.listen(PORT , () => {
    console.log(`server running on http://localhost:${PORT}`);
})