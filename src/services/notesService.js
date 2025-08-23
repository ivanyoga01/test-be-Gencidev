const prisma = require('../config/database');

class NotesService {
  static async createNote(noteData, userId) {
    const { title, content } = noteData;
    
    const note = await prisma.note.create({
      data: {
        title,
        content: content || '',
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    return note;
  }
  
  static async getUserNotes(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.note.count({
        where: { userId },
      }),
    ]);
    
    return {
      notes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  
  static async getNoteById(noteId, userId) {
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    if (!note) {
      throw new Error('Note not found');
    }
    
    return note;
  }
  
  static async updateNote(noteId, updateData, userId) {
    // First check if note exists and belongs to user
    const existingNote = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId,
      },
    });
    
    if (!existingNote) {
      throw new Error('Note not found');
    }
    
    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    return updatedNote;
  }
  
  static async deleteNote(noteId, userId) {
    // First check if note exists and belongs to user
    const existingNote = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId,
      },
    });
    
    if (!existingNote) {
      throw new Error('Note not found');
    }
    
    await prisma.note.delete({
      where: { id: noteId },
    });
    
    return { message: 'Note deleted successfully' };
  }
}

module.exports = NotesService;