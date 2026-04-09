import { browserAPI } from "@helpers/browser.js"

// ===============================
// 🔥 GLOBAL STATE
// ===============================
let focusMode = false
let topics = []

// ===============================
// 🔥 LOAD USER SETTINGS
// ===============================
const loadSettings = () => {
  browserAPI.storage.sync.get(["focusMode", "topics"], (data) => {
    focusMode = data.focusMode || false
    topics = data.topics || []

    console.log("🔥 Focus Mode:", focusMode)
    console.log("🔥 Topics:", topics)

    smartFilterVideos()
  })
}

// ===============================
// 🔥 KEYWORD MATCH (SMART FILTER)
// ===============================
const isRelevant = (text) => {
  if (!text) return false

  const lower = text.toLowerCase()

  return topics.some(topic => lower.includes(topic))
}

// ===============================
// 🔥 STATS TRACKING
// ===============================
const updateStats = (type) => {
  browserAPI.storage.sync.get(["stats"], (data) => {
    const stats = data.stats || { learning: 0, blocked: 0 }

    stats[type] = (stats[type] || 0) + 1

    browserAPI.storage.sync.set({ stats })
  })
}

// ===============================
// 🔥 BADGE UI
// ===============================
const addBadge = (video, label) => {
  if (video.querySelector(".focus-badge")) return

  const badge = document.createElement("div")
  badge.className = "focus-badge"
  badge.innerText = label.toUpperCase()

  badge.style.position = "absolute"
  badge.style.top = "8px"
  badge.style.left = "8px"
  badge.style.padding = "2px 6px"
  badge.style.fontSize = "10px"
  badge.style.borderRadius = "4px"
  badge.style.zIndex = "999"

  badge.style.background =
    label === "relevant" ? "#22c55e" : "#ef4444"
  badge.style.color = "white"

  video.style.position = "relative"
  video.appendChild(badge)
}

// ===============================
// 🔥 MAIN FILTER FUNCTION
// ===============================
const smartFilterVideos = () => {
  if (!focusMode) return

  const videos = document.querySelectorAll("ytd-video-renderer, ytd-rich-item-renderer")

  videos.forEach(video => {
    if (video.dataset.checked) return
    video.dataset.checked = "true"

    const titleEl = video.querySelector("#video-title")
    const title = titleEl?.innerText || ""

    const link = video.querySelector("a#thumbnail")
    const href = link?.href || ""

    const label = isRelevant(title) ? "relevant" : "irrelevant"

    // ===============================
    // 🔥 SHORTS HANDLING (NOT REMOVE)
    // ===============================
    if (href.includes("/shorts/")) {
      if (label === "irrelevant") {
        video.style.opacity = "0.3"
      } else {
        video.style.opacity = "1"
      }
    }

    // ===============================
    // 🔥 NORMAL VIDEOS
    // ===============================
    if (!href.includes("/shorts/")) {
      if (label !== "relevant") {
        video.style.display = "none"
        updateStats("blocked")
        return
      } else {
        updateStats("learning")
      }
    }

    // ===============================
    // 🔥 ADD BADGE
    // ===============================
    addBadge(video, label)
  })
}

// ===============================
// 🔥 OBSERVER (FOR DYNAMIC LOAD)
// ===============================
const observeDOM = () => {
  const observer = new MutationObserver(() => {
    smartFilterVideos()
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

// ===============================
// 🔥 DETECT YOUTUBE NAVIGATION (IMPORTANT)
// ===============================
let lastUrl = location.href

setInterval(() => {
  const currentUrl = location.href

  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl

    console.log("🔄 YouTube navigation detected")

    setTimeout(() => {
      smartFilterVideos()
    }, 1500)
  }
}, 1000)

// ===============================
// 🔥 INIT
// ===============================
const init = () => {
  loadSettings()
  observeDOM()

  // initial load
  setTimeout(() => {
    smartFilterVideos()
  }, 1500)
}

init()