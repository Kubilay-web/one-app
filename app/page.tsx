"use server";

import Header from "@/app/projects/components/newsportal/Header";
import Footer from "@/app/projects/components/newsportal/Footer";
import News from "./(components)/(content-layout)/home/news/page";

export default async function Home() {
  return (
    <div>
      <div>
        <Header />
        <News />
        <Footer />
      </div>
    </div>
  );
}
