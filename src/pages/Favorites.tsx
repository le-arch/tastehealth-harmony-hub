import { ProfileSidebar } from "../components/profile/ProfileSidebar";

export default function Favorites() {
  return (
    <div className="flex flex-col md:flex-row">
      <ProfileSidebar activePage="favorites" />
      <div className="flex-1 p-6 ml-0 md:ml-16 lg:ml-64">
        <h1 className="text-2xl font-bold mb-6">My Favorites</h1>
        <p className="text-muted-foreground text-center py-16">Database features removed.</p>
      </div>
    </div>
  );
}
