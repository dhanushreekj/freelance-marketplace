import { useEffect, useState } from 'react';
import api from './api/axios';

function App() {
  const [msg, setMsg] = useState('Checking backend...');

  useEffect(() => {
    api.get('/health')
      .then((res) => setMsg(`Backend OK. Skills in database: ${res.data.skillsInDb}`))
      .catch(() => setMsg('Cannot reach backend'));
  }, []);

  return <h2 style={{ padding: 24 }}>{msg}</h2>;
}

export default App;