"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FaStar, FaCalendar, FaBox, FaMapMarkerAlt } from "react-icons/fa";
import ItemCard from "@/components/ItemCard";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true); // loads the page
  // Mock data for demonstration
  // this would normally come from your database, and there would be math that would go into it
  // there would be calculations to get the rating based on reviews, total rentals based on rental history, etc. in a different file
  const profileData = {
    rating: 4.8,
    totalRentals: 15,
    reviewCount: 12,
    memberSince: "January 2024",
    reviews: [
      {
        id: 1,
        reviewer: "Sarah Johnson",
        rating: 5,
        comment:
          "Great experience! The bike was in perfect condition and pickup was smooth.",
        date: "Oct 10, 2025",
      },
      {
        id: 2,
        reviewer: "Mike Chen",
        rating: 5,
        comment:
          "Very responsive and helpful. Would definitely rent from again!",
        date: "Oct 5, 2025",
      },
      {
        id: 3,
        reviewer: "Emily Rodriguez",
        rating: 4,
        comment:
          "Good rental, item was as described. Minor delay in communication.",
        date: "Sep 28, 2025",
      },
    ],
  };

  // useEffect to fetch user data and their listed items
  // if they are signed in, fetch their items
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push("/");
      } else {
        fetchUserItems(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, [router]);

  //
  const fetchUserItems = async (uid) => {
    try {
      const itemsRef = collection(db, "items");
      const q = query(itemsRef, where("ownerUid", "==", uid));
      const snapshot = await getDocs(q);

      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUserItems(items);
    } catch (error) {
      console.error("Error fetching user items:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="flex items-start space-x-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user.displayName}
            </h1>

            {/* Stats */}
            <div className="flex items-center space-x-6 mb-4">
              <div className="flex items-center space-x-2">
                <FaStar className="text-yellow-400" />
                <span className="font-semibold">{profileData.rating}</span>
                <span className="text-gray-600">
                  ({profileData.reviewCount} reviews)
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <FaBox />
                <span>{profileData.totalRentals} rentals</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <FaCalendar />
                <span>Member since {profileData.memberSince}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <FaMapMarkerAlt className="text-green-600" />
              <span>Seattle, WA</span>
            </div>
          </div>
        </div>
      </div>

      {/* User's Listings */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Listings</h2>
        {userItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No items listed yet
            </h3>
            <p className="text-gray-500 mb-4">
              Start listing your outdoor gear to earn money!
            </p>
            <button
              onClick={() => router.push("/list")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
            >
              List Your First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {userItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Reviews ({profileData.reviewCount})
        </h2>
        <div className="space-y-4">
          {profileData.reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    {review.reviewer}
                  </p>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
