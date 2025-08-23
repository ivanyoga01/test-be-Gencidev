const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/database');

// Test data
const getTestUser = () => ({
  name: 'Test User',
  email: `test${Date.now()}@example.com`,
  password: 'password123',
});

const testNote = {
  title: 'Test Note',
  content: 'This is a test note content',
};

describe('Notes Endpoints', () => {
  let authToken;
  let userId;

  // Setup: Register user and get auth token
  beforeEach(async () => {
    await prisma.note.deleteMany({});
    await prisma.user.deleteMany({});

    const testUser = getTestUser();

    // Register user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(testUser)
      .expect(201);

    userId = registerResponse.body.data.user.id;

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    authToken = loginResponse.body.data.token;
  });

  afterAll(async () => {
    await prisma.note.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  describe('POST /api/notes', () => {
    it('should create a new note successfully', async () => {
      const response = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testNote)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Note created successfully');
      expect(response.body.data.note.title).toBe(testNote.title);
      expect(response.body.data.note.content).toBe(testNote.content);
      expect(response.body.data.note.userId).toBe(userId);
    });

    it('should return error without authentication', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send(testNote)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return validation error for invalid input', async () => {
      const invalidNote = {
        title: '', // Empty title
        content: 'Valid content',
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidNote)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation error');
    });
  });

  describe('GET /api/notes', () => {
    beforeEach(async () => {
      // Create some test notes
      await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Note 1', content: 'Content 1' });

      await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Note 2', content: 'Content 2' });
    });

    it('should get all user notes successfully', async () => {
      const response = await request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.notes).toHaveLength(2);
      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.data.pagination.total).toBe(2);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/notes?page=1&limit=1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.notes).toHaveLength(1);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(1);
    });

    it('should return error without authentication', async () => {
      const response = await request(app)
        .get('/api/notes')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/notes/:id', () => {
    let noteId;

    beforeEach(async () => {
      // Create a test note
      const createResponse = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testNote);

      noteId = createResponse.body.data.note.id;
    });

    it('should get note by ID successfully', async () => {
      const response = await request(app)
        .get(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.note.id).toBe(noteId);
      expect(response.body.data.note.title).toBe(testNote.title);
    });

    it('should return error for non-existent note', async () => {
      const response = await request(app)
        .get('/api/notes/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(500); // Will be handled by error handler

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/notes/:id', () => {
    let noteId;

    beforeEach(async () => {
      // Create a test note
      const createResponse = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testNote);

      noteId = createResponse.body.data.note.id;
    });

    it('should update note successfully', async () => {
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content',
      };

      const response = await request(app)
        .put(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.note.title).toBe(updateData.title);
      expect(response.body.data.note.content).toBe(updateData.content);
    });

    it('should update partial note data', async () => {
      const updateData = {
        title: 'Only Title Updated',
      };

      const response = await request(app)
        .put(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.note.title).toBe(updateData.title);
      expect(response.body.data.note.content).toBe(testNote.content); // Should remain unchanged
    });

    it('should return error for non-existent note', async () => {
      const response = await request(app)
        .put('/api/notes/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' })
        .expect(500); // Will be handled by error handler

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/notes/:id', () => {
    let noteId;

    beforeEach(async () => {
      // Create a test note
      const createResponse = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testNote);

      noteId = createResponse.body.data.note.id;
    });

    it('should delete note successfully', async () => {
      const response = await request(app)
        .delete(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Note deleted successfully');

      // Verify note is deleted
      const getResponse = await request(app)
        .get(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(500);

      expect(getResponse.body.success).toBe(false);
    });

    it('should return error for non-existent note', async () => {
      const response = await request(app)
        .delete('/api/notes/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(500); // Will be handled by error handler

      expect(response.body.success).toBe(false);
    });
  });
});