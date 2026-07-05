import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string; //listing individual view
  userId?: string; // if we query "My trips"
  authorId?: string; // if we query "My reservations" because we are the author of that property
}

export default async function getReservations(params: IParams) {
  try {
    const { listingId, userId, authorId } = params;

    //we create a different query depending on the param we send

    const query: any = {};

    if (listingId) {
      query.listingId = listingId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (authorId) {
      query.listing = { userId: authorId };
    }

    const reservations = await prisma.reservation.findMany({
      where: query,
      include: {
        listing: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeReservations = reservations.map((reservation) => ({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      listing: {
        ...reservation.listing,
        createdAt: reservation.listing.createdAt.toISOString(),
      },
    }));

    return safeReservations;
  } catch (error: any) {
    throw new Error(error);
  }
}
