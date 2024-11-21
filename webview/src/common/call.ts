export interface BaseCommand {
  readFile(path: string, root?: string): Promise<any>;
  writeFile(path: string, data: any, root?: string): Promise<void>;
  readDir(path: string, root?: string): Promise<Array<any>>;
  getUserDataPath(): Promise<string>;
}

export interface RNCommand extends BaseCommand {
  startYoutube(): Promise<any>;
}

export type Command = RNCommand;

export async function call<k extends keyof Command>(
  command: k,
  args: Parameters<Command[k]> = [] as any,
): Promise<ReturnType<Command[k]>> {
  try {
    // console.log(`command ${command}`, args);
    return await window.ext.invert(command, args);
  } catch (e) {
    console.error(e);
  }
}
