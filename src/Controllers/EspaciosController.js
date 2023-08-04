import mongoose from 'mongoose';
import * as fs from 'fs';

const esquema = new mongoose.Schema({
    nombre: String,
    capacidad: Number,
    imagen: String,
    ubicacion: String
  },{versionKey:false});
const EspacioModel = new mongoose.model('espacios',esquema);

export const getEspacios = async (req,res) => {
    try{
        const {id} = req.params;
        const rows = (id === undefined) ? await EspacioModel.find() : await EspacioModel.findById(id);
        return res.status(200).json({status:true,data:rows});
    }
    catch(error){
        return res.status(500).json({message:false});
    }
};

export const saveEspacio = async(req,res) => {
    try {
        const {nombre,capacidad,ubicacion} = req.body;
        const imagen = '/uploads/'+req.file.filename;
        var validacion = validar(nombre,capacidad,ubicacion);
        if(Object.entries(validacion).length === 0){
            const nuevoEspacio = new EspacioModel({ 
                nombre: nombre,
                capacidad: capacidad,
                imagen: imagen,
                ubicacion:ubicacion
                });
            return await nuevoEspacio.save().then(
                () =>  res.status(200).json({status:true,message:'Espacio guardado'})
            );
        }
        else{
            return res.status(400).json({status:false,errors:validacion});
        }
    }
    catch (error) {
        return res.status(500).json({status:false,errors:[error.message]});
    }
};
export const updateEspacio = async(req,res) => {
    try {
        const {id} = req.params;
        const {nombre,capacidad,ubicacion} = req.body;
        let imagen = '';
        let valores = {
            nombre: nombre,
            capacidad: capacidad,
            ubicacion:ubicacion
        }
        if(req.file != null){
            imagen = '/uploads/'+req.file.filename;
            valores = {
                nombre: nombre,
                capacidad: capacidad,
                ubicacion:ubicacion,
                imagen: imagen
            }
            await eliminarImagen(id);
        }
        var validacion = validar(nombre,capacidad,ubicacion);
        if(Object.entries(validacion).length === 0){
            await EspacioModel.updateOne({_id:id},{$set: valores});
            return res.status(200).json({status:true,message:'Espacio modificado'});
        }
        else{
            return res.status(400).json({status:false,errors:validacion});
        }
    }
    catch (error) {
        return res.status(500).json({status:false,errors:[error.message]});
    }
};
export const deleteEspacio = async(req,res) => {
    try {
        const {id} = req.params;
        await eliminarImagen(id);
        await EspacioModel.deleteOne({_id:id});
        return res.status(200).json({status:true,message:'Espacio eliminado'});
    }
    catch (error) {
        return res.status(500).json({status:false,errors:[error.message]});
    }
};
export const validar = (nombre,capacidad,ubicacion) => {
    var errors =[];
    if(nombre === undefined || nombre.trim() === '' || nombre.lenght > 100){
        errors.push(
            'El nombre NO debe estar vacía y debe tener máximo 100 caracteres'
        );
    }
    if(capacidad === undefined || capacidad.trim() === '' || isNaN(capacidad)){
        errors.push(
            'La capacidad NO debe estar vacía y debe ser numérica'
        );
    }
    if(ubicacion === undefined || ubicacion.trim() === ''){
        errors.push(
            'La ubicación NO debe estar vacía'
        );
    }
    return errors;
}
const eliminarImagen = async(id) =>{
    const esp = await EspacioModel.findById(id);
    const img = esp.imagen;
    fs.unlinkSync('./public'+img)
}