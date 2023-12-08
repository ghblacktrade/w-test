import {
    IsString,
    Matches,
    MinLength
} from 'class-validator';

export class AuthDto {
    @IsString()
    login: string;

    @IsString()
    @MinLength(6)
    @Matches(/[\.,!_]/)
    password: string;

    @IsString()
    fio: string;
}