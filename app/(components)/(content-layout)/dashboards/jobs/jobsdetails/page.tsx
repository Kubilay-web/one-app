"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "react-quill/dist/quill.snow.css";
import { Select, DatePicker } from "antd";
import moment from "moment";
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
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const { Option } = Select;

const ReactQuillEditor = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

const benefitsList = [
  "Job",
  "Career",
  "Employment",
  "Opportunity",
  "Vacancy",
  "Position",
  "Work",
  "Recruitment",
  "Hiring",
  "Interview",
  "Resume",
  "Salary",
  "Benefits",
  "Skills",
  "Experience",
  "Job search",
  "Job market",
  "Job application",
  "Job satisfaction",
  "Professional development",
];

export default function Jobs({ searchParams }) {
  const router = useRouter();
  const id = searchParams?.id;
  const [formData, setFormData] = useState({
    title: "",
    deadline: "",
    vacancies: "",
    companyId: "",
    jobCategoryId: "",
    countryId: "",
    stateId: "",
    cityId: "",
    address: "",
    isSalaryRange: true,
    minSalary: 0,
    maxSalary: 0,
    customSalary: 0,
    salaryTypeId: "",
    jobExperienceId: "",
    jobRoleId: "",
    educationId: "",
    jobTypeId: "",
    tags: [],
    benefits: [],
    skills: [],
    apply_on: "",
    highlight: false,
    featured: false,
    description: "",
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
          fetchJobexperiencePublic(),
          fetchJobcategoriesPublic(),
          fetchCountriesPublic(),
          fetchSalarytypesPublic(),
          fetchJobrolePublic(),
          fetchJobtypesPublic(),
          fetchEducationPublic(),
          fetchTagsPublic(),
          fetchSkillsPublic(),
          fetchCompanies(),
        ]);

        if (id) {
          await fetchJobDetails();
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load initial data");
      }
    };

    fetchInitialData();
  }, [id]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/selectcompany`,
      );
      const data = await response.json();
      if (response.ok) {
        setAllCompanies(data);
      } else {
        toast.error(data.err || "Failed to fetch companies");
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to fetch companies");
    }
  };

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/jobdetails/${id}`,
      );
      const data = await response.json();

      if (response.ok) {
        const job = data.job;
        setFormData({
          title: job?.title || "",
          deadline: job?.deadline ? moment(job.deadline) : "",
          vacancies: job?.vacancies || "",
          companyId: job?.companyId || "",
          jobCategoryId: job?.jobCategoryId || "",
          countryId: job?.countryId || "",
          stateId: job?.stateId || "",
          cityId: job?.cityId || "",
          address: job?.address || "",
          isSalaryRange: job?.salary_mode === "range",
          minSalary: job?.min_salary || 0,
          maxSalary: job?.max_salary || 0,
          customSalary: job?.custom_salary || 0,
          salaryTypeId: job?.salaryTypeId || "",
          jobExperienceId: job?.jobExperienceId || "",
          jobRoleId: job?.jobRoleId || "",
          educationId: job?.educationId || "",
          jobTypeId: job?.jobTypeId || "",
          tags: data?.jobTag?.tagId ? [data.jobTag.tagId] : [],
          skills: data?.jobSkills?.skillId ? [data.jobSkills.skillId] : [],
          benefits: data?.benefits?.name || [],
          apply_on: job?.apply_on || "",
          highlight: job?.highlight || false,
          featured: job?.featured || false,
          description: job?.description || "",
        });

        // Fetch states and cities if country and state are selected
        if (job?.countryId) {
          setSelectedCountryId(job.countryId);
          await fetchStatesPublic();
        }
        if (job?.stateId) {
          setSelectedStateId(job.stateId);
          await fetchCitiesPublic();
        }
      } else {
        toast.error(data.err || "Failed to fetch job details");
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      toast.error("Failed to fetch job details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, deadline: date }));
  };

  const handleCountryChange = async (e) => {
    const countryId = e.target.value;
    setFormData((prev) => ({ ...prev, countryId, stateId: "", cityId: "" }));
    setSelectedCountryId(countryId);
    await fetchStatesPublic();
  };

  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    setFormData((prev) => ({ ...prev, stateId, cityId: "" }));
    setSelectedStateId(stateId);
    await fetchCitiesPublic();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      const requiredFields = [
        "title",
        "deadline",
        "vacancies",
        "companyId",
        "jobCategoryId",
        "countryId",
        "stateId",
        "cityId",
        "address",
        "description",
        "salaryTypeId",
        "jobExperienceId",
        "jobRoleId",
        "jobTypeId",
        "apply_on",
      ];

      const missingFields = requiredFields.filter((field) => !formData[field]);
      if (missingFields.length > 0) {
        toast.error(
          `Please fill all required fields: ${missingFields.join(", ")}`,
        );
        setLoading(false);
        return;
      }

      if (
        formData.isSalaryRange &&
        (!formData.minSalary || !formData.maxSalary)
      ) {
        toast.error("Please provide both minimum and maximum salary");
        setLoading(false);
        return;
      }

      if (!formData.isSalaryRange && !formData.customSalary) {
        toast.error("Please provide custom salary");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/jobs/create/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            deadline: formData.deadline
              ? moment(formData.deadline).toISOString()
              : null,
            minSalary: parseInt(formData.minSalary),
            maxSalary: parseInt(formData.maxSalary),
            customSalary: parseInt(formData.customSalary),
            salary_mode: formData.isSalaryRange ? "range" : "custom",
          }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Job updated successfully", {
          duration: 2000,
          position: "top-center",
        });
        setTimeout(() => {
          router.push("/dashboard/job/admin/alljobs");
        }, 2000);
      } else {
        toast.error(data.err || "Failed to update job");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Failed to update job");
      setLoading(false);
    }
  };

  // removed bootstrap imports to keep Tailwind-only styling

  return (
    <main className="py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8">
          <h6 className="text-lg font-semibold text-gray-800 mb-6">Job details</h6>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Job Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Category*</label>
                <select
                  name="jobCategoryId"
                  value={formData.jobCategoryId}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Job Category</option>
                  {jobcategories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company*</label>
                <select
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Company</option>
                  {allCompanies?.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deadline*</label>
                <DatePicker
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleDateChange}
                  className="w-full rounded-md"
                  style={{ width: "100%" }}
                />
              </div>

              {/* Vacancies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vacancies*</label>
                <input
                  type="text"
                  name="vacancies"
                  value={formData.vacancies}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Location Section */}
            <div>
              <h6 className="text-md font-medium text-gray-800">Location</h6>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country*</label>
                  <select
                    name="countryId"
                    value={formData.countryId}
                    onChange={handleCountryChange}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Country</option>
                    {countries?.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State*</label>
                  <select
                    name="stateId"
                    value={formData.stateId}
                    onChange={handleStateChange}
                    className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${!formData.countryId ? 'opacity-60 cursor-not-allowed' : ''}`}
                    required
                    disabled={!formData.countryId}
                  >
                    <option value="">Select State</option>
                    {states?.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.statename}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City*</label>
                  <select
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleChange}
                    className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${!formData.stateId ? 'opacity-60 cursor-not-allowed' : ''}`}
                    required
                    disabled={!formData.stateId}
                  >
                    <option value="">Select City</option>
                    {cities?.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Address */}
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address*</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Salary Section */}
            <div>
              <h6 className="text-md font-medium text-gray-800">Salary Details</h6>
              <div className="mt-3">
                <div className="flex gap-4 items-center mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      className="h-4 w-4"
                      id="salaryRange"
                      checked={formData.isSalaryRange}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          isSalaryRange: true,
                        }))
                      }
                    />
                    <span className="text-sm text-gray-700">Salary Range</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      className="h-4 w-4"
                      id="customSalary"
                      checked={!formData.isSalaryRange}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          isSalaryRange: false,
                        }))
                      }
                    />
                    <span className="text-sm text-gray-700">Custom Salary</span>
                  </label>
                </div>

                {formData.isSalaryRange ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Salary*</label>
                      <input
                        type="number"
                        name="minSalary"
                        value={formData.minSalary}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Salary*</label>
                      <input
                        type="number"
                        name="maxSalary"
                        value={formData.maxSalary}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Custom Salary*</label>
                    <input
                      type="number"
                      name="customSalary"
                      value={formData.customSalary}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                )}

                {/* Salary Type */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary Type*</label>
                  <select
                    name="salaryTypeId"
                    value={formData.salaryTypeId}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Salary Type</option>
                    {salarytypes?.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Attributes Section */}
            <div>
              <h6 className="text-md font-medium text-gray-800">Attributes</h6>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience*</label>
                  <select
                    name="jobExperienceId"
                    value={formData.jobExperienceId}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Experience</option>
                    {jobexperience?.map((exp) => (
                      <option key={exp.id} value={exp.id}>
                        {exp.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Role*</label>
                  <select
                    name="jobRoleId"
                    value={formData.jobRoleId}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Job Role</option>
                    {jobrole?.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Education */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Education*</label>
                  <select
                    name="educationId"
                    value={formData.educationId}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Education</option>
                    {educations?.map((edu) => (
                      <option key={edu.id} value={edu.id}>
                        {edu.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type*</label>
                  <select
                    name="jobTypeId"
                    value={formData.jobTypeId}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Job Type</option>
                    {jobtypes?.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <Select
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder="Select Tags"
                    value={formData.tags}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, tags: value }))
                    }
                  >
                    {tags?.map((tag) => (
                      <Option key={tag.id} value={tag.id}>
                        {tag.name}
                      </Option>
                    ))}
                  </Select>
                </div>

                {/* Benefits */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                  <Select
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder="Select Benefits"
                    value={formData.benefits}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        benefits: value,
                      }))
                    }
                    options={benefitsList.map((benefit) => ({
                      value: benefit,
                      label: benefit,
                    }))}
                  >
                    {benefitsList.map((benefit) => (
                      <Option key={benefit} value={benefit}>
                        {benefit}
                      </Option>
                    ))}
                  </Select>
                </div>

                {/* Skills */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                  <Select
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder="Select Skills"
                    value={formData.skills}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, skills: value }))
                    }
                  >
                    {skillData?.map((skill) => (
                      <Option key={skill.id} value={skill.id}>
                        {skill.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {/* Application Section */}
            <div>
              <h6 className="text-md font-medium text-gray-800">Application Details</h6>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Application Received*</label>
                <select
                  name="apply_on"
                  value={formData.apply_on}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Option</option>
                  <option value="app">On Platform</option>
                  <option value="email">Email</option>
                  <option value="custom_url">Custom URL</option>
                </select>
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  id="highlight"
                  checked={formData.highlight}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, highlight: e.target.checked }))
                  }
                />
                <span className="text-sm text-gray-700">Highlight</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                  }
                />
                <span className="text-sm text-gray-700">Featured</span>
              </label>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description*</label>
              <div className="bg-white border border-gray-200 rounded-md min-h-[220px]">
                <ReactQuillEditor
                  value={formData.description}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, description: value }))
                  }
                  modules={{ toolbar: true }}
                  theme="snow"
                  className="quill-editor min-h-[200px]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md px-6 py-2 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Job"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
