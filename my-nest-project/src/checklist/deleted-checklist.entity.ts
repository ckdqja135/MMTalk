import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('deletedchecklist')
export class DeletedChecklistEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    weekNumber: number;

    @Column()
    content: string;

    @CreateDateColumn()
    deletedAt: Date;

    @Column({ nullable: true }) // completed가 null이 될 수 있도록 함
    completed?: boolean;
}
