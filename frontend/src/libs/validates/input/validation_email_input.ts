import {required} from "../../rules/required"

export const validateEmailInput = (value: string) => {
    if (required(value)) {
        return required(value)
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(value)) {
        return "Invalid email address"
    }

    return null



}