import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ChecklistInput {
    @Field()
    weekNumber: number;

    @Field()
    content: string;
}