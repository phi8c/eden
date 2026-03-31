import {Button} from "antd"
import type {PrimaryButtonProps} from "./types"
export const PrimaryButton  = ({
    children,
    onClick,
    loading = false,
    disabled = false,
    htmlType = "button"
    


}: PrimaryButtonProps) => {
    return (
        <Button
         type="primary"
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      htmlType={htmlType}
      block
        
        
        >
            {children}
        </Button>
    )
    
}

