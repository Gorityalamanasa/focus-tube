import { applyVideoPageFixes } from "./video-page"

export const initPlaylistsPage = () => {
  document.body.classList.add("fy-playlists-page")

  applyVideoPageFixes()

  // 🔥 ADD THIS (IMPORTANT)
  const observer = new MutationObserver(() => {
    applyVideoPageFixes()
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
}