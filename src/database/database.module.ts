import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { envConfig } from '../config/env';
import { DataSource } from 'typeorm';

const dbOptions = {
  //this name refers to connection name but for consistency purpose Database is same as connection name.
  name: envConfig.app.database.name,
  type: 'postgres' as any,
  host: envConfig.app.database.host,
  port: envConfig.app.database.port,
  username: envConfig.app.database.user,
  password: envConfig.app.database.password,
  database: envConfig.app.database.name,
};

export const connection = new DataSource({
  ...dbOptions,
  entities: [__dirname + '/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});

export const databaseProvider = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      return await connection.initialize();
    },
  },
  DatabaseService,
];

@Module({
  providers: databaseProvider,
  exports: databaseProvider,
})
export class DatabaseModule {}
