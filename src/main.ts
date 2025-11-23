import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@common/pipes';
import { LoggingInterceptor, TransformInterceptor } from '@common/interceptors';
// import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe);
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());
  await app.listen(process.env.PORT ?? 4000, () => {
    console.log(process.env.PORT)
  });
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
