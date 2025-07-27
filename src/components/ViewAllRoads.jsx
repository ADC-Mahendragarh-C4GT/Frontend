export default function ViewAllRoads() {
  const [roads, setRoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoads = async () => {
      try {
        const response = await axios.get('/api/roads/');
        setRoads(response.data);
      } catch (err) {
        setError('Failed to fetch roads');
      } finally {
        setLoading(false);
      }
    };

    fetchRoads();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>All Roads</h1>
      <ul>
        {roads.map(road => (
          <li key={road.id}>
            {road.road_name} - {road.unique_code}
          </li>
        ))}
      </ul>
    </div>
  );
}