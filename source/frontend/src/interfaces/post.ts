export interface IPost {
  versions?: { language: string; title: string; content: string }[]
  id: string
  collection?: string
  title: string
  createdAt: string
  updatedAt?: string        // 最后修改时间
  published: boolean
  hideInList: boolean
  tags?: string[]
  categories?: string[]
  categoryIds?: string[]    // 分类 Slug 列表
  feature: string
  isTop: boolean
  content: string
  fileName: string
}
