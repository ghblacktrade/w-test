import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuthModel } from '../../auth/entities/authModel.entity';
import {
    ApiProperty
} from "@nestjs/swagger";

@Entity()
export class WeatherEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @ManyToOne(() => AuthModel, (user) => user.id)
    @JoinColumn({ name: 'ser_id' })
    @ApiProperty()
    user: AuthModel;

    @Column({ type: 'bigint' })
    @ApiProperty()
    action_time: number;

    @Column()
    @ApiProperty()
    request_result: number;

    @Column({ nullable: true })
    @ApiProperty()
    temp_c: number;
}


