import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { connectDB } from './config/db.js';

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

app.listen(port, ()=>{
    console.log(`Server started on http://localhost:${port}`);

})