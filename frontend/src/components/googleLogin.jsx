import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
// import { loginWithGoogle } from '@/store/auth-slice';
// import { useToast } from '@/hooks/use-toast';
import googleLogo from '@/assets/google.png'; 

function GoogleLoginButton() {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        const userInfo = await res.json();

        const payload = {
          email: userInfo.email,
          userName: userInfo.name,
          profilePic: userInfo.picture,
          provider: 'google',
        };

        // dispatch(loginWithGoogle(payload)).then((data) => {
        //   toast({
        //     title: data?.payload?.message || 'Logged in successfully',
        //   });
        // });
      } catch (err) {
        console.error('Google login failed:', err);
        // toast({
        //   title: 'Google login failed',
        //   variant: 'destructive',
        // });
      }
    },
    onError: () =>
      toast({
        title: 'Google login was cancelled or failed.',
        variant: 'destructive',
      }),
  });

  return (
    <button
      onClick={() => handleGoogleLogin()}
      className="w-full border flex items-center justify-center gap-2 py-2 rounded-md hover:bg-gray-100"
    >
      <img src={googleLogo} alt="Google" className="w-5 h-5" />
      Sign in with Google
    </button>
  );
}

export default GoogleLoginButton;
