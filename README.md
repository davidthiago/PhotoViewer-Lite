# PhotoViewer Lite

Aplicativo simples de visualização de imagens feito em **Electron**, desenvolvido como **PhotoViewer Lite**.

---

## Funcionalidades Implementadas

- [x] Janela principal **sem moldura**, com barra de título personalizada.  
- [x] Botões de controle (minimizar, maximizar/restaurar, fechar) funcionando via **IPC**.  
- [x] Botão para abrir imagens do computador (dialog nativo).  
- [x] Exibição da imagem selecionada e de suas informações (caminho, nome, tamanho, dimensões).  
- [x] Janela de pré-visualização em miniatura, aberta via atalho `Ctrl+Shift+P`.  
- [x] Persistência de posição e tamanho da janela (abre no mesmo lugar/tamanho em que foi fechada).  
- [x] Atalhos extras:  
  - `Ctrl+Alt+Left`: encaixa à esquerda da tela.  
  - `Ctrl+Alt+Right`: encaixa à direita.  
  - `Ctrl+Alt+Up`: centraliza em 2/3 da tela.  
- [x] Comunicação **Renderer ↔ Main ↔ Renderer** usando os canais IPC solicitados:
  - `windowControls.minimize`, `windowControls.maximizeRestore`, `windowControls.close`
  - `windowControls.openImage()`
  - `window-state-updated`, `theme-changed`

---

## 🛠️ Arquitetura do Projeto
visualizador-de-fotos-lite/
├─ package.json
├─ main.js
├─ preload.js
├─ index.html
├─ renderer.js
├─ about.html
└─ styles.css

---

## Como rodar

1. Clone este repositório:
   ```bash
   git clone https://github.com/davidthiagoT8/photo-viewer-lite.git

2. Entre na pasta: 
   cd photo-viewer-lite

3. Instale as dependências:
   npm install

4. Rode a aplicação:
    npm start

  ---   
