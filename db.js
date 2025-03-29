// Importa o mongoose, uma biblioteca para modelar e interagir com bancos de dados MongoDB.
const mongoose = require("mongoose"); 

// Carrega as variáveis de ambiente do arquivo .env para serem usadas no código.
require("dotenv").config();

// Configura o mongoose para impedir consultas que utilizem campos não definidos no esquema.
// Isso ajuda a evitar erros e manter o código mais seguro.
mongoose.set("strictQuery", true);

// Declara uma função assíncrona chamada "main" que será responsável por conectar ao banco de dados.
async function main() {
  // Conecta ao banco de dados MongoDB usando a URI definida no arquivo .env.
  // FALTA PASSAR A URI COMO ARGUMENTO EM mongoose.connect(process.env.MONGO_URI)
  await mongoose.connect()  

  // Exibe uma mensagem no console indicando que a conexão foi bem-sucedida.
  console.log("Conectou ao banco de dados!");
}

// Chama a função main() e, caso ocorra um erro, ele será capturado e exibido no console.
main().catch((err) => console.log(err));

// Exporta a função main para que possa ser usada em outros arquivos do projeto, se necessário.
module.exports = main;
