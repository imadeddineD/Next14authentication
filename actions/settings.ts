"use server"

import { SettingsSchema } from "@/Schemas"
import { getUserById } from "@/data/user"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { User } from "@prisma/client"
import { z } from "zod"

export const settings = async (
    values : z.infer<typeof SettingsSchema>
) => {
    const user : any = await currentUser()

    if(!user) {
        return {error : "Unauthorized"}
    }

    const dbUser= await getUserById(user.id)

    if (!dbUser) {
        return { error : "Unauthorized"}
    }

    await db.user.update({
        where : {id : dbUser.id} , 
        data : {
            ...values
        }
    })

    return {success : "settings updated!"}
}