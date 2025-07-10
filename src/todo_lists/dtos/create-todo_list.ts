import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateTodoListDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;
}
