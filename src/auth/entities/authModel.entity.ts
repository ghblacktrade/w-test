import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany
} from 'typeorm';
import {
    IsOptional
} from "class-validator";
import {
    ApiProperty
} from "@nestjs/swagger";

@Entity()
export class AuthModel {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string;

    @Column({ unique: true })
    @ApiProperty()
    email: string;

    @Column()
    @ApiProperty()
    passwordHash: string;

    @Column()
    @IsOptional()
    @ApiProperty()
    fio?: string;
}
