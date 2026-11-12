<template>
  <div class="h-full flex flex-col bg-background">
    <header class="h-12 border-b px-6 flex items-center font-medium">Collections</header>
    <main class="flex-1 overflow-y-auto p-6 space-y-6">
      <p class="text-sm text-muted-foreground">Assign each post to one collection. Enter a new name to create a collection, or leave it empty to remove membership. Categories and tags are independent.</p>
      <div class="flex flex-wrap gap-2">
        <button class="border rounded-full px-3 py-1 text-sm" @click="filter = ''">All posts</button>
        <button v-for="name in names" :key="name" class="border rounded-full px-3 py-1 text-sm" @click="filter = name">{{ name }}</button>
      </div>
      <p role="status" class="text-sm">{{ status }}</p>
      <datalist id="all-collections"><option v-for="name in names" :key="name" :value="name" /></datalist>
      <article v-for="post in visiblePosts" :key="post.fileName" class="border-b pb-4 flex items-center gap-4">
        <div class="flex-1 min-w-0"><h2 class="text-sm font-medium">{{ post.title }}</h2><p class="text-xs text-muted-foreground">{{ post.published ? 'Published' : 'Draft' }}</p></div>
        <Input v-model="drafts[post.fileName]" list="all-collections" placeholder="No collection" :aria-label="`Collection for ${post.title}`" class="max-w-60" />
        <Button variant="outline" :disabled="busy || (drafts[post.fileName] || '').trim() === (post.collection || '')" @click="save(post.fileName)">Save</Button>
      </article>
    </main>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useSiteStore } from '@/stores/site'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SetCollection, LoadPosts } from '@/wailsjs/go/facade/PostFacade'
const site = useSiteStore()
const filter = ref('')
const drafts = reactive<Record<string, string>>({})
const busy = ref(false)
const status = ref('')
const names = computed(() => [...new Set(site.posts.map(p => p.collection || '').filter(Boolean))].sort())
const visiblePosts = computed(() => site.posts.filter(p => !filter.value || p.collection === filter.value))
watch(() => site.posts, posts => { for (const p of posts) drafts[p.fileName] = p.collection || '' }, { immediate: true })
async function save(fileName: string) {
  busy.value = true
  try { await SetCollection(fileName, (drafts[fileName] || '').trim()); site.updateSite({ posts: await LoadPosts() }); status.value = 'Saved. Preview or publish to regenerate collection pages.' }
  catch { status.value = 'Could not save collection. Please try again.' }
  finally { busy.value = false }
}
</script>
