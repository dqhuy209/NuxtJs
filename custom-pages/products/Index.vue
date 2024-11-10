<script setup>
// const { data: products } = useAsyncData(async () => {
//   const res = await $fetch("/api/v1/post");
//   console.log(res);
//   return res;
// });
// const { data: news } = await useFetch("/api/v1/post");
// const { data: news } = useAsyncData(async () => {
//   const res = await $fetch("/api/v1/post");
//   return res;
// });
const news = ref([]);
const searchQuery = ref("");
const page = ref(1);
const loading = ref(false);
let observer = null;
const loadArticles = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    const res = await $fetch("/api/v1/post", {
      params: {
        q: searchQuery.value || "latest",
        page: page.value,
        pageSize: 10,
      },
    });
    if (res.articles) {
      news.value.push(...res.articles);
      page.value++;
    }
  } catch (error) {
    console.log("Failed to fetch articles:", error);
  } finally {
    loading.value = false;
  }
};
const onSearch = () => {
  news.value = [];
  page.value = 1;
  loadArticles();
};
//
const setupObserver = () => {
  observer = new IntersectionObserver((entries) => {
    // 0 là đã xuất hiện ở vw
    if (entries[0].isIntersecting) {
      loadArticles();
    }
  });
  // Bắt đầu theo dõi
  observer.observe(document.querySelector(".load-more-trigger"));
};
// Ngắn kết nối tối ưu
onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});
onMounted(() => {
  loadArticles();
  setupObserver();
});
watch(searchQuery, () => {
  news.value = [];
  page.value = 1;
  loadArticles();
});
</script>

<template>
  <div class="news-container">
    <input
      placeholder="Tìm kiếm bài viết..."
      class="search-input"
      v-model="searchQuery"
      @keyup.enter="onSearch"
    />

    <ul class="news-list">
      <li class="news-item" v-for="(article, index) in news" :key="index">
        <h2>{{ article.title }}</h2>
        <p>{{ article.description }}</p>
      </li>
    </ul>

    <!--  -->
    <div class="loading">Đang tải thêm bài viết...</div>
    <div ref="loadMoreTrigger" class="load-more-trigger"></div>
  </div>
</template>

<style scoped>
.news-container {
  width: 90%;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f4f8fb;
  border-radius: 12px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
}

.search-input {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: #ffffff;
}
.search-input:focus {
  outline: none;
  border-color: #1e88e5;
  box-shadow: 0px 0px 8px rgba(30, 136, 229, 0.4);
}

.news-list {
  list-style-type: none;
  padding: 0;
}

.news-item {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
  padding: 15px;
  margin-bottom: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}
.news-item:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 20px rgba(30, 136, 229, 0.15);
  background-color: #e3f2fd;
}

.news-item h2 {
  font-size: 20px;
  margin: 0 0 8px;
  color: #1976d2;
  font-weight: 600;
  transition: color 0.3s ease;
}
.news-item:hover h2 {
  color: #0d47a1;
}

.news-item p {
  font-size: 15px;
  color: #546e7a;
  margin: 0;
  line-height: 1.6;
}

.loading {
  text-align: center;
  padding: 10px;
  font-weight: bold;
  color: #1e88e5;
  background-color: #e1f5fe;
  border-radius: 8px;
  margin-top: 10px;
  transition: all 0.3s ease;
}

.load-more-trigger {
  height: 1px;
  margin-bottom: 20px;
}
</style>
