import { getFileURL } from "@/lib/pb/client";
import { SherpaUserUpdate } from "@/lib/pb/db-types";
import { Image } from "@unpic/react";
import { ImagePlus, Save } from "lucide-react";
import { useRef, useState } from "react";


interface ProfileImageProps {
  record_id: string;
  file_name?: string;
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setInput: React.Dispatch<React.SetStateAction<SherpaUserUpdate>>;
}

export function ProfileImage({
  file_name,
  record_id,
  editing,
  setEditing,
  setInput,
}: ProfileImageProps) {
  const pb_avatar_file_url = file_name
    ? getFileURL({ collection_id_or_name: "sherpa_user", file_name, record_id })
    : "";

  const [pic, setPic] = useState(pb_avatar_file_url);
  const ref = useRef<HTMLInputElement>(null);


  // console.log("update image mutation  ==== ",mutation)
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setPic((prev) => {
        if (e.target.files && e.target.files[0]) {
          return URL.createObjectURL(e.target.files[0]);
        }
        return prev;
      });
      setInput((prev) => {
        return {
          ...prev,
          avatar: (e.target.files && e.target.files[0]) as File | undefined,
        };
      });
      // setFileImage && setFileImage(e.target.files && e.target.files[0]);
    }
  }
  const avatar_file = ref?.current?.files && ref?.current?.files[0];
  return (
    <div className="p-1 bg-accent/20">
      <div className="  flex flex-col items-center justify-center border gap-1">
        {typeof pic === "string" && pic.length > 0 ? (
          <div
            className=""
            onClick={() => {
              editing && ref.current?.click();
            }}
          >
            <Image
              className=""
              src={pic}
              layout="constrained"
              height={200}
              width={200}
            />
          </div>
        ) : null}

        <div className="flex flex-col items-center justify-center">
          <input
            type="file"
            ref={ref}
            className="hidden"
            onChange={(e) => handleChange(e)}
          />
          {editing && (
            <div className="w-full flex  items-center justify-center gap-5">
              <ImagePlus
                onClick={() => ref.current?.click()}
                className="h-7 w-7"
              ></ImagePlus>


            </div>
          )}
        </div>
      </div>
    </div>
  );
}
