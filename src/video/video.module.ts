import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entity/video.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateVideoHandler } from './create-video-handler';
import { VideoCreatedHandler } from './video-created-handler';
import { FindVideosQueryHandler } from './find-videos-handler';

@Module({
  imports: [TypeOrmModule.forFeature([Video]), CqrsModule],
  controllers: [VideoController],
  providers: [VideoService, CreateVideoHandler, VideoCreatedHandler, FindVideosQueryHandler]
})
export class VideoModule {}
