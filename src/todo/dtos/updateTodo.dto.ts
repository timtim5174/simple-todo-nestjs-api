import {IsBoolean, IsString} from "class-validator";

export class UpdateTodoDTO {
    @IsString()
    text: string;

    @IsBoolean()
    isCompleted: boolean;
}
