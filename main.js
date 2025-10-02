const larguraBotao = 200;
const alturaBotao = 70;

let tesouros = 0;
let tesourosPorClique = 1;
let tesourosPorSegundo = 0;

// Lista de upgrades
let upgrades = [
  { nome: "⛏️ Melhoria Picareta", bonus: 1, custo: 10, tipo: "clique" },
  { nome: "🧪 Poção Tonificante", bonus: 1, custo: 20, tipo: "passivo" },
  { nome: "🧤 Melhoria Luvas", bonus: 2, custo: 50, tipo: "clique" },
  { nome: "🔥 Inspiração", bonus: 5, custo: 100, tipo: "passivo" },
  { nome: "✨ Magia de Terra", bonus: 50, custo: 1000, tipo: "clique" },
];

class CenaPrincipal extends Phaser.Scene {
  constructor() {
    super("CenaPrincipal");
  }

  preload() {
    // Carregando as 3 imagens separadas
    this.load.image("miner1", "assets/miner1.png");
    this.load.image("miner2", "assets/miner2.png");
    this.load.image("miner3", "assets/miner3.png");
    this.load.audio("musicaFundo", "assets/musica.mp3");
  }

  create() {
    this.tempoInicial = this.time.now;
    this.vitoriaMostrada = false;

    // Texto dos tesouros
    this.textoTesouros = this.add.text(10, 10, "💰 Tesouros: 0", {
      fontSize: "24px",
      fill: "#fff",
    });

    // Título
    this.titulo = this.add.text(275, 10, "CAVE DIGGINELSON‼️", {
      fill: "#fa0b0bff",
      font: "bold 20px 'MedievalSharp'",
    });

    // Criar animação usando imagens separadas
    this.anims.create({
      key: "cavar",
      frames: [{ key: "miner1" }, { key: "miner2" }, { key: "miner3" }],
      frameRate: 6,
      repeat: -1,
    });

    // Sprite do minerador (apenas animado)
    this.miner = this.add.sprite(200, 150, "miner1").setScale(0.5);
    this.miner.play("cavar");

    // Botão de música no canto superior direito
    this.botaoMusica = this.add
      .text(550, 40, "🔊", {
        fontSize: "24px",
        backgroundColor: "#444",
        color: "#fff",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive();

    this.botaoMusica.on("pointerdown", () => {
      if (this.musica.isPlaying) {
        this.musica.pause();
        this.botaoMusica.setText("🔇");
      } else {
        this.musica.resume();
        this.botaoMusica.setText("🔊");
      }
    });

    // Botão de clique abaixo do minerador
    this.botaoClique = this.add
      .text(200, 240, "Cavar Tesouro!", {
        fontSize: "20px",
        backgroundColor: "#666",
        color: "#fff",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        tesouros += tesourosPorClique;
        this.atualizarTexto();
        this.checarVitoria();

        // Animação de clique
        this.tweens.add({
          targets: this.botaoClique,
          scale: 1.2,
          duration: 100,
          yoyo: true,
          ease: "Power1",
        });

        this.botaoClique.setStyle({ backgroundColor: "#FFD700" });
        this.time.delayedCall(150, () => {
          this.botaoClique.setStyle({ backgroundColor: "#666" });
        });
      });

    // Criar botões de upgrade dinamicamente
    upgrades.forEach((up, i) => {
      let y = 70 + i * 80;
      let botao = this.add
        .text(
          350,
          y,
          `${up.nome}\n(+${up.bonus} por ${up.tipo})\nCusto: ${up.custo}`,
          {
            fontSize: "18px",
            backgroundColor: "#444",
            padding: { x: 10, y: 5 },
          }
        )
        .setInteractive()
        .setDisplaySize(larguraBotao, alturaBotao)
        .on("pointerdown", () => {
          if (tesouros >= up.custo) {
            tesouros -= up.custo;

            if (up.tipo === "clique") {
              tesourosPorClique += up.bonus;
            } else if (up.tipo === "passivo") {
              tesourosPorSegundo += up.bonus;
            }

            this.atualizarTexto();
            this.checarVitoria();

            this.tweens.add({
              targets: botao,
              alpha: 0.5,
              duration: 100,
              yoyo: true,
              ease: "Power1",
            });

            botao.setStyle({ backgroundColor: "#3cff00ff" });
            this.time.delayedCall(150, () => {
              botao.setStyle({ backgroundColor: "#444" });
            });

            up.custo = Math.floor(up.custo * 1.5);
            botao.setText(
              `${up.nome}\n(+${up.bonus} por ${up.tipo})\nCusto: ${up.custo}`
            );
          }
        });
    });

    // Tesouros passivos por segundo
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        tesouros += tesourosPorSegundo;
        this.atualizarTexto();
        this.checarVitoria();
      },
      loop: true,
    });

    // Música de fundo
    this.musica = this.sound.add("musicaFundo", {
      volume: 0.5,
      loop: true,
    });
    this.musica.play();
  }

  atualizarTexto() {
    this.textoTesouros.setText(
      `💰 Tesouros: ${tesouros}\n(+${tesourosPorClique}/clique, +${tesourosPorSegundo}/s)`
    );
  }

  checarVitoria() {
    if (tesouros >= 99999 && !this.vitoriaMostrada) {
      this.vitoriaMostrada = true;
      let tempoFinal = Math.floor((this.time.now - this.tempoInicial) / 1000);

      // Caixa de fundo - mais estreita e mais abaixo
      let painel = this.add
        .rectangle(180, 280, 280, 100, 0x000000, 0.8)
        .setOrigin(0.5, 0)
        .setStrokeStyle(3, 0xffd700)
        .setAlpha(0);

      // Texto sobre o painel
      let msg = this.add
        .text(
          180,
          280,
          "🏆 Atingiu 99999!\nVocê é o anão mais rico da banda! Parabéns!\n" +
            `⏱ Tempo: ${tempoFinal} segundos`,
          {
            fontSize: "18px",
            fill: "#FFD700",
            align: "center",
            padding: { x: 10, y: 10 },
            wordWrap: { width: 250 },
          }
        )
        .setOrigin(0.5, 0)
        .setAlpha(0);

      // Fade-in para painel e mensagem
      this.tweens.add({
        targets: [painel, msg],
        alpha: 1,
        duration: 2000,
        ease: "Power2",
      });

      // Brilho pulsante no texto
      this.tweens.add({
        targets: msg,
        scale: 1.05,
        yoyo: true,
        repeat: -1,
        duration: 800,
        ease: "Sine.easeInOut",
      });
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 500,
  backgroundColor: "#333",
  scene: [CenaPrincipal],
};

new Phaser.Game(config);
