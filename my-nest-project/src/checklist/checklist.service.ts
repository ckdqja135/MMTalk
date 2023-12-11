import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {DeepPartial, FindOneOptions, Repository} from 'typeorm';
import { ChecklistEntity } from './checklist.entity';
import {DeletedChecklistEntity} from "./deleted-checklist.entity";
import {ChecklistInput} from "./dto/checklist.dto";

@Injectable()
export class ChecklistService {
    constructor(
        @InjectRepository(ChecklistEntity)
        private checklistRepository: Repository<ChecklistEntity>,
        @InjectRepository(DeletedChecklistEntity)
        private deletedChecklistRepository: Repository<DeletedChecklistEntity>,
    ) {}

    async getChecklistByWeek(weekNumber: number, pageSize: number, currentPage: number): Promise<ChecklistEntity[]> {
        const skipItems = Math.floor((currentPage - 1) * pageSize);

        return this.checklistRepository.find({
            where: {weekNumber},
            order: {createdAt: 'ASC'}, // createdAt을 기준으로 오름차순 정렬
            take: pageSize,
            skip: skipItems,
        });
    }

    // 체크리스트 데이터 추가용.
    // async createChecklist(checklistData: { weekNumber: number; content: string }[]): Promise<ChecklistEntity[]> {
    //     const checklistEntities = checklistData.map(data => this.checklistRepository.create(data));
    //     return this.checklistRepository.save(checklistEntities);
    // }


    async updateChecklistItemStatus(id: number, completed: boolean): Promise<ChecklistEntity | undefined> {
        try {
            // id를 기반으로 업데이트하고자 하는 항목을 찾음
            const checklistItem = await this.checklistRepository.findOne({
                where: {id}, // id를 기반으로 찾음
            });

            if (checklistItem) {
                // 업데이트할 필드를 설정
                checklistItem.completed = completed;

                // 업데이트를 수행하고 업데이트된 엔터티를 반환
                return await this.checklistRepository.save(checklistItem);
            }

            // 해당 id에 대한 항목을 찾지 못한 경우 undefined 반환
            return undefined;
        } catch (error) {
            // 예외 처리
            console.error('Error updating checklist item status:', error);
            throw error;
        }
    }

    async createChecklistItem(input: ChecklistInput): Promise<ChecklistEntity> {
        try {
            const newItem = this.checklistRepository.create({
                weekNumber: input.weekNumber,
                content: input.content,
                completed: false, // 또는 실제 비즈니스 로직에 따라 설정
            });

            return await this.checklistRepository.save(newItem);
        } catch (error) {
            console.error('Error creating checklist item:', error);
            throw error;
        }
    }

    async updateChecklistItem(id: number, updatedData: { weekNumber?: number; content?: string }): Promise<ChecklistEntity | undefined> {
        try {
            const checklistItem = await this.checklistRepository.findOne( {
                where: {id}, // id를 기반으로 찾음
            });

            if (checklistItem) {
                // 업데이트할 필드가 주어진 경우만 업데이트
                if (updatedData.weekNumber !== undefined) {
                    checklistItem.weekNumber = updatedData.weekNumber;
                }

                if (updatedData.content !== undefined) {
                    checklistItem.content = updatedData.content;
                }

                return await this.checklistRepository.save(checklistItem);
            }

            return undefined;
        } catch (error) {
            console.error('Error updating checklist item:', error);
            throw error;
        }
    }

    async undoDeleteChecklistItem(id: number): Promise<ChecklistEntity[]> {
        try {
            // 휴지통 보관된 데이터에서 삭제되지 않은 상태로 복원
            const deletedItem = await this.deletedChecklistRepository.findOne({
                where: {id}, // id를 기반으로 찾음
            })

            console.log("deletedItem ", deletedItem);
            console.log("id ", id);

            if (deletedItem) {
                const restoredItem = this.checklistRepository.create(deletedItem);
                await this.deletedChecklistRepository.remove(deletedItem);
                console.log("restoredItem ", restoredItem)
                // @ts-ignore
                return restoredItem;
            }

            return undefined; // 해당 id에 대한 삭제된 항목이 없음
        } catch (error) {
            console.error('Error undoing delete for checklist item:', error);
            throw error;
        }
    }

    async deleteChecklistItem(id: number): Promise<ChecklistEntity> {
        try {
            const checklistItem = await this.checklistRepository.findOne({
                where: {id}, // id를 기반으로 찾음
            });

            console.log('checklistItem ', checklistItem)

            if (!checklistItem) {
                throw new Error(`Checklist item with id ${id} not found`);
            }

            // checklistItem을 DeletedChecklistEntity로 이동
            const deletedItem = this.deletedChecklistRepository.create(checklistItem);
            await this.deletedChecklistRepository.save(deletedItem);

            // 데이터 삭제
            await this.checklistRepository.delete(id);

            return checklistItem;
        } catch (error) {
            console.error('Error deleting checklist item:', error);
            throw error;
        }
    }
}