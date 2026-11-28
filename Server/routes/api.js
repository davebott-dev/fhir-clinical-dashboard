const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const controller = require('../controllers/apiController');

// READ routes
router.get('/notes/:patientId', controller.getNotes);
router.get('/files/:patientId', controller.getFiles);

// CREATE routes
router.post('/notes/create', controller.createNote);
router.post('/files/upload', upload.single('file'), controller.uploadFile);

router.post('/note/:noteId/delete', controller.deleteNote);
router.post('/file/:fileId/delete', controller.deleteFile);

export default router;