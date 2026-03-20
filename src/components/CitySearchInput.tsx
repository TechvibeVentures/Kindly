import { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const popularCities = [
  { city: 'Zurich', country: 'Switzerland' },
  { city: 'Berlin', country: 'Germany' },
  { city: 'London', country: 'United Kingdom' },
  { city: 'Paris', country: 'France' },
  { city: 'Amsterdam', country: 'Netherlands' },
  { city: 'Vienna', country: 'Austria' },
  { city: 'Barcelona', country: 'Spain' },
  { city: 'Rome', country: 'Italy' },
  { city: 'Madrid', country: 'Spain' },
  { city: 'Brussels', country: 'Belgium' },
  { city: 'Copenhagen', country: 'Denmark' },
  { city: 'Stockholm', country: 'Sweden' },
  { city: 'Oslo', country: 'Norway' },
  { city: 'Helsinki', country: 'Finland' },
  { city: 'Warsaw', country: 'Poland' },
];

interface CityResult { city: string; country: string; displayName: string; }
interface CitySearchInputProps { value: string; onChange: (city: string, country: string) => void; placeholder?: string; onCancel?: () => void; }

export function CitySearchInput({ value, onChange, placeholder, onCancel }: CitySearchInputProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<CityResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(true);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useLanguage();

  const searchCities = async (searchQuery: string) => {
    if (searchQuery.length < 1) {
      setResults(popularCities.map(c => ({ city: c.city, country: c.country, displayName: `${c.city}, ${c.country}` })));
      return;
    }
    if (searchQuery.length === 1) {
      const filtered = popularCities.filter(c => c.city.toLowerCase().startsWith(searchQuery.toLowerCase()) || c.country.toLowerCase().startsWith(searchQuery.toLowerCase())).map(c => ({ city: c.city, country: c.country, displayName: `${c.city}, ${c.country}` }));
      setResults(filtered.length > 0 ? filtered : popularCities.map(c => ({ city: c.city, country: c.country, displayName: `${c.city}, ${c.country}` })));
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery + '*')}&format=json&addressdetails=1&limit=20`, { headers: { 'Accept-Language': 'en' } });
      const data = await response.json();
      const cities: CityResult[] = data.filter((item: any) => item.address && (item.address.city || item.address.town || item.address.village || item.address.municipality)).map((item: any) => {
        const cityName = item.address.city || item.address.town || item.address.village || item.address.municipality || item.name;
        return { city: cityName, country: item.address.country || '', displayName: `${cityName}, ${item.address.country || ''}` };
      }).filter((item: CityResult, index: number, self: CityResult[]) => index === self.findIndex(t => t.city === item.city && t.country === item.country));
      if (cities.length === 0) {
        const filtered = popularCities.filter(c => c.city.toLowerCase().includes(searchQuery.toLowerCase()) || c.country.toLowerCase().includes(searchQuery.toLowerCase())).map(c => ({ city: c.city, country: c.country, displayName: `${c.city}, ${c.country}` }));
        setResults(filtered);
      } else setResults(cities);
    } catch (error) {
      const filtered = popularCities.filter(c => c.city.toLowerCase().includes(searchQuery.toLowerCase()) || c.country.toLowerCase().includes(searchQuery.toLowerCase())).map(c => ({ city: c.city, country: c.country, displayName: `${c.city}, ${c.country}` }));
      setResults(filtered);
    } finally { setIsLoading(false); }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchCities(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  useEffect(() => { setResults(popularCities.map(c => ({ city: c.city, country: c.country, displayName: `${c.city}, ${c.country}` }))); }, []);

  const handleSelect = (city: string, country: string, displayName: string) => {
    // Put the selected value into the input (so it doesn't look like a separate “field” below).
    setQuery(displayName);
    onChange(city, country);
    // Close the dropdown once selected; typing again will re-open it.
    setShowDropdown(false);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-secondary/30">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            placeholder={placeholder || t.findYourCity}
            autoFocus
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-background border-none focus:outline-none text-sm"
          />
        </div>
        {onCancel && <button onClick={onCancel} className="text-foreground font-medium text-sm">{t.cancel}</button>}
      </div>
      {showDropdown && (
        <div className="overflow-y-auto max-h-56">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">{t.searching}</div>
          ) : results.length > 0 ? (
            results.map((item, index) => (
              <button
                key={`${item.city}-${item.country}-${index}`}
                onClick={() => handleSelect(item.city, item.country, item.displayName)}
                className="w-full flex items-center gap-3 px-4 py-4 hover:bg-secondary/50 active:bg-secondary transition-colors text-left border-b border-border/50"
              >
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground">{item.displayName}</span>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">{t.noCitiesFound}</div>
          )}
        </div>
      )}
    </div>
  );
}