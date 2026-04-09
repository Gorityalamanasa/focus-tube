// =========================
// 🔥 CHECK NODE MATCH
// =========================
const nodeMatchesSelector = (node, selector) => {
  if (!node) return false

  // ✅ Only element nodes (important)
  if (node.nodeType !== 1) return false

  if (node.matches && node.matches(selector)) {
    return true
  }

  if (node.querySelector && node.querySelector(selector)) {
    return true
  }

  return false
}

// =========================
// 🔥 HIDE SECTION BY TITLE
// =========================
export const hideSectionByTitle = (titleText) => {
  const sections = document.querySelectorAll(
    "ytd-shelf-renderer.style-scope.ytd-item-section-renderer"
  )

  const section = Array.from(sections).find((section) => {
    const title = section.querySelector("#title")

    if (title) {
      return title.innerText.toLowerCase().includes(titleText.toLowerCase())
    } else {
      return false
    }
  })

  if (section) {
    section.style.display = "none"   // 🔥 stronger than class
  }
}

// =========================
// 🔥 FIXED OBSERVER (CRITICAL)
// =========================
export const observeDOM = (obj, selector, callback) => {
  const observer = new MutationObserver((mutations) => {
    let shouldRun = false

    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          if (nodeMatchesSelector(node, selector)) {
            shouldRun = true
          }
        })
      }
    })

    if (shouldRun) {
      callback()
    }
  })

  observer.observe(obj, {
    childList: true,
    subtree: true
  })
}

// =========================
// 🔥 CLEANUP CLASSES
// =========================
export const cleanUpFYClasses = () => {
  const currentFYBodyClasses = Array.from(document.body.classList).filter(
    (className) => className.startsWith("fy-")
  )

  currentFYBodyClasses.forEach((fyClassName) => {
    document.body.classList.remove(fyClassName)
  })
}