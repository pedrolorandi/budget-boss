import { PrismaClient } from "@prisma/client";

export async function add_edit(sources, sourceName) {
  // check if the recorded source is already in the source table. If not, we'll add a new row to the source table with the recorded source name as well.
  let sourceId = 0;
  sources.forEach((source) => {
    if (source.name === sourceName) sourceId = source.id;
  });

  // if the recorded source doesn't exist in the source table
  if (!sourceId) {
    const prisma = new PrismaClient();
    const newSource = await prisma.source.create({
      data: {
        name: sourceName,
        userId: 1,
      },
    });

    sourceId = newSource.id;
  }

  return sourceId;
}
