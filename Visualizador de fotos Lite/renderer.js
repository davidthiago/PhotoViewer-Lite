const openBtn = document.getElementById('openBtn');
const infoDiv = document.getElementById('info');
const imgTag = document.getElementById('preview');
const statusDiv = document.getElementById('status');

openBtn.addEventListener('click', async () => {
  const image = await window.electronAPI.openImage();
  if (image) {
    infoDiv.innerText = `Arquivo: ${image.name} | Tamanho: ${image.size} bytes`;
    imgTag.src = image.base64;

    window.electronAPI.sendToPreview(image);
  }
});

window.electronAPI.onWindowStateUpdate((_event, bounds) => {
  statusDiv.innerText = `Posição: ${bounds.x},${bounds.y} | ${bounds.width}x${bounds.height}`;
});
