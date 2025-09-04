// Espera o HTML carregar completamente para rodar o script
document.addEventListener('DOMContentLoaded', () => {
    
    //1. Pegando os elementos do HTML que vamos usar
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const paletteContainer = document.getElementById('paletteContainer');

    //Instanciando oo ColorThief
    const colorThief = new ColorThief();

    //2. Adicionando um "escutador de evento" para o input de imagem
    //Isso vai disparar uma função sempre que o usuário escolher um arquivo
    imageInput.addEventListener('change', event => {
        const file = event.target.files[0];
        if (!file) {
            return; // Sai da função se nenhum arquivo for selecionado
        }

        // Usamos o FilerReader para ler o arquivo da imagem
        const reader = new FileReader();

        reader.onload = e => {
            // Quando a imagem carregar, mostramos a prévia
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';

            // Precisamos esperar a imagem ser "desenhada" na tela
            // para o ColorThief funcionar corretamente
            imagePreview.onload = () => {
                //3. Usamos o ColorThief para pegar a paleta de cores (8 cores)
                const palette = colorThief.getPalette(imagePreview, 8);

                //4. Exibindo a paleta na tela
                displayPalette(palette);
            }
        };

        // Lê o arquivo como uma URL de dados
        reader.readAsDataURL(file);
    });

    //Função para mostrar as cores na tela
    function displayPalette(palette) {
        //limpar qualquer paleta anterior
        paletteContainer.innerHTML = '';

        palette.forEach(color => {
            // Converte a cor de RGB (ex; [255, 100, 80]) para Hexadecimal (ex: #ff6450)
            const hexColor = rgbToHex(color[0], color[1], color[2]);

            // Cria um novo elemento <div> para cada cor
            const colorBox = document.createElement('div');
            colorBox.classList.add('color-box');
            colorBox.style.backgroundColor = hexColor;
            colorBox.innerText = hexColor;

            // Adiciona a funcionalidade de copiar a cor ao clicar
            colorBox.addEventListener('click', () => {
                navigator.clipboard.writeText(hexColor).then(() => {
                    alert(`Cor ${hexColor} copiada!`);
                }).catch(err => {
                    console.error('Falha ao copiar cor: ', err);
                });
            });

            // Adiciona a caixinha de cor dentro do container da paleta
            paletteContainer.appendChild(colorBox);
        });
    }

    // Função auxiliar para converter RGB em Hexadecimal
    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

});