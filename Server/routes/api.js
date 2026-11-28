const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/orm-postgres');
const prisma = new PrismaClient();
const multer = require('multer');
const upload = multer();
const controller = require('../controllers/apiController');

router.get('/notes', controller.getNotes);
router.get('/files', controller.getFiles);

router.post('/notes/create', controller.createNote);
router.post('files/upload', upload.single('file'), controller.uploadFile);

module.exports = router;