export const minLength = (length: number) => {
  return (value: string) => {
    if (value.length < length) {
      return `Minimum ${length} characters`
    }

    return null
  }
}