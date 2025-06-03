import { forwardRef, Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { AuthModule } from 'src/auth/auth.module';
import { OrdersModule } from 'src/orders/orders.module';
import { EmailService } from 'src/shared/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice]),
    AuthModule,
    forwardRef(() => OrdersModule),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, EmailService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
