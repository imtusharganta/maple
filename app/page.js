"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import ItemCard from "@/components/ItemCard";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const itemsRef = collection(db, "items");
      const q = query(itemsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const itemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setItems(itemsData);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on URL category parameter
  const filteredItems =
    categoryParam === "all"
      ? items
      : items.filter((item) => {
          // Map URL slugs to actual category names
          const categoryMap = {
            bicycles: "Bicycles & E-Bikes",
            "skis-snowboards": "Skis & Snowboards",
            camping: "Camping Gear",
            "water-sports": "Water Sports",
            "winter-gear": "Winter Gear",
            climbing: "Climbing Equipment",
            garden: "Garden & Tools",
            hiking: "Hiking Gear",
            photography: "Photography Equipment",
          };
          return item.category === categoryMap[categoryParam];
        });

  // Get display name for current category
  const getCategoryDisplayName = () => {
    const categoryMap = {
      all: "All Items",
      bicycles: "Bicycles & E-Bikes",
      "skis-snowboards": "Skis & Snowboards",
      camping: "Camping Gear",
      "water-sports": "Water Sports",
      "winter-gear": "Winter Gear",
      climbing: "Climbing Equipment",
      garden: "Garden & Tools",
      hiking: "Hiking Gear",
      photography: "Photography Equipment",
    };
    return categoryMap[categoryParam] || "All Items";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading outdoor gear...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-8 mb-6 text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome to Maple 🍁</h1>
        <p className="text-xl text-green-50">
          Rent outdoor gear from locals. Save money. Make money.
        </p>
      </div>

      {/* Category Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {getCategoryDisplayName()}
        </h2>
        <p className="text-gray-600">
          {filteredItems.length} item(s) available
        </p>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg">
          <div className="text-6xl mb-4">🏔️</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No items in this category yet
          </h3>
          <p className="text-gray-500 mb-4">
            Try another category or be the first to list!
          </p>
          <a
            href="/list"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            List Your First Item →
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
