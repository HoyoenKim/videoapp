import { MiddlewareConsumer, Module, NestModule, Logger } from '@nestjs/common';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { VideoModule } from './video/video.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import postgresConfig from './config/postgres.config';
import jwtConfig from './config/jwt.config';
import { User } from './user/entity/user.entity';
import { RefreshToken } from './auth/entity/refresh-token.entity';
import { Video } from './video/entity/video.entity';
import { JwtModule } from '@nestjs/jwt';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import swaggerConfig from './config/swagger.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import { EmailModule } from './email/email.module';
import sentryConfig from './config/sentry.config';
import emailConfig from './config/email.config';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [postgresConfig, jwtConfig, swaggerConfig, sentryConfig, emailConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        let obj: TypeOrmModuleOptions = {
          type: 'postgres',
          host: configService.get('postgres.host'),
          port: configService.get('postgres.port'),
          database: configService.get('postgres.database'),
          username: configService.get('postgres.username'),
          password: configService.get('postgres.password'),
          autoLoadEntities: true,
          synchronize: false,
        };
        if (configService.get('STAGE') === 'local') {
          console.log('Sync postgres');
          obj = Object.assign(obj, {
            //synchronize: true,
            logging: true,
          })
        }
        return obj;
      },
    }),
    AnalyticsModule, 
    AuthModule, 
    UserModule, 
    VideoModule, HealthModule, EmailModule
  ],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
      consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
