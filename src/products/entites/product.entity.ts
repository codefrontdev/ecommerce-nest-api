import { Review } from 'src/reviews/entites/review.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  category: string;

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

  @Column('simple-json', { default: { url: '', publicId: '' } })
  images: {
    url: string;
    publicId: string;
  }[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @Column('simple-array', { nullable: true })
  colors: string[];

  @Column('simple-array', { nullable: true })
  sizes: string[];

  @Column('simple-array', { nullable: true })
  attributes: string[];

  @Column('simple-array', { nullable: true })
  attributesValues: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
