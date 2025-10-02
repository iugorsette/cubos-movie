import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { v4 as uuid } from 'uuid';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class MovieService {
  private storage: Storage;
  private bucketName: string;

  constructor(private readonly prisma: PrismaService) {
    this.storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      credentials: JSON.parse(process.env.GCP_CREDENTIALS_JSON!),
    });
    this.bucketName = process.env.GCP_BUCKET_NAME!;
  }

  private async uploadToGCS(file: Express.Multer.File): Promise<string> {
    if (!file) throw new BadRequestException('Arquivo não enviado');

    const bucket = this.storage.bucket(this.bucketName);
    const filename = `${uuid()}-${file.originalname}`;
    const blob = bucket.file(filename);

    return new Promise<string>((resolve, reject) => {
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
      });

      blobStream.on('error', reject);
      blobStream.on('finish', () =>
        resolve(
          `https://storage.googleapis.com/${this.bucketName}/${filename}`,
        ),
      );

      blobStream.end(file.buffer);
    });
  }

  async create(
    createMovieDto: CreateMovieDto,
    userId: string,
    capaFile?: Express.Multer.File,
    capaFundoFile?: Express.Multer.File,
  ) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new BadRequestException('Usuário não encontrado no banco de dados');
    }

    const capaUrl = capaFile ? await this.uploadToGCS(capaFile) : undefined;
    const capaFundo = capaFundoFile
      ? await this.uploadToGCS(capaFundoFile)
      : undefined;

    const dataLancamento = createMovieDto.dataLancamento
      ? new Date(createMovieDto.dataLancamento)
      : '0000-00-00';

    return this.prisma.filme.create({
      data: {
        titulo: createMovieDto.titulo,
        tituloOriginal: createMovieDto.tituloOriginal,
        sinopse: createMovieDto.sinopse,
        dataLancamento,
        duracao: createMovieDto.duracao,
        generos: createMovieDto.generos,
        idioma: createMovieDto.idioma,
        popularidade: Number(createMovieDto.popularidade) || 0,
        votos: Number(createMovieDto.votos) || 0,
        orcamento: Number(createMovieDto.orcamento) || 0,
        receita: Number(createMovieDto.receita) || 0,
        lucro: Number(createMovieDto.lucro) || 0,
        capaUrl,
        capaFundo,
        trailerUrl: createMovieDto.trailerUrl,
        user: { connect: { id: userId } },
      },
      include: { user: true },
    });
  }

  async update(
    id: string,
    updateMovieDto: Partial<UpdateMovieDto>,
    capaFile?: Express.Multer.File,
    capaFundoFile?: Express.Multer.File,
  ) {
    const numericFields = [
      'popularidade',
      'votos',
      'orcamento',
      'receita',
      'lucro',
    ];

    const data: any = Object.entries(updateMovieDto).reduce(
      (acc, [key, value]) => {
        if (value === undefined || value === null) return acc;

        if (['id', 'createdBy', 'createdAt', 'user'].includes(key)) return acc;

        if (numericFields.includes(key)) {
          acc[key] = Number(value);
        } else if (key === 'dataLancamento') {
          acc[key] = new Date(value as string);
        } else {
          acc[key] = value;
        }

        return acc;
      },
      {} as any,
    );

    if (capaFile) data.capaUrl = await this.uploadToGCS(capaFile);
    if (capaFundoFile) data.capaFundo = await this.uploadToGCS(capaFundoFile);

    return this.prisma.filme.update({
      where: { id },
      data,
    });
  }

  findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    generos?: string[];
    sortBy?: 'titulo' | 'dataLancamento' | 'popularidade' | 'createdAt';
    order?: 'asc' | 'desc';
  }) {
    const {
      skip = 0,
      take = 10,
      search,
      generos,
      sortBy = 'createdAt',
      order = 'desc',
    } = params;

    return this.prisma.filme.findMany({
      skip,
      take,
      where: {
        AND: [
          search
            ? {
                OR: [
                  { titulo: { contains: search, mode: 'insensitive' } },
                  { tituloOriginal: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          generos?.length ? { generos: { hasSome: generos } } : {},
        ],
      },
      orderBy: { [sortBy]: order },
    });
  }

  findOne(id: string) {
    return this.prisma.filme.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  remove(id: string) {
    return this.prisma.filme.delete({ where: { id } });
  }
}
