import { getExecutionByStatus } from "./db"


export const executionSchedularFn = async () => {
    try{
        const executions = await getExecutionByStatus("pending");
        console.log(executions)
    }catch(e : any){
        console.error(e);
    }
}