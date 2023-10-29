import { ResumeFields } from "../steps/ResumeMutiStepForm";


interface SingleViewResumeTemplateProps {
  resume_fields: ResumeFields;
}

export function SingleViewResumeTemplate({resume_fields}:SingleViewResumeTemplateProps){
function getMonthAndYear(date: Date){
    return new Date(date)?.toLocaleDateString();
}
    return (
    <div className="w-full h-full flex items-center justify-center p-5">
      <div className="w-full mx-auto flex flex-col gap-3 text-sm">
        {/* basic deatils */}
        <div className="flex flex-col items-start justify-between gap-1 pb-2 border-b">
          <h2 className="text-2xl">{resume_fields.name}</h2>
            <div className="flex gap-1">
            <h5 className="flex">City : {resume_fields.city}</h5> 
            <h5 className="flex">Country : {resume_fields.country}</h5>
          </div>
          <div className="flex gap-1">
            <h5 className="flex">Phone : {resume_fields.phone}</h5>
            <h5 className="flex">Emaill : {resume_fields.email}</h5>
          </div>
          <div className="flex gap-1 ">
            <a
              href={`https://www.linkedin.com/in/${resume_fields.linkedin_username}/`}
              className="underline"
            >
              LinkedIn: {resume_fields.linkedin_username}
            </a> 
            {" "}
            |
            {" "}
            <a
              href={`https:/github.com/${resume_fields.github_username}/`}
              className="underline"
            >
              Github: {resume_fields.github_username}{' '}
            </a>
          </div>
        </div>

        {/* summary */}
        <div className="flex flex-col ">
          <h3 className="font-bold">Summary</h3>
          <p className="">{resume_fields.summary}</p>
        </div>

        {/* skills div */}
        <div className="flex flex-col w-full">
          <h3 className="font-bold">Skills</h3>
          <ul className="list-disc">
            {resume_fields.skills.split(',').map((skill) => (
              <li className="flex-grow" key={skill}>
                {skill}
              </li>
            ))}
          </ul>
        </div>

        {/* experience div */}
        {resume_fields?.experience.length > 0 && (
          <div className="flex flex-col">
            <h3 className="font-bold">Experience</h3>
            <ul className="flex flex-col gap-1 list-disc">
              {resume_fields?.experience?.map((exp) => (
                <li
                  className=""
                  key={exp.id}
                >{`${exp.company} , ${exp.position}  (${getMonthAndYear(exp.from)} - ${getMonthAndYear(exp.to)})`}</li>
              ))}
            </ul>
          </div>
        )}

        {/* education div */}
        {resume_fields.education.length > 0 && (
          <div className="flex flex-col">
            <h3 className="font-bold">Education</h3>
            <ul className="list-disc">
              {resume_fields.education.map((edu) => {
                return (
                  <li key={edu.id}>{`${edu.qualification} in ${edu.field}, ${
                    edu.school
                  }, (${getMonthAndYear(edu.from)} - ${
                    getMonthAndYear(edu.to)
                  })`}</li>
                );
              })}
            </ul>
          </div>
        )}

        {/* projects div*/}
        {resume_fields.projects.length > 0 && (
          <div className="flex flex-col">
            <h3 className="font-bold">Projects</h3>
            <ul className="">
              {resume_fields.projects.map((project) => {
                return (
                  <li key={project.id} className="">
                    **{project.name}** : {project.description}
                </li>
                );
              })}
            </ul>
          </div>
        )}

   
        {/* references div */}
        {resume_fields?.references.length>0&&
        <div className="flex flex-col">
          <h3 className="font-bold">References</h3>
          <ul className="list-disc">
            {resume_fields.references.map((reference) => {
              return (
                <li key={reference.name} className="">
                  {/* <h5> {reference.name}</h5>
                  <h5> {reference.contact}</h5> */}
                  **{reference.name}** : {reference.contact}
                </li>
              );
            })}
          </ul>
        </div>}

                {/* references div */}
        {resume_fields?.hackathons.length > 0 &&
        <div className="flex flex-col">
          <h3 className="font-bold">Hackathons</h3>
          <ul className="list-disc">
            {resume_fields.hackathons.map((hack) => {
              return (
                <li key={hack.name} className="">
                  {/* <h5> {hack.name}</h5>
                  <h5> {hack.contact}</h5> */}
                  **{hack.name}** : {hack.description}
                </li>
              );
            })}
          </ul>
        </div>}

      </div>
    </div>
);
}
