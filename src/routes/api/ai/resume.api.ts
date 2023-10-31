import { TextServiceClient } from "@google-ai/generativelanguage";
import { json } from "@hattip/response";
import { GoogleAuth } from "google-auth-library";
import { RequestContext } from "rakkasjs";
import { canProompt } from "./helpers";

export async function post(ctx: RequestContext) {
  try {
      const MODEL_NAME = "models/text-bison-001";
      const API_KEY = import.meta.env.RAKKAS_PALM_API_KEY;

      if (!API_KEY || API_KEY === "") {
          return json(
              {
                  data: null,
                  error: {
                      message: "API Key not found",
                      original_error: new Error("API Key not found"),
                  },
              },
              { status: 400 },
          );
      }
    const body = await ctx.request.json();
    // console.log(" ============ ai resume body ============ ",body)
    const job_description_input = body?.job;
    const resume_input = body?.resume;

    if (!resume_input) {
      return json(
        {
          data: null,
          error: {
            message: "resume is required",
            original_error: new Error("resume is required"),
          },
        },
        { status: 400 },
      );
    }
    if (!job_description_input) {
      return json(
        {
          data: null,
          error: {
            message: "job description is required",
            original_error: new Error("job description is required"),
          },
        },
        { status: 400 },
      );
    }
    const can_proompt = await canProompt(ctx, "resume");
  
    if (!can_proompt.can_proompt) {
      return json(
        {
          data: null,
          error: {
            message:
              "try again after " + can_proompt.can_proompt_after + " hours",
            original_error: new Error(
              "try again after " + can_proompt.can_proompt_after + " hours",
            ),
          },
        },
        { status: 429 },
      );
    }

    const promptString = `craft a resume for a software developer using rich text and ATS-friendly 
        formatting for an applicant with the following details ${resume_input} 
        applying for a job with the following description ${job_description_input} try and keep the most important bits in the first
        page of the resume , prioritize the summary ,skills(kepp it under 7 bullet points) ,
         projects , open source contributions , then the rest`;

    const stopSequences: string[] = [];
   

    const client = new TextServiceClient({
      authClient: new GoogleAuth().fromAPIKey(API_KEY),
    });

    const result = await client.generateText({
      // required, which model to use to generate the result
      model: MODEL_NAME,
      // optional, 0.0 always uses the highest-probability result
      temperature: 0.7,
      // optional, how many candidate results to generate
      candidateCount: 1,
      // optional, number of most probable tokens to consider for generation
      topK: 40,
      // optional, for nucleus sampling decoding strategy
      topP: 0.95,
      // optional, maximum number of output tokens to generate
      maxOutputTokens: 1024,
      // optional, sequences at which to stop model generation
      stopSequences: stopSequences,
      // optional, safety settings
      safetySettings: [
        { category: "HARM_CATEGORY_DEROGATORY", threshold: 1 },
        { category: "HARM_CATEGORY_TOXICITY", threshold: 1 },
        { category: "HARM_CATEGORY_VIOLENCE", threshold: 2 },
        { category: "HARM_CATEGORY_SEXUAL", threshold: 2 },
        { category: "HARM_CATEGORY_MEDICAL", threshold: 2 },
        { category: "HARM_CATEGORY_DANGEROUS", threshold: 2 },
      ],
      prompt: {
        text: promptString,
      },
    });

    let resume_response = "";
    result.forEach((item, idx) => {
      if (item) {
        // @ts-expect-error
        item.candidates.forEach((x, index) => {
          resume_response = resume_response + x.output;
        });
      }
    });

    return json(
      {
        data: {
          output: resume_response,
          original_response: result,
        },
        error: null,
      },
      { status: 200 },
    );
  } catch (err: any) {
      return json({
          data: null,
          error: {
              message: "error creating resume",
              original_error: err
          }
      }, { status: 400 });
  
  }
}
