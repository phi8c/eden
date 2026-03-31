import { required } from "../../rules/required"
import { minLength } from "../../rules/min_length"

export const validatePasswordInput = (value: string) => {
    const rules = [required, minLength(10)]
    for (const rule of rules) {
        const error = rule(value)
        if(error)  return error
    }
    return null

}