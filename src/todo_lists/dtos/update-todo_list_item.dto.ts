import {
  IsOptional,
  IsString,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateTodoListItemDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
