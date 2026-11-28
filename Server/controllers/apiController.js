import {db} from '../src/prisma/db.js';

export const getNotes = async (req, res) => {
    console.log('1. GET /notes request received');

    try {
        const { patientId } = req.params;

        const notes = await db.orm.public.Note
            .where({ patientId })
            .all();


        return res.status(200).json(notes);

    } catch (error) {
        console.error('Database query failed:', error);

        return res.status(500).json({
            error: 'Failed to retrieve notes.'
        });
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
            console.log('note created')
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

            const files = await db.orm.public.File.where({patientId}).all()
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

            const deleteItem = await db.orm.public.Note.delete({
                where:{
                    noteId
                }
            })
        }catch(error) {
            console.error(error);
            res.status(500).json({
                error: "Failed to delete note"
            })
        }
    };

    
    export const deleteFile = async(req,res) => {
        try{
            const {fileId} = req.params;

            const deleteItem = await db.orm.public.File.delete({
                where:{
                    fileId
                }
            })
        }catch(error) {
            console.error(error);
            res.status(500).json({
                error: "Failed to delete file"
            })
        }
    };