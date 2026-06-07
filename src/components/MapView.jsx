import {
  buildYandexExternalUrl,
  mapCenter,
  masters,
} from "../data/siteData.js";
import { useEffect, useRef } from "react";

function MasterPin({ master, className }) {
  return (
    <div className={`absolute ${className}`}>
      <div
        className={`${master.pro ? "pro-pulse border-pink-500" : "border-white"} grid h-11 w-11 place-items-center rounded-full border-[3px] ${master.color} text-sm font-bold shadow-lg`}
      >
        {master.initials}
      </div>
      {master.pro && (
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-pink-500 px-1.5 py-0.5 text-[9px] font-semibold text-white">
          PRO
        </span>
      )}
    </div>
  );
}

export default function MapView({
  mobile = false,
  query = "",
  geoStatus = "denied",
  userLocation = null,
  filteredMasters = masters,
  onBooking,
  onContact,
}) {
  const featured = filteredMasters[0] ?? masters[0];
  const visiblePins = filteredMasters.length
    ? filteredMasters.slice(0, 3)
    : masters.slice(0, 3);
  const pinPositions = mobile
    ? ["left-[42%] top-[30%]", "left-[24%] top-[44%]", "right-[18%] top-[40%]"]
    : ["left-[54%] top-[28%]", "left-[30%] top-[52%]", "right-[14%] top-[46%]"];

  const mapRef = useRef(null);
  useEffect(() => {
    let mapInstance = null;
    let poll = null;

    const init = () => {
      try {
        window.ymaps.ready(() => {
          const centerLat = Number(userLocation?.lat ?? mapCenter.lat);
          const centerLng = Number(userLocation?.lng ?? mapCenter.lng);
          mapInstance = new window.ymaps.Map(mapRef.current, {
            center: [centerLat, centerLng],
            zoom: 13,
            controls: [],
          });

          const pins = filteredMasters.length
            ? filteredMasters.slice(0, 3)
            : masters.slice(0, 3);
          pins.forEach((master, idx) => {
            const hasCoords = master.latitude && master.longitude;
            const lat = hasCoords
              ? Number(master.latitude)
              : centerLat + (idx - 1) * 0.01;
            const lng = hasCoords
              ? Number(master.longitude)
              : centerLng + (idx - 1) * 0.01;
            const placemark = new window.ymaps.Placemark(
              [lat, lng],
              {
                hintContent: master.name,
                balloonContent: `${master.name} — ${master.service}`,
              },
              {
                preset: master.pro
                  ? "islands#pinkIcon"
                  : hasCoords
                    ? "islands#redIcon"
                    : "islands#blueIcon",
              },
            );
            placemark.events.add("click", () => onContact?.(master));
            mapInstance.geoObjects.add(placemark);
          });
        });
      } catch (err) {
        // ignore
      }
    };

    if (typeof window !== "undefined") {
      if (window.ymaps) init();
      else {
        poll = setInterval(() => {
          if (window.ymaps) {
            clearInterval(poll);
            poll = null;
            init();
          }
        }, 150);
      }
    }

    return () => {
      if (poll) clearInterval(poll);
      if (mapInstance) {
        mapInstance.destroy();
        mapInstance = null;
      }
    };
  }, [query, userLocation, filteredMasters, onContact]);

  return (
    <div
      className={`relative overflow-hidden ${mobile ? "h-full" : "h-[420px] rounded-3xl border border-gray-200"}`}
    >
      <div ref={mapRef} className="h-full w-full" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/20" />
      <div className="pointer-events-none absolute inset-0">
        {visiblePins.map((master, index) => (
          <MasterPin
            key={master.id}
            master={master}
            className={pinPositions[index]}
          />
        ))}
      </div>

      <div
        className={`absolute left-3 right-3 z-10 ${mobile ? "hidden" : "bottom-3"}`}
      >
        <div className="flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/95 p-3 shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-950">
              {mapCenter.address}
            </div>
            <div className="mt-0.5 text-xs text-gray-500">
              {filteredMasters.length
                ? `${filteredMasters.length} мастеров найдено`
                : "Ничего не найдено"}
              {query ? ` · запрос: ${query}` : " · PRO-мастера подсвечены"}
              {geoStatus === "allowed"
                ? " · центр по вашей геопозиции"
                : " · центр города"}
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href={buildYandexExternalUrl(query, userLocation)}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-100 transition hover:bg-indigo-50"
            >
              Открыть карту
            </a>
            <button
              type="button"
              onClick={() => onContact(featured)}
              className="rounded-xl bg-pink-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-pink-600"
            >
              Связаться
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
