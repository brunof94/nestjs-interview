import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TodoListsModule } from 'src/todo_lists/todo_lists.module';

describe('TodoListsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TodoListsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('TodoLists', () => {
    it('should create a todo list', () => {
      return request(app.getHttpServer())
        .post('/api/todolists')
        .send({ name: 'Test Todo List' })
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toBe('Test Todo List');
          expect(res.body.id).toBeDefined();
          expect(res.body.items).toEqual([]);
        });
    });

    it('should get all todo lists', () => {
      return request(app.getHttpServer())
        .get('/api/todolists')
        .expect(200)
        .expect([]);
    });
  });

  describe('TodoListItems', () => {
    let todoListId: number;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/todolists')
        .send({ name: 'Test Todo List' });
      todoListId = response.body.id;
    });

    it('should get all items from a todo list', () => {
      return request(app.getHttpServer())
        .get(`/api/todolists/${todoListId}/items`)
        .expect(200)
        .expect([]);
    });

    it('should create a todo list item', () => {
      return request(app.getHttpServer())
        .post(`/api/todolists/${todoListId}/items`)
        .send({ title: 'Test Task', completed: false })
        .expect(201)
        .expect((res) => {
          expect(res.body.title).toBe('Test Task');
          expect(res.body.completed).toBe(false);
          expect(res.body.id).toBeDefined();
        });
    });

    it('should update a todo list item', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`/api/todolists/${todoListId}/items`)
        .send({ title: 'Test Task', completed: false });

      const itemId = createResponse.body.id;

      return request(app.getHttpServer())
        .put(`/api/todolists/${todoListId}/items/${itemId}`)
        .send({ title: 'Updated Task', completed: true })
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('Updated Task');
          expect(res.body.completed).toBe(true);
          expect(res.body.id).toBe(itemId);
        });
    });

    it('should delete a todo list item', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`/api/todolists/${todoListId}/items`)
        .send({ title: 'Test Task', completed: false });

      const itemId = createResponse.body.id;

      await request(app.getHttpServer())
        .delete(`/api/todolists/${todoListId}/items/${itemId}`)
        .expect(200);

      return request(app.getHttpServer())
        .get(`/api/todolists/${todoListId}/items`)
        .expect(200)
        .expect([]);
    });
  });
});
