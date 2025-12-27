export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    // Login Errors
    case 'auth/invalid-email':
      return 'The email address is in an invalid format.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    
    // Registration Errors
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please login.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    
    // General Errors
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Please try again later.';
    
    default:
      return 'Something went wrong. Please try again.';
  }
};
