import { Product } from 'src/products/entites/product.entity';
import { User } from 'src/users/entites/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @Column()
  rating: number;

  @Column("json")
  comment: {
    title: string;
    body: string;
    images?: string[]; // Optional field for images
  };

  @CreateDateColumn()
  createdAt: Date;
}
