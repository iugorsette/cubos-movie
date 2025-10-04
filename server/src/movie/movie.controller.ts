import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SeedMoviesDto } from './dto/seed-movies.dto';
import { MovieOwnerGuard } from 'src/auth/movie-owner.guard';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'capaFile', maxCount: 1 },
      { name: 'capaFundoFile', maxCount: 1 },
    ]),
  )
  async create(
    @UploadedFiles()
    files: {
      capaFile?: Express.Multer.File[];
      capaFundoFile?: Express.Multer.File[];
    },
    @Body() dto: CreateMovieDto,
    @Req() req,
  ) {
    return this.movieService.create(
      dto,
      req.user.id as string,
      files.capaFile?.[0],
      files.capaFundoFile?.[0],
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Req() req,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
    @Query('generos') generos?: string,
    @Query('classificacoesIndicativas') classificacoes?: string,
    @Query('sortBy') sortBy?: 'titulo' | 'dataLancamento' | 'popularidade',
    @Query('order') order?: 'asc' | 'desc',
    @Query('minDuration') minDuration?: string,
    @Query('maxDuration') maxDuration?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const parsedGeneros = generos?.split(',') || [];
    const parsedClassificacoes = classificacoes?.split(',') || [];

    return this.movieService.findAll({
      skip: skip ? Number(skip) : 0,
      take: take ? Number(take) : 10,
      search,
      generos: parsedGeneros,
      classificacoes: parsedClassificacoes,
      sortBy,
      order,
      minDuration: minDuration ? Number(minDuration) : undefined,
      maxDuration: maxDuration ? Number(maxDuration) : undefined,
      startDate,
      endDate,
      userId: req.user.id,
    });
  }

  @UseGuards(JwtAuthGuard, MovieOwnerGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, MovieOwnerGuard)
  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'capaFile', maxCount: 1 },
      { name: 'capaFundoFile', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      capaFile?: Express.Multer.File[];
      capaFundoFile?: Express.Multer.File[];
    },
    @Body() dto: UpdateMovieDto,
  ) {
    return this.movieService.update(
      id,
      dto,
      files.capaFile?.[0],
      files.capaFundoFile?.[0],
    );
  }

  @UseGuards(JwtAuthGuard, MovieOwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movieService.remove(id);
  }

  @Post('seed')
  async seed(@Body() body: SeedMoviesDto) {
    const count = body.count ?? 50;
    const userId = 'e2541014-7c85-4998-938c-bacee7b71726'; // id conta sistema
    const result = await this.movieService.seedMovies(count, userId);
    return { message: `${count} filmes criados com sucesso!`, result };
  }
}
