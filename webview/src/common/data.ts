import { call } from "./call";

class Data<T> {
  private localStorage = null;
  async init() {
    this.localStorage = await this.inget();
    try {
      this.data = Object.assign(
        {},
        this.data,
        this.localStorage ? JSON.parse(this.localStorage) : {},
      );
    } catch (e) {
      console.error(e);
    }
    return this.data;
  }
  constructor(
    private KEY: string,
    private data: T,
  ) {}
  get(): T {
    return this.data;
  }

  async save() {
    this.insave();
  }
  private async inget() {
    if (window.ext) {
      return await call("readFile", [this.KEY]).catch((e) => "");
    } else {
      return localStorage.getItem(this.KEY);
    }
  }
  private async insave() {
    if (window.ext) {
      return await call("writeFile", [
        this.KEY,
        JSON.stringify(this.data, null, 4),
      ]);
    } else {
      return localStorage.setItem(this.KEY, JSON.stringify(this.data));
    }
  }
}

export const data = new Data("data.json", {
  isAutoLauncher: false,
  skipAD: false,
  backPlay: true,
});

await data.init();
