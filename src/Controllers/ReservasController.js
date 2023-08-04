import mongoose from 'mongoose';

const esquema = new mongoose.Schema({
    espacio: String,
    espacio_id: String,
    usuario: String,
    usuario_id: String,
    fecha: Date,
    descripcion: String
  },{versionKey:false});
const ReservasModel = new mongoose.model('reservas',esquema);

export const getReservas = async (req,res) => {
    try{
        const {id} = req.params;
        const rows = (id === undefined) ? await ReservasModel.find() : await ReservasModel.findById(id);
        return res.json({status:true,data:rows});
    }
    catch(error){
        return res.status(500).json({message:false});
    }
};
export const saveReserva = async (req,res) => {
    try {
        const {espacio,usuario,fecha,descripcion,espacio_id,usuario_id} = req.body;
        var validacion = validar(espacio_id,usuario,fecha,descripcion);
        var dupli = await comprobarDisponibilidad(espacio_id,fecha);
        var msj = 'Ya existe una reserva para '+espacio+' en la fecha '+fecha+' intenta con otra fecha';        
        if(Object.entries(validacion).length === 0){
            if(dupli){
                const nuevaReserva = new ReservasModel({ 
                    espacio: espacio,espacio_id:espacio_id,usuario_id:usuario_id, usuario: usuario, fecha: fecha,descripcion:descripcion
                });
                await nuevaReserva.save();
                return res.status(200).json({status:true,message:'Reserva creada'});
            }
            else{
                return res.status(400).json({status:false,errors:[msj]});
            }
        }
        else{
            return res.status(400).json({status:false,errors:validacion});
        }
    }
    catch (error) {
        return res.status(500).json({status:false,errors:[error.message]});
    }
};
export const updateReserva = async (req,res) => {
    try {
        const {id} = req.params;
        const {fecha,espacio,descripcion,espacio_id} = req.body;
        var validacion = validar(espacio,'usuario',fecha,descripcion);
        var dupli = await comprobarDisponibilidad(espacio_id,fecha);
        var msj = 'Ya existe una reserva para '+espacio+' en la fecha '+fecha+' intenta con otra fecha';        
        if(Object.entries(validacion).length === 0){
            if(dupli){
                await ReservasModel.updateOne({_id:id},{$set: {
                    fecha: fecha,descripcion:descripcion
                }});
                return res.status(200).json({status:true,message:'Reserva actualizada'});
            }
            else{
                return res.status(400).json({status:false,errors:[msj]});
            }
        }
        else{
            return res.status(400).json({status:false,errors:validacion});
        }
    }
    catch (error) {
        return res.status(500).json({status:false,errors:[error.message]});
    }
};
export const deleteReserva = async (req,res) => {
    try {
        const {id} = req.params;
        await ReservasModel.deleteOne({_id:id});
        return res.status(200).json({status:true,message:'Reserva eliminada'});
    }
    catch (error) {
        return res.status(500).json({status:false,errors:[error.message]});
    }
};

export const validar = (espacio,usuario,fecha,descripcion) => {
    var errors =[];
    if(espacio === undefined || espacio.trim() === ''){
        errors.push(
            'Debes de seleccionar el espacio a reservar'
        );
    }
    if(usuario === undefined || usuario.trim() === ''){
        errors.push(
            'Debes seleccionar el usuario que va a reservar'
        );
    }
    if(fecha === undefined || fecha.trim() === ''){
        errors.push(
            'Debes seleccionar la fecha de reserva'
        );
    }
    if(descripcion === undefined || descripcion.trim() === ''){
        errors.push(
            'Debes de escribir una descripción'
        );
    }
    return errors;
}
export const getReservasPorUsuario = async (req,res) => {
    try{
        const {id} = req.params;
        const rows = await ReservasModel.find({usuario_id:id});
        return res.json({status:true,data:rows});
    }
    catch(error){
        return res.status(500).json({message:false});
    }
};
export const comprobarDisponibilidad = async(espacio,fecha) => {
    const rows = await ReservasModel.find({espacio_id:espacio,"fecha":{$gte: new Date(fecha+"T00:00:00.000Z")}});
    return (rows.length > 0) ? false : true;
};