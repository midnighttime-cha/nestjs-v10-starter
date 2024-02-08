import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './shared/exception/all-exception-filter';
import { HelperModule } from './shared/helpers/helper.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SystemModule } from './system/system.module';
import { MasterDataModule } from './master-data/master-data.module';
import { ResponseModule } from './shared/response/response.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      {
        name: "default", // connection name: [String]
        type: "postgres", // database driver:  [String] 'postgres', 'mysql', 'oracle', 'mssql'
        applicationName: process.env.APP_NAME, // application name: [String]
        host: process.env.PG_HOST, // database host
        port: parseInt(process.env.PG_PORT), // database port: [Number]
        username: process.env.PG_USERNAME, // database username: [String]
        password: process.env.PG_PASSWORD, // database password: [String]
        database: process.env.PG_DATABASE, // database name: [String]
        schema: process.env.PG_SCHEMA, // database schema: [String]
        entities: [
          "dist/**/**/*.entity{.ts,.js}" // entity path: [String]
        ],
        autoLoadEntities: true,
        synchronize: true,  // database synchronize: [Boolean] true=update table, false=non update table
        logging: process.env.APP_SERVTYPE === 'LOCAL' ? true : false,  // database log: [Boolean]
        retryDelay: 300,  // database retry delay: [Number]
        maxQueryExecutionTime: process.env.APP_SERVTYPE === 'LOCAL' ? 300 : 0,  // database test query time: [Number]
        connectTimeoutMS: 30000,  // connection timeout: [NUmber]
      }
    ),
    HelperModule,
    UserModule,
    AuthModule,
    SystemModule,
    MasterDataModule,
    ResponseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter
    }
  ],
})
export class AppModule {}
