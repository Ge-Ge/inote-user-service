interface KeyConfig {
  key: string;
  express: number;
}
export function key(keyName, value?: string, split = ':') {
  if (!value) { return keyName; }
  return `${keyName}${split}${value}`;
}
export class RedisKey {
  split: string;
  constructor({ split } ) {
    this.split = split;
  }

  key(keyName: string | KeyConfig, value?: string, split?: string) {
    if (typeof keyName === 'string') { return key(keyName, value, split || this.split); }
    return key(keyName.key, value, split || this.split);
  }
}
