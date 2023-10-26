interface FeaturesProps {}

export function Features({}: FeaturesProps) {
  const features = [
    {
      title: "Resume  generator",
      description:
        "provide a job descrioption and get application documents specific to it",
    },
    {
      title: "Applications statistics",
      description:
        "Easily visualize your applications , with stats and simple metrics ",
    },
  ];
  return (
    <div className="w-full h-full flex flex-wrap items-center justify-center gap-5">
      {features.map((ftr, idx) => {
        return (
          <FeatureCard
            key={idx}
            title={ftr.title}
            description={ftr.description}
          />
        );
      })}
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="card md:w-[35%] bg-base-100 shadow-xl elevation-5 hover:scale-[99%]">
      <div className="card-body p-5 w-full">
        <h2 className="card-title ">{title}</h2>
        <p className="card-compact text-sm w-full p-0 ">{description}</p>
      </div>
    </div>
  );
}
