import {Resolver, Args, Query, Mutation, Int} from '@nestjs/graphql';
import { ChecklistService } from './checklist.service';
import { ChecklistEntity } from './checklist.entity';
import {ChecklistInput} from "./dto/checklist.dto";
import {UpdateChecklistItemInput} from "./update-checklist-item.input";

@Resolver(() => ChecklistEntity)
export class ChecklistResolver {
    constructor(private readonly checklistService: ChecklistService) {}

    @Query(() => [ChecklistEntity])
    async getChecklistByWeek(
        @Args('weekNumber') weekNumber: number,
        @Args('pageSize') pageSize: number,
        @Args('currentPage') currentPage: number,
    ): Promise<ChecklistEntity[]> {
        const skipItems = (currentPage - 1) * pageSize;

        return this.checklistService.getChecklistByWeek(weekNumber, pageSize, currentPage);
    }
    @Mutation(() => ChecklistEntity)
    async updateChecklistItemStatus(
        @Args('id') id: number,
        @Args('completed') completed: boolean,
    ): Promise<ChecklistEntity> {
        return this.checklistService.updateChecklistItemStatus(id, completed);
    }

    @Mutation(() => ChecklistEntity)
    async createChecklistItem(@Args('input') input: ChecklistInput): Promise<ChecklistEntity> {
        // @ts-ignore
        return this.checklistService.createChecklistItem(input);
    }

    @Mutation(() => [ChecklistEntity])
    async undoDeleteChecklistItem(@Args('id', { type: () => Int }) id: number): Promise<ChecklistEntity[]> {
        // @ts-ignore
        return this.checklistService.undoDeleteChecklistItem(id);
    }

    @Mutation(() => ChecklistEntity)
    async deleteChecklistItem(@Args('id', { type: () => Int }) id: number): Promise<ChecklistEntity> {
        return this.checklistService.deleteChecklistItem(id);
    }


    @Mutation(() => ChecklistEntity)
    async updateChecklistItem(
        @Args('id', { type: () => Int }) id: number,
        @Args('updatedData', { type: () => UpdateChecklistItemInput }) updatedData: UpdateChecklistItemInput,
    ): Promise<ChecklistEntity> {
        return this.checklistService.updateChecklistItem(id, updatedData);
    }
}