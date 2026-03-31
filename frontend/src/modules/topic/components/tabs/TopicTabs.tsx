import { observer } from "mobx-react-lite"

import topicStore from "../../stores/topicStore"
import chatStore from "../../../chat/stores/chatStore"

interface Props {
  onChange: (topicId: number) => void
  onCreateClick: () => void
}

const TopicTabs = observer(({ onChange, onCreateClick }: Props) => {
  return (
    <div className="d-flex align-items-center border-bottom px-2">

      {topicStore.topics.map((topic) => {
        const isActive =
          chatStore.currentTopicId === String(topic.id)

        return (
          <div
            key={topic.id}
            className={`px-3 py-2 me-2 cursor-pointer ${
              isActive
                ? "border-bottom border-primary fw-bold"
                : ""
            }`}
            onClick={() => {
              onChange(topic.id)
            }}
          >
            {topic.name}
          </div>
        )
      })}

      {/* 🔥 nút tạo topic */}
      <button
        className="btn btn-sm btn-outline-primary ms-auto"
        onClick={onCreateClick}
      >
        +
      </button>
    </div>
  )
})

export default TopicTabs