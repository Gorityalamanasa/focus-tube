import "../video_style.css"
// ===============================
// 🔥 USE CHROME API (NO BUILD ERRORS)
// ===============================
const browserAPI = chrome

// ===============================
// 🔥 GLOBAL STATE
// ===============================
let focusMode = false
let topics = []
let lastUrl = location.href

// ===============================
// 🔥 LOAD SETTINGS
// ===============================
const loadSettings = (callback) => {
  browserAPI.storage.sync.get(["focusMode", "topics"], (data) => {
    focusMode = data.focusMode || false
    topics = data.topics || []

    console.log("🔥 Focus Mode:", focusMode)
    console.log("🔥 Topics:", topics)

    if (callback) callback()
  })
}

// ===============================
// 🔥 MATCH LOGIC
// ===============================
const isRelevant = (text) => {
  if (!text) return false
  const lower = text.toLowerCase()
  return topics.some(topic => lower.includes(topic))
}

// ===============================
// 🔥 STATS
// ===============================
const updateStats = (type) => {
  browserAPI.storage.sync.get(["stats"], (data) => {
    const stats = data.stats || { learning: 0, blocked: 0 }
    stats[type] = (stats[type] || 0) + 1
    browserAPI.storage.sync.set({ stats })
  })
}

// ===============================
// 🔥 BADGE
// ===============================
const addBadge = (video, label) => {
  if (video.querySelector(".focus-badge")) return

  const badge = document.createElement("div")
  badge.className = "focus-badge"
  badge.innerText = label.toUpperCase()

  badge.style.cssText = `
    position:absolute;
    top:8px;
    left:8px;
    padding:3px 6px;
    font-size:10px;
    border-radius:4px;
    z-index:999;
    background:${label === "relevant" ? "#22c55e" : "#ef4444"};
    color:white;
  `

  video.style.position = "relative"
  video.appendChild(badge)
}

// ===============================
// 🔥 HOMEPAGE REDIRECT
// ===============================
const handleHomeRedirect = () => {
  if (!focusMode) return

  if (location.pathname === "/" && topics.length > 0) {
    const query = topics[0]

    console.log("🚀 Redirecting to:", query)

    window.location.href =
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent(query)
  }
}

// ===============================
// 🔥 FILTER ENGINE
// ===============================
const smartFilterVideos = () => {
  if (!focusMode) return

  const videos = document.querySelectorAll(
    "ytd-video-renderer, ytd-rich-item-renderer"
  )

  videos.forEach(video => {
    if (video.dataset.checked === lastUrl) return
    video.dataset.checked = lastUrl

    const titleEl = video.querySelector("#video-title")
    const title = titleEl?.innerText || ""

    const link = video.querySelector("a#thumbnail")
    const href = link?.href || ""

    const label = isRelevant(title) ? "relevant" : "irrelevant"

    // 🔥 SHORTS → dim only
    if (href.includes("/shorts/")) {
      video.style.opacity = label === "relevant" ? "1" : "0.3"
    }

    // 🔥 NORMAL VIDEOS
    if (!href.includes("/shorts/")) {
      if (label !== "relevant") {
        video.style.display = "none"
        updateStats("blocked")
        return
      } else {
        updateStats("learning")
        video.style.border = "2px solid #22c55e"
        video.style.borderRadius = "10px"
      }
    }

    addBadge(video, label)
  })
}

// ===============================
// 🔥 SIDEBAR TOGGLE BUTTON
// ===============================
const setupSidebarToggle = () => {
  if (document.querySelector("#fy-toggle-btn")) return

  const toggleBtn = document.createElement("div")
  toggleBtn.id = "fy-toggle-btn"
  toggleBtn.innerText = "☰"

  toggleBtn.style.cssText = `
    position:fixed;
    top:10px;
    left:10px;
    z-index:9999;
    cursor:pointer;
    font-size:20px;
    background:#fff;
    padding:6px 10px;
    border-radius:6px;
    box-shadow:0 2px 6px rgba(0,0,0,0.2);
  `

  document.body.appendChild(toggleBtn)

  let sidebarVisible = false

  toggleBtn.onclick = () => {
    const sidebar = document.querySelector("#guide")
    if (!sidebar) return

    sidebar.style.transition = "0.3s"
    sidebarVisible = !sidebarVisible

    sidebar.style.transform = sidebarVisible
      ? "translateX(0)"
      : "translateX(-100%)"
  }

  const sidebar = document.querySelector("#guide")
  if (sidebar) sidebar.style.transform = "translateX(-100%)"
}

// ===============================
// 🔥 VIDEO + PLAYLIST LAYOUT FIX (IMPORTANT)
// ===============================
const fixVideoLayout = () => {
  const player = document.querySelector("#primary")
  const sidebar = document.querySelector("#secondary")
  const container = document.querySelector("#columns")

  if (!player || !sidebar || !container) return

  container.style.display = "flex"
  container.style.justifyContent = "center"
  container.style.alignItems = "flex-start"
  container.style.gap = "20px"

  // 🎯 VIDEO FIX
  player.style.maxWidth = "900px"
  player.style.width = "100%"
  player.style.margin = "0 auto"

  // 🎯 PLAYLIST FIX (RIGHT SIDE CLEAN)
  sidebar.style.width = "350px"
  sidebar.style.minWidth = "300px"
  sidebar.style.position = "sticky"
  sidebar.style.top = "80px"
  sidebar.style.height = "calc(100vh - 100px)"
  sidebar.style.overflowY = "auto"

  // 🎯 REMOVE OVERLAY ISSUE
  sidebar.style.transform = "none"
  sidebar.style.zIndex = "10"
}

// ===============================
// 🔥 OBSERVER (DYNAMIC LOAD)
// ===============================
const observeDOM = () => {
  const observer = new MutationObserver(() => {
    smartFilterVideos()
    setupSidebarToggle()
    fixVideoLayout()
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
}

// ===============================
// 🔥 NAVIGATION DETECTION
// ===============================
setInterval(() => {
  const currentUrl = location.href

  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl

    console.log("🔄 Navigation detected")

    loadSettings(() => {
      setTimeout(() => {
        handleHomeRedirect()
        smartFilterVideos()
        setupSidebarToggle()
        fixVideoLayout()
      }, 1200)
    })
  }
}, 1000)

// ===============================
// 🔥 INIT
// ===============================
const init = () => {
  loadSettings(() => {
    observeDOM()

    handleHomeRedirect()
    smartFilterVideos()
    setupSidebarToggle()

    setTimeout(() => {
      fixVideoLayout()
    }, 1500)
  })
}

init()