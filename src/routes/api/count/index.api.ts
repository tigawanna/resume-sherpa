import { json } from "@hattip/response";
import { RequestContext } from "rakkasjs";
import { prisma } from "@/lib/db/prisma";

export async function get(ctx: RequestContext) {
    try {

        const params = ctx.url.searchParams
        const user_id = params.get('user_id');
        const model = params.get('model');
     
        // console.log({model,user_id})
        if (!user_id) {
            return json({
                error: {
                    message: 'user id is required',
                    original_error: new Error('user id is required'),
                },
            });
        }

        if (!model) {
            return json({
                error: {
                    message: 'model name is required',
                    original_error: new Error('model name is required'),
                },
            });
        }
        const prisma_model = prisma[model as keyof typeof prisma]
        // @ts-expect-error
        const res = await prisma_model.count({
            where: { userId: user_id },
        })
    return json(res, { status: 200 });
    } catch (error: any) {
        return json(
            {
                error: {
                    message: error.message,
                    original_error: error,
                },
            },
            { status: 400 },
        );
    }
}
