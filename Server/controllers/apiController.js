import {db} from '../src/prisma/db.js';

    export const getNotes= async(req,res) => {
        try{
            const {patientId} = req.params;

            const notes = await db.orm.public.Note.all({
                where:{
                    patientId
                }
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Failed to retrieve notes."
            })
        }
    };
    
    export const createNote=  async(req,res) => {
        try{
            const {patientId, practitionerId, message} = req.body;

            const note = await db.orm.public.Note.create({
                patientId,
                practitionerId,
                message
            });
            res.status(201).json(note);
        } catch(error) {
            console.error(error);
            res.status(500).json({
                error: 'Failed to create note.'
            })
        }
    };

    export const getFiles = async(req,res) => {
        try{
            const {patientId} = req.params; 

            const files = await db.orm.public.File.all({
                where:{
                    patientId
                }
            })
        } catch(error) {
            console.error(error);
            res.status(500).json({
                error: "Failed to retieve files."
            })
        }
    };

    export const uploadFile =  async(req,res) => {
        try{
            const newUpload = await db.orm.public.File.create({
                fileName: req.file.originalname,
                data: req.file.buffer,
                patientId: req.body.patientId,
                practitionerId: req.body.practitionerId
            })
        }catch(error) {
        console.error(error);
        res.status(500).json({
            error:"Failed to upload file."
        })
    }
    };

    export const deleteNote = async(req,res) => {
        try{
            const {noteId} = req.params;

            const delete = await db.orm.public.Note.delete({
                where:{
                    noteId
                }
            })
        }
    };

    
    export const deleteFile = async(req,res) => {
        try{
            const {fileId} = req.params;

            const delete = await db.orm.public.File.delete({
                where:{
                    fileId
                }
            })
        }
    };