import { Router } from 'express';
import { addVeterinary, getVeterinaries, getVeterinaryById } from '../controllers/veterinarys.controllers.js';
const router = Router();

router.post('/veterinaries', addVeterinary);
router.get('/veterinaries', getVeterinaries)
router.get('/veterinaries/:id', getVeterinaryById)
export default router;
