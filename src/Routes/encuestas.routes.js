import { Router } from "express";
import { verificacion } from "../Controllers/Middleware.js";
import { getEncuestas,saveEncuesta,updateEncuesta,deleteEncuesta,savePregunta,updatePregunta,deletePregunta,saveRespuesta } from "../Controllers/EncuestasController.js";

const router = Router();
router.get('/encuestas',verificacion,getEncuestas);
router.get('/encuestas/:id',verificacion,getEncuestas);
router.post('/encuestas',verificacion,saveEncuesta);
router.put('/encuestas/:id',verificacion,updateEncuesta);
router.delete('/encuestas/:id',verificacion,deleteEncuesta);
router.post('/preguntas',verificacion,savePregunta);
router.put('/preguntas/:id',verificacion,updatePregunta);
router.delete('/preguntas/:id',verificacion,deletePregunta);
router.post('/respuestas',verificacion,saveRespuesta);

export default router;