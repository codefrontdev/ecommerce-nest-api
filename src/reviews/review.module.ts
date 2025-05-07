import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./entites/review.entity";


@Module({
  providers: [],
  imports: [TypeOrmModule.forFeature([Review])],
  exports: [],
  controllers: [],
})
export class ReviewModule {}