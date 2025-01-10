import { JobCreateDataType } from "./schema";
import { Prisma } from "@prisma/client";

const handleWebhookTriggerCreation = (prisma: Prisma.TransactionClient) => {
    try{
        await prisma.trigger.create({
            data: {
                trigger_type: "webhook",
                
            }
        })
    }
}

export const createTriggerforWorkflow = async (job: JobCreateDataType, prisma: Prisma.TransactionClient) => {
    try{
        const triggerJob = await prisma.job.findFirst({
            where: {
                id: job.id,
                step_no: 1
            }
        })
        if(triggerJob?.app !== "webhook" && triggerJob?.app !== "schedule"){
            throw new Error("Trigger not found.")
        }
        if(triggerJob.app == "webhook"){

        }
    }catch(e){  
        console.log(e);
    }
}