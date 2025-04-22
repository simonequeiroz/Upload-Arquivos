// Importando o modelo "Picture"
const Picture = require("../models/Picture");

// Função para criar uma nova imagem
exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    const picture = new Picture({
      name,
      image: file.buffer,
      contentType: file.mimetype,
    });

    await picture.save();

    res.json({ picture, msg: "Imagem salva com sucesso!" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao salvar!" });
  }
};

// Função para listar todas as imagens
exports.findAll = async (req, res) => {
  try {
    const pictures = await Picture.find();
    res.json({ pictures, msg: "Imagens buscadas com sucesso!" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar as imagens!" });
  }
};

// Função para buscar imagem por ID
exports.getImage = async (req, res) => {
  try {
    const picture = await Picture.findById(req.params.id);

    if (!picture) {
      return res.status(404).json({ message: "Imagem não encontrada!" });
    }

    res.set("Content-Type", picture.contentType);
    res.send(picture.image);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar Imagem!" });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const picture = await Picture.findByIdAndDelete(id);

    if (!picture) {
      return res.status(404).json({ message: "Imagem não encontrada" });
    }

    res.status(200).json({ message: "Imagem excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir imagem:", error);
    res.status(500).json({ message: "Erro ao excluir imagem" });
  }
};
