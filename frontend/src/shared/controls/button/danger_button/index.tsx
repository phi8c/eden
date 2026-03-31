import { Button } from "antd"
import type { DangerButtonProps } from "./types"

export const DangerButton = ({
  children,
  onClick,
  loading = false,
  disabled = false,
  htmlType = "button"
}: DangerButtonProps) => {

  return (
    <Button
      danger
      loading={loading}
      disabled={disabled}
      htmlType={htmlType}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}