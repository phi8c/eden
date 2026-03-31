export type DangerButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
  htmlType?: "button" | "submit" | "reset"
}