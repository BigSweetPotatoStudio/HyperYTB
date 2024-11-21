import { sleep } from "./sleep";

export async function retry(fn, count: number = 3, time: number) {
  while (count > 0) {
    try {
      return await fn();
    } catch (e) {
      count--;
      time && (await sleep(time));
      if (count == 0) {
        throw e;
      }
    }
  }
}
