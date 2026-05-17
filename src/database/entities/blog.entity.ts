import { Entity , PrimaryGeneratedColumn , Column, UpdateDateColumn, CreateDateColumn, DeleteDateColumn } from "typeorm";

@Entity()
export class Blog{

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name : string

    @UpdateDateColumn()
    updated_at : Date
    @CreateDateColumn()
    created_at : Date
    @DeleteDateColumn()
    deleted_at : Date


}