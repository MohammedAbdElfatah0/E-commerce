import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@common/pipes/validation.pipe';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 4000, () => {
    console.log(process.env.PORT)
  });
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
