import {Router } from "express"
import { createMatchSchema, listMatchQSchema } from "../validation/matches.js"
import {db} from '../db/db.js'
import { matches } from "../db/schema.js"
import { getMatchStatus } from "../utils/matchStatus.js"
import { desc } from "drizzle-orm"
export const matchRouter=Router()

matchRouter.get('/v1',async (req,res)=>{
    const MAX_LIMIT=100;
    const parsed=listMatchQSchema.safeParse(req.query);

    if(!parsed.success){
        return res.status(400).json({
            error:"invalid query"
        })
    }

    const limit=Math.min(parsed.data.limit??50,MAX_LIMIT)

    try {
        const data=await db.select().from(matches).orderBy(desc(matches.createdAt)).limit(limit)

        res.json({data})
    } catch (error) {
       res.status(500).json({error:"failed to list matches"}) 
    }
})

matchRouter.post('/v1',async (req,res)=>{
    const parsed=createMatchSchema.safeParse(req.body);
    if(!parsed.success){
        return res.status(400).json({
            error:"invalid payload"
        })
    }
    const {data:{startTime,endTime,homeScore,awayScore}}=parsed;

    try {
        const [event]=await db.insert(matches).values({...parsed.data,
            startTime:new Date(startTime),
            endTime:new Date(endTime),
            homeScore:homeScore??0,
            awayScore:awayScore??0,
            status:getMatchStatus(startTime,endTime)
        }).returning();
        res.status(201).json({data:event})
        
    } catch (error) {
        
        res.status(500).json({
            error:"failed to create match",
            message: error.message
        })
    }
})