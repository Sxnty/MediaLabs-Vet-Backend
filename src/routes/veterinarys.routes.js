import { Router } from 'express';
import { addVeterinary, getVeterinaries } from '../controllers/veterinarys.controllers.js';
const router = Router();

router.post('/veterinaries', addVeterinary);
router.get('/veterinaries', getVeterinaries)
export default router;
