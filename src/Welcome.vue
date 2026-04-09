<script>
import { browserAPI } from "@helpers/browser.js"
import { saveUserProfile } from "@helpers/cloud"

export default {
  data() {
    return {
      selectedMode: "",
      loading: false,

      // Custom Mode
      customTopics: [],
      newTopic: "",
      showError: false
    }
  },

  methods: {

    // ✅ Select mode
    selectMode(mode) {
      this.selectedMode = mode
      this.showError = false
    },

    // ✅ Add topic
    addTopic() {
      const topic = this.newTopic.trim().toLowerCase()

      if (!topic) return

      if (!this.customTopics.includes(topic)) {
        this.customTopics.push(topic)
      }

      this.newTopic = ""
    },

    // ✅ Remove topic
    removeTopic(index) {
      this.customTopics.splice(index, 1)
    },

    // 🚀 FINAL START MODE (FIXED)
    startMode() {

      if (!this.selectedMode) return

      this.loading = true

      const modeMap = {
        study: ["dsa", "data structure", "algorithm", "interview", "system design"],
        ai: ["machine learning", "deep learning", "generative ai", "llm"],
        tech: ["react", "node", "web development", "full stack"]
      }

      let topics = []

      // 🔥 Custom mode
      if (this.selectedMode === "custom") {
        if (this.customTopics.length === 0) {
          this.showError = true
          this.loading = false
          return
        }
        topics = this.customTopics
      } else {
        topics = modeMap[this.selectedMode]
      }

      // ✅ Save locally
      browserAPI.storage.sync.set({
        mode: this.selectedMode,
        topics: topics,
        focusMode: true
      })

      // 🚀 INSTANT NAVIGATION (NO LOADING ISSUE)
      window.location.href = "https://www.youtube.com"

      // 🔥 Background cloud save (non-blocking)
      saveUserProfile({
        mode: this.selectedMode,
        topics: topics,
        createdAt: Date.now()
      }).catch(() => {
        console.log("Cloud save failed")
      })
    }
  }
}
</script>

<template>
<div class="fy-ai">

  <h1>🚀 FocusTube AI</h1>
  <p class="subtitle">Choose your focus mode</p>

  <!-- MODES -->
  <div class="modes">

    <div
      class="mode-card"
      :class="{ active: selectedMode === 'study' }"
      @click="selectMode('study')"
    >
      🎓 Study Mode
      <p>DSA, interviews, learning</p>
    </div>

    <div
      class="mode-card"
      :class="{ active: selectedMode === 'ai' }"
      @click="selectMode('ai')"
    >
      🤖 AI Mode
      <p>ML, GenAI, deep learning</p>
    </div>

    <div
      class="mode-card"
      :class="{ active: selectedMode === 'tech' }"
      @click="selectMode('tech')"
    >
      💻 Tech Mode
      <p>Web dev, coding, projects</p>
    </div>

    <div
      class="mode-card"
      :class="{ active: selectedMode === 'custom' }"
      @click="selectMode('custom')"
    >
      ⚙️ Custom Mode
      <p>Your own topics</p>
    </div>

  </div>

  <!-- CUSTOM MODE -->
  <div v-if="selectedMode === 'custom'" class="custom-box">

    <div class="input-row">
      <input
        v-model="newTopic"
        type="text"
        placeholder="Enter topic (e.g. music, dance, anime)"
        @keyup.enter="addTopic"
      />
      <button @click="addTopic">Add</button>
    </div>

    <div class="topics">
      <span
        v-for="(topic, index) in customTopics"
        :key="index"
        class="chip"
      >
        {{ topic }}
        <span class="remove" @click="removeTopic(index)">✕</span>
      </span>
    </div>

  </div>

  <!-- ERROR -->
  <p v-if="showError" class="error">
    ⚠️ Add at least one topic
  </p>

  <!-- START BUTTON -->
  <button
    class="start-btn"
    :disabled="!selectedMode"
    @click="startMode"
  >
    {{ loading ? "Loading..." : "Start Focus Mode 🚀" }}
  </button>

  <p class="tip">📌 Smart filtering powered by FocusTube AI</p>

</div>
</template>

<style scoped>
.fy-ai {
  text-align: center;
  margin-top: 60px;
}

.subtitle {
  color: #666;
  margin-bottom: 20px;
}

.modes {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.mode-card {
  width: 180px;
  padding: 16px;
  border-radius: 10px;
  border: 2px solid #ddd;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-card:hover {
  border-color: #22c55e;
  transform: translateY(-3px);
}

.mode-card.active {
  border-color: #22c55e;
  background: #ecfdf5;
}

.custom-box {
  margin-top: 20px;
}

.input-row {
  display: flex;
  justify-content: center;
  gap: 10px;
}

input {
  padding: 10px;
  width: 280px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  padding: 10px 14px;
  border: none;
  background: #ddd;
  border-radius: 6px;
  cursor: pointer;
}

.topics {
  margin-top: 10px;
}

.chip {
  background: #22c55e;
  color: white;
  padding: 6px 10px;
  margin: 5px;
  border-radius: 20px;
  display: inline-block;
}

.remove {
  margin-left: 8px;
  cursor: pointer;
}

.error {
  color: red;
  margin-top: 10px;
}

.start-btn {
  margin-top: 25px;
  background: #16a34a;
  color: white;
  padding: 12px 20px;
  font-weight: bold;
}

.start-btn:disabled {
  background: #ccc;
}

.tip {
  margin-top: 20px;
  color: #777;
}
</style>