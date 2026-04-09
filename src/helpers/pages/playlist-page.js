import { applyVideoPageFixes } from "./video-page" // adjust path if needed

export const initPlaylistPage = () => {
  document.body.classList.add("fy-playlist-page")

  // 🔥 Apply same layout fixes
  applyVideoPageFixes()
}