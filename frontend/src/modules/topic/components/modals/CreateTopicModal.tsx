import { Modal, message } from "antd"
import { useState } from "react"
import topicStore from "../../stores/topicStore"

interface Props {
  open: boolean
  onClose: () => void
  conversationId: number
}

export default function CreateTopicModal({
  open,
  onClose,
  conversationId,
}: Props) {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!name) {
      message.error("Topic name required")
      return
    }

    try {
      setLoading(true)
      await topicStore.createTopic(conversationId, name)
      message.success("Created")
      setName("")
      onClose()
    } catch {
      message.error("Create failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="Create Topic"
      open={open}
      onCancel={onClose}
      onOk={handleCreate}
      confirmLoading={loading}
    >
      <input
        className="form-control"
        placeholder="Enter topic name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </Modal>
  )
}