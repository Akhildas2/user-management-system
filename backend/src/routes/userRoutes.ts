import express from 'express';
import bodyParser from 'body-parser';
import { getUsers,createUser } from '../controllers/userControllers';
const jsonParser = bodyParser.json();
const router = express.Router();

//get api READ
router.get('/user', getUsers);
//get api READ
router.post('/user', jsonParser,createUser);

export default router;
