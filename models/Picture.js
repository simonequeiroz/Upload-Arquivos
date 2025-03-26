// Importando o módulo "mongoose", que é uma biblioteca para trabalhar com MongoDB em Node.js
const mongoose = require("mongoose");

// Criando uma referência ao "Schema" do Mongoose, que será usado para definir a estrutura dos dados no MongoDB
const Schema = mongoose.Schema;

// Definindo o esquema para o modelo "Picture" (Imagem) no MongoDB
const PictureSchema = new Schema({
  // A propriedade "name" irá armazenar o nome da imagem, e é do tipo String. "required: true" significa que este campo é obrigatório.
  name: { type: String, require: true },
  
  // A propriedade "src" irá armazenar o caminho ou URL da imagem. Também é do tipo String e é um campo obrigatório.
  src: { type: String, required: true },
})

// Exportando o modelo "Picture", que usará o esquema "PictureSchema". O modelo é o que permite interagir com a coleção "pictures" no banco de dados MongoDB.
module.exports = mongoose.model("Picture", PictureSchema);
