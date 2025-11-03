// app/(user)/layout.jsx
export default function UserLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}