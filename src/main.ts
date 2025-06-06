import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from "./config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    cors:true
  });
  //信任代理
  (app as any).set('trust proxy', true);
  //增加前缀
  app.setGlobalPrefix('api')
  await app.listen(config.host.port);
}
bootstrap();
