import {Module} from '@nestjs/common';
import {OpenApiController} from './open-api/open-api.controller';
import {OpenApiService} from './open-api/open-api.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [],
            synchronize: true,
        }),
    ],
    controllers: [
        OpenApiController,
    ],
    providers: [
        OpenApiService
    ],
})
export class AppModule {
}
