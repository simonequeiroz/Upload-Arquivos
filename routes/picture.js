// Importando o framework Express para facilitar o roteamento e o manuseio de requisições HTTP
const express = require("express");

// Criando um roteador a partir do Express para definir as rotas da aplicação
const router = express.Router();

// Importando a configuração do middleware "multer" para manipulação de arquivos enviados
const upload = require("../config/multer");

// Importando o controlador de imagens, onde a lógica de criação de imagens é definida (GET, POST e etc...)
const PictureController = require("../controllers/PictureController");

// Definindo a rota POST para a criação de uma imagem.
// A rota receberá um arquivo e o processará usando o middleware "multer",
// e, em seguida, passará o controle para o método "create" do PictureController
router.post("/", upload.single("file"), PictureController.create);

// Definindo a rota GET (Trazer todas as imagens do MongoDB)
router.get("/", PictureController.findAll);

// Rota para obter uma imagem especifica
router.get("/:id/image", PictureController.getImage);

//Exportando para utilizar em outro arquivo
module.exports = router;
