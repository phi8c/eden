import type { NavbarProps } from "./types"

export default function Navbar({
  left,
  center,
  right,
  className = "",
}: NavbarProps) {
  return (
    <div
      className={`w-100 d-flex align-items-center justify-content-between border-bottom px-3 bg-white ${className}`}
      style={{ height: "56px" }}
    >
      <div className="d-flex align-items-center">
        {left}
      </div>

      <div className="d-flex align-items-center justify-content-center flex-fill">
        {center}
      </div>

      <div className="d-flex align-items-center">
        {right}
      </div>
    </div>
  )
}