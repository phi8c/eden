import { Badge } from "antd"
import type  {NotificationBadgeProps } from "./types"
export const NotificationBadge = ({
    count = 0,
    max = 99,
    children,
    showZero = false


}: NotificationBadgeProps ) => {
    const displayCount = count > max ? `${max} +` : count
    if (!showZero &&  count == 0)
    {
        return <> {children}</>
    }
    return (
        <Badge
        count = {displayCount}
        size = "small"
         >
            {children}

        </Badge>
    )

    

}

