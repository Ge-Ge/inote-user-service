import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum ACStatus {
  DELETE = -1, NOT_ACTIVE = 0, NORMAL = 1, DISABLE = 2,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, comment: '用户名' })
  username: string;

  @Column({ comment: '密码' })
  password: string;

  @Column({ length: 320, comment: '邮箱' })
  email: string;

  @Column({
    type: 'enum', enum: ACStatus,
    default: ACStatus.NOT_ACTIVE,
    comment: '用户账号状态  -1:删除  0:待激活  1:正常  2:禁用',
  })
  status: ACStatus;

}
