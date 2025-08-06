import React from 'react';
import SpkOverlay from '../uielements/spk-overlay';
import Link from 'next/link';

interface SpkJobdetailsProps {

	object?: any;
}



const SpkJobdetails: React.FC<SpkJobdetailsProps> = ({ object, }) => {
	return (
		<div className="grid grid-cols-12 gap-x-6">
			<div className="md:col-span-12 col-span-12">
				<div className="box featured-jobs">
					<div className="box-body">
						<div className="btn-list float-end">
							<SpkOverlay>
								<button type="button" className="hs-tooltip-toggle avatar avatar-sm avatar-rounded bg-light text-default me-1">
									<i className="bi bi-heart"></i>
									<span
										className="hs-tooltip-content  ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !font-medium !text-white shadow-sm !rounded-sm"
										role="tooltip">
										Add To Wishlist
									</span>
								</button>
							</SpkOverlay>
							<SpkOverlay>
								<button type="button" className="hs-tooltip-toggle avatar avatar-sm avatar-rounded bg-warning/[0.15] text-warning">
									<i className="bi bi-star-fill"></i>
									<span
										className="hs-tooltip-content  ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !font-medium !text-white shadow-sm !rounded-sm"
										role="tooltip">
										Featured Jobs
									</span>
								</button>
							</SpkOverlay>

						</div>
						<div className="flex mb-3 flex-wrap gap-2">
							<div>
								<span className="avatar avatar-lg avatar-rounded bg-primary/10 border text-primary border-defaultborder dark:border-defaultborder/10">
									{object.icon}
								</span>
							</div>
							<div className="ms-2">
								<h5 className="font-medium mb-0 flex items-center"><Link scroll={false} href="#!"> {object.name}</Link></h5>
								<Link scroll={false} href="#!"><i className="bi bi-building"></i> {object.company}</Link>
							</div>
						</div>
						<div className="popular-tags mb-3">
							<Link scroll={false} href="#!" className="badge !rounded-full bg-light text-default me-1"><i className="bi bi-geo-alt text-textmuted dark:text-textmuted/50 me-1"></i> Hyderabad</Link>
							{object.badge && (

								<Link scroll={false} href="#!" className="badge !rounded-full bg-light text-default me-1"><i className="bi bi-briefcase text-muted me-1"></i>  13 Openings</Link>

							)}


							<Link scroll={false} href="#!" className="badge !rounded-full bg-light text-default me-1"><i className="bi bi-mortarboard text-textmuted dark:text-textmuted/50 me-1"></i> Graduate</Link>
							<Link scroll={false} href="#!" className="badge !rounded-full bg-light text-default me-1"><i className="bi bi-clock text-textmuted dark:text-textmuted/50 me-1"></i> Min - 2Years</Link>
						</div>
						<div className="flex justify-between">
							<h6 className="font-medium mb-0">$25,000 - $35,000</h6>
							<Link scroll={false} href="#!" className="text-primary font-medium text-[0.875rem]">
								Apply Now <i className="fe fe-arrow-right"></i>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>

	);
};

export default SpkJobdetails;
