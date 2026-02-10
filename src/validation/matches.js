import { z} from "zod"

export const MATCH_STATUS={
    SCHEDULED:'Scheduled',
    LIVE:'Live',
    FINISHED:'Finished'
};

export const listMatchQSchema=z.object({
    limit:z.coerce.number().int().positive().max(100).optional()
})

export const matchIdParamSchema=z.object({
    id:z.coerce.number().int().positive()
})

const isoDateString=z.string().refine((val)=>!isNaN(Date.parse(val)),{
    message:"Invalid iso date string"
});

export const createMatchSchema=z.object({
    sport:z.string(),
    homeTeam:z.string(),
    awayTeam:z.string(),
    startTime:isoDateString,
    endTime:isoDateString,
    homeScore:z.coerce.number().int().nonnegative().optional(),
    awayScore:z.coerce.number().int().nonnegative().optional()
}).superRefine((date,ctx)=>{
    const start=new Date(date.startTime);
    const end=new Date(date.endTime);
    if(end<=start){
        ctx.addIssue({
            code:z.ZodIssueCode.custom,
            message:"endtime must be chronologically after starttime",
            path:["endTime"]
        })
    }
})

export const updateScoreSchema=z.object({
    homeScore:z.coerce.number().int().nonnegative(),
    awayScore:z.coerce.number().int().nonnegative(),
})
