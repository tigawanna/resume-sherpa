import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { Spinner } from "@/components/navigation/loaders/Spinner";
import {  Plus } from "lucide-react";
import { Link, navigate, usePageContext, useQueryClient, useSSQ } from "rakkasjs";
import { Suspense, useState } from "react";
import { HackathonCard } from "./HackathonCard";
import { useQuery } from "@tanstack/react-query";
import { PBReturnedUseQueryError } from "@/components/error/PBReturnedUseQueryEror";
import { tryCatchWrapper } from "@/utils/async";
import { numberToArray } from "@/utils/helpers/others";
import { useSearchWithQuery } from "@/utils/hooks/search";


interface HackathonsProps {

}

export function Hackathons({}: HackathonsProps) {
  
   const page_ctx = usePageContext();
   const { debouncedValue, isDebouncing, keyword, setKeyword } =
     useSearchWithQuery();
   const page_number = parseInt(page_ctx.url.searchParams.get("p") ?? "1") ?? 1;
   const query = useQuery({
     queryKey: ["sherpa_hackathon", debouncedValue, page_number],

     queryFn: async () => {
       // console.log("page arams  ====== ",pageParam)
       return tryCatchWrapper(
         page_ctx.locals.pb
           ?.collection("sherpa_hackathon")
           .getList(page_number, 12, {
             sort: "-created",
             filter: `name~"${debouncedValue}"`,
           }),
       );
     },
   });

   if (query.error) {
     return <PBReturnedUseQueryError error={query?.error} />;
   }

   function handleChange(e: any) {
     setKeyword(e.target.value);
   }

   const error = query?.data?.error;
   const data = query?.data?.data?.items;
   const total_pages = query?.data?.data?.totalPages;
   const pages_arr = numberToArray(total_pages!);
   function goToPage(page: number) {
     page_ctx.url.searchParams.set("p", page.toString());
     navigate(page_ctx.url);
   }

  
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 p-2 pb-5">
      {/* hedaer + search bar + add new link */}
      <div className="sticky top-[5%] flex flex-wrap w-full items-center justify-evenly p-2 gap-3">
        <h3 className="text-2xl font-bold hidden md:flex">hackathons</h3>
        <div className=" relative flex md:min-w-[50%] min-w-[70%]  items-center justify-center gap-1">
          <TheTextInput
            label_classname="hidden"
            value={keyword}
            field_key={"keyword"}
            placeholder="Search"
            field_name="Search"
            onChange={handleChange}
          />
          {(query.isRefetching || isDebouncing) && (
            <div className="absolute  flex w-full items-center justify-center gap-3 p-2">
              <span className="loading loading-infinity loading-lg text-warning"></span>
            </div>
          )}
        </div>
        <Link href={`/dashboard/hackathon/new`} className="btn btn-outline">
          <Plus className="h-6 w-6" />
        </Link>
      </div>

      {!data && (
        <div className="flex h-full  w-full items-center justify-center p-2">
          <div className="rounded-lg border p-2 text-info">
            no matches found
          </div>
        </div>
      )}
      <div className="flex  w-full h-full flex-col justify-between items-center gap-2 px-5">
        <div className="flex w-full flex-wrap items-center justify-start  gap-2">
          {data &&
            data.map((item) => {
              if (item) {
                return <HackathonCard key={item.id} item={item} />;
              }
            })}
        </div>
        <div className="join">
          {pages_arr.map((item) => {
            return (
              <button
                key={item}
                onClick={() => goToPage(item)}
                className={
                  item === page_number
                    ? "join-item btn btn-sm btn-active"
                    : "join-item btn btn-sm"
                }
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
