'use client';

import React from 'react';
import AIBriefingReviews from '@/components/map/AIBriefingReviews';

interface NaverBlogReviewsProps {
  placeName: string;
  address?: string;
}

export default function NaverBlogReviews({ placeName, address }: NaverBlogReviewsProps) {
  return <AIBriefingReviews placeName={placeName} address={address} />;
}
