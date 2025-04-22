// Elementos da interface (DOM)
const elements = {
  photoGrid: document.getElementById("photoGrid"),
  uploadModal: document.getElementById("uploadModal"),
  addPhotoButton: document.getElementById("addPhotoBtn"),
  closeButton: document.querySelector(".close"),
  uploadForm: document.getElementById("uploadForm"),
  toast: document.getElementById("toast"),
  nameInput: document.getElementById("name"),
  fileInput: document.getElementById("file"),
  imageModal: document.getElementById("modal"),
  imagemModal: document.getElementById("imagemModal"),
  closeImageModal: document.getElementById("closeImageModal"),
};

// Configuração da Aplicação
const config = {
  apiUrl: "http://localhost:4000/pictures",
  placeholderImage: "https://via.placeholder.com/300",
};

// Função de notificação
function showNotification(message, type = "success") {
  const { toast } = elements;
  toast.textContent = message;
  toast.className = `toast show toast-${type}`;

  setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}

// Funções de manipulação de fotos
async function fetchPhotos() {
  try {
    const response = await fetch(config.apiUrl);
    if (!response.ok) {
      throw new Error(`Erro na requisição: status ${response.status}`);
    }
    const data = await response.json();
    return data.pictures || [];
  } catch (error) {
    console.error("Falha ao carregar fotos", error);
    showNotification("Falha ao carregar fotos", "error");
    return [];
  }
}

function renderPhotoGrid(photos) {
  const { photoGrid } = elements;
  photoGrid.innerHTML = "";

  if (photos.length === 0) {
    photoGrid.innerHTML = '<p class="no-photos">Nenhuma foto encontrada</p>';
    return;
  }

  photos.forEach((photo) => {
    const photoCard = createPhotoCardElement(photo);
    photoGrid.appendChild(photoCard);
  });
}

function createPhotoCardElement(photo) {
  const card = document.createElement("div");
  card.className = "photo-card";
  const imageUrl = `${config.apiUrl}/${photo._id}/image`;

  card.innerHTML = `
    <img src="${imageUrl}" alt="${photo.name}"
         onerror="this.onerror=null; this.src='${config.placeholderImage}'">
    <div class="photo-info">
      <div class="photo-name">${photo.name}</div>
      <button class="btn-delete" data-id="${photo._id}">Excluir</button>
    </div>
  `;

  // Adiciona evento de clique na imagem para abrir o modal
  const img = card.querySelector("img");
  img.addEventListener("click", () => {
    elements.imagemModal.src = imageUrl;
    elements.imageModal.style.display = "block";
  });

  // Adiciona evento ao botão de exclusão
  const deleteButton = card.querySelector(".btn-delete");
  deleteButton.addEventListener("click", () => deletePhoto(photo._id));

  return card;
}

async function uploadNewPhoto(formData) {
  try {
    const response = await fetch(config.apiUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Falha no upload da foto");
    }

    showNotification("Foto enviada com sucesso!", "success");
    closeUploadModal();
    elements.uploadForm.reset();
    loadAndDisplayPhotos();
  } catch (error) {
    console.error("Erro no upload:", error);
    showNotification("Falha ao enviar foto", "error");
  }
}

// Funções de controle da Interface
function openUploadModal() {
  elements.uploadModal.style.display = "block";
}

function closeUploadModal() {
  elements.uploadModal.style.display = "none";
}

function handleOutsideClick(event) {
  if (event.target === elements.uploadModal) {
    closeUploadModal();
  }
  if (event.target === elements.imageModal) {
    closeImageModal();
  }
}

function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData();
  formData.append("name", elements.nameInput.value);
  formData.append("file", elements.fileInput.files[0]);
  uploadNewPhoto(formData);
}

async function deletePhoto(photoId) {
  if (!confirm("Tem certeza que deseja excluir esta foto?")) return;

  try {
    const response = await fetch(`${config.apiUrl}/${photoId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao excluir a foto");
    }

    showNotification("Foto excluída com sucesso!", "success");
    loadAndDisplayPhotos();
  } catch (error) {
    console.error("Erro ao excluir:", error);
    showNotification("Erro ao excluir a foto", "error");
  }
}

function closeImageModal() {
  elements.imageModal.style.display = "none";
}

// Carrega e exibe todas as fotos
async function loadAndDisplayPhotos() {
  const photos = await fetchPhotos();
  renderPhotoGrid(photos);
}

// Configura todos os eventos
function setupEventListeners() {
  elements.addPhotoButton.addEventListener("click", openUploadModal);
  elements.closeButton.addEventListener("click", closeUploadModal);
  elements.closeImageModal.addEventListener("click", closeImageModal);
  window.addEventListener("click", handleOutsideClick);
  elements.uploadForm.addEventListener("submit", handleFormSubmit);
}

// Inicialização da aplicação
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  loadAndDisplayPhotos();
});
