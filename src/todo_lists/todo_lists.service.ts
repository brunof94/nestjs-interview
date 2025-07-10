import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { CreateTodoListItemDto } from './dtos/create-todo_list_item.dto';
import { UpdateTodoListItemDto } from './dtos/update-todo_list_item.dto';
import { TodoList } from '../interfaces/todo_list.interface';
import { TodoListItem } from '../interfaces/todo_list_item.interface';

@Injectable()
export class TodoListsService {
  private readonly todoLists: TodoList[];

  constructor(todoLists: TodoList[] = []) {
    this.todoLists = todoLists;
  }

  all(): TodoList[] {
    return this.todoLists;
  }

  private getTodoList(id: number): TodoList {
    const todoList = this.todoLists.find((x) => x.id === Number(id));
    if (!todoList) {
      throw new NotFoundException(`TodoList with id ${id} not found`);
    }
    return todoList;
  }

  get(id: number): TodoList {
    return this.getTodoList(id);
  }

  create(dto: CreateTodoListDto): TodoList {
    const todoList: TodoList = {
      id: this.nextId(),
      name: dto.name,
      items: [],
    };

    this.todoLists.push(todoList);

    return todoList;
  }

  update(id: number, dto: UpdateTodoListDto): TodoList {
    const todoList = this.getTodoList(id);

    // Update the record
    todoList.name = dto.name;

    return todoList;
  }

  delete(id: number): void {
    const index = this.todoLists.findIndex((x) => x.id == Number(id));

    if (index === -1) {
      throw new NotFoundException(`TodoList with id ${id} not found`);
    }

    this.todoLists.splice(index, 1);
  }

  // TodoListItem methods
  getAllItems(todoListId: number): TodoListItem[] {
    const todoList = this.getTodoList(todoListId);
    return todoList.items || [];
  }

  getItem(todoListId: number, itemId: number): TodoListItem {
    const todoList = this.getAllItems(todoListId);
    const item = todoList.find((item) => item.id === Number(itemId));
    if (!item) {
      throw new NotFoundException(
        `TodoListItem with id ${itemId} not found in TodoList ${todoListId}`,
      );
    }
    return item;
  }

  createItem(todoListId: number, dto: CreateTodoListItemDto): TodoListItem {
    const todoList = this.getTodoList(todoListId);

    if (!todoList.items) {
      todoList.items = [];
    }

    const newItem: TodoListItem = {
      id: this.nextItemId(todoList.items),
      title: dto.title,
      completed: dto.completed || false,
    };

    todoList.items.push(newItem);
    return newItem;
  }

  updateItem(
    todoListId: number,
    itemId: number,
    dto: UpdateTodoListItemDto,
  ): TodoListItem {
    const todoList = this.getTodoList(todoListId);

    const item = todoList.items?.find((item) => item.id === Number(itemId));
    if (!item) {
      throw new NotFoundException(
        `TodoListItem with id ${itemId} not found in TodoList ${todoListId}`,
      );
    }

    if (dto.title !== undefined) {
      item.title = dto.title;
    }
    if (dto.completed !== undefined) {
      item.completed = dto.completed;
    }

    return item;
  }

  deleteItem(todoListId: number, itemId: number): void {
    const todoList = this.getTodoList(todoListId);

    const itemIndex = todoList.items.findIndex(
      (item) => item.id === Number(itemId),
    );
    if (itemIndex === -1) {
      throw new NotFoundException(
        `TodoListItem with id ${itemId} not found in TodoList ${todoListId}`,
      );
    }

    todoList.items.splice(itemIndex, 1);
  }

  private nextId(): number {
    const last = this.todoLists
      .map((x) => x.id)
      .sort()
      .reverse()[0];

    return last ? last + 1 : 1;
  }

  private nextItemId(items: TodoListItem[]): number {
    if (!items || items.length === 0) {
      return 1;
    }

    const last = items
      .map((x) => x.id)
      .sort()
      .reverse()[0];

    return last ? last + 1 : 1;
  }
}
