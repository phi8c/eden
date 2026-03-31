export const required = (value: string) => {
  if (!value || value.trim() === "") {
    return "This field is required"
  }

  return null
}