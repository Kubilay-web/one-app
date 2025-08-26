"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const SpkSelect = dynamic(
  () =>
    import("@/shared/@spk-reusable-components/spk-packages/spk-reactselect"),
  { ssr: false }
);
import SpkBadge from "@/shared/@spk-reusable-components/uielements/spk-badge";
import SpkDropdown from "@/shared/@spk-reusable-components/uielements/spk-dropdown";
import SpkOverlay from "@/shared/@spk-reusable-components/uielements/spk-overlay";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { useSearchParams } from "next/navigation";

const SearchCompany = () => {
  const searchParams = useSearchParams(); // <- hook ile searchParams alındı

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    industryTypeId: [],
    organizationTypeId: [],
    countryId: [],
    stateId: [],
    cityId: [],
    companySize: [],
    recruiterType: [],
    jobVacancies: [],
    employmentType: [],
  });
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      const current = prev[filterType];
      if (current.includes(value)) {
        return { ...prev, [filterType]: current.filter((v) => v !== value) };
      } else {
        return { ...prev, [filterType]: [...current, value] };
      }
    });
  };

  useEffect(() => {
    const getCompanies = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();

        Object.entries(filters).forEach(([key, values]) =>
          values.forEach((v) => query.append(key, v))
        );

        if (keyword) query.append("keyword", keyword);
        if (category && category !== "all") query.append("category", category);

        // searchParams'den değerleri al
        const industryid = searchParams.get("industryid") || "";
        const organizationid = searchParams.get("organizationid") || "";
        const countryid = searchParams.get("countryid") || "";
        const stateid = searchParams.get("stateid") || "";
        const cityid = searchParams.get("cityid") || "";

        if (industryid) query.append("industry_type_id", industryid);
        if (organizationid)
          query.append("organization_type_id", organizationid);
        if (countryid) query.append("country_id", countryid);
        if (stateid) query.append("state_id", stateid);
        if (cityid) query.append("city_id", cityid);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/companyfilters?${query.toString()}`
        );
        if (!response.ok) throw new Error("Fetch error");
        const data = await response.json();
        setCompanies(data);
      } catch (err) {
        console.error(err);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    getCompanies();
  }, [filters, keyword, category, searchParams]);

  const categories = [
    { value: "all", label: "All categories" },
    { value: "it", label: "Information Technology" },
    { value: "finance", label: "Finance" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
  ];

  return (
    <Fragment>
      <Seo title="Search Company" />
      <Pageheader
        Heading="Search Company"
        breadcrumbs={["Apps", "Jobs"]}
        currentpage="Search Company"
      />

      <div className="container">
        <div className="grid grid-cols-12 gap-x-6">
          {/* Filters */}
          <div className="xxl:col-span-4 lg:col-span-12 col-span-12">
            <div className="box custom-box products-navigation-box">
              <div className="box-body !p-0">
                {/* Industry Filter */}
                <div className="p-6 border-b dark:border-defaultborder/10">
                  <h6 className="font-semibold mb-0">Sektör Türü</h6>
                  <div className="px-0 py-4 pb-0">
                    {[
                      {
                        value: "rd",
                        label: "Araştırma & Geliştirme",
                        count: 2712,
                      },
                      { value: "accounting", label: "Muhasebe", count: 536 },
                    ].map((item) => (
                      <div
                        key={item.value}
                        className="form-check !flex items-center !mb-2"
                      >
                        <input
                          type="checkbox"
                          className="form-check-input me-2"
                          checked={filters.industryTypeId.includes(item.value)}
                          onChange={() =>
                            handleFilterChange("industryTypeId", item.value)
                          }
                        />
                        <label className="form-check-label">{item.label}</label>
                        <SpkBadge
                          variant="light"
                          customClass="text-defaulttextcolor float-end ms-auto"
                        >
                          {item.count}
                        </SpkBadge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div className="p-6 border-b dark:border-defaultborder/10">
                  <h6 className="font-semibold mb-0">Konum</h6>
                  <div className="px-0 py-4 pb-0">
                    {[
                      { value: "hyderabad", label: "Hyderabad", count: 512 },
                      { value: "banglore", label: "Banglore", count: 2186 },
                    ].map((item) => (
                      <div
                        key={item.value}
                        className="form-check !flex items-center !mb-2"
                      >
                        <input
                          type="checkbox"
                          className="form-check-input me-2"
                          checked={filters.cityId.includes(item.value)}
                          onChange={() =>
                            handleFilterChange("cityId", item.value)
                          }
                        />
                        <label className="form-check-label">{item.label}</label>
                        <SpkBadge
                          variant="light"
                          customClass="text-default float-end ms-auto"
                        >
                          {item.count}
                        </SpkBadge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Company Size Filter */}
                <div className="p-6 border-b dark:border-defaultborder/10">
                  <h6 className="font-semibold mb-0">Şirket Büyüklüğü</h6>
                  <div className="px-2 py-3 pb-0">
                    {[
                      { value: "0-50", label: "0-50", count: 145 },
                      { value: "50-100", label: "50-100", count: 432 },
                    ].map((item) => (
                      <div
                        key={item.value}
                        className="form-check !flex items-center !mb-2"
                      >
                        <input
                          type="checkbox"
                          className="form-check-input me-2"
                          checked={filters.companySize.includes(item.value)}
                          onChange={() =>
                            handleFilterChange("companySize", item.value)
                          }
                        />
                        <label className="form-check-label">{item.label}</label>
                        <SpkBadge
                          variant="light"
                          customClass="text-default float-end ms-auto"
                        >
                          {item.count}
                        </SpkBadge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company List */}
          <div className="xxl:col-span-8 lg:col-span-12 col-span-12">
            <div className="grid grid-cols-12 gap-x-6 align-center mb-4">
              <div className="lg:col-span-12 col-span-12">
                <div className="inline-flex !w-full companies-search-input mb-6 lg:!flex-nowrap flex-wrap">
                  <input
                    type="text"
                    className="form-control !w-auto form-control-lg flex-grow !rounded-e-none"
                    placeholder="Anahtar kelime girin"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <SpkSelect
                    classNameprefix="Select2"
                    mainClass="rounded-0 custom-select"
                    name="form-field-name"
                    option={categories}
                    placeholder="Tüm kategoriler"
                    value={category}
                    onChange={(selected) => setCategory(selected.value)}
                  />
                </div>
              </div>

              {loading ? (
                <div className="col-span-12 text-center py-8">
                  Yükleniyor...
                </div>
              ) : companies.length > 0 ? (
                companies.map((company) => (
                  <div key={company.id} className="xl:col-span-6 col-span-12">
                    <div className="box">
                      <div className="box-body flex items-center gap-3">
                        <Image
                          src={
                            company.logoSecureUrl ||
                            "/assets/images/company-logos/default-company.png"
                          }
                          alt={company.name}
                          width={64}
                          height={64}
                        />
                        <div>
                          <Link href={`/company/${company.slug}`}>
                            <h5>{company.name}</h5>
                          </Link>
                          <p>{company.city?.name || "Lokasyon bilgisi yok"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-12 text-center py-8">
                  <h5>Şirket bulunamadı</h5>
                  <p>Arama kriterlerinize uygun şirket bulunamadı.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SearchCompany;
