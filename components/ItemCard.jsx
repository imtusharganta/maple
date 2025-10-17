'use client';

import Link from 'next/link';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function ItemCard({ item }) {
  const { id, title, pricePerDay, images, category, pickupLocation, ownerName } = item;

  return (
    <Link href={`/item/${id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          <img
            src={images?.[0] || 'https://via.placeholder.com/400x300?text=Outdoor+Gear'}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded-full text-xs font-semibold">
            {category}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <div className="text-xl font-bold text-gray-900 mb-1">
            ${pricePerDay}
            <span className="text-sm font-normal text-gray-600">/day</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-600">
            <FaMapMarkerAlt className="mr-1 text-green-600" />
            <span>{pickupLocation}</span>
          </div>

          {/* Owner */}
          {ownerName && (
            <div className="text-xs text-gray-500 mt-2">
              Listed by {ownerName}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}