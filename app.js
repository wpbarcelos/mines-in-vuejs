let interval = null;
Vue.createApp({
  data() {
    return {
      map: [],
      flags: [],
      bombs: [{ linha: 3, coluna: 3 }],
      log: [],
      linhas: 10,
      colunas: 10,
      gameover: false,
      flags: 0,
      time: 0,
    };
  },
  computed: {
    winGame() {
      if (this.flags < 10) return false;
      let flagged = 0;
      this.map.forEach((l) =>
        l.forEach((coluna) => {
          if (coluna.flag && coluna.bomb) {
            flagged++;
          }
        })
      );
      if (flagged < 10) {
        return false;
      }

      clearInterval(interval);

      return true;
    },
  },
  created() {
    let map = [];

    colunas = () =>
      new Array(this.linhas).fill(0).map((item, index) => ({
        id: Math.random() * 99999999,
        bomb: false,
        flagged: false,
        flag: false,
        opened: false,
        bombsAround: "",
      }));

    map = new Array(this.linhas).fill(0).map((item, index) => colunas());

    bombs = 0;
    while (bombs < 10) {
      linha = Math.round(Math.random() * 9);
      coluna = Math.round(Math.random() * 9);
      if (!map[linha][coluna].bomb) {
        map[linha][coluna].bomb = true;
        bombs++;
      }
    }
    this.map = map;

    interval = setInterval(() => {
      this.time++;
    }, 10);
  },
  methods: {
    markFlag(linha, coluna) {
      if (this.flags >= 10 && !this.map[linha][coluna].flag) return;
      this.map[linha][coluna].flag = !this.map[linha][coluna].flag;
      this.flags += this.map[linha][coluna].flag ? 1 : -1;
    },
    markArea(linha, coluna) {
      if (this.winGame || this.gameover) return;

      this.log.unshift(`Marcou linha: ${linha}, coluna: ${coluna}`);
      const vizinhos = this.vizinhos(linha, coluna);
      this.map[linha][coluna].opened = true;

      if (this.map[linha][coluna].bomb) {
        this.gameover = true;

        clearInterval(interval);
      }

      bombsAround = vizinhos.filter(
        ([_linha, _coluna]) => this.map[_linha][_coluna].bomb
      ).length;

      if (bombsAround === 0) {
        vizinhos.forEach(([_linha, _coluna]) => {
          if (!this.map[_linha][_coluna].opened) {
            this.markArea(_linha, _coluna);
          }
        });
      } else {
        this.map[linha][coluna].bombsAround = bombsAround;
      }

      vizinhos.forEach((_l, _c) => {
        const vizinhos_vizinho = this.vizinhos(_l, _c);
        const nao_tem_bomb = vizinhos_vizinho.some((v) => v.bom === false);
      });
    },
    vizinhos(linha, coluna) {
      const positions = [
        [linha - 1, coluna - 1],
        [linha - 1, coluna],
        [linha - 1, coluna + 1],
        [linha, coluna - 1],
        [linha, coluna + 1],
        [linha + 1, coluna - 1],
        [linha + 1, coluna],
        [linha + 1, coluna + 1],
      ].filter(([_l, _c]) => this.map?.[_l]?.[_c] !== undefined);

      return positions;
    },
  },
}).mount("#app");
