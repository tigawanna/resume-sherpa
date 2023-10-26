import { Link } from "rakkasjs";

interface BreadCrumbsProps {
  route_history: string[];
}

export function BreadCrumbs({ route_history }: BreadCrumbsProps) {
  // console.log(route_history);
  const history_arr = route_history
    .filter((item) => {
      return item.length > 0;
    })
    .reverse();

  return (
    <div className="text-sm breadcrumbs absolute top-12 right-5 ">
      <ul>
        {history_arr.map((item, index) => {
          const back_steps = calculateBackSteps(index);
          return (
            <li key={index}>
              {/* @ts-expect-error */}
              <Link to={back_steps}>{item}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function calculateBackSteps(index: number) {
  const one_step = "..";
  let all_steps = "";
  for (let i = 0; i < index; i++) {
    if (i === index - 1) {
      all_steps += one_step;
    } else {
      all_steps = one_step + "/" + all_steps;
    }
  }

  const back_steps = all_steps;

  return back_steps;
}
