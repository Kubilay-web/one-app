
import { StudioView } from "../modules/studio/ui/views/studio-view";

export const dynamic = 'force-dynamic';

const Page = async () => {
  // Using a direct fetch for the fastest approach to retrieve data
  const fetchStudios = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/video/studio/videos`, { method: 'GET' });
      if (!response.ok) {
        throw new Error('Failed to fetch studios');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching studios:', error);
      return [];
    }
  };

  // Fetch the data before rendering
  const studios = await fetchStudios();

  return (
      <StudioView studios={studios} />
  );
};

export default Page;
