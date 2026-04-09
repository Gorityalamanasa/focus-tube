<script>
import Settings from "./components/Settings.vue"
import PopupFooter from "./components/PopupFooter.vue"
import { browserAPI, extensionPageUrl } from "./helpers/browser.js"

export default {
  components: {
    Settings,
    PopupFooter
  },

  data() {
    return {
      focusMode: false,
      topics: [],
      mode: ""
    }
  },

  mounted() {
    browserAPI.storage.sync.get(
      ["focusMode", "topics", "mode"],
      (data) => {
        this.focusMode = data.focusMode || false
        this.topics = data.topics || []
        this.mode = data.mode || "Not selected"
      }
    )
  },

  watch: {
    focusMode(val) {
      browserAPI.storage.sync.set({ focusMode: val })
    }
  },

  methods: {
    openWelcomePage() {
      browserAPI.tabs.create({
        url: extensionPageUrl("welcome.html")
      })
    }
  }
}
</script>

<template>
<div class="focused-youtube-popup">
  
  <!-- HEADER -->
  <header class="focused-youtube-popup__header">
    <img
      src="./assets/logo.svg"
      class="focused-youtube-popup__logo"
      alt="Focused Youtube logo" />

    <img
      src="./assets/info_icon.svg"
      class="focused-youtube-popup__info-icon"
      alt="Settings"
      @click.prevent="openWelcomePage" />
  </header>

  <!-- MODE DISPLAY -->
  <div class="mode-box">
    <p class="label">Mode:</p>
    <p class="value">{{ mode }}</p>
  </div>

  <!-- TOPICS DISPLAY -->
  <div class="topics-box">
    <p class="label">Topics:</p>

    <div v-if="topics.length === 0" class="empty">
      No topics selected
    </div>

    <div v-else class="topics-list">
      <span
        v-for="(topic, index) in topics"
        :key="index"
        class="topic-tag"
      >
        {{ topic }}
      </span>
    </div>
  </div>

  <!-- FOCUS TOGGLE -->
  <div class="focused-youtube-popup__focus">
    <label class="focus-toggle">
      <input type="checkbox" v-model="focusMode" />
      <span>Focus Mode</span>
    </label>
  </div>

  <!-- SETTINGS -->
  <div class="focused-youtube-popup__settings">
    <Settings />
  </div>

  <hr class="focused-youtube-popup__hr">

  <!-- FOOTER -->
  <div class="focused-youtube-popup__footer">
    <PopupFooter />
  </div>

</div>
</template>

<style scoped>
.focused-youtube-popup {
  padding: 10px;
  width: 240px;
  font-family: Arial;
}

/* HEADER */
.focused-youtube-popup__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.focused-youtube-popup__logo {
  height: 24px;
}

.focused-youtube-popup__info-icon {
  width: 18px;
  cursor: pointer;
}

/* MODE */
.mode-box {
  margin-bottom: 10px;
}

.label {
  font-size: 12px;
  color: gray;
}

.value {
  font-weight: bold;
}

/* TOPICS */
.topics-box {
  margin-bottom: 10px;
}

.empty {
  font-size: 12px;
  color: #999;
}

.topics-list {
  margin-top: 6px;
}

.topic-tag {
  display: inline-block;
  background: #22c55e;
  color: white;
  padding: 4px 6px;
  margin: 3px;
  border-radius: 6px;
  font-size: 11px;
}

/* TOGGLE */
.focused-youtube-popup__focus {
  margin: 10px 0;
}

.focus-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

/* HR */
.focused-youtube-popup__hr {
  margin: 10px 0;
  border-top: 1px solid #e5e5e5;
}
</style>