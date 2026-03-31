import { Avatar } from "antd"
import type { UserAvatarProps } from "./types"

import styles from "./styles.module.css"

const getInitials = (name?: string) => {

  if (!name) return "?"

  const parts = name.split(" ")

  if (parts.length === 1) {
    return parts[0][0]
  }

  return parts[0][0] + parts[1][0]
}

export const UserAvatar = ({
  src,
  name,
  size = 40,
  online = false
}: UserAvatarProps) => {

  const initials = getInitials(name)

  return (
    <div className={styles.avatarWrapper}>

      <Avatar
        src={src}
        size={size}
      >
        {initials}
      </Avatar>

      {online && (
        <span className={styles.onlineDot}/>
      )}

    </div>
  )
}