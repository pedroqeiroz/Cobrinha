const canvas = document.getElementById("jogo");
      const contexto = canvas.getContext("2d");
      const inicio = document.getElementById("inicio");

      // Variáveis do jogo
      let cobrinha = [{ x: 10, y: 10 }];
      let comida = { x: 15, y: 15 };
      let tamanhoCobrinha = 1;
      let direcao = "right";
      let tamanhoBloco = 20;
      let intervaloJogo;
      let velocidade = 100;
      let pontos = 0;
      let nivel = 1;

      // Função para gerar cores aleatórias
      function corAleatoria() {
        const letras = "0123456789ABCDEF";
        let cor = "#";
        for (let i = 0; i < 6; i++) {
          cor += letras[Math.floor(Math.random() * 16)];
        }
        return cor;
      }

      // Função para desenhar a cobrinha e a comida
      function desenhar() {
        contexto.clearRect(0, 0, canvas.width, canvas.height);

        // Desenhar a comida
        contexto.fillStyle = corAleatoria();
        contexto.fillRect(comida.x * tamanhoBloco, comida.y * tamanhoBloco, tamanhoBloco, tamanhoBloco);

        // Desenhar a cobrinha
        contexto.fillStyle = "green";
        cobrinha.forEach((segmento) => {
          contexto.fillRect(segmento.x * tamanhoBloco, segmento.y * tamanhoBloco, tamanhoBloco, tamanhoBloco);
        });

        // Mostrar a pontuação e nível
        contexto.fillStyle = "white";
        contexto.font = "20px Arial";
        contexto.fillText("Pontuação: " + pontos, 10, 20);
        contexto.fillText("Nível: " + nivel, 10, 40);
      }

      // Função para atualizar a direção da cobrinha
      function mudarDirecao(event) {
        const tecla = event.key;
        if (tecla === "ArrowUp" && direcao !== "down") direcao = "up";
        if (tecla === "ArrowDown" && direcao !== "up") direcao = "down";
        if (tecla === "ArrowLeft" && direcao !== "right") direcao = "left";
        if (tecla === "ArrowRight" && direcao !== "left") direcao = "right";
      }

      // Função para atualizar o jogo
      function atualizar() {
        let cabeca = { ...cobrinha[0] };

        if (direcao === "right") cabeca.x++;
        if (direcao === "left") cabeca.x--;
        if (direcao === "up") cabeca.y--;
        if (direcao === "down") cabeca.y++;

        cobrinha.unshift(cabeca);

        // Verificar se a cobrinha comeu a comida
        if (cabeca.x === comida.x && cabeca.y === comida.y) {
          tamanhoCobrinha++;
          pontos++;
          comida.x = Math.floor(Math.random() * (canvas.width / tamanhoBloco));
          comida.y = Math.floor(Math.random() * (canvas.height / tamanhoBloco));
        }

        // Remover segmentos extras
        while (cobrinha.length > tamanhoCobrinha) {
          cobrinha.pop();
        }

        // Aumentar a velocidade a cada 5 pontos
        if (pontos % 5 === 0) {
          nivel++;
          velocidade -= 10;
        }

        // Verificar colisões com as bordas
        if (cabeca.x < 0 || cabeca.y < 0 || cabeca.x * tamanhoBloco >= canvas.width || cabeca.y * tamanhoBloco >= canvas.height) {
          clearInterval(intervaloJogo);
          inicio.style.display = "block";
          inicio.innerHTML = "Fim de jogo! Pontuação: " + pontos;
        }

        // Verificar colisão com o próprio corpo
        for (let i = 1; i < cobrinha.length; i++) {
          if (cabeca.x === cobrinha[i].x && cabeca.y === cobrinha[i].y) {
            clearInterval(intervaloJogo);
            inicio.style.display = "block";
            inicio.innerHTML = "Fim de jogo! Pontuação: " + pontos;
          }
        }

        desenhar();
      }

      // Função para iniciar o jogo
      function iniciarJogo() {
        inicio.style.display = "none";
        cobrinha = [{ x: 10, y: 10 }];
        comida = { x: 15, y: 15 };
        tamanhoCobrinha = 1;
        direcao = "right";
        pontos = 0;
        nivel = 1;
        velocidade = 100;
        intervaloJogo = setInterval(atualizar, velocidade);
      }

      document.addEventListener("keydown", mudarDirecao);