# Lusoportunas
- Ofertas de trabalho por indústria, cargo, empresa.
- Uma plataforma que coloca em contacto recrutas e interessados em ofertas de emprego.


## Como compilar e executar o servidor

##### Configuração de base de dados e execução em modo de desenvolvimento
- Criar uma base de dados usando o MongoDB
- Modificar a String the conexão em data/lusDB.js
- `$ npm install` para instalar módulos.
- Importar base de dados atual com os seguintes comandos: `$ node data/import.users.js`, etc.
- `$ npm start` (criar instância de servidor usando porto)
- Fazer login usando "filipe@gmail.com" pwd: "filipe"

##### Executar servidor em modo de produção (sem o login automático

- `$npm start --production`

## Desenvolvimento

##### Desenvolvimento de conteúdo em português:
- [x] Atenção erros ortográficos.
- [x] Sem conteúdo estático.

#### Funcionalidades

- Artigos com informação pertinente para utilizadores e empresas.
- Ofertas de trabalho por indústria, cargo, empresa.
- Perfil de utilizador (brevemente)

#### Checklist

- [x] Incorporar com o tema
- [x] Argumentar erros
- [x] Página de Utilizador
- [x] Datas implementadas nos vários routes
- [ ] Desenvolver página de pesquisa
- [x] Artigos
    - [ ] Incorporar com HTML
    - [ ] Fazer página Sobre (dinâmica)
    - [ ] Fazer página Contacto (dinâmica)
- [ ] Desenvolver mecanismos de contacto
- [ ] Ofertas de trabalho
    - [ ] Programar e Estilizar oferta de trabalho única
    - [x] Categorizar
    - [x] Desenvolver coleção de empresas
- [ ] Utilizador Pessoal
    - [ ] Estilizar com modificações e edições
    - [ ] Implementar popups com uso de AJAX/JQuery
- [ ] Utilizador Público
    - [ ] Estilizar
- [ ] Melhorar o Tema
- [ ] UX - User Experience Tests


