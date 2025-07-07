'use client';

import PageTitles from '@/components/modules/PageTitles';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

type Props = {};

export default function ToursMap({}: Props) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize the map
    const map = L.map(mapRef.current).setView([35.6892, 51.389], 13);

    // Add tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Add a marker
    L.marker([35.6892, 51.389]).addTo(map).bindPopup('Hello from Tehran!').openPopup();
    return () => {
      map.remove(); // Clean up on unmount
    };
  }, []);
  return (
    <>
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <div className="p-4 w-full">
          <PageTitles
            breadcrumbs={[
              { label: 'همگام', href: '/dashboard' },
              { label: 'بازاریاب', href: '/dashboard/visitors' },
              { label: 'مشاهده بازاریاب‌ها', href: '/dashboard/visitors/table' },
              { label: 'تور ویزیت', href: '/dashboard/visitors/table/visit-tours' },
              { label: 'مسیرها', href: '/dashboard/visitors/table/tours-map' },
            ]}
            showSearch={false}
            showDateRange={true}
            title={'مسیرها'}
          />
        </div>
        <div ref={mapRef} className="w-full h-full relative z-0" />
      </div>
    </>
  );
}
