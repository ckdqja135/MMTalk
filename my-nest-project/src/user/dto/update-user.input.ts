import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
    @Field(() => Int)
    userSeq: number;

    @Field({ nullable: true })
    nickname: string;

    @Field({ nullable: true })
    dueDate: string;
}
