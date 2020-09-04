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

