const express = require('express');
const NotesController = require('../controllers/notesController');
const { validateRequest } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const { noteCreateSchema, noteUpdateSchema } = require('../utils/validation');

const router = express.Router();

// All notes routes are protected
router.use(authenticateToken);

// CRUD operations
router.post('/', validateRequest(noteCreateSchema), NotesController.createNote);
router.get('/', NotesController.getNotes);
router.get('/:id', NotesController.getNoteById);
router.put('/:id', validateRequest(noteUpdateSchema), NotesController.updateNote);
router.delete('/:id', NotesController.deleteNote);

module.exports = router;