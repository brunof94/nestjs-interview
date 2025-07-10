import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TodoListsService } from './todo_lists.service';

describe('TodoListsService Error Handling', () => {
  let service: TodoListsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoListsService],
    }).compile();

    service = module.get<TodoListsService>(TodoListsService);
  });

  describe('get', () => {
    it('should throw NotFoundException when todolist not found', () => {
      expect(() => service.get(999)).toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when todolist not found', () => {
      expect(() => service.update(999, { name: 'test' })).toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException when todolist not found', () => {
      expect(() => service.delete(999)).toThrow(NotFoundException);
    });
  });

  describe('getItem', () => {
    it('should throw NotFoundException when todolist not found', () => {
      expect(() => service.getItem(999, 1)).toThrow(NotFoundException);
    });
  });
});
