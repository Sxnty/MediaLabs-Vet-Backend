import { Router } from 'express';
import { addVeterinary } from '../controllers/veterinarys.controllers.js';
const router = Router();

router.post('/veterinarys', addVeterinary);

export default router;
