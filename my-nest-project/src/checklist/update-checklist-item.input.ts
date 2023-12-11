import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateChecklistItemInput {
    @Field(() => Int, { nullable: true })
    weekNumber?: number;

    @Field({ nullable: true })
    content?: string;
}