import { Button } from "antd"

import type { IconButtonProps } from "./types"

export const IconButton = ({
  icon,
  onClick,
  size = "middle"
}: IconButtonProps) => {

  return (
    <Button
      type="text"
      icon={icon}
      onClick={onClick}
      size={size}
    />
  )
}