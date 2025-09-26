"use client";
import { useState, useEffect } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaGraduationCap,
  FaMoneyBillWave,
  FaAddressCard,
} from "react-icons/fa";
import { MdDateRange, MdMoreTime, MdWork } from "react-icons/md";
import { ShareSocial } from "react-share-social";
import { IoFileTrayFullSharp } from "react-icons/io5";
import { TbCategoryPlus } from "react-icons/tb";
import { GrUserExpert } from "react-icons/gr";
import { LiaCriticalRole } from "react-icons/lia";
import Link from "next/link";
import SpkSwiperJs from "@/shared/@spk-reusable-components/spk-packages/spk-swiperjs";
import SpkBadge from "@/shared/@spk-reusable-components/uielements/spk-badge";
import SwiperComponent from "@/shared/data/apps/jobs/job-details-data";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import { useParams } from "next/navigation";

const JobDetails = () => {
const params = useParams();
const slug = params.slug;
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(null);
  const [job, setJob] = useState(null);
  const [count, setCount] = useState(0);
  const [tags, setTags] = useState([]);
  const [skills, setSkills] = useState([]);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const breakpoints = {
    320: { slidesPerView: 1, spaceBetween: 20 },
    480: { slidesPerView: 1, spaceBetween: 30 },
    640: { slidesPerView: 2, spaceBetween: 40 },
    1440: { slidesPerView: 2, spaceBetween: 40 },
  };

  useEffect(() => {
    if (!slug) return;
    fetchJobData();
    fetchJobApplyStatus();
  }, [slug]);

  useEffect(() => {
    if (typeof window !== "undefined") setUrl(window.location.href);
  }, []);

  async function fetchJobData() {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/job/${slug}`
      );
      const data = await res.json();
      console.log(data)
      if (!res.ok) {
        toast.error(data.err || "Failed to fetch job data");
      } else {
        setJob(data.job);
        setCount(data.openjobs || 0);
        setTags(data.tags || []);
        setSkills(data.skills || []);
      }
    } catch {
      toast.error("An error occurred");
    }
    setLoading(false);
  }

  async function fetchJobApplyStatus() {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/jobapplycheck/${slug}`
      );
      const data = await res.json();
      if (res.ok) setAlreadyApplied(data.alreadyexists || false);
    } catch {}
    setLoading(false);
  }

  async function handleApply() {
    if (!job?.id) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/jobapply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: job?.id }),
        }
      );
      const data = await res.json();
      if (!res.ok) toast.error(data.err || "Failed to apply");
      else {
        toast.success("Applied successfully");
        setAlreadyApplied(true);
      }
    } catch {
      toast.error("An error occurred");
    }
    setLoading(false);
  }

  //   if (loading || !job) {
  //     return (
  //       <div className="mx-auto my-10 max-w-5xl p-10 text-center">
  //         <Skeleton active />
  //       </div>
  //     );
  //   }

  return (
    <>
      {/* <!-- Page Header --> */}
      <Seo title="Job Details" />
      <Pageheader
        Heading="Job Details"
        breadcrumbs={["Apps", "Jobs"]}
        currentpage="Job Details"
      />
      {/* <!-- Page Header Close --> */}

      {/* <!-- Start::row-1 --> */}
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xl:col-span-8 col-span-12">
          <div className="box">
            <div className="box-body">
              <div className="flex flex-wrap items-top justify-between gap-2">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <div>
                      <span className="avatar avatar-rounded avatar-lg">
                        <Image
                          src={
                           job?.company?.logoSecureUrl ||
                            "/assets/images/company-logos/8.png"
                        
                          }
                          width={50}
                          height={50}
                          alt={job?.company?.name ?? "Company"}
                        />
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium mb-0 flex items-center">
                        <Link scroll={false} href="#!">
                          {job?.title || "UI Developer - Fresher"}
                        </Link>
                      </h4>
                      <Link scroll={false} href="#!" className="font-medium">
                        <i className="bi bi-building"></i>{" "}
                        {job?.company?.name ||
                          "Spruko Technologies PRIVATE LIMITED"}
                      </Link>
                      <div className="flex text-[0.875rem] mt-4">
                        <div>
                          <p className="mb-1">
                            <i className="bi bi-geo-alt me-1"></i>
                            {job?.city?.name || "Banglore"},{" "}
                            {job?.state?.statename || "Karnataka"}
                          </p>
                          <p>
                            <i className="bi bi-briefcase me-1"></i>
                            {job?.job_experience?.name || "1 - 3+ years"}{" "}
                            Experience
                          </p>
                        </div>
                        <div className="ms-4">
                          <p className="mb-1">
                            <i className="bi bi-coin me-1"></i>
                            <span className="font-medium">
                              {job?.min_salary || "10,000"} -{" "}
                              {job?.max_salary || "20,000"}
                            </span>{" "}
                            / per month{" "}
                            {job?.custom_salary
                              ? `(+${job?.custom_salary} incentives)`
                              : "(+incentives)"}
                          </p>
                          <p>
                            <i className="bi bi-mortarboard me-1"></i>
                            {job?.education?.name || "Graduate"} and Above
                          </p>
                        </div>
                      </div>
                      <div className="popular-tags mt-4">
                        <SpkBadge
                          variant="info/[0.15]"
                          customClass="!rounded-full text-info me-1"
                        >
                          <i className="bi bi-clock me-1"></i>
                          {job?.job_type?.name || "Full Time"}
                        </SpkBadge>
                        <SpkBadge
                          variant="danger/[0.15]"
                          customClass="!rounded-full text-danger"
                        >
                          <i className="bi bi-briefcase me-1"></i>
                          {job?.vacancies || "13"} Openings
                        </SpkBadge>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="btn-list mb-2">
                    {!alreadyApplied ? (
                      <button
                        onClick={handleApply}
                        disabled={loading}
                        className="ti-btn ti-btn-primary me-2"
                      >
                        Apply Now
                      </button>
                    ) : (
                      <span className="ti-btn ti-btn-primary me-2 cursor-default">
                        Applied
                      </span>
                    )}
                    <Link
                      scroll={false}
                      href="#!"
                      className="ti-btn ti-btn-icon ti-btn-soft-primary btn-wave me-2"
                    >
                      <i className="ri-heart-line"></i>
                    </Link>
                    <Link
                      scroll={false}
                      href="#!"
                      className="ti-btn ti-btn-icon ti-btn-soft-primary btn-wave"
                    >
                      <i className="ri-share-line"></i>
                    </Link>
                  </div>
                  {job?.deadline && (
                    <p className="mb-0">
                      <i
                        className="bi bi-info-circle text-danger"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title={`${Math.ceil((new Date(job?.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days left`}
                      ></i>
                      <span className="font-medium">
                        {Math.ceil(
                          (new Date(job?.deadline) - new Date()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        days left
                      </span>{" "}
                      to apply this job
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="box">
            <div className="box-body">
              <div className="box-body">
                <h5 className="font-medium">Job Description</h5>
                <p className="opacity-90 pb-4">
                  {job?.description ||
                    "Est amet sit vero sanctus labore no sed ipsum ipsum nonumy. Sit ipsum sanctus ea magna est. Aliquyam sed amet. Kasd diam rebum sit ipsum ipsum erat et kasd.Est amet sit vero sanctus labore no sed ipsum ipsum nonumy vero sanctus labore.A officiis optio temporibus minima facilis..."}
                </p>

                {job?.Job_benfits && job?.Job_benfits.length > 0 && (
                  <>
                    <h5 className="font-medium">Key Responsibilities</h5>
                    <ol className="ti-list-group !border-0 ti-list-unstyled list-decimal mb-4 ps-[2rem]">
                      {job?.Job_benfits.map((benefit, index) => (
                        <li
                          key={index}
                          className="ti-list-group-item !border-0 !py-1"
                        >
                          {benefit.benfit.name}
                        </li>
                      ))}
                    </ol>
                  </>
                )}

                <h5 className="font-medium">Requirements</h5>
                <ol className="ti-list-group !border-0 ti-list-unstyled list-decimal mb-4 ps-[2rem]">
                  <li className="ti-list-group-item !border-0 !py-1">
                    Design thoughtful, beautiful, and useful software user
                    interfaces and experiences in a team environment..
                  </li>
                  <li className="ti-list-group-item !border-0 !py-1">
                    Create user-centered designs by considering market analysis,
                    customer feedback, site metrics, and usability findings.
                  </li>
                  <li className="ti-list-group-item !border-0 !py-1">
                    Work with stakeholders to plan projects for effective
                    delivery while maintaining high standards for design..
                  </li>
                  <li className="ti-list-group-item !border-0 !py-1">
                    Be a passionate and effective advocate for design with
                    non-design audiences..
                  </li>
                  <li className="ti-list-group-item !border-0 !py-1">
                    Use business requirements, user and market research to
                    assist in developing scenarios, use cases, and high-level
                    requirements..
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="box border !bg-primary/[0.15] shadow-none">
            <div className="box-body">
              <div className="grid grid-cols-12 sm:gap-x-6 items-center">
                <div className="lg:col-span-6 col-span-12">
                  <h5 className="font-medium mb-0">
                    &#128400; Was this job fit for someone?
                  </h5>
                </div>
                {/* <div className="lg:col-span-6 col-span-12 text-end">
                  <ShareSocial
                    url={url}
                    style={{ display: "inline-flex" }}
                    socialTypes={["facebook", "twitter", "linkedin", "email"]}
                  />
                </div> */}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-x-6">
            <div className="xl:col-span-12 col-span-12">
              <h4 className="font-medium mb-0">Related Jobs</h4>
              <p className="mb-4">
                Sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua
              </p>
              <SpkSwiperJs
                spaceBetween={30}
                slidesPerView={2}
                slides={SwiperComponent}
                breakpoint={breakpoints}
                navigation={true}
                autoplay={true}
                className="swiper-related-jobs swiper-initialized swiper-horizontal swiper-pointer-events swiper-backface-hidden"
              />
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 col-span-12">
          <div className="box">
            <div className="box-header">
              <div className="box-title">Job Highlights</div>
            </div>
            <div className="box-body">
              <div className="grid grid-cols-12 gap-x-6 gap-y-[3rem]">
                <div className="xxl:col-span-6 xl:col-span-12 md:col-span-6 col-span-12">
                  <p className="text-[0.875rem] mb-4 flex items-center">
                    <span className="avatar avatar-sm border leading-none avatar-rounded me-2 bg-light text-default border-defaultborder dark:border-defaultborder/10">
                      <i className="ri-time-line text-[0.875rem]"></i>
                    </span>
                    09:30 AM - 06:00 PM
                  </p>
                  <p className="text-[0.875rem] mb-0 flex items-center">
                    <span className="avatar avatar-sm border leading-none avatar-rounded me-2 bg-light text-default border-defaultborder dark:border-defaultborder/10">
                      <i className="bi bi-mortarboard text-[0.875rem]"></i>
                    </span>
                    {job?.education?.name || "Graduate"} and Above
                  </p>
                </div>
                <div className="xxl:col-span-6 xl:col-span-12 md:col-span-6 col-span-12">
                  <p className="text-[0.875rem] mb-4 flex items-center">
                    <span className="avatar avatar-sm border leading-none avatar-rounded me-2 bg-light text-default border-defaultborder dark:border-defaultborder/10">
                      <i className="bi bi-calendar text-[0.875rem]"></i>
                    </span>
                    5 Working Days
                  </p>
                  <p className="text-[0.875rem] mb-0 flex items-center">
                    <span className="avatar avatar-sm border leading-none avatar-rounded me-2 bg-light text-default border-defaultborder dark:border-defaultborder/10">
                      <i className="bi bi-person-check text-[0.875rem]"></i>
                    </span>
                    Bachelors Preferred
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="box border overflow-hidden">
            <div className="box-header justify-between">
              <div className="box-title">Similar Jobs</div>
              <Link
                scroll={false}
                href="#!"
                className="text-primary font-medium text-[0.8125rem]"
              >
                View All <i className="fe fe-arrow-right"></i>
              </Link>
            </div>
            <div className="box-body !p-0">
              <ul className="ti-list-group ti-list-group-flush">
                <li className="ti-list-group-item mb-2">
                  <div className="sm:flex">
                    <span className="avatar avatar-md avatar-rounded bg-primary/10 border border-defaultborder dark:border-defaultborder/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-primary text-primary"
                        data-name="Layer 1"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="var(--primary-color)"
                          d="M11.103,10.43793a1.78593,1.78593,0,1,0,2.43957.65362A1.786,1.786,0,0,0,11.103,10.43793Zm8.0047,1.93768q-.17587-.201-.37116-.40308.13641-.14337.264-.28649c1.60583-1.80427,2.28357-3.61371,1.65558-4.70154-.60217-1.043-2.39343-1.35382-4.63593-.91779q-.33132.06482-.659.14624-.06272-.21624-.13343-.43C14.467,3.49042,13.2381,1.99921,11.98206,2,10.77765,2.00055,9.61359,3.39709,8.871,5.5575q-.10959.31969-.20276.64471-.21908-.05375-.44-.0993c-2.366-.48578-4.27167-.16584-4.89844.9226-.601,1.04376.02753,2.74982,1.52851,4.47211q.22329.25562.45922.49976c-.18542.191-.361.38189-.52465.57171-1.4646,1.698-2.05719,3.37616-1.45716,4.41541.61969,1.07348,2.49854,1.42437,4.7854.97436q.278-.05511.55292-.124.10071.35156.22095.697c.73932,2.11706,1.89685,3.46863,3.097,3.4682,1.23944-.00073,2.48194-1.45288,3.23474-3.65875.05945-.17432.11573-.35535.16907-.54175q.35514.08835.71485.1568c2.20336.41687,3.95251.089,4.55145-.951C21.28058,15.93109,20.64288,14.12933,19.10767,12.37561ZM4.07019,7.45184c.38586-.67,1.94324-.93139,3.98608-.512q.19584.04027.39838.09a20.464,20.464,0,0,0-.42126,2.67767,20.88659,20.88659,0,0,0-2.10389,1.6936q-.21945-.22695-.42718-.4649l.00006.00006C4.21631,9.46057,3.708,8.08081,4.07019,7.45184Zm3.88666,5.72809c-.51056-.3866-.98505-.78265-1.41571-1.181.43036-.39587.90515-.79059,1.41467-1.17615q-.02746.58915-.02722,1.1792Q7.929,12.59117,7.95685,13.17993Zm-.00061,3.94061a7.23675,7.23675,0,0,1-2.63971.09314,1.766,1.766,0,0,1-1.241-.65631c-.36407-.63067.11176-1.978,1.36432-3.43023q.23621-.273.48791-.53174a20.49026,20.49026,0,0,0,2.10712,1.70007,20.80226,20.80226,0,0,0,.42621,2.712Q8.21011,17.07023,7.95624,17.12054Zm7.10113-8.03936q-.50309-.317-1.01861-.61365-.5073-.292-1.0268-.56207c.593-.24933,1.17591-.46228,1.73865-.63581A18.21775,18.21775,0,0,1,15.05737,9.08118ZM9.679,5.83521c.63623-1.85114,1.57763-2.98053,2.30352-2.98084.77308-.00037,1.77753,1.21826,2.43433,3.19763q.064.19355.121.38928a20.478,20.478,0,0,0-2.52716.9712,20.06145,20.06145,0,0,0-2.519-.98194Q9.578,6.13062,9.679,5.83521ZM9.27863,7.259a18.30717,18.30717,0,0,1,1.72967.642Q9.95746,8.4433,8.96094,9.0824C9.0412,8.4444,9.148,7.83313,9.27863,7.259ZM8.9624,14.91968q.49695.31813,1.00843.61273.52174.30039,1.05737.57556a18.19577,18.19577,0,0,1-1.74445.66492C9.15161,16.1908,9.04364,15.56879,8.9624,14.91968Zm5.45569,3.14551A7.23556,7.23556,0,0,1,13.18,20.39844l-.00006.00006a1.76585,1.76585,0,0,1-1.18841.747c-.72821.00042-1.65766-1.085-2.28992-2.89545q-.11169-.32108-.20551-.648a20.10863,20.10863,0,0,0,2.52918-1.0097,20.79976,20.79976,0,0,0,2.54736.97851Q14.50141,17.81983,14.41809,18.06519Zm.36224-1.32422c-.56921-.176-1.16058-.39252-1.76214-.64551q.50867-.2677,1.02472-.56543.52955-.30579,1.0321-.62689A18.1524,18.1524,0,0,1,14.78033,16.741Zm.44629-4.74268q.00111.91095-.05688,1.82044c-.49268.33343-1.01282.659-1.554.97143-.53894.31116-1.07293.59711-1.59674.8559q-.82682-.39624-1.62176-.854-.79047-.455-1.54468-.969-.06894-.90921-.06946-1.82172l.00012.00019q-.00063-.91187.06794-1.82184c.49255-.33637,1.00891-.66168,1.54278-.96991.53632-.30969,1.077-.59442,1.61469-.85248q.81664.39688,1.60382.85065.78992.454,1.549.95868.06519.91443.06524,1.83166Zm.95673-5.09283c1.92133-.37372,3.37-.12232,3.73291.50622.3866.66962-.16748,2.1485-1.55383,3.70636l-.00006.00006q-.1149.12891-.23841.25891A20.06118,20.06118,0,0,0,15.98,9.68915a20.04054,20.04054,0,0,0-.40546-2.64893Q15.88486,6.96387,16.18335,6.90546Zm-.12988,3.8847A18.16447,18.16447,0,0,1,17.51483,11.978a18.11912,18.11912,0,0,1-1.45672,1.20831q.02325-.59391.02288-1.18842Q16.08072,11.39389,16.05347,10.79016Zm3.8681,5.78876c-.36346.63116-1.76788.89435-3.65222.53784q-.32391-.06115-.66474-.14557a20.069,20.069,0,0,0,.38746-2.68176,19.93914,19.93914,0,0,0,2.13708-1.71588q.17643.18329.33563.36487v-.00007a7.23437,7.23437,0,0,1,1.40308,2.23792A1.76563,1.76563,0,0,1,19.92157,16.57892Z"
                        ></path>
                      </svg>
                    </span>
                    <div className="ms-3 flex-grow">
                      <p className="font-medium text-[0.8125rem] mb-1">
                        <Link scroll={false} href="#!">
                          {" "}
                          React Lead Developer
                        </Link>
                      </p>
                      <p className="mb-0 me-3">
                        <i className="bi bi-building text-textmuted dark:text-textmuted/50"></i>{" "}
                        Infratech PVT LTD
                      </p>
                    </div>
                  </div>
                </li>
                {/* Diğer benzer iş ilanları buraya eklenebilir */}
              </ul>
            </div>
          </div>

          <div className="box border">
            <div className="box-header justify-between">
              <div className="box-title">Contact Information</div>
            </div>
            <div className="box-body">
              <div className="space-y-3 text-gray-700">
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-lg text-blue-600" />
                  {job?.address}, {job?.city?.name}, {job?.state?.statename}{" "}
                  {job?.country?.name}
                </p>
                <p className="flex items-center gap-2">
                  <FaPhoneAlt className="text-lg text-blue-600" />
                  {job?.company?.phone || "Phone not available"}
                </p>
                <p className="flex items-center gap-2">
                  <FaEnvelope className="text-lg text-blue-600" />
                  {job?.company?.email || "Email not available"}
                </p>
                <p className="flex items-center gap-2">
                  <MdDateRange className="text-lg text-blue-600" />
                  Published: {moment(job?.createdAt).format("DD MMM YYYY")}
                </p>
                {job?.deadline && (
                  <p className="flex items-center gap-2">
                    <MdDateRange className="text-lg text-blue-600" />
                    Deadline: {moment(job?.deadline).format("DD MMM YYYY")}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="box">
            <div className="box-body">
              <div className="">
                <h5 className="font-medium mb-4">Get Latest Job Alerts</h5>
                <p className="mb-4">
                  Latest jobs updates on the go to received direct to your
                  email. Stay updated with your latest new jobs.
                </p>
                <div className="input-group mb-4">
                  <input
                    type="text"
                    className="form-control !border-s"
                    placeholder="Email Here"
                    aria-label="blog-email"
                    aria-describedby="blog-subscribe"
                  />
                  <button
                    className="ti-btn ti-btn-primary !m-0"
                    type="button"
                    id="blog-subscribe"
                  >
                    Subscribe
                  </button>
                </div>
                <label className="form-check-label">
                  By Subscribing you accept to{" "}
                  <Link scroll={false} href="#!" className="text-success">
                    <u>privacy policy</u>
                  </Link>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- End::row-1 --> */}
    </>
  );
};

export default JobDetails;
