-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Filme" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "tituloOriginal" TEXT,
    "sinopse" TEXT,
    "dataLancamento" TIMESTAMP(3) NOT NULL,
    "duracao" TEXT,
    "popularidade" DOUBLE PRECISION,
    "votos" INTEGER,
    "idioma" TEXT,
    "orcamento" DOUBLE PRECISION,
    "receita" DOUBLE PRECISION,
    "lucro" DOUBLE PRECISION,
    "generos" TEXT[],
    "capaUrl" TEXT,
    "capaFundo" TEXT,
    "trailerUrl" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Filme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Filme" ADD CONSTRAINT "Filme_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
