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
    const capaFile = files.capaFile?.[0];
    const capaFundoFile = files.capaFundoFile?.[0];

    return this.movieService.create(
      dto,
      req.user.id as string,
      capaFile,
      capaFundoFile,
    );
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
    @Query('generos') generos?: string,
    @Query('sortBy') sortBy?: 'titulo' | 'dataLancamento' | 'popularidade',
    @Query('order') order?: 'asc' | 'desc',
  ) {
    const parsedGeneros = generos ? generos.split(',') : [];
    return this.movieService.findAll({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      search,
      generos: parsedGeneros,
      sortBy,
      order,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
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
    const capaFile = files.capaFile?.[0];
    const capaFundoFile = files.capaFundoFile?.[0];

    return this.movieService.update(id, dto, capaFile, capaFundoFile);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movieService.remove(id);
  }
}
