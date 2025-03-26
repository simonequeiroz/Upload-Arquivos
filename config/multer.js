// Importando o pacote "multer" para manipulação de uploads de arquivos
const multer = require("multer");

// Importando o módulo "path" que nos ajuda a trabalhar com caminhos de arquivos
const path = require("path");

// Configurando o armazenamento de arquivos usando o multer
const storage = multer.diskStorage({
  // Função para determinar o destino onde os arquivos serão armazenados
  destination: function (req, file, cb) {
    // O caminho 'uploads/' será o local onde os arquivos serão armazenados
    // 'uploads/' é a pasta onde os arquivos de upload serão salvos
    cb(null, "uploads/"); 
  },
  
  // Função para definir o nome do arquivo quando ele for salvo
  filename: function (req, file, cb) {
    // Criamos um nome único para o arquivo, baseado no timestamp atual
    // O 'Date.now()' gera um número único (timestamp em milissegundos)
    // E usamos 'path.extname(file.originalname)' para manter a extensão do arquivo original
    // Exemplo: um arquivo chamado "imagem.jpg" poderá ter o nome gerado como "1649789201023.jpg"
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

// Inicializando o multer com a configuração de armazenamento definida
const upload = multer({ storage });

// Exportando a configuração do upload para que ela possa ser usada em outras partes da aplicação
module.exports = upload;
