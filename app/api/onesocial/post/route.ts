import { NextRequest, NextResponse } from 'next/server'
import db from "@/app/lib/db"
import { validateRequest } from '@/app/auth'
// GET /api/postsocial - Tüm postları getir (arkadaşların ve kendi postları)
export async function GET(request: NextRequest) {
  try {
    const {user} = await validateRequest()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Kullanıcı ID'si
    const userId = user?.id

    // Where koşulu: type 'story' olmayan ve arkadaşların postları
    let whereCondition: any = {
      type: { not: 'story' } // Story olmayan postlar
    }

    // Kullanıcı giriş yaptıysa, arkadaşlarının ve kendi postlarını göster
    if (userId) {
      // Arkadaşları bul
      const friends = await db.friendRequest.findMany({
        where: {
          OR: [
            { userId, status: 'accepted' },
            { friendId: userId, status: 'accepted' }
          ]
        },
        select: {
          userId: true,
          friendId: true
        }
      })

      // Arkadaş ID'lerini topla
      const friendIds = friends.flatMap(friend => 
        friend.userId === userId ? friend.friendId : friend.userId
      )

      // Kendi ID'yi de ekle
      const allUserIds = [userId, ...friendIds]
      whereCondition.userId = { in: allUserIds }
    } else {
      // Giriş yapmamışsa public postları göster
      whereCondition = {
        type: { not: 'story' }
      }
    }

    // Post'ları getir (comments, likes, reacts, user bilgileri ile)
    const posts = await db.postSocial.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
            role: true
          }
        },
        comments: {
          include: {
            commentBy: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true
              }
            }
          },
          orderBy: { commentAt: 'desc' },
          take: 2 // İlk 2 yorumu getir
        },
        React: {
          include: {
            reactBy: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true
              }
            }
          }
        },
        SavedPost: {
          where: userId ? { userId } : undefined,
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    // Toplam post sayısı
    const totalPosts = await db.postSocial.count({
      where: whereCondition
    })

    // Post'ları frontend formatına dönüştür
    const formattedPosts = posts.map(post => ({
      id: post.id,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      caption: post.text,
      images: post.images,
      background: post.background,
      type: post.type,
      user: {
        id: post.user.id,
        name: post.user.displayName || post.user.username,
        username: post.user.username,
        avatar: post.user.avatarUrl,
        bio: post.user.bio,
        role: post.user.role
      },
      likesCount: post.React.filter(r => r.react === 'like' || r.react === 'love' || r.react === 'wow' || r.react === 'haha').length,
      commentsCount: post.comments.length,
      sharesCount: 0, // Paylaşım sayısı için ayrı model gerekebilir
      isLiked: userId ? post.React.some(r => r.reactById === userId && 
        (r.react === 'like' || r.react === 'love' || r.react === 'wow' || r.react === 'haha')) : false,
      isSaved: post.SavedPost.length > 0,
      comments: post.comments.map(comment => ({
        id: comment.id,
        content: comment.comment,
        image: comment.image,
        createdAt: comment.commentAt,
        user: {
          id: comment.commentBy.id,
          name: comment.commentBy.displayName || comment.commentBy.username,
          avatar: comment.commentBy.avatarUrl
        }
      })),
      reacts: post.React.map(react => ({
        id: react.id,
        type: react.react,
        userId: react.reactById,
        user: {
          id: react.reactBy.id,
          name: react.reactBy.displayName || react.reactBy.username,
          avatar: react.reactBy.avatarUrl
        }
      }))
    }))

    return NextResponse.json({
      success: true,
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total: totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        hasMore: skip + limit < totalPosts
      }
    })
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch posts'
    }, { status: 500 })
  }
}

// POST /api/postsocial - Yeni post oluştur
export async function POST(request: NextRequest) {
  try {
    const {user} = await validateRequest()
    
    if (!user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const body = await request.json()
    const { text, images, background, type = 'post' } = body

    // Yeni post oluştur
    const post = await db.postSocial.create({
      data: {
        type,
        text,
        images: images || [],
        background,
        userId: user.id,
        createdAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        createdAt: post.createdAt,
        caption: post.text,
        images: post.images,
        background: post.background,
        type: post.type,
        user: {
          id: post.user.id,
          name: post.user.displayName || post.user.username,
          avatar: post.user.avatarUrl
        },
        likesCount: 0,
        commentsCount: 0,
        isLiked: false,
        isSaved: false,
        comments: [],
        reacts: []
      },
      message: 'Post created successfully'
    })
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create post'
    }, { status: 500 })
  }
}