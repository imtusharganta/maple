"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

// what categrories we have for listing items
const CATEGORIES = [
  "Bicycles & E-Bikes",
  "Skis & Snowboards",
  "Camping Gear",
  "Water Sports",
  "Winter Gear",
  "Climbing Equipment",
  "Garden & Tools",
  "Hiking Gear",
  "Photography Equipment",
];

//this is a list of stuff that we will use as meetup spots later on
const MEETUP_SPOTS = [
  "Green Lake Park",
  "Gas Works Park",
  "Discovery Park",
  "Alki Beach",
  "University District",
  "Pike Place Market",
  "Capitol Hill Light Rail Station",
  "Northgate Mall",
  "SeaTac Airport",
  "Westlake Center",
];

export default function ListItemPage() {
  const router = useRouter(); //to navigate to different pages, we need to use router
  const [user, setUser] = useState(null); //no user is logged in at the start
  const [loading, setLoading] = useState(false); // to manage loading state during form submission
  const [images, setImages] = useState([]); // to hold the images user uploads

  const [formData, setFormData] = useState({
    //this is the data we will collect from the form that the user will fill out
    title: "",
    description: "",
    category: CATEGORIES[0],
    pricePerDay: "",
    pickupLocation: MEETUP_SPOTS[0],
  });

  // useEffect to check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      //mounts to go to the list page based on whether logged in or not
      setUser(currentUser);
      if (!currentUser) {
        alert("Please sign in to list an item");
        router.push("/"); //go to the home page because if not signed in, cannot list item, essentially go to the root path
        //unmounts /list page
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const uploadImages = async () => {
    const uploadPromises = images.map(async (image) => {
      const imageRef = ref(storage, `items/${Date.now()}_${image.name}`);
      await uploadBytes(imageRef, image);
      return getDownloadURL(imageRef);
    });
    return Promise.all(uploadPromises);
  };

  //function to handle form submission once we list the item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in first");
      return;
    }

    setLoading(true);
    try {
      // Upload images
      const imageUrls = images.length > 0 ? await uploadImages() : [];

      // Create item document
      await addDoc(collection(db, "items"), {
        ...formData,
        pricePerDay: parseFloat(formData.pricePerDay),
        images: imageUrls,
        ownerUid: user.uid,
        ownerName: user.displayName,
        ownerPhoto: user.photoURL,
        available: true,
        createdAt: serverTimestamp(),
      });

      alert("Item listed successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error listing item:", error);
      alert("Failed to list item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your Item</h1>
      <p className="text-gray-600 mb-8">
        Share your outdoor gear and earn money!
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-8 space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Item Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Mountain Bike - Trek X-Caliber"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Describe your item, its condition, what's included, etc."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Price per Day ($) *
          </label>
          <input
            type="number"
            name="pricePerDay"
            value={formData.pricePerDay}
            onChange={handleChange}
            required
            min="1"
            step="0.01"
            placeholder="45.00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Pickup Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pickup Location *
          </label>
          <select
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {MEETUP_SPOTS.map((spot) => (
              <option key={spot} value={spot}>
                {spot}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            ✨ Recommended popular meetup spots in Seattle
          </p>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Photos (up to 5)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            {images.length} photo(s) selected
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          {loading ? "Listing Item..." : "List Item"}
        </button>
      </form>
    </div>
  );
}
