import { Router } from 'express';
import { addVeterinary, deleteVeterinaryById, getVeterinaries, getVeterinaryById, getVeterinaryByphone } from '../controllers/veterinarys.controllers.js';
const router = Router();

router.post('/veterinaries', addVeterinary);
router.get('/veterinaries', getVeterinaries)
router.get('/veterinaries/:id', getVeterinaryById)
router.get('/veterinaries/phone/:phone', getVeterinaryByphone)
router.delete('/veterinaries/:id', deleteVeterinaryById)
export default router;
