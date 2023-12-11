import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import {TypeOrmModule} from "@nestjs/typeorm";
import { UserEntity } from './user/user.entity';
import { ChecklistEntity } from './checklist/checklist.entity';
import { UserModule } from './user/user.module';
import { ChecklistModule } from './checklist/checklist.module';
import {ChecklistResolver} from "./checklist/checklist.resolver";
import {DeletedChecklistEntity} from "./checklist/deleted-checklist.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      "type": "mysql",
      "host": "localhost",
      "port": 3306,
      "username": "root",
      "password": "123456",
      "database": "userentity",
      "entities": [UserEntity, ChecklistEntity, DeletedChecklistEntity],
      "synchronize": false,
      "logging": true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: 'schema.gql',
      driver: ApolloDriver,
      context: ({ req }) => ({ req })
    }),
    UserModule,
    ChecklistModule,
  ],
  providers: [ChecklistResolver],
})
export class AppModule {}
