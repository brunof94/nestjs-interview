import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateTodoListDto } from './create-todo_list';
import { UpdateTodoListDto } from './update-todo_list';
import { CreateTodoListItemDto } from './create-todo_list_item.dto';
import { UpdateTodoListItemDto } from './update-todo_list_item.dto';
import { TodoListParamsDto, TodoListItemParamsDto } from './params.dto';

describe('DTO Validation', () => {
  describe('CreateTodoListDto', () => {
    it('should pass validation with valid data', async () => {
      const dto = new CreateTodoListDto();
      dto.name = 'Valid Todo List';
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with empty name', async () => {
      const dto = new CreateTodoListDto();
      dto.name = '';
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation with name too long', async () => {
      const dto = new CreateTodoListDto();
      dto.name = 'a'.repeat(101); // 101 characters
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('should fail validation with non-string name', async () => {
      const dto = new CreateTodoListDto();
      dto.name = 123 as any;
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('UpdateTodoListDto', () => {
    it('should pass validation with valid data', async () => {
      const dto = new UpdateTodoListDto();
      dto.name = 'Updated Todo List';
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with undefined name (optional)', async () => {
      const dto = new UpdateTodoListDto();
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with empty name', async () => {
      const dto = new UpdateTodoListDto();
      dto.name = '';
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('minLength');
    });
  });

  describe('CreateTodoListItemDto', () => {
    it('should pass validation with valid data', async () => {
      const dto = new CreateTodoListItemDto();
      dto.title = 'Valid task';
      dto.completed = true;
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation without completed field (optional)', async () => {
      const dto = new CreateTodoListItemDto();
      dto.title = 'Valid task';
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with empty title', async () => {
      const dto = new CreateTodoListItemDto();
      dto.title = '';
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation with title too long', async () => {
      const dto = new CreateTodoListItemDto();
      dto.title = 'a'.repeat(201); // 201 characters
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('should fail validation with non-boolean completed', async () => {
      const dto = new CreateTodoListItemDto();
      dto.title = 'Valid task';
      dto.completed = 'true' as any;
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('isBoolean');
    });
  });

  describe('UpdateTodoListItemDto', () => {
    it('should pass validation with valid data', async () => {
      const dto = new UpdateTodoListItemDto();
      dto.title = 'Updated task';
      dto.completed = false;
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with empty object (all optional)', async () => {
      const dto = new UpdateTodoListItemDto();
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('TodoListParamsDto', () => {
    it('should pass validation with valid todoListId', async () => {
      const dto = new TodoListParamsDto();
      dto.todoListId = 1;
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with negative todoListId', async () => {
      const dto = new TodoListParamsDto();
      dto.todoListId = -1;
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('isPositive');
    });

    it('should fail validation with non-integer todoListId', async () => {
      const dto = new TodoListParamsDto();
      dto.todoListId = 1.5;
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty('isInt');
    });
  });

  describe('TodoListItemParamsDto', () => {
    it('should pass validation with valid ids', async () => {
      const dto = new TodoListItemParamsDto();
      dto.todoListId = 1;
      dto.itemId = 2;
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid ids', async () => {
      const dto = new TodoListItemParamsDto();
      dto.todoListId = 0;
      dto.itemId = -1;
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(2);
      expect(errors[0].constraints).toHaveProperty('isPositive');
      expect(errors[1].constraints).toHaveProperty('isPositive');
    });
  });
});
