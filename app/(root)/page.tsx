import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import InterviewCard from '@/components/InterviewCard'
import { getCurrentUser } from '@/lib/actions/auth.action'
import {  getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general.action'

const page = async () => {
  const user = await getCurrentUser();

  const[userInterviews,latestInterviews] = await Promise.all([
    await getInterviewsByUserId(user?.id!),
    await getLatestInterviews({ userId: user?.id! })
  ]);
  

  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews= latestInterviews?.length > 0;
  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>

          <h2>Get Interview Ready with AI-Powered Mock Interviews</h2>
          <p>Practice your interview skills with our realistic mock interviews powered by AI & get instant feedback.</p>

          <Button asChild className='btn-primary max-sw:w-full'>
            <Link href="/interview">Start Practicing</Link>
          </Button>
        </div>

        <Image src="/robot.png" alt="robot" width={400} height={400} className='max-sm:hidden' />

      </section>

      <section className='flex flex-col gap-6 mt-8 '>
        <h2>Your Interviews</h2>

        <div className='interview-section flex flex-row gap-5'>
          {
            hasPastInterviews ? (
              userInterviews?.map((interview) => (
                <InterviewCard key={interview.id} {...interview} />

              ))) : (

              <p>You have not taken any interviews yet.</p>
            )

            // dummyInterviews.map((interview) => (
            // ))}
          }
        </div>
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Take an Interview</h2>

        <div className='interview-section flex flex-row gap-5'>
          {
            hasUpcomingInterviews ? (
              latestInterviews?.map((interview) => (
                <InterviewCard key={interview.id} {...interview} />

              ))) : (

              <p>There are  no new interviews available</p>
            )

            // dummyInterviews.map((interview) => (
            // ))}
          }
        </div>

      </section>


    </>


  )
}

export default page
