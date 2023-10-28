import { json } from '@hattip/response';
import { RequestContext } from 'rakkasjs';

import {
  JobApplicationSchema,
  jobApplicationApi,
} from '@/routes/api/helpers/prisma/job-application';

export async function get(ctx: RequestContext) {
  try {
    const params = ctx.url.searchParams
      const user_id = params.get('user_id');
    const keyword = params.get('keyword');
    if (!user_id) {
      return json({
        error: {
          message: 'user id is required',
          original_error: new Error('user id is required'),
        },
      });
    }
    const res = await jobApplicationApi.findByField({
      user_id:user_id,
      fields: ['job_title', 'description'],
      keyword: keyword ?? '',
    });
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

export async function post(ctx: RequestContext) {
  try {
    const body = await ctx.request.json();
    const new_job_apllication = JobApplicationSchema.parse(body);
    const res = await jobApplicationApi.addNew({
      input: new_job_apllication,
    });
    return json(res, { status: 200 });
  } catch (error: any) {
    return json(
      {
        error: {
          message: error.message,
          original_error: error,
        },
      },
      {
        status: 400,
      },
    );
  }
}
export async function put(ctx: RequestContext) {

  try {
    const body = await ctx.request.json();
    // console.log("=======   CTX BODY =============\n",body);
    // console.log("=======   CTX =============\n",ctx);
    if (!body?.user_id) {
      return json({
        error: {
          message: 'user id is required',
          original_error: new Error('user id is required'),
        },
      });
    }
    if (!body?.input?.id) {
      return json({
        error: {
          message: 'job apllication id is required',
          original_error: new Error('job apllication id is required'),
        },
      });
    }
    const new_job_apllication = body?.input

    const res = await jobApplicationApi.updateOne({
      input: { ...new_job_apllication, id: body?.input?.id },
      user_id: body?.user_id,
    });
    return json(res, { status: 200 });
  } catch (error: any) {
    return json(
      {
        error: {
          message: error.message,
          original_error: error,
        },
      },
      {
        status: 400,
      },
    );
  }
}

export async function del(ctx: RequestContext) {
  try {
    const body = await ctx.request.json();
    if (!body.user_id) {
      return json({
        error: {
          message: 'user id is required',
          original_error: new Error('user id is required'),
        },
      });
    }
    if (!body?.input?.id) {
      return json({
        error: {
          message: 'job apllication id is required',
          original_error: new Error('job apllication id is required'),
        },
      });
    }

    const res = await jobApplicationApi.removeOne({
      item_id: body?.input?.id,
      user_id: body?.user_id,
    });
    return json(res);
  } catch (error: any) {
    return json(
      {
        error: {
          message: error.message,
          original_error: error,
        },
      },
      {
        status: 400,
      },
    );
  }
}
