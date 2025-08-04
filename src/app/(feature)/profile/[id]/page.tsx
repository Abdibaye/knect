"use client";

import ProfilePage from '@/components/profile/profile'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Page = ({ params }: { params: { id: string } }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  const router = useRouter()

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/user/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);  
      } catch (err: any) {
        setError(err.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, []);

  useEffect(() => {
    console.log(profile);
  }, [profile]);

  return (
    <div>
      <ProfilePage profile={profile} />
    </div>
  )
}

export default Page