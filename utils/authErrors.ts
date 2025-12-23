export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    // Login Errors
    case 'auth/invalid-email':
      return 'Email address galat format mein hai.';
    case 'auth/user-disabled':
      return 'Ye account disable kar diya gaya hai.';
    case 'auth/user-not-found':
      return 'Is email se koi account nahi mila. Pehle Sign Up karein.';
    case 'auth/wrong-password':
      return 'Password galat hai. Dobara koshish karein.';
    case 'auth/invalid-credential':
      return 'Email ya password galat hai.';
    
    // Registration Errors
    case 'auth/email-already-in-use':
      return 'Ye email pehle se register hai. Login karein.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in enable nahi hai.';
    case 'auth/weak-password':
      return 'Password kam se kam 6 characters ka hona chahiye.';
    
    // General Errors
    case 'auth/network-request-failed':
      return 'Internet ka masla hai. Connection check karein.';
    case 'auth/too-many-requests':
      return 'Bohat zyada koshish kar li gayi hai. Kuch dair baad try karein.';
    
    default:
      return 'Kuch galat ho gaya. Dobara koshish karein.';
  }
};
