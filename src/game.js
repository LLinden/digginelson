import Phaser from "phaser";

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
  }

  create() {
    // Texto dos tesouros
    this.textoTesouros = this.add.text(10, 10, "💰 Tesouros: 0", {
      fontSize: "24px",
      fill: "#fff",
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

        // Animação de clique
        this.tweens.add({
          targets: this.botaoClique,
          scale: 1.2, // aumenta 20%
          duration: 100, // duração de subida
          yoyo: true, // volta ao tamanho normal
          ease: "Power1",
        });

        // Mudança temporária de cor
        this.botaoClique.setStyle({ backgroundColor: "#FFD700" }); // dourado
        this.time.delayedCall(150, () => {
          this.botaoClique.setStyle({ backgroundColor: "#666" }); // volta ao normal
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

            // custo progressivo
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
      },
      loop: true,
    });
  }

  atualizarTexto() {
    this.textoTesouros.setText(
      `💰 Tesouros: ${tesouros}\n(+${tesourosPorClique}/clique, +${tesourosPorSegundo}/s)`
    );
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
