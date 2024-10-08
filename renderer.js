// renderer.js

const { ipcRenderer } = require('electron');

// Elementos do DOM
const filePathInput = document.getElementById('filePath');
const selectFileButton = document.getElementById('selectFile');
const changeDateButton = document.getElementById('changeDate');
const messageElement = document.getElementById('message');
const infoIcon = document.getElementById('infoIcon');
const infoModal = document.getElementById('infoModal');
const closeBtn = document.querySelector('.close');

// Função para selecionar o arquivo
async function selectFile() {
    const filePath = await ipcRenderer.invoke('open-file-dialog');
    if (filePath) {
        filePathInput.value = filePath;
    }
}

// Função para alterar a data do arquivo
async function changeFileDate() {
    const filePath = filePathInput.value;
    if (!filePath) {
        showMessage('Please select a file first.', 'error');
        return;
    }

    const newDate = new Date();
    const result = await ipcRenderer.invoke('change-file-date', filePath, newDate);
    showMessage(result.message, result.success ? 'success' : 'error');
}

// Função para mostrar mensagens
function showMessage(text, type) {
    messageElement.textContent = text;
    messageElement.className = type;
    setTimeout(() => {
        messageElement.textContent = '';
        messageElement.className = '';
    }, 3000);
}

// Função para abrir o modal de informações
function openInfoModal() {
    infoModal.style.display = 'block';
}

// Função para fechar o modal de informações
function closeInfoModal() {
    infoModal.style.display = 'none';
}

// Event Listeners
selectFileButton.addEventListener('click', selectFile);
changeDateButton.addEventListener('click', changeFileDate);
infoIcon.addEventListener('click', openInfoModal);
closeBtn.addEventListener('click', closeInfoModal);

// Fechar o modal se clicar fora dele
window.addEventListener('click', (event) => {
    if (event.target === infoModal) {
        closeInfoModal();
    }
});

// Atualizar a interface quando o arquivo for selecionado
ipcRenderer.on('selected-file', (event, filePath) => {
    filePathInput.value = filePath;
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('Renderer process started');
});