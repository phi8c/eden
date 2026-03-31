import type { PageContainerProps } from "./types"

const widthMap = {
  sm: "container-sm",
  md: "container-md",
  lg: "container-lg",
  xl: "container-xl",
  full: "container-fluid",
}

export default function PageContainer({
  children,
  className = "",
  maxWidth = "lg",
}: PageContainerProps) {
  return (
    <div className={`${widthMap[maxWidth]} px-3 ${className}`}>
      {children}
    </div>
  )
}