'use client'; //this is a client component meaning this is what the user will see/interact with

import {useState, useEffect} from 'react'; //react hooks to manage state(think variables) and side effects (things that change those variables over time)
import {auth, googleProvider} from '@/lib/firebase'; //importing our firebase authentication and google login provider from our firebase config file
import {signInWithPopup, signOut, onAuthStateChanged} from 'firebase/auth'; //pop up sign in method, sign out method, and listener for auth state changes from firebase auth package
import { FaSearch, FaUser, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';

export default function Navbar() {
  const [user, setUser] = useState(null); //no user is logged in at the start
  const [search, setSearch] = useState(''); //we haven't searched anything yet

  //listen for auth state changes (login/logout) of a user
  // mounting
  useEffect(() => { 
    const stopAuthListener = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); //updates when user logs in or out
    });
    // The listener itself continues to handle sign-in/out changes until unmounted
    return () => stopAuthListener(); // 
  }, []);

  //function to handle google sign in
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Failed to sign in. Please try again.');
    }
  };

  //function to handle sign out
  //async because it is returning a promise, its waiting for firebase to confirm sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  //navbar JSX
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-3xl">🍁</div>
            <span className="text-2xl font-bold text-green-700">Maple</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search outdoor gear..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  href="/profile"
                  className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
                >
                  <img 
                    src={user.photoURL || '/default-avatar.png'} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium">{user.displayName}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition"
                >
                  <FaSignOutAlt />
                  <span className="text-sm">Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                className="flex items-center space-x-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
              >
                <FaSignInAlt />
                <span>Sign In with Google</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}