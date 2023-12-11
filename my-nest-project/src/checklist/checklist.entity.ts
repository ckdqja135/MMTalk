import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('checklistentity')
export class ChecklistEntity {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    weekNumber: number;

    @Column()
    @Field()
    content: string;

    @Column({ default: false }) // 기본값은 false로 설정
    @Field()
    completed: boolean;

    @CreateDateColumn()
    @Field()
    createdAt: Date;
}
