interface RightSidebarProps {
  activeTab?: "summary" | "social";
  onChangeTab?: (tab: string) => void;
}
export default function RightSidebar({
  activeTab = "summary",
  onChangeTab,
}: RightSidebarProps) {
  return (
    <div
      className="border-start bg-light d-flex flex-column"
      style={{ width: "320px" }}
    >
      <div className="border-bottom d-flex">
        <button
          className={`btn flex-fill ${
            activeTab === "summary" ? "btn-light" : "btn-white"
          }`}
          onClick={() => onChangeTab?.("sumary")}
        >
          summary
        </button>

        <button
          className={`btn flex-fill ${
            activeTab === "social" ? "btn-light" : "btn-white"
          }`}
          onClick={() => onChangeTab?.("social")}
        >
          social
        </button>
      </div>
      <div className="flex-fill p-3">
        {activeTab === "summary" && <div>Summary content</div>}
        {activeTab === "social" && <div>Social content</div>}
      </div>
    </div>
  );
}
