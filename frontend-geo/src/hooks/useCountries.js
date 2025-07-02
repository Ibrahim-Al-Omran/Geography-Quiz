import { useState, useEffect } from 'react';

export default function useCountries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,capital,flags,region,population")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(c => c.capital && c.capital[0] && c.flags?.png);
        setCountries(filtered);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch countries");
        setLoading(false);
      });
  }, []);

  return { countries, loading, error };
}
