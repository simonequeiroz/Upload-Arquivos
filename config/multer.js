const multer = require("multer");

const storage = multer.memoryStorage(); // Armazena o arquivo como Buffer na memória

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limita o tamanho a 5MB
  },
});

module.exports = upload;
