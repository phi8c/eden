import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "user_profiles" })
export class UserProfile {
  @PrimaryColumn({
    name: "user_id",
    type: "bigint",
    unsigned: true,
  })
  userId: number;

  @Column({
    name: "display_name",
    nullable: true,
  })
  displayName: string;

  @Column({
    name: "avatar_url",
    nullable: true,
  })
  avatarUrl: string;

  @Column({
    nullable: true,
  })
  bio: string;
}
