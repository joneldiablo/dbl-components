export default class LCG {
  constructor(seed) {
    this.a = 1664525;
    this.c = 1013904223;
    this.m = 2 ** 32;
    this.seed = seed;
  }

  random() {
    this.seed = (this.a * this.seed + this.c) % this.m;
    return this.seed / this.m;
  }
}
