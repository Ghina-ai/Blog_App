import express from 'express';
import postsRouter from "./routes/posts/posts.raoutes";
import usersRouter from './routes/users/users.routes';
import categoriesRouter from './routes/category/categorys.routes';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/v1/posts' , postsRouter);
app.use('/api/v1/users' , usersRouter); //ngambil postinngannya berdasarkan id usernya
app.use('/api/v1/category' , categoriesRouter);
app.use('/api/v1/users' , usersRouter);


app.get('/' , (req, res) => {
    res.send("hellow word");
})

app.listen(PORT , () => {
    console.log(`server running on http://localhost:${PORT}`);
})