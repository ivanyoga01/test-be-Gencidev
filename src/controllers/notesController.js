const NotesService = require('../services/notesService');

class NotesController {
  static async createNote(req, res, next) {
    try {
      const note = await NotesService.createNote(req.body, req.user.id);
      
      res.status(201).json({
        success: true,
        message: 'Note created successfully',
        data: { note },
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async getNotes(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const result = await NotesService.getUserNotes(req.user.id, page, limit);
      
      res.status(200).json({
        success: true,
        message: 'Notes retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async getNoteById(req, res, next) {
    try {
      const noteId = parseInt(req.params.id);
      const note = await NotesService.getNoteById(noteId, req.user.id);
      
      res.status(200).json({
        success: true,
        message: 'Note retrieved successfully',
        data: { note },
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async updateNote(req, res, next) {
    try {
      const noteId = parseInt(req.params.id);
      const note = await NotesService.updateNote(noteId, req.body, req.user.id);
      
      res.status(200).json({
        success: true,
        message: 'Note updated successfully',
        data: { note },
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async deleteNote(req, res, next) {
    try {
      const noteId = parseInt(req.params.id);
      const result = await NotesService.deleteNote(noteId, req.user.id);
      
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = NotesController;