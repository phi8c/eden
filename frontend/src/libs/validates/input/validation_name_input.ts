import { required } from "../../rules/required"
import { minLength } from "../../rules/min_length"
import { maxLength } from "../../rules/max_length"

export function validateNameInput(value: string) {
    const rules = [
        required,
        minLength(2),
        maxLength(50)
    ]
    for (const rule of rules) {
        const error = rule(value)
        if(error) return error 

        
    }
    return null
}