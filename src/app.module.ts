import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SalesModule } from './sales/sales.module';
import { ProductsModule } from './products/products.module';
import { ShoppingModule } from './shopping/shopping.module';
import { OverViewModule } from './overview/overview.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    SalesModule,
    ProductsModule,
    ShoppingModule,
    SalesModule,
    OverViewModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
