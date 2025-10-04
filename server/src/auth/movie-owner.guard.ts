import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { MovieService } from 'src/movie/movie.service';

@Injectable()
export class MovieOwnerGuard implements CanActivate {
  constructor(private readonly movieService: MovieService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const movieId = request.params.id;

    if (!user || !movieId) return false;

    const movie = await this.movieService.findOne(movieId as string);

    if (!movie) {
      throw new ForbiddenException('Filme não encontrado');
    }

    if (movie.createdBy !== user.id) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este filme',
      );
    }

    return true;
  }
}
