<template>
  <q-page class="home-hub">
    <!-- Background Photo Slideshow -->
    <div class="photo-background">
      <transition name="fade" mode="out-in">
        <img
          :key="currentPhotoIndex"
          :src="photos[currentPhotoIndex].url"
          :alt="photos[currentPhotoIndex].caption"
          class="background-photo"
        />
      </transition>
      <div class="photo-overlay" />
    </div>

    <!-- Main Content -->
    <div class="hub-content">
      <!-- Left Side: Time, Date, Weather (Bottom) -->
      <div class="left-panel">
        <div class="left-spacer" />
        <div class="left-info">
          <div class="time-display">{{ currentTime }}</div>
          <div class="date-display">{{ currentDate }}</div>
        </div>
      </div>

      <!-- Right Side: Widgets -->
      <div class="right-panel">
        <weather-widget />
        <div class="widget-calendar">
          <CalendarWidget />
        </div>
        <div class="widget-news">
          <NewsWidget />
        </div>
      </div>
    </div>

    <!-- Photo indicator -->
    <!-- <div class="photo-indicator">
      <span
        v-for="(photo, index) in photos"
        :key="index"
        class="indicator-dot"
        :class="{ active: index === currentPhotoIndex }"
        @click="goToPhoto(index)"
      />
    </div> -->
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import CalendarWidget from 'src/components/CalendarWidget.vue'
import NewsWidget from 'src/components/NewsWidget.vue'
import WeatherWidget from 'src/components/WeatherWidget.vue'

export default defineComponent({
  name: 'IndexPage',

  components: {
    CalendarWidget,
    NewsWidget,
    WeatherWidget,
  },

  setup() {
    const currentTime = ref('')
    const currentDate = ref('')
    const currentPhotoIndex = ref(0)
    let timeInterval = null
    let photoInterval = null

    const photos = ref([
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
        caption: 'Mountain Adventure',
      },
      {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop',
        caption: 'Ocean Sunset',
      },
      {
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop',
        caption: 'Forest Path',
      },
      {
        url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop',
        caption: 'Lake Reflection',
      },
      {
        url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&h=1080&fit=crop',
        caption: 'Starry Night',
      },
    ])

    const updateTime = () => {
      const now = new Date()

      currentTime.value = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })

      currentDate.value = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    }

    const nextPhoto = () => {
      currentPhotoIndex.value = (currentPhotoIndex.value + 1) % photos.value.length
    }

    const goToPhoto = (index) => {
      currentPhotoIndex.value = index
    }

    onMounted(() => {
      updateTime()
      timeInterval = setInterval(updateTime, 1000)
      photoInterval = setInterval(nextPhoto, 15000) // Change photo every 15 seconds
    })

    onUnmounted(() => {
      if (timeInterval) clearInterval(timeInterval)
      if (photoInterval) clearInterval(photoInterval)
    })

    return {
      currentTime,
      currentDate,
      currentPhotoIndex,
      photos,
      goToPhoto,
    }
  },
})
</script>

<style lang="scss" scoped>
.home-hub {
  position: fixed;
  inset: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

// Background Photo Slideshow
.photo-background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.background-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 1s ease;
}

.photo-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.1) 40%,
    rgba(0, 0, 0, 0.4) 70%,
    rgba(0, 0, 0, 0.6) 100%
  );
  pointer-events: none;
}

// Main Content Layout
.hub-content {
  position: relative;
  z-index: 1;
  display: flex;
  height: 100vh;
  padding: 24px;
  gap: 24px;
  box-sizing: border-box;
  overflow: hidden;
}

// Left Panel - Time/Date/Weather
.left-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-width: 0;
}

.left-spacer {
  flex: 1;
}

.left-info {
  animation: fadeIn 1s ease forwards;
}

.time-display {
  font-size: 96px;
  font-weight: 200;
  line-height: 1;
  letter-spacing: -4px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.date-display {
  font-size: 28px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

// Right Panel - Widgets
.right-panel {
  width: 340px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.widget-calendar,
.widget-news {
  flex: 1;
  min-height: 0;
  max-height: 50%;
  overflow: hidden;
  animation: slideIn 0.6s ease forwards;
}

.widget-calendar {
  animation-delay: 0.2s;
  opacity: 0;
}

.widget-news {
  animation-delay: 0.4s;
  opacity: 0;
}

// Photo Indicator
.photo-indicator {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  gap: 10px;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.indicator-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  &.active {
    width: 28px;
    border-radius: 5px;
    background: linear-gradient(90deg, var(--accent-purple), var(--accent-pink));
  }
}

// Animations
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// Photo transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// Responsive
@media (max-width: 1000px) {
  .hub-content {
    flex-direction: column;
    padding: 24px;
  }

  .left-panel {
    flex: none;
  }

  .time-display {
    font-size: 64px;
  }

  .date-display {
    font-size: 20px;
  }

  .right-panel {
    width: 100%;
    flex-direction: row;
  }

  .photo-indicator {
    bottom: 16px;
  }
}

@media (max-width: 600px) {
  .time-display {
    font-size: 48px;
  }

  .right-panel {
    flex-direction: column;
  }

  .widget-calendar,
  .widget-news {
    min-height: 300px;
  }
}
</style>
