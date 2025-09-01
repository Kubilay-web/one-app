"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { Select } from "antd";
import { DatePicker } from "antd";
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

const ReactQuillEditor = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

const ben = [
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

export default function Jobs() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [totalVacancies, setTotalVacancies] = useState("");
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [selectedJobCategory, setSelectedJobCategory] = useState("");
  const [allcompany, setAllcompany] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [address, setAddress] = useState("");
  const [isSalaryRange, setIsSalaryRange] = useState(true);
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [customSalary, setCustomSalary] = useState("");
  const [selectedSalaryType, setSelectedSalaryType] = useState("");
  const [experience, setExperience] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [education, setEducation] = useState("");
  const [jobType, setJobType] = useState("");
  const [tags, setTags] = useState([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [skills, setSkills] = useState([]);
  const [applicationReceived, setApplicationReceived] = useState("");
  const [highlight, setHighlight] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  // Zustand stores
  const { countries, fetchCountriesPublic } = useCountryStore();
  const { states, fetchStatesPublic, setStates } = useStateStore();
  const { cities, fetchCitiesPublic, setCities } = useCityStore();
  const { jobcategories, fetchJobcategoriesPublic } = useJobcategoryStore();
  const { educations, fetchEducationPublic } = useEducationStore();
  const { jobrole, fetchJobrolePublic } = useJobroleStore();
  const { jobtypes, fetchJobtypesPublic } = useJobtypeStore();
  const { jobexperience, fetchJobexperiencePublic } = useJobexperienceStore();
  const { salarytypes, fetchSalarytypesPublic } = useSalarytypeStore();
  const { skills: allSkills, fetchSkillsPublic } = useSkillStore();
  const { tags: allTags, fetchTagsPublic } = useTagStore();

  useEffect(() => {
    fetchJobexperiencePublic();
    fetchJobcategoriesPublic();
    fetchData();
    fetchCountriesPublic();
    fetchSalarytypesPublic();
    fetchJobrolePublic();
    fetchJobtypesPublic();
    fetchEducationPublic();
    fetchTagsPublic();
    fetchSkillsPublic();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/selectcompany`,
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.err);
      } else {
        setAllcompany(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleJobCategoryChange = async (e) => {
    setSelectedJobCategory(e.target.value);
  };

  const handleSelectCompanyChange = async (e) => {
    setSelectedCompany(e.target.value);
  };

  const handleDateChange = async (value) => {
    setDeadline(value);
  };

  const handleCountryChange = async (e) => {
    try {
      const countryId = e.target.value;
      setSelectedCountry(countryId);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/state`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ countryId }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error("Failed to fetch states");
      } else {
        setStates(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStateChange = async (e) => {
    try {
      const stateId = e.target.value;
      setSelectedState(stateId);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/city`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stateId }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error("Failed to fetch cities");
      } else {
        setCities(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSalaryChange = async (e) => {
    setSelectedSalaryType(e.target.value);
  };

  const handleExperienceChange = async (e) => {
    setExperience(e.target.value);
  };

  const handleJobroleChange = async (e) => {
    setJobRole(e.target.value);
  };

  const handleJobTypeChange = async (e) => {
    setJobType(e.target.value);
  };

  const handleEducationChange = async (e) => {
    setEducation(e.target.value);
  };

  const handleTagChanges = (value) => {
    setTags(value);
  };

  const filteredTag = allTags.filter((t) =>
    t.name.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  const handleBenefitChange = (value: string[]) => {
    setBenefits(value);
  };

  const handleSkillChanges = (value) => {
    setSkills(value);
  };

  const filteredSkill = allSkills.filter((t) =>
    t.name.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const handleHighlightChange = () => {
    setHighlight(!highlight);
    if (!highlight) {
      setFeatured(false);
    }
  };

  const handleFeaturedChange = () => {
    setFeatured(!featured);
    if (!featured) {
      setHighlight(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !title ||
        !deadline ||
        !totalVacancies ||
        !selectedCompany ||
        !selectedJobCategory ||
        !selectedCountry ||
        !selectedState ||
        !selectedCity ||
        !address ||
        !description ||
        !selectedSalaryType ||
        !experience ||
        !jobRole ||
        !jobType ||
        !tags ||
        !benefits ||
        !skills ||
        !applicationReceived
      ) {
        toast.error("Please fill all the fields");
        return;
      }

      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/jobs/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            highlight,
            featured,
            deadline,
            totalVacancies,
            selectedCompany,
            selectedJobCategory,
            isSalaryRange,
            salary_mode: isSalaryRange ? "range" : "custom",
            selectedCountry,
            selectedState,
            selectedCity,
            address,
            minSalary,
            maxSalary,
            customSalary,
            selectedSalaryType,
            education,
            experience,
            jobRole,
            jobType,
            tags,
            benefits,
            skills,
            applicationReceived,
            description,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Something went wrong");
      } else {
        toast.success("Job created successfully!");
        resetForm();
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while submitting the job");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDeadline("");
    setTotalVacancies("");
    setSelectedCompany("");
    setSelectedJobCategory("");
    setSelectedCountry("");
    setSelectedState("");
    setSelectedCity("");
    setAddress("");
    setIsSalaryRange(true);
    setMinSalary("");
    setMaxSalary("");
    setCustomSalary("");
    setSelectedSalaryType("");
    setExperience("");
    setJobRole("");
    setEducation("");
    setJobType("");
    setTags([]);
    setBenefits([]);
    setSkills([]);
    setApplicationReceived("");
    setHighlight(false);
    setFeatured(false);
    setDescription("");
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Job details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter job title"
                />
              </div>

              {/* Job Category and Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Job Category
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    value={selectedJobCategory}
                    onChange={handleJobCategoryChange}
                  >
                    <option value="">Select Job Category</option>
                    {jobcategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Company</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    value={selectedCompany}
                    onChange={handleSelectCompanyChange}
                  >
                    <option value="">Select Company</option>
                    {allcompany.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Deadline and Vacancies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <DatePicker
                    placeholder="Select deadline"
                    onChange={handleDateChange}
                    value={deadline}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Vacancies</label>
                  <input
                    type="text"
                    value={totalVacancies}
                    onChange={(e) => setTotalVacancies(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Enter number of vacancies"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Location</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        value={selectedCountry}
                        onChange={handleCountryChange}
                      >
                        <option value="">Select a country</option>
                        {countries.map((country) => (
                          <option key={country.id} value={country.id}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        value={selectedState}
                        onChange={handleStateChange}
                      >
                        <option value="">Select a state</option>
                        {states.map((state) => (
                          <option key={state.id} value={state.id}>
                            {state.statename}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                      >
                        <option value="">Select a city</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      rows={3}
                      placeholder="Enter full address"
                    />
                  </div>
                </div>
              </div>

              {/* Salary Details */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Salary details</h3>
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-blue-600"
                        checked={isSalaryRange}
                        onChange={() => setIsSalaryRange(true)}
                      />
                      <span className="ml-2">Salary Range</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-blue-600"
                        checked={!isSalaryRange}
                        onChange={() => setIsSalaryRange(false)}
                      />
                      <span className="ml-2">Custom Salary</span>
                    </label>
                  </div>
                  
                  {isSalaryRange ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Salary</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          value={minSalary}
                          onChange={(e) => setMinSalary(e.target.value)}
                          placeholder="Min salary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Salary</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          value={maxSalary}
                          onChange={(e) => setMaxSalary(e.target.value)}
                          placeholder="Max salary"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Custom Salary</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        value={customSalary}
                        onChange={(e) => setCustomSalary(e.target.value)}
                        placeholder="e.g. Negotiable, Based on experience"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Salary Type</label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      value={selectedSalaryType}
                      onChange={handleSalaryChange}
                    >
                      <option value="">Select Salary Type</option>
                      {salarytypes.map((salary) => (
                        <option key={salary.id} value={salary.id}>
                          {salary.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Attribute Details */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Attribute details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      value={experience}
                      onChange={handleExperienceChange}
                    >
                      <option value="">Select Experience</option>
                      {jobexperience.map((exp) => (
                        <option key={exp.id} value={exp.id}>
                          {exp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      value={jobRole}
                      onChange={handleJobroleChange}
                    >
                      <option value="">Select Job Role</option>
                      {jobrole.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      value={education}
                      onChange={handleEducationChange}
                    >
                      <option value="">Select Education</option>
                      {educations.map((edu) => (
                        <option key={edu.id} value={edu.id}>
                          {edu.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      value={jobType}
                      onChange={handleJobTypeChange}
                    >
                      <option value="">Select Job Type</option>
                      {jobtypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Select Tags"
                    filterOption={false}
                    showSearch
                    value={tags}
                    onChange={handleTagChanges}
                    className="w-full"
                  >
                    {filteredTag.map((tag) => (
                      <Option key={tag.id} value={tag.id}>
                        {tag.name}
                      </Option>
                    ))}
                  </Select>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Select benefits"
                    filterOption={false}
                    showSearch
                    value={benefits}
                    onChange={handleBenefitChange}
                    className="w-full"
                  >
                    {ben.map((b) => (
                      <Option key={b} value={b}>
                        {b}
                      </Option>
                    ))}
                  </Select>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Select skills"
                    filterOption={false}
                    showSearch
                    value={skills}
                    onChange={handleSkillChanges}
                    className="w-full"
                  >
                    {filteredSkill.map((skill) => (
                      <Option key={skill.id} value={skill.id}>
                        {skill.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Application Details */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Application details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application Received</label>
                  <select
                    value={applicationReceived}
                    onChange={(e) => setApplicationReceived(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    <option value="">Select Option</option>
                    <option value="app">On Platform</option>
                    <option value="email">Email</option>
                    <option value="custom_url">Custom URL</option>
                  </select>
                </div>
                
                <div className="mt-4 flex space-x-6">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600 rounded"
                      checked={highlight}
                      onChange={handleHighlightChange}
                    />
                    <span className="ml-2 text-gray-700">Highlight</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600 rounded"
                      checked={featured}
                      onChange={handleFeaturedChange}
                    />
                    <span className="ml-2 text-gray-700">Featured</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-gray-200 pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">Description</label>
                <ReactQuillEditor
                  value={description}
                  onChange={handleDescriptionChange}
                  modules={{ toolbar: true }}
                  theme="snow"
                  className="h-64 mb-12"
                />
              </div>

              {/* Submit Button */}
              <div className="border-t border-gray-200 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Submit Job Details"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}