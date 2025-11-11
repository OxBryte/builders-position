const MissingTokenAlert = () => {
  return (
    <div className="rounded-2xl border border-yellow-300 bg-yellow-50/70 p-6 text-center text-sm text-yellow-800">
      Talent Protocol API token missing. Add <code>VITE_TALENT_API_TOKEN</code> to your
      environment configuration and restart the dev server.
    </div>
  );
};

export default MissingTokenAlert;
