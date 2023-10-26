interface descriptionBulletPointsProps {

}

export function DescriptionBulletPoints({}:descriptionBulletPointsProps){
return (

    	<section className="w-full h-full bg-base-100">
		<div className="container max-w-xl p-6 py-12 mx-auto space-y-24 lg:px-8 lg:max-w-7xl">

			<div className="flex flex-col items-center justify-center gap-10 ">
				<div className="w-full flex justify-start">
            	<div className="mb-10 w-full lg:w-[60%]">
					<h3 className="text-3xl font-bold">
                        Tailor your application with a variable-driven approach</h3>
					<p className="mt-3 text-lg">
                    Consolidate and reuse important information from your past experience, projects, 
                    internships, hackathons, and open source contributions to create a tailored resume and cover letter
                     for each job you apply to. Highlight your most relevant skills and experience
                     for each job to make a lasting impression on potential employers </p>
                </div>

                </div>


                {/* compose and create resume */}
                <div className="flex w-full h-full flex-col-reverse lg:flex-row justify-between items-center gap-10">

                     <div className="w-full  lg:w-[40%]" >
                        <img src="/sherpa/assets.jpg" width="480" height="360" ></img>
                    </div>

						<div className="flex lg:w-[50%] gap-5 bg-base-200 h-full p-5 rounded-md">
							<div className="flex-shrink-0">
								<div className="flex items-center justify-center w-12 h-12 rounded-md bg-accent text-accent-content">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
									</svg>
								</div>
							</div>
							<div className="ml-4">
								<h4 className="text-lg font-medium leadi  ">
                                  Highlight your skills and experience in a central place
                                </h4>
								<p className="mt-2 dark:text-gray-400">
                                    Take inventory of your skills and experience in the form of 
                                    projects worked on , internships, hackathons, and open source contributions
                                     to build a resume that showcases your best assets.
                                </p>
							</div>
						</div>
                  </div>

                {/* import from github */}
                <div className="flex w-full h-full flex-col lg:flex-row justify-between items-center gap-10">
						<div className="flex lg:w-[50%] gap-5 bg-base-200 h-full p-5 rounded-md">
							<div className="flex-shrink-0">
								<div className="flex items-center justify-center w-12 h-12 rounded-md bg-accent text-accent-content">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
									</svg>
								</div>
							</div>
							<div className="ml-4">
								<h4 className="text-lg font-medium leadi dark:text-gray-50 ">import projects from Github</h4>
								<p className="mt-2 dark:text-gray-400">
                            Your personal projects are one of the important assets of your resume , with one click you can import your projects from Github

                            </p>
							</div>
						</div>
                  
                        <video className="w-full lg:w-[40%]" controls width="480" height="360" autoPlay>
                        <source src="/sherpa/video/import-from-github.mp4" type="video/mp4"></source>
                        </video>
                    </div>


                 {/* save update abd pull from records */}
                <div className="flex w-full h-full flex-col-reverse lg:flex-row justify-between items-center gap-10">
                        
                        <div className="w-full lg:w-[40%]" >
                             <img src="/sherpa/rich-text-editor.jpg" />
                        </div>


						<div className="flex lg:w-[50%] gap-5 bg-base-200 h-full p-5 rounded-md">
							<div className="flex-shrink-0">
								<div className="flex items-center justify-center w-12 h-12 rounded-md bg-accent text-accent-content">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
									</svg>
								</div>
							</div>
							<div className="ml-4">
							<h4 className="text-lg font-medium leadi dark:text-gray-50 ">Rich text editor</h4>
						    <p className="mt-2 dark:text-gray-400">
                                Add final touches to your resume with the cherry-markdown rich text editor with support for markdown syntax , 
                            </p>
							</div>
						</div>
                      </div>
                    </div>
             {/* import from github */}
                <div className="flex w-full h-full flex-col lg:flex-row justify-between items-center gap-10">
						<div className="flex lg:w-[50%] gap-5 bg-base-200 h-full p-5 rounded-md">
							<div className="flex-shrink-0">
								<div className="flex items-center justify-center w-12 h-12 rounded-md bg-accent text-accent-content">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
									</svg>
								</div>
							</div>
							<div className="ml-4">
								<h4 className="text-lg font-medium leadi dark:text-gray-50 ">AI generation</h4>
								<p className="mt-2 dark:text-gray-400">
AI generate your resume and cover letter

                            </p>
							</div>
						</div>
                  
                 	 <div className="w-full lg:w-[40%]" >
                             <img src="/svg/robot.svg" />
                        </div>
                    </div>
	
		</div>
	</section>

);
}
