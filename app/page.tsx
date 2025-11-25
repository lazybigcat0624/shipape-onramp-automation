export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Webhook Handler</h1>
      <p>This application handles Elfsight form submissions.</p>
      <p>
        Webhook endpoint: <code>/api/webhook</code>
      </p>
    </div>
  );
}

