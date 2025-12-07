<template>
  <div class="news-widget">
    <div class="news-title">{{ cleanTitle(currentArticle?.title) }}</div>
    <div class="news-preview">{{ cleanPreview(currentArticle?.content) }}</div>
    <div class="news-source">
      <q-icon :name="articleLogo" />
      <span> | {{ currentArticle?.source.name }}</span>
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

    return {
      articles,
      currentArticle,
      getDomainFromUrl,
      articleLogo,
      cleanPreview,
      cleanTitle,
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
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);

  .q-icon {
    font-size: 20px;
  }
}
</style>
