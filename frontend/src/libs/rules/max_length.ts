export const maxLength = (length: number) => {
  return (value: string) => {
    if (value.length > length) {
      return `Maximum ${length} characters`
    }

    return null
  }
}