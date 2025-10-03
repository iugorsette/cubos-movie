# 🎬 Fullstack Filmes

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-orange)
![Node.js](https://img.shields.io/badge/node-%3E=18-brightgreen)
![NestJS](https://img.shields.io/badge/nestjs-%5E11.0.0-red)
![React](https://img.shields.io/badge/react-%5E18.0.0-blue)
![PostgreSQL](https://img.shields.io/badge/postgresql-%3E=15-blue)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.7.3-blue)

> Projeto Fullstack de cadastro, listagem e gerenciamento de filmes, com frontend em React + TypeScript e backend em NestJS + Prisma + PostgreSQL, utilizando Google Cloud Storage para imagens.

---

## 📂 Estrutura do Projeto
```
 root/
│
├── client/ # Frontend (React + TypeScript)
└── server/ # Backend (NestJS + TypeScript + Prisma + PostgreSQL)
```

## 🛠 Roadmap Completo de Instalação

1. Instalar Node.js, npm/yarn e Docker  
2. Configurar PostgreSQL local (ou via Docker)  
3. Copiar e configurar `.env` do backend com:
   - DATABASE_URL
   - JWT_SECRET
   - GCP_PROJECT_ID
   - GCP_BUCKET_NAME
   - GCP_CREDENTIALS_JSON
4. Instalar dependências do backend (`npm install`)  
5. Migrar banco com Prisma (`npx prisma migrate dev --name init`)  
6. Gerar client Prisma (`npx prisma generate`)  
7. Rodar backend (`npm run start:dev`)  
8. Configurar variáveis do frontend (`REACT_APP_API_URL=http://localhost:3000`)  
9. Instalar dependências do frontend (`npm install`)  
10. Rodar frontend (`npm start`)  

---

## 📌 Observações Importantes

- Criar conta no GCP e Bucket antes de rodar upload de imagens  
- Conceder permissão **Storage Admin** à conta de serviço  
- Prisma Studio: `npx prisma studio` para visualizar banco  

---