import express from 'express';
import postsRouter from "./routes/posts/posts.raoutes";
import usersRouter from './routes/users/users.routes';
import categoryRoutes from "./routes/category/category.controller";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/v1/posts' , postsRouter);
app.use('/api/v1/users' , usersRouter); //ngambil postinngannya berdasarkan id usernya
app.use('/api/v1/category' , categoryRoutes); //ngambil postinngannya berdasarkan id usernya

app.get('/' , (req, res) => {
    res.send("hellow word");
})

app.listen(PORT , () => {
    console.log(`server running on http://localhost:${PORT}`);
})