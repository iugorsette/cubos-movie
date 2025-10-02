import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Senha incorreta');

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token: this.jwtService.sign({ sub: user.id, email: user.email }),
    };
  }

  async register(name: string, email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { name, email, password: hashed },
    });
    const { password: _, ...userWithoutPassword } = user;

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Email não encontrado');

    const tempPassword = Math.random().toString(36).slice(-8);

    const hashed = await bcrypt.hash(tempPassword, 10);

    await this.prisma.user.update({
      where: { email },
      data: { password: hashed },
    });

    await this.mailService.sendMail(
      email,
      'Recuperação de senha - Movies App',
      `Olá ${user.name},\n\nSua senha temporária é: ${tempPassword}\n\nUse esta senha para entrar e depois troque sua senha.`,
    );

    return { message: 'Senha temporária enviada por email' };
  }
}
