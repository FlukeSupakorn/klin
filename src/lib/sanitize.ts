const ILLEGAL_CHARS = /[<>:"/\\|?*\x00-\x1F]/g

export function sanitizeFilename(filename: string): string {
  return filename.replace(ILLEGAL_CHARS, "_").trim()
}

export function applyTransform(value: string, transform?: string): string {
  if (!transform) return value

  switch (transform) {
    case "kebab":
      return value.toLowerCase().replace(/[\s_]+/g, "-")
    case "snake":
      return value.toLowerCase().replace(/[\s-]+/g, "_")
    case "upper":
      return value.toUpperCase()
    case "lower":
      return value.toLowerCase()
    default:
      return value
  }
}
