# Desafio Fullstack - Cubos Tecnologia

## 1. Objetivo
O objetivo deste desafio é desenvolver uma aplicação web completa e responsiva, cobrindo
tanto o frontend quanto o backend. A aplicação deve permitir que os usuários realizem as
operações de adicionar, editar, excluir e visualizar detalhes de filmes. Adicionalmente,
são essenciais as funcionalidades de busca e filtragem dentro da lista de filmes.

## 2. Design
A criação da interface do usuário deve seguir fielmente o design fornecido no Figma. A
fidelidade visual será um ponto de avaliação importante. Contudo, encorajamos e
valorizamos a implementação de melhorias e modificações criativas, desde que estas sejam
claramente justificadas no arquivo README.md.
Pontos que requerem sua atenção especial:


Responsividade: O design apresenta especificações para larguras de 1366 e 414
pixels. É crucial abordar e garantir a responsividade adequada para todas as dimensões
intermediárias e maiores, assegurando uma experiência consistente em diferentes
dispositivos.

Detalhes do Usuário (UX/UI): Elementos que aprimoram a experiência do usuário (UX) e
a navegabilidade podem não estar explicitamente detalhados no design. Espera-se que você
utilize sua criatividade e conhecimento técnico para implementar tais melhorias,
aprimorando a interface e a usabilidade geral.

Acesse o figma para visualizar o design

### 2.1 Cores e Temas
A paleta de cores foi definida utilizando o Radix Colors, um sistema conhecido por suas
escalas de cores acessíveis e fáceis de implementar. Embora o Radix Colors sirva como base
para o design, o uso da biblioteca de componentes Radix não é obrigatório. Você tem total
liberdade para selecionar outras bibliotecas de componentes ou desenvolver componentes
personalizados, desde que a justificativa para tal escolha seja apresentada no
README.md.
O design principal adota um tema escuro. É requisito que a aplicação possua uma
funcionalidade para alternar entre o tema claro e o tema escuro, com o controle acessível
por meio de um botão posicionado no canto superior direito da interface.

## 3. Requisitos das Páginas:

### 3.1 Página de Login

Deve apresentar um formulário de login contendo campos para e-mail e senha.
Após um login bem-sucedido, o usuário deve ser automaticamente redirecionado para a
página de listagem de filmes.
Caso o usuário já esteja autenticado no sistema, o acesso a esta página deve resultar em
um redirecionamento imediato para a página de listagem de filmes.


### 3.2 Página de Cadastro

Deve conter um formulário de cadastro com os campos Nome, e-mail, senha e confirmação de
senha.
Similar à página de login, se o usuário já estiver logado, ele deve ser automaticamente
redirecionado para a página de listagem de filmes.


### 3.3 Página de Listagem de Filmes

Esta página deve exibir a lista de todos os filmes cadastrados, independentemente de
qualquer filtro ou busca ativa.
Deve incluir um campo de busca que permita filtrar os filmes dinamicamente conforme o
usuário digita.
A lista de filmes deve ser paginada, exibindo um máximo de 10 itens por página.
Ao clicar no cartão de um filme, o usuário deve ser navegado para a sua página de
detalhes.
O acesso a esta página deve ser restrito a usuários logados; usuários não autenticados
não devem conseguir visualizá-la.


#### 3.3.1 Filtros

Ao acionar o botão "Filtro", uma modal deve ser apresentada contendo opções para refinar
os resultados da lista de filmes.
Os filtros por duração e data de lançamento são obrigatórios. Para o filtro de
data de lançamento, a aplicação deve permitir que o usuário especifique um período,
definindo uma data de início e uma data de fim para a listagem.
Além dos filtros de duração e data, é necessário implementar ao menos um filtro
adicional, de sua escolha, para enriquecer as opções de pesquisa.


### 3.4 Adição e Edição de Filme

Em cenários onde um filme é criado com uma data de lançamento futura, o sistema deve
enviar um e-mail de lembrete ao usuário na data de estreia correspondente.


### 3.5 Página de Detalhes do Filme

Esta página deve exibir informações detalhadas sobre um filme específico, incluindo, mas
não se limitando a: título, título original, data de lançamento, descrição, orçamento,
entre outros dados relevantes.


### 3.6 Permissões

As ações de visualizar, editar e excluir filmes devem ser restritas exclusivamente ao
usuário que originalmente cadastrou o filme.


### 4. Stack Frontend
Nossa stack padrão recomendada é o React, sendo esta a opção mais segura e alinhada com as
expectativas para este desafio. No entanto, incentivamos a exploração e adoção de outras
tecnologias que possam trazer benefícios significativos ao projeto. Caso opte por uma
stack diferente, é imperativo que sua decisão seja detalhadamente justificada no
README.md, explicando como sua escolha contribui para a eficácia e a intuitividade do
aplicativo.
O uso de TypeScript é obrigatório.

### 5. Stack Backend

O banco de dados a ser utilizado é o PostgreSQL. As operações de migrações de banco
de dados devem ser implementadas. Sinta-se à vontade para escolher e utilizar o ORM de
sua preferência.
O armazenamento de imagens deve ser realizado em serviços de cloud como AWS S3,
Cloudflare R2 ou Google Cloud Storage.
O desenvolvimento deve ser feito em TypeScript. Qualquer framework dentro do
ecossistema TypeScript é permitido.
Para o envio de e-mails, você pode utilizar serviços como Mailhog,
Ethereal,Resend ou SES.


### 6. Critérios de Avaliação
O projeto será avaliado com base nos seguintes critérios:

Implementação das funcionalidades exigidas.
Fidelidade à reprodução do design, incluindo a responsividade e a atenção aos detalhes
visuais e de UX.
Qualidade do código, avaliada pela organização, legibilidade e boas práticas de
desenvolvimento.
Alinhamento geral do projeto com o nível e os requisitos da vaga.


### 7. Entrega
O projeto deve ser entregue em um repositório de código hospedado (como GitHub, GitLab,
Bitbucket ou similar). É essencial incluir um arquivo README.md que contenha instruções
claras e detalhadas sobre como compilar e executar a aplicação. Reforçamos que quaisquer
modificações em relação aos requisitos aqui apresentados são encorajadas, desde que sejam
devidamente justificadas no README.md.