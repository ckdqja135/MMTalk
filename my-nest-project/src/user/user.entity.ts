import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field } from "@nestjs/graphql";

@Entity('userentity')
@ObjectType()
export class UserEntity {
    @PrimaryGeneratedColumn()
    @Field()
    seq: number;

    @Column()
    @Field()
    nickname: string;

    @Column()
    @Field()
    dueDate: string;

    @Column({ nullable: true }) // 현재 임신 주차는 예정일이 지난 후에 계산되므로 nullable로 설정
    @Field({ nullable: true })
    currentPregnancyWeek?: number;
}