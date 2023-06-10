import { Router } from 'express';
import {
  addVeterinary,
  deleteVeterinaryById,
  getVeterinaries,
  getVeterinaryById,
  getVeterinaryByPhone,
  getVeterinaryByEmail,
  updateVeterinaryName,
  updateVeterinaryEmail,
  updateVeterinaryStatus,
} from '../controllers/veterinarys.controllers.js';
const router = Router();

router.post('/veterinaries', addVeterinary);
router.get('/veterinaries', getVeterinaries);
router.get('/veterinaries/:id', getVeterinaryById);
router.get('/veterinaries/phone/:phone', getVeterinaryByPhone);
router.get('/veterinaries/email/:email', getVeterinaryByEmail);
router.delete('/veterinaries/:id', deleteVeterinaryById);

router.put('/veterinaries/:id/name', updateVeterinaryName);
router.put('/veterinaries/:id/email', updateVeterinaryEmail);
router.put('/veterinaries/:id/status', updateVeterinaryStatus);

export default router;
