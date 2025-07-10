import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class TodoListParamsDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  todoListId: number;
}

export class TodoListItemParamsDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  todoListId: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  itemId: number;
}
