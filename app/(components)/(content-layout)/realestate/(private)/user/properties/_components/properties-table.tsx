import db from "@/app/lib/db";
import React from "react";
import ClientSidePropertiesTable from "./properties-table-clientside";
import { validateRequest } from "@/app/auth";
import { Prisma } from "@prisma/client";

async function PropertiesTable({
  searchParams,
  fromAdmin = false,
}: {
  searchParams: any;
  fromAdmin?: boolean;
}) {
  const { user } = await validateRequest();

  // ✅ Prisma where clause'u oluştur - SADECE Prisma'da tanımlı alanlar
  const whereCondition: Prisma.PropertyWhereInput = {};

  // ✅ ÖNEMLİ: Eğer admin değilse, sadece kullanıcının kendi property'lerini göster
  if (!fromAdmin) {
    if (user?.id) {
      whereCondition.userId = user.id;
    } else {
      return (
        <div className="section !py-6">
          <div className="container">
            <div className="box">
              <div className="box-body text-center py-10">
                <div className="mb-4">
                  <i className="bi bi-shield-lock text-5xl text-gray-300"></i>
                </div>
                <h5 className="text-gray-500 mb-2">Authentication Required</h5>
                <p className="text-gray-400 mb-4">Please log in to view your properties</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // ✅ Prisma model alanlarına göre filtreleme
  // String alanlar için
  const stringFields = ['type', 'status', 'city', 'furnishing', 'parking', 'facing'];
  stringFields.forEach(field => {
    if (searchParams[field] && searchParams[field].trim() !== '') {
      const value = searchParams[field].trim();
      (whereCondition as any)[field] = {
        equals: value,
        mode: 'insensitive'
      };
    }
  });

  // Contains filtreleme yapılacak alanlar
  const containsFields = ['name', 'landmark', 'address', 'description'];
  containsFields.forEach(field => {
    if (searchParams[field] && searchParams[field].trim() !== '') {
      const value = searchParams[field].trim();
      (whereCondition as any)[field] = {
        contains: value,
        mode: 'insensitive'
      };
    }
  });

  // Number alanları
  const numberFields = ['age', 'bedrooms', 'bathrooms', 'balconies', 'floors'];
  numberFields.forEach(field => {
    if (searchParams[field] && !isNaN(Number(searchParams[field]))) {
      (whereCondition as any)[field] = Number(searchParams[field]);
    }
  });

  // Float alanları
  const floatFields = ['area'];
  floatFields.forEach(field => {
    if (searchParams[field] && !isNaN(parseFloat(searchParams[field]))) {
      (whereCondition as any)[field] = parseFloat(searchParams[field]);
    }
  });

  // ✅ Fiyat filtrelemesi - Prisma'da sadece 'price' alanı var
  if (searchParams.minPrice && !isNaN(Number(searchParams.minPrice))) {
    whereCondition.price = {
      ...(whereCondition.price as any),
      gte: Number(searchParams.minPrice)
    };
  }
  
  if (searchParams.maxPrice && !isNaN(Number(searchParams.maxPrice))) {
    whereCondition.price = {
      ...(whereCondition.price as any),
      lte: Number(searchParams.maxPrice)
    };
  }

  // Eğer sadece price varsa (eski filtre)
  if (searchParams.price && !isNaN(Number(searchParams.price)) && !searchParams.minPrice && !searchParams.maxPrice) {
    whereCondition.price = Number(searchParams.price);
  }

  // ✅ Tarih filtrelemesi
  if (searchParams.startDate) {
    whereCondition.createdAt = {
      ...(whereCondition.createdAt as any),
      gte: new Date(searchParams.startDate)
    };
  }
  
  if (searchParams.endDate) {
    whereCondition.createdAt = {
      ...(whereCondition.createdAt as any),
      lte: new Date(searchParams.endDate)
    };
  }

  // ✅ Boolean alanları
  if (searchParams.isActive !== undefined) {
    whereCondition.isActive = searchParams.isActive === 'true';
  }
  
  if (searchParams.showOwnerContact !== undefined) {
    whereCondition.showOwnerContact = searchParams.showOwnerContact === 'true';
  }

  console.log("PropertiesTable - Where condition:", JSON.stringify(whereCondition, null, 2));

  // Veritabanı sorgusu
  const properties = await db.property.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    where: whereCondition,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        }
      },
      Query: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  console.log("PropertiesTable - Found properties:", properties.length);

  return (
    <div>
      <ClientSidePropertiesTable
        properties={properties}
        fromAdmin={fromAdmin}
      />
    </div>
  );
}

export default PropertiesTable;