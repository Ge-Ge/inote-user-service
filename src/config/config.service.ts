import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor(filePath: string) {
    this.envConfig = dotenv.parse(fs.readFileSync(filePath));
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  mysql(): any {
    return {
      type: 'mysql',
      host: '127.0.0.1',
      port: this.get('MYSQL_PORT') || '3306',
      username: this.get('MYSQL_USER') || 'admin',
      password: this.get('MYSQL_PASSWORD') || '',
      database: this.get('MYSQL_DATABASE'),
      entities: [path.join(__dirname, '../') + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    };
  }
}
