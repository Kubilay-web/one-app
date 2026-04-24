// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter, useParams } from "next/navigation";
// import axios from "axios";

// const EditWriter = () => {
//   const router = useRouter();
//   const { id } = useParams();

//   const [loader, setLoader] = useState(false);
//   const [state, setState] = useState({
//     penName: "",
//     category: "",
//   });

//   useEffect(() => {
//     if (!id) return;

//     axios
//       .get(`/api/writer/${id}`)
//       .then((res) => {
//         const writer = res.data.writer;
//         setState({
//           penName: writer.penName,
//           category: writer.category,
//         });
//       })
//       .catch(() => {
//         alert("Writer not found");
//         router.push("/dashboard/newsportal/writers");
//       });
//   }, [id, router]);

//   const inputHandle = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     setState((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const submit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoader(true);

//     try {
//       await axios.put(`/api/writer/${id}`, state);
//       setLoader(false);
//       router.push("/dashboards/newsportal/writers");
//     } catch {
//       setLoader(false);
//       alert("Failed to update writer");
//     }
//   };

//   return (
//     <div className="rounded-md bg-white">
//       <div className="flex justify-between p-4">
//         <h2 className="text-xl font-semibold">Edit Writer</h2>
//         <Link
//           href="/dashboards/newsportal/writers"
//           className="rounded-md bg-blue-500 px-3 py-[6px] text-white hover:bg-blue-800"
//         >
//           Writers
//         </Link>
//       </div>

//       <div className="p-4">
//         <form onSubmit={submit}>
//           <div className="mb-3 grid grid-cols-2 gap-x-8">
//             <div className="flex flex-col gap-y-2">
//               <label
//                 htmlFor="penName"
//                 className="text-md font-semibold text-gray-600"
//               >
//                 Pen Name
//               </label>
//               <input
//                 onChange={inputHandle}
//                 value={state.penName}
//                 required
//                 type="text"
//                 placeholder="Pen Name"
//                 name="penName"
//                 id="penName"
//                 className="h-10 rounded-md border border-gray-300 px-3 py-2 outline-0 focus:border-blue-500"
//               />
//             </div>

//             <div className="flex flex-col gap-y-2">
//               <label
//                 htmlFor="category"
//                 className="text-md font-semibold text-gray-600"
//               >
//                 Category
//               </label>
//               <select
//                 onChange={inputHandle}
//                 value={state.category}
//                 required
//                 name="category"
//                 id="category"
//                 className="h-10 rounded-md border border-gray-300 px-3 py-2 outline-0 focus:border-blue-500 appearance-none bg-none"
//               >
//                 <option value="">--- Select Category ---</option>
//                 <option value="Education">Education</option>
//                 <option value="Travel">Travel</option>
//                 <option value="Health">Health</option>
//                 <option value="International">International</option>
//                 <option value="Sports">Sports</option>
//                 <option value="Technology">Technology</option>
//               </select>
//             </div>
//           </div>

//           <div className="mt-4">
//             <button
//               disabled={loader}
//               className="rounded-md bg-blue-500 px-3 py-[6px] text-white hover:bg-blue-800"
//             >
//               {loader ? "Loading..." : "Update Writer"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditWriter;











"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const EditWriter = () => {
  const router = useRouter();
  const { id } = useParams();

  const [loader, setLoader] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [state, setState] = useState({
    penName: "",
    category: "",
  });

  // Kategorileri getir
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const { data } = await axios.get("/api/news/category");
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Kategoriler yüklenirken hata:", error);
        toast.error("Kategoriler yüklenemedi");
        // Fallback kategoriler
        setCategories([
          "Education", "Travel", "Health", "International",
          "Sports", "Technology", "Business"
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Writer bilgilerini getir
  useEffect(() => {
    if (!id) return;

    const fetchWriter = async () => {
      try {
        const { data } = await axios.get(`/api/writer/${id}`);
        const writer = data.writer;
        setState({
          penName: writer.penName,
          category: writer.category,
        });
      } catch (error) {
        console.error("Writer bulunamadı:", error);
        toast.error("Writer not found");
        router.push("/dashboards/newsportal/writers");
      }
    };

    fetchWriter();
  }, [id, router]);

  const inputHandle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!state.category) {
      toast.error("Please select a category");
      return;
    }

    setLoader(true);

    try {
      await axios.put(`/api/writer/${id}`, state);
      setLoader(false);
      toast.success("Writer updated successfully");
      router.push("/dashboards/newsportal/writers");
    } catch (error: any) {
      setLoader(false);
      toast.error(error?.response?.data?.message || "Failed to update writer");
    }
  };

  return (
    <div className="rounded-md bg-white shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700">Edit Writer</h2>
        <Link
          href="/dashboards/newsportal/writers"
          className="rounded-md bg-blue-500 px-4 py-2 text-white text-center hover:bg-blue-800 transition"
        >
          Writers
        </Link>
      </div>

      <div className="p-4">
        <form onSubmit={submit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pen Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="penName"
                className="text-md font-semibold text-gray-600"
              >
                Pen Name
              </label>
              <input
                onChange={inputHandle}
                value={state.penName}
                required
                type="text"
                placeholder="Pen Name"
                name="penName"
                id="penName"
                className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Category - Dinamik */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="category"
                className="text-md font-semibold text-gray-600"
              >
                Category
              </label>
              <select
                onChange={inputHandle}
                value={state.category}
                required
                name="category"
                id="category"
                disabled={loadingCategories}
                className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {loadingCategories ? "Loading categories..." : "--- Select Category ---"}
                </option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={loader || loadingCategories}
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-800 transition disabled:opacity-60"
            >
              {loader ? "Updating..." : "Update Writer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWriter;