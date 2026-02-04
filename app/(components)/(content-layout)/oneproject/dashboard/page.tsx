
import { validateRequest } from "@/app/auth";
import { getDashboardOverview } from "../actions/analytics";
import { getUserRecentClients } from "../actions/clients";
import { getUserRecentProjects } from "../actions/projects";
import OverViewCard from "../components/dashboard/overview/OverViewCard";
import RecentClients from "../components/dashboard/overview/RecentClients";
import RecentProjects from "../components/dashboard/overview/RecentProjects";

export default async function Dashboard() {
  const {user} = await validateRequest();
  const recentProjects = (await getUserRecentProjects(user?.id)) || [];
  const recentClients = (await getUserRecentClients(user?.id)) || [];
  const analytics = (await getDashboardOverview(user?.id)) || [];
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {analytics.map((item, i) => (
          <OverViewCard item={item} key={i} />
        ))}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 ">
        {recentProjects.length > 0 && (
          <RecentProjects recentProjects={recentProjects} />
        )}
        {recentClients.length > 0 && (
          <RecentClients recentClients={recentClients} />
        )}
      </div>
    </main>
  );
}
