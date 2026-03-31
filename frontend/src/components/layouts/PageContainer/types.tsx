import type { ReactNode } from "react"

export interface PageContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full"
}