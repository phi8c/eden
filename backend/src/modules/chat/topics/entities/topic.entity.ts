import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Conversation } from '../../conversations/entities/conversation.entity';

@Entity('topics')
export class Topic {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    conversation_id: number;

    @ManyToOne(() => Conversation)
    @JoinColumn({name: 'conversation_id'})
    conversation: Conversation;

    @Column({nullable: true})
    created_by: number;
    @Column({type: 'datetime', default: ()=> 'CURRENT_TIMESTAMP'})
    created_at: Date;

}