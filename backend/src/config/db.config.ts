import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const dbConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USER'),
    password: String(configService.get('DATABASE_PASSWORD')),
    database: configService.get<string>('DATABASE_NAME'),
    synchronize: true,
    autoLoadEntities: true,
})
