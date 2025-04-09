// Importando o modelo "Picture" para interagir com a coleção "pictures" no MongoDB
const Picture = require("../models/Picture");

// Importando o módulo "fs" (File System) que permite interagir com o sistema de arquivos
const fs = require("fs");

// Função responsável por criar e salvar uma nova imagem
exports.create = async (req, res) => {
  // Enviando uma resposta simples dizendo "Ok!" no início (pode ser útil para verificar a requisição)

  try {
    // Extraindo o nome da imagem a partir do corpo da requisição (o cliente deve enviar o nome da imagem)
    const { name } = req.body;

    // Extraindo o arquivo enviado na requisição (o arquivo foi manipulado pelo multer)
    const file = req.file;

    // Criando um novo documento "Picture" com os dados recebidos: nome e caminho do arquivo
    const picture = new Picture({
      name, // O nome da imagem, que vem do corpo da requisição
      src: file.path, // O caminho do arquivo, que foi gerado automaticamente pelo multer (onde o arquivo foi salvo)
    });

    // Salvando o novo documento "picture" no banco de dados MongoDB
    await picture.save();

    // Enviando uma resposta JSON com o objeto "picture" e uma mensagem de sucesso
    res.json({ picture, msg: "Imagem salva com sucesso!" });
  } catch (err) {
    // Se ocorrer algum erro durante o processo, envia uma resposta com status 500 (erro no servidor)
    // E uma mensagem informando que houve um erro ao salvar a imagem
    res.status(500).json({ message: "Erro ao salvar!" });
  }
};

// Função responsável por buscar todas as imagens salvas no banco de dados
exports.findAll = async (req, res) => {
  try {
    // Utilizando o modelo Picture para buscar todas as imagens no banco de dados
    const picture = await Picture.find();

    // Enviando as imagens encontradas como resposta para o cliente
    res.json(pictures);
  } catch (error) {
    // Caso ocorra algum erro, envia uma resposta com status 500 (erro no servidor)
    // E uma mensagem informando que houve um erro ao buscar as imagens
    res.status(500).json({ message: "Erro ao buscar as imagens!" });
  }
};

// Função para obter uma imagem especifica
exports.getImage = async (req, res) => {
  try {
    const picture = await Picture.findById(req.params.id)
    if (!picture) {
      return res.status(404).json({ message: "Imagem não encontrada!" });
    }
    res.set("Content-Type", picture.contentType);
    res.send(picture.image);
  } catch (error) {
    res.status(500).jason({ message: "Erro ao buscar Imagem!" });
  }
};