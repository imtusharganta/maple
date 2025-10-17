'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FaBiking, FaSkiing, FaCampground, FaWater, FaSnowflake, FaMountain, FaTools, FaHiking, FaCamera, FaPlus, FaThLarge } from 'react-icons/fa';

const CATEGORIES = [
  { id: 'all', name: 'All Items', icon: FaThLarge, slug: 'all' },
  { id: 'bicycles', name: 'Bicycles & E-Bikes', icon: FaBiking, slug: 'bicycles' },
  { id: 'winter-sports', name: 'Skis & Snowboards', icon: FaSkiing, slug: 'skis-snowboards' },
  { id: 'camping', name: 'Camping Gear', icon: FaCampground, slug: 'camping' },
  { id: 'water-sports', name: 'Water Sports', icon: FaWater, slug: 'water-sports' },
  { id: 'winter-gear', name: 'Winter Gear', icon: FaSnowflake, slug: 'winter-gear' },
  { id: 'climbing', name: 'Climbing Equipment', icon: FaMountain, slug: 'climbing' },
  { id: 'garden', name: 'Garden & Tools', icon: FaTools, slug: 'garden' },
  { id: 'hiking', name: 'Hiking Gear', icon: FaHiking, slug: 'hiking' },
  { id: 'photography', name: 'Photography', icon: FaCamera, slug: 'photography' },
];

export default function Sidebar() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen p-4">
      {/* List Item Button */}
      <Link
        href="/list"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 mb-6 transition"
      >
        <FaPlus />
        <span>List Item</span>
      </Link>

      {/* Categories */}
      <div className="space-y-1">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
          Categories
        </h3>
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isActive = currentCategory === category.slug;
          
          return (
            <Link
              key={category.id}
              href={category.slug === 'all' ? '/' : `/?category=${category.slug}`}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-3 transition ${
                isActive
                  ? 'bg-green-50 text-green-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="text-lg" />
              <span className="text-sm">{category.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Location Filter */}
      <div className="mt-8">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
          Location
        </h3>
        <div className="px-3">
          <input
            type="text"
            placeholder="Seattle, WA"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-gray-500 mt-1">Within 40 mi</p>
        </div>
      </div>
    </aside>
  );
}