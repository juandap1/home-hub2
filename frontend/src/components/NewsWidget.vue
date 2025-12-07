<template>
  <div class="news-widget">
    <div class="news-title">{{ cleanTitle(currentArticle?.title) }}</div>
    <div class="news-preview">{{ cleanPreview(currentArticle?.content) }}</div>
    <div class="news-source">
      <q-icon :name="articleLogo" />
      <span>{{ currentArticle?.source.name }}</span>
      <span class="news-time">{{ formatTimeAgo(currentArticle?.publishedAt) }}</span>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useCounterStore } from 'src/stores/store'

export default defineComponent({
  name: 'NewsWidget',

  setup() {
    const store = useCounterStore()
    const articles = computed(() => store.news)
    const currentArticle = computed(() => articles.value[0])
    const articleLogo = computed(() => {
      return `img:http://localhost:6989/logo?company=${currentArticle.value?.source.name}&domain=${getDomainFromUrl(currentArticle.value?.url)}`
    })

    const getDomainFromUrl = (url) => {
      if (!url) return null
      try {
        const urlObject = new URL(url)
        return urlObject.hostname
      } catch (error) {
        console.error('Invalid URL:', error)
        return null // Or handle the error as appropriate for your application
      }
    }

    const cleanPreview = (preview) => {
      if (!preview) return null
      const regex = /\[.*?\]$/
      return preview.replace(regex, '').trim()
    }

    const cleanTitle = (title) => {
      if (!title) return null
      const regex = /-.*$/
      return title.replace(regex, '').trim()
    }

    const formatTimeAgo = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMins / 60)
      const diffDays = Math.floor(diffHours / 24)

      if (diffMins < 1) return 'just now'
      if (diffMins < 60) return `${diffMins}m ago`
      if (diffHours < 24) return `${diffHours}h ago`
      if (diffDays < 7) return `${diffDays}d ago`
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    return {
      articles,
      currentArticle,
      getDomainFromUrl,
      articleLogo,
      cleanPreview,
      cleanTitle,
      formatTimeAgo,
    }
  },
})
</script>

<style lang="scss" scoped>
.news-widget {
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
  overflow: hidden;
  box-sizing: border-box;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  line-height: 1;
  max-width: 600px;
}

.news-title {
  font-size: 16px;
  font-weight: bold;
}

.news-preview {
  font-size: 14px;
}

.news-source {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);

  .q-icon {
    font-size: 18px;
  }
}

.news-time {
  margin-left: auto;
}
</style>
