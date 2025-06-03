import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/user-role.decorator';
import { UserRole } from 'src/utils/enums';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ParseUUIDPipe } from 'src/pipes/parse-uuid.pipe';
import { GetByIdDto } from './dto/get-by-id.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @Post()
  @Roles(UserRole.ADMIN, UserRole.CONTENT_ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard)
  async create(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentsService.create(createCommentDto);
  }

  @Get('')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query()
    query: {
      orderId?: string;
      userId?: string;
      page?: number;
      pageSize?: number;
    },
  ) {
    return this.commentsService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: GetByIdDto,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id.id, updateCommentDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.CONTENT_ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.remove(id);
  }
}
