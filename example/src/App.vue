<template>
  <div id="app">
    <header class="header">
      <h1>🔔 OneSignal Vue Plugin Example</h1>
      <p>Test the OneSignal integration with your Vue app</p>
    </header>

    <main class="main">
      <div class="card">
        <h2>🚀 Quick Setup</h2>
        <p>
          Replace <code>xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</code> in main.js
          with your actual OneSignal App ID.
        </p>
        <div class="status-info">
          <p><strong>Status:</strong> {{ status }}</p>
          <p><strong>OneSignal ID:</strong> {{ userId || "Not available" }}</p>
        </div>
      </div>

      <div class="card">
        <h2>📱 Push Notifications</h2>
        <div class="button-group">
          <button @click="requestPermission" class="btn btn-secondary">
            🔔 Request Permission
          </button>

          <button @click="showSlidedownPrompt" class="btn btn-secondary">
            📋 Show Slidedown Prompt
          </button>
        </div>
      </div>

      <div class="card">
        <h2>👤 User Management</h2>
        <div class="input-group">
          <label for="externalIdInput">Set External ID:</label>
          <input
            id="externalIdInput"
            v-model="externalId"
            type="text"
            placeholder="Enter external ID"
            class="input"
          />
          <button
            @click="loginUser"
            :disabled="!externalId"
            class="btn btn-secondary"
          >
            🔑 Login User
          </button>
        </div>
      </div>

      <div class="card">
        <h2>🏷️ Tags & Events</h2>
        <div class="input-group">
          <label for="tagKey">Tag Key:</label>
          <input
            id="tagKey"
            v-model="tagKey"
            type="text"
            placeholder="e.g., user_type"
            class="input"
          />
          <label for="tagValue">Tag Value:</label>
          <input
            id="tagValue"
            v-model="tagValue"
            type="text"
            placeholder="e.g., premium"
            class="input"
          />
          <button
            @click="addTag"
            :disabled="!tagKey || !tagValue"
            class="btn btn-secondary"
          >
            🏷️ Add Tag
          </button>
        </div>

        <div class="input-group">
          <label for="eventName">Event Name:</label>
          <input
            id="eventName"
            v-model="eventName"
            type="text"
            placeholder="e.g., button_clicked"
            class="input"
          />
          <label for="eventProperties">Event Properties (JSON):</label>
          <textarea
            id="eventProperties"
            v-model="eventProperties"
            placeholder='{"key": "value", "count": 1}'
            class="input textarea"
            rows="3"
          ></textarea>
          <button
            @click="trackEvent"
            :disabled="!isInitialized || !eventName"
            class="btn btn-secondary"
          >
            📊 Track Event
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";

// Access OneSignal from the global property as shown in README
const { appContext } = getCurrentInstance();
const OneSignal = appContext.config.globalProperties.$OneSignal;

// Reactive state
const status = ref("OneSignal initialized via plugin");
const userId = ref(null);
const externalId = ref("");
const tagKey = ref("");
const tagValue = ref("");
const eventName = ref("");
const eventProperties = ref("");
const isInitialized = ref(false);

// Update user info
function updateUserInfo() {
  try {
    userId.value = OneSignal?.User?.onesignalId ?? null;
    isInitialized.value = !!OneSignal;
  } catch (error) {
    // ignore
  }
}

// Request permission for notifications
async function requestPermission() {
  try {
    await OneSignal.Notifications.requestPermission();
    updateUserInfo();
  } catch (error) {
    console.error("Error requesting permission:", error);
  }
}

// Show slidedown prompt
async function showSlidedownPrompt() {
  try {
    await OneSignal.Slidedown.promptPush();
  } catch (error) {
    console.error("Error showing slidedown:", error);
  }
}

// Login user with external ID
async function loginUser() {
  try {
    await OneSignal.login(externalId.value);
    updateUserInfo();
    externalId.value = "";
  } catch (error) {
    console.error("Error logging in user:", error);
  }
}

// Add tag to user
function addTag() {
  try {
    OneSignal.User.addTag(tagKey.value, tagValue.value);
    tagKey.value = "";
    tagValue.value = "";
  } catch (error) {
    console.error("Error adding tag:", error);
  }
}

// Track event
function trackEvent() {
  try {
    let properties = {
      timestamp: Date.now(),
      source: "example_app",
    };

    // Parse JSON properties if provided
    if (eventProperties.value.trim()) {
      try {
        const parsedProperties = JSON.parse(eventProperties.value);
        properties = { ...properties, ...parsedProperties };
      } catch (parseError) {
        console.error("Error parsing event properties JSON:", parseError);
        alert(
          "Invalid JSON format for event properties. Please check your input."
        );
        return;
      }
    }

    OneSignal.User.trackEvent(eventName.value, properties);
    eventName.value = "";
    eventProperties.value = "";
  } catch (error) {
    console.error("Error tracking event:", error);
  }
}

onMounted(() => {
  updateUserInfo();
});
</script>

<style scoped>
#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  line-height: 1.6;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
}

.header p {
  margin: 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.main {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
}

.card h2 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: #667eea;
}

.textarea {
  resize: vertical;
  min-height: 80px;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 0.9rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f8f9fa;
  color: #495057;
  border: 2px solid #e9ecef;
}

.btn-secondary:hover:not(:disabled) {
  background: #e9ecef;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.status-info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.status-info p {
  margin: 0.25rem 0;
}

code {
  background: #e9ecef;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 0.9em;
}

@media (max-width: 768px) {
  .main {
    grid-template-columns: 1fr;
  }

  .header h1 {
    font-size: 2rem;
  }

  .button-group {
    flex-direction: column;
  }

  .btn {
    margin-right: 0;
  }
}
</style>
