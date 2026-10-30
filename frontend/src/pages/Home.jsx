import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="container">
      <h1>Welcome, {user.name}</h1>
      <p>You are logged in as a <strong>{user.role}</strong>.</p>
      <p>Dashboard features will appear here as we build them.</p>
    </div>
  );
}