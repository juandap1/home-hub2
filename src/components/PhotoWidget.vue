<template>
  <div class="photo-widget glass-card">
    <div class="photo-container" @click="nextPhoto">
      <transition name="fade" mode="out-in">
        <img
          :key="currentIndex"
          :src="photos[currentIndex].url"
          :alt="photos[currentIndex].caption"
          class="photo"
        />
      </transition>
      <div class="photo-overlay">
        <span class="photo-caption">{{ photos[currentIndex].caption }}</span>
      </div>
    </div>

    <div class="photo-controls">
      <button class="nav-btn" @click.stop="prevPhoto">
        <q-icon name="chevron_left" />
      </button>

      <div class="photo-dots">
        <span
          v-for="(photo, index) in photos"
          :key="index"
          class="dot"
          :class="{ active: index === currentIndex }"
          @click.stop="goToPhoto(index)"
        />
      </div>

      <button class="nav-btn" @click.stop="nextPhoto">
        <q-icon name="chevron_right" />
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'

export default defineComponent({
  name: 'PhotoWidget',

  setup() {
    const currentIndex = ref(0)
    let autoPlayInterval = null

    // Using placeholder images - replace with your own photos
    const photos = ref([
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        caption: 'Mountain Adventure',
      },
      {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        caption: 'Ocean Sunset',
      },
      {
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
        caption: 'Forest Path',
      },
      {
        url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop',
        caption: 'Lake Reflection',
      },
      {
        url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop',
        caption: 'Starry Night',
      },
    ])

    const nextPhoto = () => {
      currentIndex.value = (currentIndex.value + 1) % photos.value.length
    }

    const prevPhoto = () => {
      currentIndex.value =
        currentIndex.value === 0 ? photos.value.length - 1 : currentIndex.value - 1
    }

    const goToPhoto = (index) => {
      currentIndex.value = index
    }

    const startAutoPlay = () => {
      autoPlayInterval = setInterval(nextPhoto, 10000) // Change every 10 seconds
    }

    const stopAutoPlay = () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval)
      }
    }

    onMounted(() => {
      startAutoPlay()
    })

    onUnmounted(() => {
      stopAutoPlay()
    })

    return {
      currentIndex,
      photos,
      nextPhoto,
      prevPhoto,
      goToPhoto,
    }
  },
})
</script>

<style lang="scss" scoped>
.photo-widget {
  padding: 12px;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
  overflow: hidden;
}

.photo-container {
  flex: 1;
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-md);
    padding: 2px;
    background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.5;
    pointer-events: none;
  }
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-md);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px 16px 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  border-radius: 0 0 var(--radius-md) var(--radius-md);
}

.photo-caption {
  font-size: 14px;
  font-weight: 500;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.photo-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.nav-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  &:active {
    transform: scale(0.9);
  }

  .q-icon {
    font-size: 20px;
  }
}

.photo-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  &.active {
    width: 24px;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--accent-purple), var(--accent-pink));
  }
}

// Transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
