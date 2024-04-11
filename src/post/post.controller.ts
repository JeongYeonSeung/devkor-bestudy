import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt-access.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostLikeToggleDto } from './dto/post-like-toggle.dto';
import { PageOptionsDto } from './dto/page-options.dto';
import { PageDto } from './dto/page.dto';
import { PostEntity } from 'src/entities/post.entity';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getPostList(
    @Query() pageOptions: PageOptionsDto,
  ): Promise<PageDto<PostEntity>> {
    return await this.postService.getPostList(pageOptions);
  }

  // 게시글 생성
  @UseGuards(JwtAccessAuthGuard)
  @Post()
  async createPost(@Body() body: CreatePostDto, @Req() req) {
    const user = req.user;
    const title = body.title;
    const content = body.content;

    const post = await this.postService.createPost(user.id, title, content);
    return post;
  }

  // 게시글 불러오기
  @UseGuards(JwtAccessAuthGuard)
  @Get('/:postId')
  async getPostInfo(@Param('postId') postId: string, @Req() req) {
    const user = req.user;
    const postInfo = await this.postService.getPostInfo(
      Number(postId),
      user.id,
    );

    return postInfo;
  }

  // 게시글 삭제하기
  @UseGuards(JwtAccessAuthGuard)
  @Delete('/:postId')
  async deletePost(@Param('postId') postId: string, @Req() req) {
    const user = req.user;
    await this.postService.deletePost(Number(postId), user.id);
  }

  // 게시글 좋아요/좋아요 취소하기
  @UseGuards(JwtAccessAuthGuard)
  @Post('like-toggle')
  async postLikeToggle(@Body() body: PostLikeToggleDto, @Req() req) {
    const user = req.user;
    await this.postService.postLikeToggle(Number(body.postId), user.id);
  }
}