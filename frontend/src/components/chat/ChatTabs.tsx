interface ChatTabsProps {
  tabs?: { id: string; title: string }[]
  activeTabId?: string
  onChange?: (id: string) => void
}
export default function ChatTabs({
  tabs = [],
  activeTabId,
  onChange,
}: ChatTabsProps) {
  return (
    <div className="border-bottom d-flex overflow-auto">

      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`px-3 py-2 border-end ${
            tab.id === activeTabId ? "bg-light" : ""
          }`}
          style={{ cursor: "pointer" }}
          onClick={() => onChange?.(tab.id)}
        >
          {tab.title}
        </div>
      ))}

    </div>
  )
}