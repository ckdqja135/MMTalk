// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions  } from 'typeorm';
import { UserEntity } from './user.entity';
import {UpdateUserInput} from "./dto/update-user.input";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) {}

    async findAll(): Promise<UserEntity[]> {
        return this.userRepository.find();
    }

    async findUserById(userId: number): Promise<UserEntity | undefined> {
        const options: FindOneOptions<UserEntity> = {
            where: { seq: userId },
        };

        console.log("options ", options);

        return this.userRepository.findOne(options);
    }

    async calculateCurrentPregnancyWeek(dueDate: string): Promise<number | null> {
        // 현재 임신 주차를 계산하는 로직
        const today = new Date();
        const dueDateObj = new Date(dueDate);
        const timeDiff = dueDateObj.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        const pregnancyWeek = Math.floor((280 - daysDiff) / 7);
        return pregnancyWeek >= 0 && pregnancyWeek <= 40 ? pregnancyWeek : null;
    }

    async updateUserInfo(input: UpdateUserInput): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: { seq: +input.userSeq },
        });

        if (!user) {
            // 사용자를 찾지 못했을 경우 예외처리 또는 메시지 반환
            return null;
        }

        // 사용자 정보 업데이트
        if (input.nickname) {
            user.nickname = input.nickname;
        }
        // 데이터베이스에 저장
        await this.userRepository.save(user);

        return user;
    }
}
