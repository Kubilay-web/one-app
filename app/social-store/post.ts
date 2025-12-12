import { create } from 'zustand'

export interface Post {
  id: string
  content: string
  author: {
    name: string
    avatar: string
  }
  createdAt: string
  likes: number
  comments: number
  shares: number
  media?: string[]
}

interface PostStore {
  posts: Post[]
  addPost: (content: string, authorName: string, authorAvatar: string) => void
  setPosts: (posts: Post[]) => void
}

export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  
  addPost: (content, authorName, authorAvatar) => {
    const newPost: Post = {
      id: Date.now().toString(),
      content,
      author: {
        name: authorName,
        avatar: authorAvatar
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
    }
    
    set((state) => ({
      posts: [newPost, ...state.posts]
    }))
  },
  
  setPosts: (posts) => set({ posts }),
}))