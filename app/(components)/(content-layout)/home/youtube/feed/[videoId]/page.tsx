interface PageProps {
  params: Promise<{ videoId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { videoId } = await params;
  console.log("where i am rendering");
  return <div>The video id is {videoId} </div>;
};

export default Page;
