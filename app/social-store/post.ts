import { create } from "zustand";

/* =======================
   TYPES
======================= */
export interface Post {
  id: string;
  createdAt: string;
  text: string;
  images: string[];
  videos: string[];
  user: {
    username: string;
    avatarUrl: string;
  };
  likesCount: number;
  isLiked: boolean;
  comments: any[];
  commentsCount: number;
}

interface PostStore {
  posts: Post[];
  isLoading: boolean;
  hasMore: boolean;
  page: number;

  // setters
  setPosts: (posts: Post[]) => void;
  resetPage: () => void;

  // actions
  prependPost: (post: Post) => void;
  updatePost: (postId: string, data: Partial<Post>) => void;
  deletePost: (postId: string) => void;

  // async
  fetchPosts: () => Promise<void>;
}

/* =======================
   STORE
======================= */
const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  isLoading: false,
  hasMore: true,
  page: 1,

  /* -------- SETTERS -------- */
  setPosts: (posts) => set({ posts }),
  resetPage: () => set({ page: 1, hasMore: true }),

  /* -------- ACTIONS -------- */
  prependPost: (post) =>
    set((state) => ({
      posts: [post, ...state.posts],
    })),

  updatePost: (postId, data) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, ...data } : post
      ),
    })),

  deletePost: (postId) =>
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    })),

  /* -------- FETCH POSTS -------- */
  fetchPosts: async () => {
    const { hasMore } = get();
    if (!hasMore) return;

    try {
      set({ isLoading: true });

      const res = await fetch("/api/social/posts", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();

      const formatted: Post[] = data.map((post: any) => ({
        id: String(post.id),
        createdAt: post.createdAt,
        text: post.text ?? "",
        images: post.images ?? [],
        videos: post.videos ?? [],
        user: {
          username: post.user?.username ?? "Unknown",
          avatarUrl: post.user?.avatarUrl ?? "/default-avatar.png",
        },
        likesCount: post.React?.length ?? 0,
        isLiked: post.isLiked ?? false,
        comments: post.comments ?? [],
        commentsCount: post.comments?.length ?? 0,
      }));

      if (formatted.length === 0) {
        set({ hasMore: false });
        return;
      }

      // 🔥 ATOMİK & GÜVENLİ UPDATE
      set((state) => ({
        posts:
          state.page === 1
            ? formatted
            : [...state.posts, ...formatted],
        page: state.page + 1,
      }));
    } catch (error) {
      console.error("fetchPosts error:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default usePostStore;
