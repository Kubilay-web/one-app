import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/app/auth';
import db from "@/app/lib/db";

// GET: Profil bilgilerini getir
export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // URL'den username parametresini al
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    let users;

    if (username) {
      // Belirli bir kullanıcının profilini getir
      users = await db.user.findUnique({
        where: { username },
        select: {
          id: true,
          username: true,
          displayName: true,
          email: true,
          avatarUrl: true,
          bio: true,
          image: true,
          location: true,
          portfolio: true,
          bannerUrl: true,
          cover: true,
          role: true,
          createdAt: true,
          UserDetails: {
            select: {
              biosocial: true,
              otherName: true,
              job: true,
              workplace: true,
              highSchool: true,
              college: true,
              currentCity: true,
              hometown: true,
              relationship: true,
              instagram: true,
            }
          },
          posts: {
            select: { id: true },
          },
          followers: {
            select: { id: true },
          },
          following: {
            select: { id: true },
          },
        }
      });

      if (!users) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }
    } else {
      // Mevcut kullanıcının profilini getir
      users = await db.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          username: true,
          displayName: true,
          email: true,
          avatarUrl: true,
          bio: true,
          image: true,
          location: true,
          portfolio: true,
          bannerUrl: true,
          cover: true,
          role: true,
          createdAt: true,
          UserDetails: {
            select: {
              biosocial: true,
              otherName: true,
              job: true,
              workplace: true,
              highSchool: true,
              college: true,
              currentCity: true,
              hometown: true,
              relationship: true,
              instagram: true,
            }
          },
          posts: {
            select: { id: true },
          },
          followers: {
            select: { id: true },
          },
          following: {
            select: { id: true },
          },
        }
      });
    }

    // Eğer UserDetails verisi varsa, kullanıcı ile birleştir
    const formattedUser = {
      ...users,
      // UserDetails varsa birleştir
      ...(users.UserDetails && users.UserDetails[0] ? users.UserDetails[0] : {}),
      UserDetails: undefined, // Orijinal UserDetails'ı temizle
      stats: {
        posts: users.posts?.length || 0,
        followers: users.followers?.length || 0,
        following: users.following?.length || 0,
      },
      posts: undefined,
      followers: undefined,
      following: undefined,
    };

    // Arkadaşları getir
    const friends = await db.friendRequest.findMany({
      where: {
        OR: [
          { userId: user.id, status: 'accepted' },
          { friendId: user.id, status: 'accepted' }
        ]
      },
      take: 8,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        },
        friend: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        }
      }
    });

    // Fotoğrafları getir
    const photos = await db.postSocial.findMany({
      where: {
        userId: user.id,
        images: {
          isEmpty: false
        }
      },
      take: 9,
      select: {
        images: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Arkadaşları formatla
    const formattedFriends = friends.map(friend => {
      const friendUser = friend.userId === user.id ? friend.friend : friend.user;
      return {
        id: friendUser.id,
        username: friendUser.username,
        name: friendUser.displayName || friendUser.username,
        avatar: friendUser.avatarUrl || '/default-avatar.png',
        isStory: Math.random() > 0.5, // Mock data
        mutualCount: Math.floor(Math.random() * 50) + 1 // Mock data
      };
    });

    // Fotoğrafları formatla
    const formattedPhotos = photos.flatMap(photo =>
      photo.images.slice(0, 3).map(img => img)
    ).slice(0, 9);

    return NextResponse.json({
      success: true,
      data: {
        user: formattedUser,
        friends: formattedFriends,
        photos: formattedPhotos.slice(0, 9),
        isCurrentUser: !username || username === user.username
      }
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PATCH: Profil bilgilerini güncelle
export async function PATCH(request: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      displayName,
      bio,
      location,
      portfolio,
      avatarUrl,
      bannerUrl,
      cover,
      // Facebook özel alanları
      biosocial,
      otherName,
      job,
      workplace,
      highSchool,
      college,
      currentCity,
      hometown,
      relationship,
      instagram,
    } = body;

    // Temel kullanıcı bilgilerini güncelle
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        displayName,
        bio,
        location,
        portfolio,
        avatarUrl,
        bannerUrl,
        cover,
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        avatarUrl: true,
        bio: true,
        location: true,
        portfolio: true,
        bannerUrl: true,
        cover: true,
        role: true,
        createdAt: true,
      }
    });

    // UserDetails varsa güncelle, yoksa oluştur
    await db.userDetails.upsert({
      where: { userId: user.id },
      update: {
        biosocial,
        otherName,
        job,
        workplace,
        highSchool,
        college,
        currentCity,
        hometown,
        relationship,
        instagram,
      },
      create: {
        userId: user.id,
        biosocial,
        otherName,
        job,
        workplace,
        highSchool,
        college,
        currentCity,
        hometown,
        relationship,
        instagram,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
