<template>
  <div class="news-widget glass-card">
    <div class="news-header">
      <q-icon name="newspaper" />
      <span>Headlines</span>
    </div>

    <div class="news-list">
      <div
        v-for="article in articles"
        :key="article.id"
        class="news-item"
        :style="{ '--category-color': article.categoryColor }"
        @click="openArticle(article)"
      >
        <div class="news-category">{{ article.category }}</div>
        <div class="news-title">{{ article.title }}</div>
        <div class="news-meta">
          <span class="news-source">{{ article.source }}</span>
          <span class="news-time">{{ article.timeAgo }}</span>
        </div>
      </div>
    </div>

    <button class="refresh-btn" @click="refreshNews">
      <q-icon name="refresh" />
      <span>Refresh</span>
    </button>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'NewsWidget',

  setup() {
    const articles = ref([
      {
        id: 1,
        title: 'Tech Giants Report Record Quarterly Earnings',
        source: 'Reuters',
        category: 'Business',
        categoryColor: '#60a5fa',
        timeAgo: '2h ago',
        url: '#',
      },
      {
        id: 2,
        title: 'Scientists Discover New Species in Deep Ocean Expedition',
        source: 'Nature',
        category: 'Science',
        categoryColor: '#4ade80',
        timeAgo: '4h ago',
        url: '#',
      },
      {
        id: 3,
        title: 'Championship Finals Set to Break Viewership Records',
        source: 'ESPN',
        category: 'Sports',
        categoryColor: '#fb923c',
        timeAgo: '5h ago',
        url: '#',
      },
      {
        id: 4,
        title: 'New Climate Agreement Reached at Global Summit',
        source: 'BBC',
        category: 'World',
        categoryColor: '#a78bfa',
        timeAgo: '6h ago',
        url: '#',
      },
      {
        id: 5,
        title: 'AI Breakthrough Enables Real-Time Translation',
        source: 'TechCrunch',
        category: 'Tech',
        categoryColor: '#22d3ee',
        timeAgo: '8h ago',
        url: '#',
      },
    ])

    const openArticle = (article) => {
      console.log('Opening article:', article.title)
    }

    const refreshNews = () => {
      console.log('Refreshing news...')
    }

    return {
      articles,
      openArticle,
      refreshNews,
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
}

.news-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;

  .q-icon {
    font-size: 20px;
    color: var(--accent-orange);
  }
}

.news-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.news-item {
  padding: 14px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--category-color);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(4px);
  }

  &:active {
    transform: scale(0.98);
  }
}

.news-category {
  font-size: 10px;
  font-weight: 600;
  color: var(--category-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.news-title {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: var(--text-muted);
}

.news-source {
  font-weight: 500;
}

.news-time {
  opacity: 0.7;
}

.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
  }

  &:active {
    transform: scale(0.98);
  }

  .q-icon {
    font-size: 18px;
  }
}
</style>
