import { PrismaClient } from "@prisma/client";

export async function add_edit (inputValue, sourceName){
  const prisma = new PrismaClient();
  const sources = await prisma.source.findMany({
    where: {"userId": 1}
  })

  //check if the recorded source is already in the source table. If not, we'll add a new row to the source table with the recorded source name as well.
  let sourceID = 0
  sources.forEach(item => item.name === sourceName ? sourceID = item.id : false); //record the sourceID when we find it in the sources array
  if (sourceID) { //the recorded source exists in the source table
    inputValue['sourceId'] = sourceID;
    return inputValue;
  } else { //the recorded source doesn't exist in the source table
    const NewSource = await prisma.source.create({data: { //create a new source row
      name: sourceName,
      userId: 1
    }});
    
    inputValue['sourceId'] = NewSource.id
    return inputValue;
  }
};