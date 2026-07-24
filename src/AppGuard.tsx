import React, { useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabase-config';

// 세션에 찍힌 등급이 아니라, 그 시점의 실제 프로필(등급/구독만료일)을 기준으로 판단한다.
// 세션 발급 이후 강퇴/등급하향/기간만료가 있었을 수 있으므로 매번 서버에서 재확인.
function isTierValid(role?: string | null, tier?: string | null, subscriptionEndDate?: string | null): boolean {
  if (role === 'admin') return true;
  if (tier !== 'silver' && tier !== 'gold') return false;
  if (!subscriptionEndDate) return false;
  if (subscriptionEndDate === 'unlimited') return true;
  const expiry = new Date(subscriptionEndDate);
  return !isNaN(expiry.getTime()) && expiry.getTime() > Date.now();
}

export default function AppGuard({ children }: { children: ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initGuard = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const sessionToken = params.get('s');
        if (!sessionToken) return;

        // 1. 세션 토큰 자체의 유효성(만료 여부)은 get_access_session이 서버측에서 확인
        const { data: sessionData } = await supabase.rpc('get_access_session', { p_id: sessionToken });
        const session = Array.isArray(sessionData) ? sessionData[0] : sessionData;
        if (!session?.email) return;

        // 2. 세션의 등급 스냅샷이 아니라, 지금 이 순간의 실제 등급/만료일을 재확인
        const { data: profileData } = await supabase.rpc('get_profile_status', { p_email: session.email });
        const profile = Array.isArray(profileData) ? profileData[0] : profileData;

        if (profile && isTierValid(profile.role, profile.tier, profile.subscription_end_date)) {
          setIsAuthorized(true);
        }
      } catch (e) {
        console.error("인증 확인 중 오류:", e);
      } finally {
        setLoading(false);
      }
    };

    initGuard();
  }, []);

  if (loading) return <div style={containerStyle}><div className="spinner"></div></div>;

  if (!isAuthorized) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{fontSize: '40px', marginBottom: '10px'}}>🔒</div>
          <h2 style={titleStyle}>ACCESS DENIED</h2>
          <p style={subtitleStyle}>실버 또는 골드 회원만 이용할 수 있습니다.<br/>본점에서 로그인 후 다시 들어와주세요.</p>
          <button
            onClick={() => window.location.href = "https://bang-guseog.com"}
            style={buttonStyle}
          >
            본점에서 로그인하기
          </button>
        </div>
        <style>{`
          .spinner { width: 40px; height: 40px; border: 4px solid #333; border-top: 4px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}

// 스타일 정의 (어두운 테마)
const containerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'sans-serif' };
const cardStyle: React.CSSProperties = { padding: '40px', backgroundColor: '#1e1e1e', borderRadius: '24px', textAlign: 'center', width: '90%', maxWidth: '380px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' };
const titleStyle: React.CSSProperties = { fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' };
const subtitleStyle: React.CSSProperties = { fontSize: '15px', color: '#aaa', marginBottom: '30px', lineHeight: 1.6 };
const buttonStyle: React.CSSProperties = { width: '100%', padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#007bff', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' };
