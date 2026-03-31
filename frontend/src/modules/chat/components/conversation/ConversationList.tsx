import {observer} from "mobx-react-lite";
import {useEffect} from "react";
import chatStore from "../../stores/chatStore";
import ConversationItem from "./ConversationItem";

function ConversationList() {
    useEffect(() => {chatStore.getConversations()}, [])
    if(chatStore.isLoading) {
        return <div>Loading...</div>
    }
    return (
        <div className="list-group"> 

       {(chatStore.conversations || []).map((conversation)=> (
            <ConversationItem key={conversation.id} conversation={conversation} />
        ))}
        </div>
    )
}
export default observer(ConversationList)
