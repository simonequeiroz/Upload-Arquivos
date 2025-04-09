// Elementos de interface (DOM)
const elements = {
  photoGrid: document.getElementById("photoGrid"), // container da Grade de fotos
  uploadModal: document.getElementById("uploadModal"), // Modal de upload
  addPhotoButton: document.getElementById("addPhotoBtn"), // Botão para abrir Modal
  closeButton: document.querySelector(".close"), // Botão para fechar o Modal
  uploadForm: document.getElementById("uploadForm"), // Upload do Formulário
  toast: document.getElementById("toast"), // Elemento para notificação
  nameInput: document.getElementById("name"), // input nome da foto
  fileInput: document.getElementById("file"), // Input do arquivo da Foto
};

// Configuração da Aplicação (Back-End)
const config = {
  apiUrl: "http://localhost:4000/picture", // Endpoint da API
};

// Função da notificação
function showNotification(message, type = "sucess") {
  const { toast } = elements; // Armazena o elemento de notificação

  toast.textContent = message; // Define o texto da mensagem
  toast.className = `toast ${type}`; // Aplica a Classe do Css (Cor)
  toast.style.opacity = "1"; // Torna a notificação visível

  //Configura o tempo para esconder a notificação (3 seg)
  setTimeout(() => {
    toast.style.opacity = "0"; // Faz a notificação desaparecer devagar
  }, 3000);
}

// Função de manipulação de fotos
async function fetchPhotos() {
  try {
    // Faz requisição GET para API
    const response = await fetch(config.apiUrl);

    // Verifica se a resposta foi bem sucedida  (status 200-299)
    if (!response.ok) {
      throw new Error(`Erro na requisição: status ${response.status}`);
    }

    // Converte a resposta para JSON
    const data = await response.json();

    // Retorna o Array de fotos ou um vazio
    return data.pictures || [];
  } catch (error) {
    // Em caso de erro, mostra no console
    console.error("Falha ao carregar fotos", error);
    // Função de notificação sendo chamada para mostrar erro ao User
    showNotification("Falha ao carregar fotos", "error");
    return []; // Retorna um Array vazio para evitar erros
  }
}

// Renderiza as fotos no grid (Recebe um Array de objetos de fotos)
function renderPhotoGrid(photos) {
  const { photGrid } = elements;

  photoGrid.innerHTML = ""; // Limpa todo o conteúdo atual do Grid

  // Se não houver fotos, exibe a mensagem
  if (photos.length === 0) {
    photoGrid.innerHTML = '<p class="no-photos"> Nenhuma foto encontrada </p>';
    return;
  }

  // Para cada foto no array, cria um card e adiciona ao grid
  photos.forEach((photo) => {
    const photocard = createPhotoCardElement(photo);
    photo.photGrid.appendChild(photocard);
  });
}
// Criando o elemento HTML de um card de Foto (Recebe um objeto de foto)
function createPhotoCardElement(photo) {
  const card = document.createElement("div");
  card.className = "photo-card"; // Aplica a classe CSS para estilos

  //Monta URL para a imagem (API + ID da foto + /image)
  const imageUrl = `${config.apiUrl}/${photo._id}/image`;

  // Define o HTML interno do cardcom a imagem e informação
  card.innerHTML = `<img src="${imageUrl} " alt "${photo.name}"
  onerror=this.onerror=null; this.src='${config.placeholderImage}'">
  <div class="photo-info">
  <div class="photo-name">${photo.name} </div> 
  </div>

  `; // Incluir Preenchimento do Card
  return card;
}

// Envia nova foto para servidor (Recebe Formdata com nome e arquivo)
async function uploadNewPhoto(formdata) {
  try {
    // Faz uma requisição POST para API com os dados do formulário
    const response = await fetch(config.apiUrl, {
      method: "POST",
      body: formdata,
    });

    // Verifica a resposta
    if (!response.ok) {
      throw new Error("Falha no upload da foto");
    }

    // Notificação de sucesso para o User
    showNotification("Foto enviada com sucesso!");
    closeUploadModal(); // Fechar a tela do Modal
    elements.uploadForm.reset(); // Recarrega a lista de fotos (Nova Adição)
    loadAndDisplayPhotos(); // Essa linha recarrega e exibe as fotos atualizadas.
  } catch (error) {
    console.error("Error no upload:", error); // Mostra no console do navegador qual erro aconteceu.
    showNotification("Falha ao enviar foto", "error"); //  Mostra uma mensagem de erro para o usuário
  }
}
// Abre o modal de upload (mostra a janelinha na tela)
function openUloadModal() {
  // Fecha o modal de upload (esconde a janelinha)
  elements.uploadModal.style.display = "block"; // Define o estilo como "block" para exibir o modal
}

// Fecha o modal de upload (esconde a janelinha)
function closeUploadModal() {
  elements.uploadModal.style.display = "none"; // Define o estilo como "none" para ocultar o modal
}

// Fecha o modal se o usuário clicar fora do formulário
function handleOutsideclick(event) {
  // Verifica se o clique foi exatamente fora do formulário (em volta dele)
  if (event.target === elements.uploadForm) {
    closeUploadModal; // Fecha o modal corretamente (OBS: corrigido aqui, estava faltando os parênteses)
  }
}

// Manipula o envio do formulário
function handleFormSubmit(event) {
  event.preventDefault(); // Evita que o formulário recarregue a página automaticamente

  const formData = new FormData(); // Cria um objeto FormData para enviar os dados via JavaScript
  formData.append("name", elements.nameInput.value); // Adiciona o nome da foto ao formulário
  formData.append("file", elements.fileInput.files[0]); // Adiciona o arquivo de imagem selecionado

  uploadNewPhoto(formData); // Envia os dados para o backend ou função que cuida do upload
}

// Função assíncrona que carrega as fotos do servidor e exibe na tela
async function loadAndDisplayPhotos() {
  const photos = await fetchPhotos(); // Busca as fotos de algum servidor ou API
  renderPhotoGrid(photos); // Exibe as fotos na tela em formato de grade (galeria)
}

// Define os "ouvintes de eventos" para os botões e janelas
function setupEventListeners() {
  elements.addPhotoButton.addEventListener("click", openUploadModal); // Ao clicar no botão, abre o modal
  elements.closeButton.addEventListener("click", openUploadModal); // botão "X" de fechar chama a função correta
  window.addEventListener("click", handleFormsubmit); // Ao clicar fora do modal, ele será fechado
  elements.uploadForm.addEventListener("submit", handleFormSubmit); // Ao enviar o formulário, executa a função de envio
}

// Quando o conteúdo da página for totalmente carregado, configura os eventos e carrega as fotos
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners(); // Configura os botões e eventos de clique
  loadAndDisplayPhotos(); // Carrega e mostra as fotos
});
