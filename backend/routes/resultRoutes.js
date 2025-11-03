import express from 'express';
import { createResult, listResult } from '../controller/resultController';
import authMiddleware from '../middleware/auth';
const resultRouter = express.Router();

resultRouter.post('/', authMiddleware,createResult );
resultRouter.get('/', authMiddleware, listResult);

export default resultRouter;