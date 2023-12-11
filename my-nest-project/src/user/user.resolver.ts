import {Resolver, Query, Context, Mutation, Args} from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import {UpdateUserInput} from "./dto/update-user.input";

@Resolver(() => UserEntity)
export class UserResolver {
    constructor(private readonly userService: UserService) {
    }

    @Query(() => [UserEntity])
    async users(): Promise<UserEntity[]> {
        return this.userService.findAll();
    }

    @Query(() => UserEntity, { nullable: true })
    async currentUserInfo(@Context() context: any): Promise<UserEntity | null> {
        const req = context.req; // 직접 req를 추출

        // req에서 사용자 ID 추출
        const userSeq = req.headers['userseq']; // 클라이언트에서 userSeq를 헤더로 보낼 경우

        const user = await this.userService.findUserById(userSeq);

        if (user) {
            user.currentPregnancyWeek = await this.userService.calculateCurrentPregnancyWeek(user.dueDate);
        }
        return user;
    }

    @Mutation(() => UserEntity)
    async updateUserInfo(@Args('input') input: UpdateUserInput): Promise<UserEntity> {
        return this.userService.updateUserInfo(input);
    }
}

