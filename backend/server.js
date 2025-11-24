import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { connectDB } from './config/db.js';
import profileRoutes from './routes/profileRoutes.js';
import resultRouter from './routes/resultRoutes.js';
import userRoute from './routes/userRouter.js';

const app = express();
const port = 4000;

// midleware...
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// db..
connectDB();
// routeesss//
app.get('/', (req, res)=>{
    res.send("api working...")
})

// auth route
app.use('/api/auth', userRoute)
// result routee
app.use('/api/results', resultRouter);

app.use("/api/profile", profileRoutes);


app.listen(port, ()=>{
    console.log(`Server started on http://localhost:${port}`);

})