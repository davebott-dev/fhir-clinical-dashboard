import express from 'express';
import multer from 'multer';
const router = express.Router();
const upload = multer();
import * as controller from '../controllers/apiController.js';

// READ routes
router.get('/notes/:patientId', controller.getNotes);
router.get('/files/:patientId', controller.getFiles);

// CREATE routes
router.post('/notes/create', controller.createNote);
router.post('/files/upload', upload.single('file'), controller.uploadFile);

// DELTE routes
router.post('/note/:noteId/delete', controller.deleteNote);
router.post('/file/:fileId/delete', controller.deleteFile);

export default router;