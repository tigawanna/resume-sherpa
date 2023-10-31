import { TheTextInput } from '@/components/form/inputs/TheTextInput';
import { tryCatchWrapper} from '@/utils/async';
import { useDebouncedValue } from '@/utils/hooks/debounce';
import { Plus, X } from 'lucide-react';
import { Link, usePageContext } from 'rakkasjs';
import {  useState } from 'react';
import { ResumeFields } from './ResumeMutiStepForm';
import { useQuery } from '@tanstack/react-query';
import { SherpaContentResponse } from '@/lib/pb/db-types';
import { PBReturnedUseQueryError } from '@/components/error/PBReturnedUseQueryEror';

interface ResumeContentProps {
  user_id: string;
  input: ResumeFields;
  setInput: React.Dispatch<React.SetStateAction<ResumeFields>>;
  handleChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}
export function ResumeContent({
  user_id,
  input,
  setInput,
}: ResumeContentProps) {
const page_ctx =usePageContext()
  const [keyword, setKeyword] = useState('');
  const { debouncedValue, isDebouncing } = useDebouncedValue(keyword, 2000);

  const query = useQuery({
    queryKey: ['content', debouncedValue],
    queryFn: async () => {
      return tryCatchWrapper(
        page_ctx.locals.pb
          ?.collection('sherpa_content')
          .getList(1, 12, {
            sort: '-created',
            filter: `title~"${debouncedValue}"`,
          }),
      );
    },
    refetchOnWindowFocus: true, refetchOnMount: true,
  },


  );



  function handleChange(e: any) {
    setKeyword(e.target.value);
  }

  const isSelected = (id?: string) =>
    id && input.content.some((val) => val.id === id);

  const handleAddItem = ({ id, title, type }: SherpaContentResponse) => {
    // @ts-expect-error
    setInput((prev) => {
      if (
        prev.content.some((val) => {
          return val.id === id;
        })
      ) {
        return prev;
      }
      return {
        ...prev,
        content: [...prev.content, { id: id as string, title, type }],
      };
    });
  };
  const handleRemoveItem = (id?: string) => {
    if (!id) return;
    setInput((prev) => {
      const filtered = prev.content.filter((item) => item.id !== id);
      return { ...prev, content: filtered };
    });
  };

  const error = query?.data?.error;
  const data = query?.data?.data?.items;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {/* header + search bar + add new link */}
      <div className="sticky top-[5%] flex w-full flex-wrap items-center justify-evenly gap-3 p-2">
        <h3 className="text-2xl font-bold hidden sm:flex">Content</h3>
        <div className=" relative flex min-w-[70%] items-center  justify-center gap-1 md:min-w-[50%]">
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
        <Link
          href={`/dashboard/content/new`}
          className="btn btn-outline  h-auto"
        >
          <Plus className="h-6 w-6" />
        </Link>
      </div>

      {(!data || (data && data?.length === 0)) && !error && (
        <div className="flex h-full  w-full items-center justify-center p-2">
          <div className="rounded-lg border p-2 text-info">
            no matches found
          </div>
        </div>
      )}

      {error && (
        <div className="flex h-full  w-full items-center justify-center p-2">
          <PBReturnedUseQueryError error={error} />
        </div>
      )}
      {/* contents */}

        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          {data &&
            data.map((item) => {
              return (
                <div
                  key={item.id}
                  className="flex w-full flex-col justify-center gap-1 rounded-md border 
                p-2 hover:border-accent sm:w-[45%] lg:w-[30%] "
                >
                  <div className=" flex w-full items-center justify-end">
                    {isSelected(item.id) ? (
                      <X
                        className="h-6 w-6 text-error"
                        onClick={() => handleRemoveItem(item?.id)}
                      />
                    ) : (
                      <Plus
                        className="h-6 w-6 text-success"
                        onClick={() => handleAddItem(item)}
                      />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold">{item?.title}</h3>
                  <h3 className="text-lg">{item.type}</h3>
                </div>
              );
            })}
        </div>
     
    </div>
  );
}
