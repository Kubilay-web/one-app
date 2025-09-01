"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "react-quill-new/dist/quill.snow.css";
import { Select, DatePicker } from "antd";
import moment from "moment";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useSkillStore } from "@/app/job-portal-store/skill";
import { useCountryStore } from "@/app/job-portal-store/country";
import { useStateStore } from "@/app/job-portal-store/state";
import { useCityStore } from "@/app/job-portal-store/city";
import { useJobcategoryStore } from "@/app/job-portal-store/jobcategories";
import { useEducationStore } from "@/app/job-portal-store/education";
import { useJobroleStore } from "@/app/job-portal-store/jobrole";
import { useJobtypeStore } from "@/app/job-portal-store/jobtype";
import { useJobexperienceStore } from "@/app/job-portal-store/jobexperiences";
import { useSalarytypeStore } from "@/app/job-portal-store/salarytype";
import { useTagStore } from "@/app/job-portal-store/tag";

const { Option } = Select;
const ReactQuillEditor = dynamic(() => import("react-quill-new"), { ssr: false });

const benefitsList = [
  "Job","Career","Employment","Opportunity","Vacancy","Position",
  "Work","Recruitment","Hiring","Interview","Resume","Salary",
  "Benefits","Skills","Experience","Job search","Job market",
  "Job application","Job satisfaction","Professional development",
];

export default function JobsDetailsCompany({ searchParams }) {
  const router = useRouter();
  const id = searchParams?.id;

  const [formData, setFormData] = useState({
    title: "", deadline: "", vacancies: "", companyId: "", jobCategoryId: "",
    countryId: "", stateId: "", cityId: "", address: "", isSalaryRange: true,
    minSalary: 0, maxSalary: 0, customSalary: 0, salaryTypeId: "", jobExperienceId: "",
    jobRoleId: "", educationId: "", jobTypeId: "", tags: [], benefits: [], skills: [],
    apply_on: "", highlight: false, featured: false, description: "",
  });
  const [loading, setLoading] = useState(false);
  const [allCompanies, setAllCompanies] = useState([]);

  // Zustand stores
  const { skills: skillData, fetchSkillsPublic } = useSkillStore();
  const { countries, fetchCountriesPublic } = useCountryStore();
  const { states, fetchStatesPublic, setSelectedCountryId } = useStateStore();
  const { cities, fetchCitiesPublic, setSelectedStateId } = useCityStore();
  const { jobcategories, fetchJobcategoriesPublic } = useJobcategoryStore();
  const { educations, fetchEducationPublic } = useEducationStore();
  const { jobrole, fetchJobrolePublic } = useJobroleStore();
  const { jobtypes, fetchJobtypesPublic } = useJobtypeStore();
  const { jobexperience, fetchJobexperiencePublic } = useJobexperienceStore();
  const { salarytypes, fetchSalarytypesPublic } = useSalarytypeStore();
  const { tags, fetchTagsPublic } = useTagStore();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          fetchJobexperiencePublic(), fetchJobcategoriesPublic(), fetchCountriesPublic(),
          fetchSalarytypesPublic(), fetchJobrolePublic(), fetchJobtypesPublic(),
          fetchEducationPublic(), fetchTagsPublic(), fetchSkillsPublic(), fetchCompanies(),
        ]);
        if (id) await fetchJobDetails();
      } catch (error) {
        console.error(error);
        toast.error("Failed to load initial data");
      }
    };
    fetchInitialData();
  }, [id]);

  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/selectcompany`);
      const data = await res.json();
      if (res.ok) setAllCompanies(data);
      else toast.error(data.err || "Failed to fetch companies");
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch companies");
    }
  };

  const fetchJobDetails = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/jobdetails/${id}`);
      const data = await res.json();
      if (res.ok) {
        const job = data.job;
        setFormData({
          title: job?.title || "", deadline: job?.deadline ? moment(job.deadline) : "",
          vacancies: job?.vacancies || "", companyId: job?.companyId || "",
          jobCategoryId: job?.jobCategoryId || "", countryId: job?.countryId || "",
          stateId: job?.stateId || "", cityId: job?.cityId || "", address: job?.address || "",
          isSalaryRange: job?.salary_mode === "range", minSalary: job?.min_salary || 0,
          maxSalary: job?.max_salary || 0, customSalary: job?.custom_salary || 0,
          salaryTypeId: job?.salaryTypeId || "", jobExperienceId: job?.jobExperienceId || "",
          jobRoleId: job?.jobRoleId || "", educationId: job?.educationId || "",
          jobTypeId: job?.jobTypeId || "", tags: data?.jobTag?.tagId ? [data.jobTag.tagId] : [],
          skills: data?.jobSkills?.skillId ? [data.jobSkills.skillId] : [],
          benefits: data?.benefits?.name || [], apply_on: job?.apply_on || "",
          highlight: job?.highlight || false, featured: job?.featured || false,
          description: job?.description || "",
        });

        if (job?.countryId) { setSelectedCountryId(job.countryId); await fetchStatesPublic(); }
        if (job?.stateId) { setSelectedStateId(job.stateId); await fetchCitiesPublic(); }
      } else toast.error(data.err || "Failed to fetch job details");
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch job details");
    }
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleDateChange = (date) => setFormData(prev => ({ ...prev, deadline: date }));
  const handleCountryChange = async (e) => {
    const countryId = e.target.value;
    setFormData(prev => ({ ...prev, countryId, stateId: "", cityId: "" }));
    setSelectedCountryId(countryId);
    await fetchStatesPublic();
  };
  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    setFormData(prev => ({ ...prev, stateId, cityId: "" }));
    setSelectedStateId(stateId);
    await fetchCitiesPublic();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requiredFields = [
        "title","deadline","vacancies","companyId","jobCategoryId","countryId",
        "stateId","cityId","address","description","salaryTypeId",
        "jobExperienceId","jobRoleId","jobTypeId","apply_on"
      ];
      const missing = requiredFields.filter(f => !formData[f]);
      if (missing.length) { toast.error(`Please fill: ${missing.join(", ")}`); setLoading(false); return; }
      if (formData.isSalaryRange && (!formData.minSalary || !formData.maxSalary)) {
        toast.error("Provide both min and max salary"); setLoading(false); return;
      }
      if (!formData.isSalaryRange && !formData.customSalary) {
        toast.error("Provide custom salary"); setLoading(false); return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/company/jobs/create/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          deadline: formData.deadline ? moment(formData.deadline).toISOString() : null,
          minSalary: parseInt(formData.minSalary),
          maxSalary: parseInt(formData.maxSalary),
          customSalary: parseInt(formData.customSalary),
          salary_mode: formData.isSalaryRange ? "range" : "custom",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Job updated successfully", { duration: 2000, position: "top-center" });
        setTimeout(() => router.push("/dashboard/job/company/companyjob"), 2000);
      } else {
        toast.error(data.err || "Failed to update job");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update job");
      setLoading(false);
    }
  };

  return (
    <main className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-10 space-y-6">
        <h2 className="text-2xl font-bold">Job Details</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* Title */}
          <div>
            <label className="block font-medium mb-1">Title*</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Job Category & Company */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Job Category*</label>
              <select
                name="jobCategoryId"
                value={formData.jobCategoryId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select Job Category</option>
                {jobcategories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Company*</label>
              <select
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select Company</option>
                {allCompanies?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Deadline & Vacancies */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Deadline*</label>
              <DatePicker
                value={formData.deadline}
                onChange={handleDateChange}
                className="w-full border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Vacancies*</label>
              <input
                type="number"
                name="vacancies"
                value={formData.vacancies}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="font-semibold mb-2">Location</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <select
                name="countryId"
                value={formData.countryId}
                onChange={handleCountryChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Country</option>
                {countries?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select
                name="stateId"
                value={formData.stateId}
                onChange={handleStateChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={!formData.countryId}
              >
                <option value="">State</option>
                {states?.map(s => <option key={s.id} value={s.id}>{s.statename}</option>)}
              </select>
              <select
                name="cityId"
                value={formData.cityId}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={!formData.stateId}
              >
                <option value="">City</option>
                {cities?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Salary */}
          <div>
            <h3 className="font-semibold mb-2">Salary Details</h3>
            <div className="flex gap-6 mb-2">
              <label className="flex items-center gap-2">
                <input type="radio" checked={formData.isSalaryRange} onChange={() => setFormData(prev => ({ ...prev, isSalaryRange: true }))} />
                <span>Salary Range</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={!formData.isSalaryRange} onChange={() => setFormData(prev => ({ ...prev, isSalaryRange: false }))} />
                <span>Custom Salary</span>
              </label>
            </div>
            {formData.isSalaryRange ? (
              <div className="grid md:grid-cols-2 gap-4">
                <input type="number" name="minSalary" value={formData.minSalary} onChange={handleChange} placeholder="Min Salary" className="border border-gray-300 rounded-md px-3 py-2" />
                <input type="number" name="maxSalary" value={formData.maxSalary} onChange={handleChange} placeholder="Max Salary" className="border border-gray-300 rounded-md px-3 py-2" />
              </div>
            ) : (
              <input type="number" name="customSalary" value={formData.customSalary} onChange={handleChange} placeholder="Custom Salary" className="w-full border border-gray-300 rounded-md px-3 py-2" />
            )}
            <select name="salaryTypeId" value={formData.salaryTypeId} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2">
              <option value="">Salary Type</option>
              {salarytypes?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {/* Attributes */}
          <div className="grid md:grid-cols-2 gap-4">
            <select name="jobExperienceId" value={formData.jobExperienceId} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2">
              <option value="">Experience</option>
              {jobexperience?.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            <select name="jobRoleId" value={formData.jobRoleId} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2">
              <option value="">Job Role</option>
              {jobrole?.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <select name="educationId" value={formData.educationId} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2">
              <option value="">Education</option>
              {educations?.map(ed => <option key={ed.id} value={ed.id}>{ed.name}</option>)}
            </select>
            <select name="jobTypeId" value={formData.jobTypeId} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2">
              <option value="">Job Type</option>
              {jobtypes?.map(jt => <option key={jt.id} value={jt.id}>{jt.name}</option>)}
            </select>
          </div>

          {/* Multi-selects */}
          <div className="space-y-3">
            <Select mode="multiple" style={{ width: "100%" }} placeholder="Tags" value={formData.tags} onChange={v => setFormData(prev => ({ ...prev, tags: v }))}>
              {tags?.map(t => <Option key={t.id} value={t.id}>{t.name}</Option>)}
            </Select>
            <Select mode="multiple" style={{ width: "100%" }} placeholder="Benefits" value={formData.benefits} onChange={v => setFormData(prev => ({ ...prev, benefits: v }))} options={benefitsList.map(b => ({ value: b, label: b }))} />
            <Select mode="multiple" style={{ width: "100%" }} placeholder="Skills" value={formData.skills} onChange={v => setFormData(prev => ({ ...prev, skills: v }))}>
              {skillData?.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
            </Select>
          </div>

          {/* Application & Options */}
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <select name="apply_on" value={formData.apply_on} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2">
              <option value="">Application Received</option>
              <option value="app">On Platform</option>
              <option value="email">Email</option>
              <option value="custom_url">Custom URL</option>
            </select>
            <div className="flex gap-6">
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.highlight} onChange={e => setFormData(prev => ({ ...prev, highlight: e.target.checked }))} /> Highlight</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.featured} onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))} /> Featured</label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description*</label>
            <ReactQuillEditor value={formData.description} onChange={v => setFormData(prev => ({ ...prev, description: v }))} modules={{ toolbar: true }} theme="snow" className="h-60 mb-9" />
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-semibold transition">
            {loading ? "Updating..." : "Update Job"}
          </button>
        </form>
      </div>
    </main>
  );
}
