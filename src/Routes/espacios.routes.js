import { Router } from "express";
import multer from 'multer';
import { verificacion } from "../Controllers/Middleware.js";
import { getEspacios,saveEspacio,updateEspacio,deleteEspacio } from "../Controllers/EspaciosController.js";

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/uploads')
    },
    filename:(req,file,cb)=>{
        const ext = file.originalname.split('.').pop()
        cb(null,Date.now()+'.'+ext)
    }
});

const filtro = (req,file,cb) =>{
    if(file && (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

const subir = multer({storage: storage, fileFilter:filtro});

const router = Router();
router.get('/espacios',verificacion,getEspacios);
router.get('/espacios/:id',verificacion,getEspacios);
router.post('/espacios',verificacion,subir.single('imagen'),saveEspacio);
router.put('/espacios/:id',verificacion,subir.single('imagen'),updateEspacio);
router.delete('/espacios/:id',verificacion,deleteEspacio);

export default router;
