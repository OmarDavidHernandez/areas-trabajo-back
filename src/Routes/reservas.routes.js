import { Router } from "express";
import { verificacion } from "../Controllers/Middleware.js";
import { getReservas,saveReserva,updateReserva,deleteReserva,getReservasPorUsuario } from "../Controllers/ReservasController.js";

const router = Router();
router.get('/reservas',verificacion,getReservas);
router.get('/reservas/:id',verificacion,getReservas);
router.post('/reservas',verificacion,saveReserva);
router.put('/reservas/:id',verificacion,updateReserva);
router.delete('/reservas/:id',verificacion,deleteReserva);
router.get('/reservas-usuario/:id',verificacion,getReservasPorUsuario);

export default router;