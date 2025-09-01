"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [leble, setLable] = useState("");
  const [price, setPrice] = useState("");
  const [joblimit, setPjobLimit] = useState("");
  const [featuredjoblimit, setFeaturedJobLimit] = useState("");
  const [highlightjoblimit, setHighlightJobLimit] = useState("");
  const [recommended, setRecommended] = useState("");
  const [frontendshow, setFrontendShow] = useState("");
  const [profileverify, setProfileVerify] = useState("");
  const [home, setHome] = useState("");
  const [listprice, setListPrice] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedItem, setEditedItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/plan`);
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.err);
      } else {
        setListPrice(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leble,
          price,
          joblimit,
          featuredjoblimit,
          highlightjoblimit,
          recommended: recommended === "true",
          frontendshow: frontendshow === "true",
          profileverify: profileverify === "true",
          home: home === "true",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.err);
      } else {
        toast.success("Successfully plan created");
        setLable("");
        setPrice("");
        setPjobLimit("");
        setFeaturedJobLimit("");
        setHighlightJobLimit("");
        setRecommended("");
        setFrontendShow("");
        setProfileVerify("");
        setHome("");
        fetchData();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/plan/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) toast.error(data.err);
      else {
        toast.success("Successfully deleted");
        fetchData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (item) => {
    setEditedItem({
      ...item,
      recommended: item.recommended ? "true" : "false",
      frontendshow: item.frontendshow ? "true" : "false",
      profileverify: item.profileverify ? "true" : "false",
      home: item.home ? "true" : "false",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditedItem(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!editedItem) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/plan/${editedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editedItem,
          recommended: editedItem.recommended === "true",
          frontendshow: editedItem.frontendshow === "true",
          profileverify: editedItem.profileverify === "true",
          home: editedItem.home === "true",
        }),
      });

      const data = await response.json();
      if (!response.ok) toast.error(data.err);
      else {
        toast.success("Data updated successfully");
        setIsModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-6 text-center">Add Pricing System</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Label</label>
              <input
                type="text"
                value={leble}
                onChange={(e) => setLable(e.target.value)}
                placeholder="Enter label"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Job Limit</label>
              <input
                type="number"
                value={joblimit}
                onChange={(e) => setPjobLimit(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Featured Job Limit</label>
              <input
                type="number"
                value={featuredjoblimit}
                onChange={(e) => setFeaturedJobLimit(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Highlight Job Limit</label>
              <input
                type="number"
                value={highlightjoblimit}
                onChange={(e) => setHighlightJobLimit(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Recommended</label>
              <select
                value={recommended}
                onChange={(e) => setRecommended(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Frontend Show</label>
              <select
                value={frontendshow}
                onChange={(e) => setFrontendShow(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Profile Verify</label>
              <select
                value={profileverify}
                onChange={(e) => setProfileVerify(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Display Home</label>
              <select
                value={home}
                onChange={(e) => setHome(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="col-span-1 md:col-span-2 text-right">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                {loading ? "Please wait..." : "Add Price"}
              </button>
            </div>
          </form>

          {/* Pricing list */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-center mb-6">PRICING</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {listprice.map((item) => (
                <div key={item.id} className="bg-white shadow rounded-lg p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {item.recommended && <span className="px-2 py-1 bg-green-500 text-white rounded text-sm">Recommended</span>}
                      {item.home && <span className="px-2 py-1 bg-blue-400 text-white rounded text-sm">Home</span>}
                      {item.frontendshow && <span className="px-2 py-1 bg-yellow-300 text-black rounded text-sm">Frontend Show</span>}
                    </div>
                    <h5 className="text-lg font-semibold mb-2">{item.leble}</h5>
                    <div className="bg-blue-500 text-white text-center py-3 rounded mb-3">
                      <p className="text-2xl font-bold">${item.price}</p>
                    </div>
                    <ul className="mb-3 space-y-1 text-gray-700">
                      <li>Job Limit: {item.joblimit}</li>
                      <li>Featured Job Limit: {item.featuredjoblimit}</li>
                      <li>Highlight Job Limit: {item.highlightjoblimit}</li>
                      <li>
                        Recommended: {item.recommended ? <FaCheck className="text-green-500 inline" /> : <FaTimes className="text-red-500 inline" />}
                      </li>
                      <li>
                        Frontend Show: {item.frontendshow ? <FaCheck className="text-green-500 inline" /> : <FaTimes className="text-red-500 inline" />}
                      </li>
                      <li>
                        Profile Verify: {item.profileverify ? <FaCheck className="text-green-500 inline" /> : <FaTimes className="text-red-500 inline" />}
                      </li>
                    </ul>
                  </div>
                  <div className="flex justify-between">
                    <button onClick={() => handleEdit(item)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Edit Modal */}
          {isModalOpen && editedItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-xl font-semibold">Edit Plan</h5>
                  <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">&times;</button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Label</label>
                    <input type="text" name="leble" value={editedItem.leble} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"/>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Price</label>
                    <input type="number" name="price" value={editedItem.price} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"/>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Job Limit</label>
                    <input type="number" name="joblimit" value={editedItem.joblimit} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"/>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Featured Job Limit</label>
                    <input type="number" name="featuredjoblimit" value={editedItem.featuredjoblimit} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"/>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Highlight Job Limit</label>
                    <input type="number" name="highlightjoblimit" value={editedItem.highlightjoblimit} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"/>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Recommended</label>
                    <select name="recommended" value={editedItem.recommended} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400">
                      <option value="">Select</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Frontend Show</label>
                    <select name="frontendshow" value={editedItem.frontendshow} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400">
                      <option value="">Select</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Profile Verify</label>
                    <select name="profileverify" value={editedItem.profileverify} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400">
                      <option value="">Select</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Display Home</label>
                    <select name="home" value={editedItem.home} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400">
                      <option value="">Select</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div className="col-span-1 md:col-span-2 text-right mt-4">
                    <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 mr-2">Close</button>
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
