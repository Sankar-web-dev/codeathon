"use client"

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
import { useState, useEffect } from "react"
import "leaflet/dist/leaflet.css"

interface Location {
  lat: number
  lon: number
}

function LocationMarker({setLocation, location}: {setLocation: (loc: Location) => void, location: Location | null}) {
  useMapEvents({
    click(e: any){
      const {lat,lng} = e.latlng
      setLocation({
        lat,
        lon: lng
      })
    }
  })

  return location ? (
    <Marker position={[location.lat, location.lon]}></Marker>
  ) : null
}

function MapController({location}: {location: Location | null}) {
  const map = useMap()
  useEffect(() => {
    if (location) {
      map.setView([location.lat, location.lon], 13)
    }
  }, [location, map])
  return null
}

function InitialView() {
  const map = useMap()
  useEffect(() => {
    map.setView([12.97,80.22], 13)
    map.setZoom(13)
  }, [map])
  return null
}

export default function MapSelector({setLocation}: {setLocation: (loc: Location) => void}) {
  const [search, setSearch] = useState("")
  const [location, setLocationInternal] = useState<Location | null>(null)
  const [suggestions, setSuggestions] = useState<any[]>([])

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      return
    }
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`)
      const data = await response.json()
      setSuggestions(data)
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      setSuggestions([])
    }
  }

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&limit=1`)
        const data = await response.json()
        if (data.length > 0) {
          const { lat, lon } = data[0]
          const newLocation: Location = { lat: parseFloat(lat), lon: parseFloat(lon) }
          setLocationInternal(newLocation)
          setLocation(newLocation)
          setSuggestions([])
        } else {
          alert("Location not found")
        }
      } catch (error) {
        console.error("Geocoding error:", error)
        alert("Error searching location")
      }
    }
  }

  const handleLocationChange = (loc: Location) => {
    setLocationInternal(loc)
    setLocation(loc)
  }

return(
  <div className="space-y-2">
    <div className="relative">
      <input
        type="text"
        placeholder="Search for location (e.g., Chennai, India)"
        value={search}
        onChange={(e) => { setSearch(e.target.value); fetchSuggestions(e.target.value); }}
        onKeyDown={handleSearch}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-md shadow-lg z-[1000] max-h-40 overflow-y-auto">
          {suggestions.map((s) => (
            <div
              key={s.place_id}
              onClick={() => {
                const loc = { lat: parseFloat(s.lat), lon: parseFloat(s.lon) };
                setLocationInternal(loc);
                setLocation(loc);
                setSearch(s.display_name);
                setSuggestions([]);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {s.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
    <MapContainer
      style={{height:"400px"}}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <InitialView />
      <MapController location={location} />
      <LocationMarker setLocation={handleLocationChange} location={location}/>
    </MapContainer>
    {location && (
      <p className="text-sm text-gray-600">
        Selected: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
      </p>
    )}
  </div>
)

}