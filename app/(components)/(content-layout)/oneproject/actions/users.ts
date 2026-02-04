"use server";

import { CurrencyProps } from "../components/Forms/ChangeLocalCurrencyForm";

import { PasswordProps } from "../components/Forms/ChangePasswordForm";

import { isEmailBlacklisted } from "../lib/isEmailBlackListed";


import db from "@/app/lib/db";
import { UserProps } from "../types/types";
import bcrypt, { compare } from "bcrypt";
import { revalidatePath } from "next/cache";


 export async function createUser(data: UserProps) {
   const {
     email,
     password,
     firstName,
     lastName,
     name,
     phone,
     image,
     roleproject,
     country,
     location,
     userId,
     companyDescription,
     companyName,
   } = data;
   try {


    //2.22.56
     // Hash the PAASWORD
     if (isEmailBlacklisted(email)) {
       return {
         error: `Please use a valid, non-temporary email address.`,
         status: 409,
         data: null,
       };
     }
     const hashedPassword = await bcrypt.hash(password, 10);
     const existingUser = await db.user.findUnique({
       where: {
         email,
       },
     });
     if (existingUser) {
       return {
         error: `Email already exists`,
         status: 409,
         data: null,
       };
     }
     const newUser = await db.user.create({
       data: {
         email,
         password: hashedPassword,
         plain: roleproject === "CLIENT" ? password : "",
         firstName,
         lastName,
         name,
         phone,
         image,
         roleproject,
         country,
         location,
         userId,
         companyDescription,
         companyName,
       },
     });
     revalidatePath("/oneproject/dashboard/clients");
     revalidatePath("/oneproject/dashboard/users");
     console.log(newUser);
     return {
       error: null,
       status: 200,
       data: newUser,
     };
   } catch (error) {
     console.log(error);
     return {
       error: `Something Went wrong, Please try again`,
       status: 500,
       data: null,
     };
   }
 }




export async function getAllUsers() {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        projects: true,
      },
    });
    return users;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function deleteUser(id: string) {
  try {
    const deletedUser = await db.user.delete({
      where: {
        id,
      },
    });
    revalidatePath("/onefinance/dashboard/users");
    return {
      ok: true,
      data: deletedUser,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
  }
}



export type ExistingUser = {
  id: string;
  name: string;
  email: string;
};



export async function getExistingUsers() {
  try {
    const users = await db.user.findMany({
      where: {
        roleproject: "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return users;
  } catch (error) {
    console.log(error);
  }
}

 export async function updateUserById(id: string, data: UserProps) {
   try {
     const updatedUser = await db.user.update({
       where: {
         id,
       },
       data,
     });
        revalidatePath("/oneproject/dashboard/clients");
     return updatedUser;
   } catch (error) {
     console.log(error);
   }
 }


// export async function updateUserPassword(id: string, data: PasswordProps) {
//   const existingUser = await db.user.findUnique({
//     where: {
//       id,
//     },
//   });
//   // Check if the Old Passw = User Pass
//   let passwordMatch: boolean = false;
//   //Check if Password is correct
//   if (existingUser && existingUser.passwordHash) {
//     // if user exists and password exists
//     passwordMatch = await compare(data.oldPassword, existingUser.passwordHash);
//   }
//   if (!passwordMatch) {
//     return { error: "Old Password Incorrect", status: 403 };
//   }
//   const hashedPassword = await bcrypt.hash(data.newPassword, 10);
//   try {
//     const updatedUser = await db.user.update({
//       where: {
//         id,
//       },
//       data: {
//         password: hashedPassword,
//       },
//     });
//     revalidatePath("/dashboard/clients");
//     return { error: null, status: 200 };
//   } catch (error) {
//     console.log(error);
//   }
// }



export async function updateLocalCurrency(id: string, data: CurrencyProps) {
  const existingUser = await db.user.findUnique({
    where: {
      id,
    },
  });
  // Check if the Old Passw = User Pass
  if (!existingUser) {
    return { error: "No User Found", status: 403 };
  }
  try {
    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: {
        localCurrency: data.localCurrency,
        defaultCurrency: data.defaultCurrency,
      },
    });
     revalidatePath("/oneproject/dashboard/currency");
    return { error: null, status: 200 };
  } catch (error) {
    console.log(error);
  }
}
