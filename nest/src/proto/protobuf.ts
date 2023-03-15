import { load } from 'protobufjs';

// loading the game buffering

export async function loadProtobuf(path: string) {
  return await load(path);
}
