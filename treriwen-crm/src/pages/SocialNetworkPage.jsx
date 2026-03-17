import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SocialNetworkDetail from './SocialNetworkDetail';

export default function SocialNetworkPage() {
  const { network } = useParams();
  const navigate    = useNavigate();

  return (
    <SocialNetworkDetail
      networkId={network}
      onBack={() => navigate('/social')}
    />
  );
}