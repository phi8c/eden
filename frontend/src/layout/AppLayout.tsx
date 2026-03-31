import { useState } from "react"
import { observer } from "mobx-react-lite"

import LeftSidebar from "../components/sidebar/LeftSidebar"
import RightSidebar from "../components/sidebar/RightSidebar"

// ❌ bỏ component cũ
// import Conversation from "../components/chat/Conversation"
// import ChatInput from "../components/chat/ChatInput"

// ✅ dùng module
import MessageList from "../modules/chat/components/message/MessageList"
import ChatMessageInput from "../modules/chat/components/chatInput/ChatMessageInput"

import TopicTabs from "../modules/topic/components/tabs/TopicTabs"

import topicStore from "../modules/topic/stores/topicStore"
import chatStore from "../modules/chat/stores/chatStore"

import CreateTopicModal from "../modules/topic/components/modals/CreateTopicModal"

const AppLayout = observer(() => {
  const [leftOpen] = useState(true)
  const [rightOpen] = useState(true)
  const [openModal, setOpenModal] = useState(false)

  return (
    <div className="d-flex vh-100 overflow-hidden">

    
      {leftOpen && (
        <LeftSidebar
          chats={chatStore.conversations}
          activeChatId={ chatStore.activeConversationId ?? undefined}
          onSelectChat={async (id) => {
            // 🔥 set conversation
            chatStore.setActiveConversation(id)

            // 🔥 load topics
            await topicStore.loadTopics(Number(id))

            // 🔥 auto chọn topic đầu
            if (topicStore.topics.length > 0) {
              const firstTopicId = topicStore.topics[0].id
              chatStore.setActiveTopic(String(firstTopicId))
            }
          }}
        />
      )}

      {/* 🔥 MAIN */}
      <div className="flex-fill d-flex flex-column">

        {/* 🔥 TOPIC TABS */}
        <TopicTabs
          onChange={(topicId) => {
            chatStore.setActiveTopic(String(topicId))
          }}
          onCreateClick={() => setOpenModal(true)}
        />

        {/* 🔥 MESSAGE LIST */}
        <MessageList />

        {/* 🔥 INPUT */}
        <ChatMessageInput />

      </div>

      {rightOpen && <RightSidebar />}

      {/* 🔥 MODAL */}
      <CreateTopicModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        conversationId={Number(chatStore.activeConversationId)}
      />

    </div>
  )
})

export default AppLayout