import { Brand } from 'src/brands/entites/brand.entity';
import { Category } from 'src/categories/entites/category.entity';
import { OrderItem } from 'src/orders/entites/order-item.entity';
import { Review } from 'src/reviews/entites/review.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({default: null})
  categoryId: string;

  @ManyToOne(() => Brand, (brand) => brand.products)
  @JoinColumn({ name: 'brandId' })
  brand: Brand;

  @Column({default: null})
  brandId: string;

  @Column('simple-array')
  tags: string[];

  @Column()
  shortDescription: string;

  @Column()
  status: string;

  @Column()
  visibility: string;

  @Column('timestamp')
  publishDate: Date;

  @Column()
  manufacturerName: string;

  @Column()
  manufacturerBrand: string;

  @Column()
  stock: number;

  @Column()
  price: number;

  @Column()
  discount: number;

  @Column()
  orders: number;

  @Column('simple-json', { default: { url: '', publicId: null } })
  image: {
    url: string;
    publicId: string | null;
  };

  @Column('simple-json', { default: null })
  images?: {
    url: string;
    publicId: string;
  }[];

  @OneToMany(() => Review, (review) => review.product)
  @JoinColumn({ name: 'productId' })
  reviews: Review[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @Column('simple-array', { nullable: true })
  colors: string[];

  @Column('simple-array', { nullable: true })
  sizes: string[];

  @Column('simple-array', { nullable: true })
  attributes: string[];

  @Column('simple-array', { nullable: true })
  attributesValues: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
