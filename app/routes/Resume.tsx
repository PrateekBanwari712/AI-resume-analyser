import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import ATS from '~/components/ATS';
import Details from '~/components/Details';
import Summary from '~/components/Summary';
import { usePuterStore } from '~/lib/peuter';

export const meta = () => ([
    { title: 'Resumind | Review' },
    { name: 'description', content: 'Detailed overview of your resume' },
])


const Resume = () => {
    const { id } = useParams();
    const { auth, isLoading, fs, kv } = usePuterStore();
    const [imageUrl, setImageUrl] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");
    const [feedback, setFeedback] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate(`/resume/${id}`);
    }, [auth.isAuthenticated])

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);

            if (!resume) return;

            const data = JSON.parse(resume);

            const resumeBolb = await fs.read(data.resumePath);
            if (!resumeBolb) return;

            const pdfBlob = new Blob([resumeBolb], { type: 'application/pdf' })
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            // const imageBlob = await fs.read(data.imagePath);
            const imageBuffer = await fs.read(data.imagePath);
            // console.log("imageBlob", imageBlob)
            // if (!imageBlob) return;
            if (!imageBuffer) return;
            const imageBlob = new Blob([imageBuffer], { type: "image/png" });
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);
            console.log({
                resumeUrl, imageUrl, feedback: data.feedback
            })

        }
        loadResume();
    }, [id])

    return (
        <main className="pt-0">
            <nav className="resume-nav">
                <Link to={"/"} className='back-button'>
                    <img src="/icons/back.svg" alt="logo" className='w-2.5 h-2.5' />
                    <span className='text-gray-800'>Back to Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
                    {imageUrl && resumeUrl && (
                        <div className='animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-xl:h-fit w-fit'>
                            <a href={resumeUrl} target='_blank'>
                                <img src={imageUrl} alt="resume-image" className='w-full h-full rounded-2xl object-contain ' />

                            </a>

                        </div>
                    )}

                </section>
                <section className='feedback-section'>
                    <h2 className='text-4xl text-black font-bold'>Resume Review</h2>
                    {feedback ? (
                        <div className='flex flex-col gap-8 animate-in fade-in duration-1000 '>
                            <Summary feedback={feedback}/>
                            <ATS score={feedback.padStart.score || 0} suggestion = {feedback.padStart.tips || []}/>
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" alt="" />
                    )}
                </section>
            </div>
        </main>
    )
}

export default Resume