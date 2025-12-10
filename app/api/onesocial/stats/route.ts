import { NextRequest, NextResponse } from 'next/server'
import db from "@/app/lib/db";
import { validateRequest } from '@/app/auth';

// GET /api/user/stats - Facebook için kullanıcı istatistiklerini getir
export async function GET(request: NextRequest) {
  try {
    const {user} = await validateRequest()
    
    if (!user?.id) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 })
    }

    // Kullanıcı temel bilgilerini getir
    const users = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        location: true,
        role: true,
        createdAt: true,
        // Facebook specific fields
        cover: true
      }
    })

    if (!user) {
      return NextResponse.json({ 
        success: false,
        error: 'User not found' 
      }, { status: 404 })
    }

    // Facebook istatistiklerini paralel olarak getir
    const [
      postCount,
      friendCount,
      friendRequestCount,
      photosCount,
      videosCount,
      eventsCount
    ] = await Promise.all([
      // Post sayısı (PostSocial)
      db.postSocial.count({
        where: { userId: user.id }
      }),
      // Arkadaş sayısı (FriendRequest kabul edilmiş olanlar)
      db.friendRequest.count({
        where: {
          OR: [
            { userId: user.id, status: 'accepted' },
            { friendId: user.id, status: 'accepted' }
          ]
        }
      }),
      // Bekleyen arkadaş isteği sayısı
      db.friendRequest.count({
        where: {
          friendId: user.id,
          status: 'pending'
        }
      }),
      // Fotoğraf sayısı (PostSocial'daki resimli postlar)
      db.postSocial.count({
        where: { 
          userId: user.id,
          images: { isEmpty: false }
        }
      }),
      // Video sayısı (Video modelinden)
      db.video.count({
        where: { 
          userId: user.id,
          visibility: 'public'
        }
      }),
      // Etkinlik sayısı (opsiyonel, Event modeliniz varsa)
      0 // Şimdilik 0
    ])

    return NextResponse.json({ 
      success: true, 
      user,
      stats: {
        posts: postCount,
        friends: friendCount,
        friendRequests: friendRequestCount,
        photos: photosCount,
        videos: videosCount,
        events: eventsCount
      }
    })
  } catch (error) {
    console.error('Get user stats error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch user stats' 
    }, { status: 500 })
  }
}