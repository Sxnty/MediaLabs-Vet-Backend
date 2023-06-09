import { Router } from 'express';
import {
  addVeterinary,
  deleteVeterinaryById,
  getVeterinaries,
  getVeterinaryById,
  getVeterinaryByphone,
  getVeterinaryByEmail,
  updateVeterinaryName,
  updateVeterinaryEmail,
} from '../controllers/veterinarys.controllers.js';
const router = Router();

router.post('/veterinaries', addVeterinary);
router.get('/veterinaries', getVeterinaries);
router.get('/veterinaries/:id', getVeterinaryById);
router.get('/veterinaries/phone/:phone', getVeterinaryByphone);
router.get('/veterinaries/email/:email', getVeterinaryByEmail);
router.delete('/veterinaries/:id', deleteVeterinaryById);

router.put('/veterinaries/:id/name', updateVeterinaryName);
router.put('/veterinaries/:id/email', updateVeterinaryEmail);

export default router;
