export class SocketRoom{

    static user(
        userId:number,
    ){

        return `user_${userId}`;

    }

    static conversation(
        conversationId:number,
    ){

        return `conversation_${conversationId}`;

    }

}