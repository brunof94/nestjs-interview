import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateTodoListDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;
}
