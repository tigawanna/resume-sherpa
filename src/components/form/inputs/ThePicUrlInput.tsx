import { Image } from '@unpic/react'
import { X } from 'lucide-react'
import { useState, useRef } from 'react'

import { twMerge } from 'tailwind-merge'

interface ThePicUrlInputProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  img_url: string
  editing?: boolean
  setInputImage?: (img_url: string | null) => void
  container_classname?:string
  }

export function ThePicUrlInput({ img_url,editing,setInputImage,container_classname,...props}: ThePicUrlInputProps) {
  const [pic, setPic] = useState(img_url)
  const ref = useRef<HTMLInputElement>(null)

function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  setInputImage&&setInputImage(e.target.value);
  setPic(e.target.value)
}
  return (
    <div
      className={twMerge("flex flex-col items-center justify-center w-full rounded-lg gap-4",container_classname)}
    >
      {typeof pic === "string" && pic.length > 0 ? (
        <div
          className=""
          onClick={() => ref.current?.className.replace("hidden", "")}
        >
          <div 
          className="  md:h-fit ">
            <Image
              className="aspect-square  w-aut0 max-w-[250px]  object-cover md:h-auto "
              // className='border-6 h-[100px]'
              src={pic}
              // @ts-expect-error
              height={100}
              layout='fullWidth'
              {...props}
            />
          </div>
        </div>
      ) : null}

    { editing&&<div className="  flex  min-w-[60%] items-center justify-center">
        <input
          type="url"
          title="add your image url"
          placeholder="add image url"
          ref={ref}
          value={pic}
          className="input input-bordered border-accent input-sm w-full"
          onChange={(e) => handleChange(e)}
        />
        <X
        onClick={() => setPic("")}
          className="h-7 w-7"
        />
      </div>}
    </div>
  );
}
