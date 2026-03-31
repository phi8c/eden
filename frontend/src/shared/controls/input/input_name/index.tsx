import {Input} from 'antd'
import {useState} from 'react'
import {validateNameInput} from "../../../../libs/validates/input/validation_name_input"
import type {NameInputProps} from "./types"

export const NameInput = ({
    value,
    onChange,
    placeholder = "Enter name",
    disabled = false,
    showError = false,

}: NameInputProps) => {
     const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const newValue = e.target.value

    onChange(newValue)

    const validationError = validateNameInput(newValue)

    setError(validationError)
    }


    return (
        <div className="input-wrapper"> 
       <Input 
       value= {value}
       onChange= {handleChange}
       placeholder={placeholder}
       disabled = {disabled}


       />
      {showError && error && (
        <div className="input-error">
          {error}
        </div>
      )}


        </div>


    )
}


