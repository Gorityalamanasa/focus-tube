import {
  SETTINGS_COMMENTS_KEY,
  SETTINGS_DESCRIPTION_KEY,
  readStorageKeys
} from "@helpers/chrome-storage"
import "../video_style.css"

// =========================
// 🔥 DEFAULT FALLBACK TOPICS
// =========================
const DEFAULT_TOPICS = [
  "dsa",
  "data structure",
  "algorithm",
  "system design",
  "coding",
  "programming",
  "leetcode",
  "interview"
]

// =========================
// 🔥 SELECTORS
// =========================
const SELECTORS = [
  "ytd-compact-video-renderer",
  "ytd-video-renderer",
  "ytd-rich-item-renderer"
]

// =========================
// 🚀 MAIN INIT
// =========================
export const initVideoPage = () => {
  document.body.classList.add("fy-watch-page")

  applySettings()

  filterVideos()
  fixLayout()
  observeDOMChanges()
}

// =========================
// 🎯 APPLY SETTINGS
// =========================
const applySettings = () => {
  readStorageKeys(
    [SETTINGS_COMMENTS_KEY, SETTINGS_DESCRIPTION_KEY],
    (config) => {
      const $body = document.body

      // COMMENTS
      if (
        typeof config[SETTINGS_COMMENTS_KEY] === "undefined" ||
        config[SETTINGS_COMMENTS_KEY]
      ) {
        $body.classList.add("fy-watch-page--comments-visible")
      } else {
        $body.classList.remove("fy-watch-page--comments-visible")
      }

      // DESCRIPTION
      if (
        typeof config[SETTINGS_DESCRIPTION_KEY] === "undefined" ||
        config[SETTINGS_DESCRIPTION_KEY]
      ) {
        $body.classList.add("fy-watch-page--description-visible")
      } else {
        $body.classList.remove("fy-watch-page--description-visible")
      }
    }
  )
}

// =========================
// 🔥 GET USER TOPICS (IMPORTANT)
// =========================
const getTopics = (callback) => {
  chrome.storage.sync.get(["topics", "focusMode"], (data) => {
    const topics = data.topics?.length ? data.topics : DEFAULT_TOPICS
    const focusMode = data.focusMode ?? true

    callback(topics.map(t => t.toLowerCase()), focusMode)
  })
}

// =========================
// 🔥 SCORING SYSTEM (SMART FILTER)
// =========================
const getScore = (text, topics) => {
  let score = 0

  topics.forEach((topic) => {
    if (text.includes(topic)) score += 2
  })

  return score
}

// =========================
// 🔥 BADGE (UI)
// =========================
const addBadge = (video, type) => {
  if (video.querySelector(".focus-badge")) return

  const badge = document.createElement("div")
  badge.className = "focus-badge"
  badge.innerText = type

  badge.style.cssText = `
    position:absolute;
    top:8px;
    left:8px;
    padding:3px 6px;
    font-size:10px;
    border-radius:4px;
    z-index:999;
    color:white;
    background:${type === "RELEVANT" ? "#22c55e" : "#ef4444"};
  `

  video.style.position = "relative"
  video.appendChild(badge)
}

// =========================
// 🔥 FILTER VIDEOS (CORE)
// =========================
const filterVideos = () => {
  getTopics((topics, focusMode) => {

    // 🔥 NEW: TARGET SIDEBAR SPECIFICALLY (MAIN FIX)
    const sidebar = document.querySelector("#secondary")
    if (!sidebar) return

    const videos = sidebar.querySelectorAll(
      "ytd-compact-video-renderer, ytd-rich-item-renderer, ytd-video-renderer"
    )

    videos.forEach((video) => {

      const titleEl =
        video.querySelector("#video-title") ||
        video.querySelector("a#video-title") ||
        video.querySelector("yt-formatted-string")

      if (!titleEl) return

      const title = titleEl.innerText?.toLowerCase() || ""
      if (!title) return

      const score = getScore(title, topics)
     // 🔥 STRICT MATCH (MAIN FIX)
      // 🔥 IMPROVED MATCH (TITLE + CHANNEL + EXTRA SIGNALS)
     const channelEl = video.querySelector("#channel-name")
     const channel = channelEl?.innerText?.toLowerCase() || ""

     const isRelevant = topics.some(topic =>
     title.includes(topic) || channel.includes(topic)
     )

      // 🎯 STRICT FOCUS MODE
     if (focusMode) {
     if (isRelevant) {
     video.style.display = ""
     addBadge(video, "RELEVANT")
     } else {
     video.style.display = "none"
     }
     } else {
     video.style.display = ""
     addBadge(video, isRelevant ? "RELEVANT" : "DISTRACTING")
    }
    })
  })
}
// =========================
// 🎥 FIX LAYOUT
// =========================
const fixLayout = () => {
  const secondary = document.querySelector("#secondary")
  const primary = document.querySelector("#primary")
  const player = document.querySelector("#player")

  const playlist = document.querySelector("ytd-playlist-panel-renderer")
  if (playlist) {
    playlist.style.display = "block"
  }

  if (primary) {
    primary.style.maxWidth = "1280px"
    primary.style.margin = "0 auto"
  }

  if (player) {
    player.style.maxWidth = "100%"
  }

  if (secondary) {
    secondary.style.display = "block"
    secondary.style.width = "380px"
  }
}

// =========================
// 🔥 OBSERVER
// =========================
const observeDOMChanges = () => {
  let timeout

  const observer = new MutationObserver(() => {
    clearTimeout(timeout)

    timeout = setTimeout(() => {

      const sidebar = document.querySelector("#secondary")
      if (!sidebar) return

      filterVideos()
      fixLayout()

    }, 300)
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
}

// =========================
// 🔥 FOR PLAYLIST PAGE
// =========================
export const applyVideoPageFixes = () => {
  filterVideos()
  fixLayout()
}