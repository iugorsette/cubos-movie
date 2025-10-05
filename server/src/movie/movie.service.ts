import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { v4 as uuid } from 'uuid';
import { Storage } from '@google-cloud/storage';
import { Prisma } from '@prisma/client';
type MovieSeedInput = CreateMovieDto & { createdBy: string };

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

  private generateMovie(userId: string): MovieSeedInput {
    const generos = [
      'Ação',
      'Drama',
      'Comédia',
      'Terror',
      'Ficção Científica',
      'Romance',
      'Suspense',
      'Animação',
      'Documentário',
    ];

    const classificacoes = [
      'LIVRE',
      'DEZ',
      'DOZE',
      'CATORZE',
      'DEZESSEIS',
      'DEZOITO',
    ];

    const idiomas = ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão'];

    const palavrasTitulos = [
      'Sombras',
      'Destino',
      'Caminho',
      'Guerra',
      'Amor',
      'Noite',
      'Segredo',
      'Guardião',
      'Futuro',
      'Herança',
      'Esperança',
      'Cidade',
    ];

    const adjetivos = [
      'Perdido',
      'Final',
      'Oculto',
      'Proibido',
      'Eterno',
      'Invisível',
      'Mortal',
      'Secreto',
      'Último',
      'Sombrio',
    ];

    const randomInt = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const randomElement = <T>(arr: T[]) =>
      arr[Math.floor(Math.random() * arr.length)];

    const orcamento = randomInt(1_000_000, 200_000_000);
    const receita = randomInt(orcamento, orcamento * 5);

    const titulo = `${randomElement(palavrasTitulos)} ${randomElement(adjetivos)}`;

    const protagonista = randomElement([
      'um jovem herói',
      'uma cientista brilhante',
      'um detetive experiente',
      'uma família comum',
      'um guerreiro lendário',
    ]);
    const conflito = randomElement([
      'um inimigo poderoso',
      'um segredo obscuro',
      'o fim do mundo',
      'um mistério antigo',
      'um amor proibido',
    ]);
    const cenario = randomElement([
      'a tecnologia domina tudo',
      'a magia foi esquecida',
      'os humanos vivem no espaço',
      'os deuses caminham entre os mortais',
      'o futuro é incerto',
    ]);

    return {
      titulo,
      tituloOriginal: titulo,
      subtitulo: `Uma história sobre ${randomElement(['coragem', 'esperança', 'traição', 'redenção', 'aventura'])}`,
      sinopse: `Em um mundo onde ${cenario}, ${protagonista} precisa enfrentar ${conflito} para mudar o destino.`,
      dataLancamento: new Date(
        randomInt(1980, 2025),
        randomInt(0, 11),
        randomInt(1, 28),
      ),
      duracao: randomInt(80, 180),
      generos: Array.from({ length: randomInt(1, 2) }, () =>
        randomElement(generos),
      ),
      popularidade: randomInt(0, 1000),
      votos: randomInt(0, 5000),
      idioma: randomElement(idiomas),
      orcamento,
      receita,
      lucro: receita - orcamento,
      capaUrl: `https://picsum.photos/200/300?random=${randomInt(1, 1000)}`,
      capaFundo: `https://picsum.photos/400/200?random=${randomInt(1, 1000)}`,
      trailerUrl: `https://youtu.be/ZiDphkXCZsQ`,
      classificacaoIndicativa: randomElement(classificacoes),
      createdBy: userId,
    };
  }

  async seedMovies(count = 50, userId: string) {
    await this.prisma.filme.deleteMany({});

    const movies = Array.from({ length: count }).map(() =>
      this.generateMovie(userId),
    );

    return this.prisma.filme.createMany({
      data: movies,
    });
  }

  async create(
    dto: CreateMovieDto,
    userId: string,
    capaFile?: Express.Multer.File,
    capaFundoFile?: Express.Multer.File,
  ) {
    const capaUrl = capaFile ? await this.uploadToGCS(capaFile) : undefined;
    const capaFundo = capaFundoFile
      ? await this.uploadToGCS(capaFundoFile)
      : undefined;

    return this.prisma.filme.create({
      data: {
        ...dto,
        duracao: Number(dto.duracao) || 0,
        popularidade: Number(dto.popularidade) || 0,
        votos: Number(dto.votos) || 0,
        orcamento: Number(dto.orcamento) || 0,
        receita: Number(dto.receita) || 0,
        lucro: Number(dto.lucro) || 0,
        dataLancamento: new Date(dto.dataLancamento),
        capaUrl,
        capaFundo,
        user: { connect: { id: userId } },
      },
      include: { user: true },
    });
  }

  async update(
    id: string,
    dto: Partial<UpdateMovieDto>,
    capaFile?: Express.Multer.File,
    capaFundoFile?: Express.Multer.File,
  ) {
    const data: Partial<UpdateMovieDto> = {};

    const numericFields = [
      'duracao',
      'popularidade',
      'votos',
      'orcamento',
      'receita',
      'lucro',
    ];

    for (const key of Object.keys(dto)) {
      const value = dto[key as keyof typeof dto];
      if (value === undefined || value === null) continue;

      if (numericFields.includes(key)) {
        data[key] = Number(value);
      } else if (key === 'dataLancamento') {
        data[key] = new Date(value as string);
      } else if (!['id', 'createdBy', 'createdAt', 'user'].includes(key)) {
        data[key] = value;
      }
    }

    if (capaFile) data.capaUrl = await this.uploadToGCS(capaFile);
    if (capaFundoFile) data.capaFundo = await this.uploadToGCS(capaFundoFile);

    return this.prisma.filme.update({
      where: { id },
      data,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    generos?: string[];
    classificacoes?: string[];
    sortBy?: 'titulo' | 'dataLancamento' | 'popularidade' | 'createdAt';
    order?: 'asc' | 'desc';
    minDuration?: number;
    maxDuration?: number;
    minPopularity?: number;
    startDate?: string;
    endDate?: string;
    userId?: string;
  }) {
    const {
      skip = 0,
      take = 10,
      sortBy = 'createdAt',
      order = 'desc',
      userId,
      ...filters
    } = params;

    const AND: any[] = [];

    if (userId) AND.push({ user: { id: userId } });

    if (filters.minPopularity) {
      AND.push({ popularidade: { gte: Number(filters.minPopularity) } });
    }

    if (filters.classificacoes && Array.isArray(filters.classificacoes)) {
      const validClassifs = filters.classificacoes.filter(
        (c) => c && c.trim() !== '',
      );
      if (validClassifs.length > 0) {
        AND.push({ classificacaoIndicativa: { in: validClassifs } });
      }
    }

    if (filters.search)
      AND.push({
        OR: [
          { titulo: { contains: filters.search, mode: 'insensitive' } },
          { tituloOriginal: { contains: filters.search, mode: 'insensitive' } },
        ],
      });
    const validGeneros =
      filters.generos?.filter((g) => g && g.trim() !== '') || [];
    if (validGeneros.length > 0) {
      AND.push({ generos: { hasSome: validGeneros } });
    }
    if (filters.minDuration || filters.maxDuration)
      AND.push({
        duracao: {
          gte: filters.minDuration ?? undefined,
          lte: filters.maxDuration ?? undefined,
        },
      });
    if (filters.startDate || filters.endDate)
      AND.push({
        dataLancamento: {
          gte: filters.startDate ? new Date(filters.startDate) : undefined,
          lte: filters.endDate ? new Date(filters.endDate) : undefined,
        },
      });

    const where = { AND };

    const [movies, total] = await Promise.all([
      this.prisma.filme.findMany({
        skip,
        take,
        where,
        orderBy: { [sortBy]: order },
        include: { user: true },
      }),
      this.prisma.filme.count({ where }),
    ]);

    return { movies, total };
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
