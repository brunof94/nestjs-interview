import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { CreateTodoListItemDto } from './dtos/create-todo_list_item.dto';
import { UpdateTodoListItemDto } from './dtos/update-todo_list_item.dto';
import { TodoListParamsDto, TodoListItemParamsDto } from './dtos/params.dto';
import { TodoList } from '../interfaces/todo_list.interface';
import { TodoListItem } from '../interfaces/todo_list_item.interface';
import { TodoListsService } from './todo_lists.service';

@Controller('api/todolists')
export class TodoListsController {
  constructor(private todoListsService: TodoListsService) {}

  @Get()
  index(): TodoList[] {
    return this.todoListsService.all();
  }

  @Get('/:todoListId')
  show(@Param() param: TodoListParamsDto): TodoList {
    return this.todoListsService.get(param.todoListId);
  }

  @Post()
  create(@Body() dto: CreateTodoListDto): TodoList {
    return this.todoListsService.create(dto);
  }

  @Put('/:todoListId')
  update(
    @Param() param: TodoListParamsDto,
    @Body() dto: UpdateTodoListDto,
  ): TodoList {
    return this.todoListsService.update(param.todoListId, dto);
  }

  @Delete('/:todoListId')
  delete(@Param() param: TodoListParamsDto): void {
    this.todoListsService.delete(param.todoListId);
  }

  // TodoListItem routes
  @Get('/:todoListId/todos')
  getAllItems(@Param() param: TodoListParamsDto): TodoListItem[] {
    return this.todoListsService.getAllItems(param.todoListId);
  }

  @Get('/:todoListId/todos/:itemId')
  getItem(@Param() param: TodoListItemParamsDto): TodoListItem {
    return this.todoListsService.getItem(param.todoListId, param.itemId);
  }

  @Post('/:todoListId/todos')
  createItem(
    @Param() param: TodoListParamsDto,
    @Body() dto: CreateTodoListItemDto,
  ): TodoListItem {
    return this.todoListsService.createItem(param.todoListId, dto);
  }

  @Put('/:todoListId/todos/:itemId')
  updateItem(
    @Param() param: TodoListItemParamsDto,
    @Body() dto: UpdateTodoListItemDto,
  ): TodoListItem {
    return this.todoListsService.updateItem(
      param.todoListId,
      param.itemId,
      dto,
    );
  }

  @Delete('/:todoListId/todos/:itemId')
  deleteItem(@Param() param: TodoListItemParamsDto): void {
    this.todoListsService.deleteItem(param.todoListId, param.itemId);
  }
}
