import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistEntity } from './checklist.entity';
import { ChecklistService } from './checklist.service';
import { ChecklistResolver } from './checklist.resolver';
import {DeletedChecklistEntity} from "./deleted-checklist.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ChecklistEntity, DeletedChecklistEntity])],
    providers: [ChecklistResolver, ChecklistService],
    exports: [ChecklistService],
})
export class ChecklistModule {}