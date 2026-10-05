export function getCourseThumbnail(thumbnail?: string | null): string {
  if (!thumbnail || thumbnail.trim() === "") {
    return "/placeholder.jpg";
  }
  if (thumbnail.startsWith("http://") || thumbnail.startsWith("https://")) {
    return thumbnail;
  }
  if (thumbnail.startsWith("/")) {
    return thumbnail;
  }
  return "/" + thumbnail;
}
