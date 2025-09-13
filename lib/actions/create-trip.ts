"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";

export default async function createTrip(data: FormData) {

    const session = await auth();
    if (!session || !session.user?.id) {
        throw new Error("Unauthorized");
    }

  const title = data.get("title") as string;
  const description = data.get("description") as string;
  const startDate = data.get("startDate") as string;
  const endDate = data.get("endDate") as string;
  const imageUrl = data.get("imageUrl") as string;

  if(!title || !description || !startDate || !endDate) {
    throw new Error("Missing required fields");
  }

  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  await prisma.trip.create({
    data: {
        title,
        description,
        startDate: startDateObj,
        endDate: endDateObj,
        userId: session.user.id,
        imageUrl: imageUrl || null,
    },
    });

    redirect("/trips");
}