import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TodoListsController } from './todo_lists.controller';
import { TodoListsService } from './todo_lists.service';

describe('TodoListsController', () => {
  let todoListService: TodoListsService;
  let todoListsController: TodoListsController;

  beforeEach(async () => {
    todoListService = new TodoListsService([
      { id: 1, name: 'test1', items: [] },
      { id: 2, name: 'test2', items: [] },
    ]);

    const app: TestingModule = await Test.createTestingModule({
      controllers: [TodoListsController],
      providers: [{ provide: TodoListsService, useValue: todoListService }],
    }).compile();

    todoListsController = app.get<TodoListsController>(TodoListsController);
  });

  describe('index', () => {
    it('should return the list of todolist', () => {
      expect(todoListsController.index()).toEqual([
        { id: 1, name: 'test1', items: [] },
        { id: 2, name: 'test2', items: [] },
      ]);
    });
  });

  describe('show', () => {
    it('should return the todolist with the given id', () => {
      expect(todoListsController.show({ todoListId: 1 })).toEqual({
        id: 1,
        name: 'test1',
        items: [],
      });
    });

    it('should throw NotFoundException when todolist not found', () => {
      expect(() => todoListsController.show({ todoListId: 999 })).toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update the todolist with the given id', () => {
      expect(
        todoListsController.update({ todoListId: 1 }, { name: 'modified' }),
      ).toEqual({ id: 1, name: 'modified', items: [] });

      expect(todoListService.get(1).name).toEqual('modified');
    });

    it('should throw NotFoundException when todolist not found', () => {
      expect(() =>
        todoListsController.update({ todoListId: 999 }, { name: 'modified' }),
      ).toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new todolist', () => {
      expect(todoListsController.create({ name: 'new' })).toEqual({
        id: 3,
        name: 'new',
        items: [],
      });

      expect(todoListService.all().length).toBe(3);
    });
  });

  describe('delete', () => {
    it('should delete the todolist with the given id', () => {
      expect(() => todoListsController.delete({ todoListId: 1 })).not.toThrow();

      expect(todoListService.all().map((x) => x.id)).toEqual([2]);
    });

    it('should throw NotFoundException when todolist not found', () => {
      expect(() => todoListsController.delete({ todoListId: 999 })).toThrow(
        NotFoundException,
      );
    });
  });

  describe('TodoListItem operations', () => {
    beforeEach(() => {
      // Ensure we have a todo list with some items for testing
      todoListService.createItem(1, { title: 'Test item 1', completed: false });
      todoListService.createItem(1, { title: 'Test item 2', completed: true });
    });

    describe('getAllItems', () => {
      it('should return all items for a todolist', () => {
        const items = todoListsController.getAllItems({ todoListId: 1 });
        expect(items).toHaveLength(2);
        expect(items[0].title).toBe('Test item 1');
        expect(items[1].title).toBe('Test item 2');
      });
    });

    describe('getItem', () => {
      it('should return a specific item', () => {
        const item = todoListsController.getItem({ todoListId: 1, itemId: 1 });
        expect(item.title).toBe('Test item 1');
        expect(item.completed).toBe(false);
      });

      it('should throw NotFoundException when item not found', () => {
        expect(() =>
          todoListsController.getItem({ todoListId: 1, itemId: 999 }),
        ).toThrow(NotFoundException);
      });

      it('should throw NotFoundException when todolist not found', () => {
        expect(() =>
          todoListsController.getItem({ todoListId: 999, itemId: 1 }),
        ).toThrow(NotFoundException);
      });
    });

    describe('createItem', () => {
      it('should create a new todo item', () => {
        const newItem = todoListsController.createItem(
          { todoListId: 1 },
          { title: 'New item', completed: false },
        );
        expect(newItem.title).toBe('New item');
        expect(newItem.completed).toBe(false);
        expect(newItem.id).toBeDefined();
      });
    });

    describe('updateItem', () => {
      it('should update an existing todo item', () => {
        const updatedItem = todoListsController.updateItem(
          { todoListId: 1, itemId: 1 },
          { title: 'Updated item', completed: true },
        );
        expect(updatedItem.title).toBe('Updated item');
        expect(updatedItem.completed).toBe(true);
      });

      it('should throw a NotFoundException if the item does not exist', () => {
        expect(() =>
          todoListsController.updateItem(
            { todoListId: 1, itemId: 999 },
            { title: 'Updated item', completed: true },
          ),
        ).toThrow(NotFoundException);
      });
    });

    describe('deleteItem', () => {
      it('should delete a todo item', () => {
        expect(() =>
          todoListsController.deleteItem({ todoListId: 1, itemId: 1 }),
        ).not.toThrow();

        const items = todoListsController.getAllItems({ todoListId: 1 });
        expect(items).toHaveLength(1);
        expect(items[0].id).toBe(2);
      });

      it('should throw a NotFoundException if the item does not exist', () => {
        expect(() =>
          todoListsController.deleteItem({ todoListId: 1, itemId: 999 }),
        ).toThrow(NotFoundException);
      });
    });
  });
});
