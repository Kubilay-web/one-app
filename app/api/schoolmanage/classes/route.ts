import { NextRequest, NextResponse } from 'next/server';
import db from "@/app/lib/db";
import { generateSlug } from '../generateSlug';
import { 
  ClassCreateProps, 
  StreamCreateProps, 
  AssignClassTeacherProps 
} from '../types/types';

// ==================== GET İŞLEMLERİ ====================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');
    const type = searchParams.get('type'); // 'brief', 'streams', 'all'
    const classId = searchParams.get('classId');
    const streamId = searchParams.get('streamId');

    // Tek bir stream getir
    if (streamId) {
      const stream = await db.stream.findUnique({
        where: { id: streamId },
        include: {
          class: {
            select: { title: true }
          },
          students: {
            select: {
              id: true,
              name: true,
              regNo: true,
            },
          },
        },
      });

      if (!stream) {
        return NextResponse.json(
          { error: 'Stream not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(stream);
    }

    // Tek bir class getir
    if (classId) {
      const classData = await db.class.findUnique({
        where: { id: classId },
        include: {
          streams: {
            include: {
              _count: {
                select: { students: true },
              },
            },
          },
          _count: {
            select: { students: true },
          },
        },
      });

      if (!classData) {
        return NextResponse.json(
          { error: 'Class not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(classData);
    }

    // Tüm stream'leri getir (filtresiz)
    if (type === 'streams') {
      const streams = await db.stream.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          class: {
            select: { title: true }
          },
          _count: {
            select: { students: true }
          }
        }
      });
      return NextResponse.json(streams);
    }

    // Brief classes (sadece id ve title)
    if (type === 'brief' && schoolId) {
      const classes = await db.class.findMany({
        orderBy: { createdAt: 'desc' },
        where: { schoolId },
        select: {
          id: true,
          title: true,
        },
      });
      return NextResponse.json(classes);
    }

    // School'a göre class'ları getir
    if (schoolId) {
      const classes = await db.class.findMany({
        orderBy: { createdAt: 'desc' },
        where: { schoolId },
        include: {
          streams: {
            include: {
              _count: {
                select: { students: true },
              },
            },
          },
          _count: {
            select: { students: true },
          },
        },
      });
      return NextResponse.json(classes);
    }

    // Tüm class'lar (filtresiz)
    const classes = await db.class.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        streams: {
          include: {
            _count: {
              select: { students: true },
            },
          },
        },
        _count: {
          select: { students: true },
        },
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// ==================== POST İŞLEMLERİ ====================

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { action, classData, streamData } = data;

    // -------------------- STREAM OLUŞTUR --------------------
    if (action === "stream") {
      if (!streamData?.title) {
        return NextResponse.json(
          { data: null, error: "Stream title is required" },
          { status: 400 }
        );
      }

      const slug = generateSlug(streamData.title);
      streamData.slug = slug;

      const existingStream = await db.stream.findUnique({
        where: { slug },
      });

      if (existingStream) {
        return NextResponse.json(
          { data: null, error: "Stream Already exists" },
          { status: 409 }
        );
      }

      const newStream = await db.stream.create({
        data: streamData,
      });

      console.log(`Stream created successfully: ${newStream.title} (${newStream.id})`);

      return NextResponse.json({ data: newStream, error: null }, { status: 201 });
    }

    // -------------------- CLASS OLUŞTUR --------------------
    if (action === "class") {
      if (!classData?.title) {
        return NextResponse.json(
          { data: null, error: "Class title is required" },
          { status: 400 }
        );
      }

      const slug = generateSlug(classData.title);
      classData.slug = slug;

      const existingClass = await db.class.findUnique({
        where: { slug },
      });

      if (existingClass) {
        return NextResponse.json(
          { data: null, error: "Class Already exists" },
          { status: 409 }
        );
      }

      const newClass = await db.class.create({
        data: classData,
      });

      console.log(`Class created successfully: ${newClass.title} (${newClass.id})`);

      return NextResponse.json({ data: newClass, error: null }, { status: 201 });
    }

    // -------------------- GEÇERSİZ ACTION --------------------
    return NextResponse.json(
      { data: null, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { data: null, error: "Something went wrong" },
      { status: 500 }
    );
  }
}


// ==================== PUT İŞLEMLERİ (Assign Class Teacher) ====================
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');

    if (!classId) {
      return NextResponse.json(
        { error: 'Class ID is required' },
        { status: 400 }
      );
    }

    const data = await request.json() as AssignClassTeacherProps;
    const { classTeacherId, classTeacherName, oldClassTeacherId } = data;

    // Class teacher atama
    const updatedClass = await db.class.update({
      where: { id: classId },
      data: {
        classTeacherId,
        classTeacherName,
      },
    });

    // Yeni teacher'ı class teacher yap
    await db.teacher.update({
      where: { id: classTeacherId },
      data: { isClassTeacher: true },
    });

    // Eski teacher varsa, class teacher statüsünü kaldır
    if (oldClassTeacherId) {
      await db.teacher.update({
        where: { id: oldClassTeacherId },
        data: { isClassTeacher: false },
      });
    }

    console.log(
      `Class updated successfully => New Class teacher: ${updatedClass.classTeacherName}`
    );

    return NextResponse.json({
      data: updatedClass,
      error: null,
    });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      {
        data: null,
        error: 'Something went wrong',
      },
      { status: 500 }
    );
  }
}

// ==================== DELETE İŞLEMLERİ ====================
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type'); // 'class', 'stream'

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    // STREAM sil
    if (type === 'stream') {
      await db.stream.delete({
        where: { id },
      });
      return NextResponse.json(
        { message: 'Stream deleted successfully' },
        { status: 200 }
      );
    }

    // CLASS sil (default)
    await db.class.delete({
      where: { id },
    });
    return NextResponse.json(
      { message: 'Class deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete' },
      { status: 500 }
    );
  }
}

// ==================== PATCH İŞLEMLERİ (kısmi güncelleme) ====================
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type'); // 'class', 'stream'

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const data = await request.json();

    // Stream güncelle
    if (type === 'stream') {
      const updatedStream = await db.stream.update({
        where: { id },
        data,
      });
      return NextResponse.json(updatedStream);
    }

    // Class güncelle (default)
    const updatedClass = await db.class.update({
      where: { id },
      data,
    });
    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update' },
      { status: 500 }
    );
  }
}