import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateTodoListItemDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean = false;
}
