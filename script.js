const elements = {
  photoGrid: document.getElementById("photoGrid"),
  uploadModal: document.getElementById("uploadModal"),
  addPhotoButton: document.getElementById("addPhotoBtn"),
  closeButton: document.querySelector(".close"),
  uploadForm: document.getElementById("uploadForm"),
  toast: document.getElementById("toast"),
  name: document.getElementById("name"),
  fileInput: document.getElementById("file"),
};

const config = {
  apiUrl: "http://localhost:4000/picture",
};

function showNotification(message, type = "sucess") {
  const { toast } = elements;

  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.opacity = "1";

  setTimeout(() => {
    toast.styles.opacity = "0";
  }, 3000);
}

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

function createPhotoCardElement(photo) {
  const card = document.createElement("div");
  card.className = "photo-card";

  const imageUrl = `${config.apiUrl}/${photo._id}/image`;

  card.innerHTML = ``;

  return card;
}

async function uploadNewPhoto(formdata) {
  try {
    const response = await fetch(config.apiUrl, {
      method: "POST",
      body: formdata,
    });
    if (!response.ok) {
      throw new Error("Falha no upload da foto");
    }

    showNotification("Foto enviada com sucesso!");
    closeUploadModal();
    elements.uploadForm.reset();
    loadAndDisplayPhotos();
  } catch (error) {
    console.error("Error no upload:", error);
    showNotification("Falha ao enviar foto", "error");
  }
}

function openUloadModal() {
  elements.uploadModal.style.display = "block";
}

function closeUploadModal() {
  elements.uploadModal.style.display = "none";
}

function handleOutsideclick(event) {
  if (event.target === elements.uploadForm) {
    closeUploadModal;
  }
}

function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData();
  formData.append("name", elements.nameInput.value);
  formData.append("file", elements.fileInput.files[0]);

  uploadNewPhoto(formData);
}

async function loadAndDisplayPhotos() {
  const photos = await fetchPhotos();
  renderPhotoGrid(photos);
}

function setupEventListeners() {
  elements.addPhotoButton.addEventListener("click", openUploadModal);
  elements.closeButton.addEventListener("click", openUploadModal);
  window.addEventListener("click", handleFormsubmit);
  elements.uploadForm.addEventListener("submit", handleFormSubmit);
}

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  loadAndDisplayPhotos();
});
