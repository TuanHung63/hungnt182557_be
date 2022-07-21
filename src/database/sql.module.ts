import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('SQL_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('SQL_USERNAME'),
        password: configService.get('SQL_PASSWORD'),
        database: configService.get('SQL_DB_NAME'),
        entities: ['dist/**/*.entity.js'],
        synchronize: true,
        subscribers: ['dist/**/*.entity.js'],
        migrations: ['migration/*.js'],
        cli: {
          migrationsDir: 'migration',
        },
        extra: {
          charset: 'utf8mb4_unicode_ci',
        },
      }),
    }),
  ],
})
export class SqlModule { }
