import {useEffect, useRef, useState} from "react";
import RiverbitLogo from "../components/RiverbitLogo";
import DesktopNav from "../components/DesktopNav";
import Footer from "../components/Footer";
import DesktopNavRight from "../components/DesktopNavRight";
import MobileHeader from "../components/MobileHeader";
import MobileMenu from "../components/MobileMenu";
const Announcement = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [language, setLanguage] = useState("EN");
	const [showLangDropdown, setShowLangDropdown] = useState(false);
	const [showWalletDropdown, setShowWalletDropdown] = useState(false);
	const [showMoreDropdown, setShowMoreDropdown] = useState(false);
	const walletDropdownRef = useRef<HTMLDivElement>(null);
	const langDropdownRef = useRef<HTMLDivElement>(null);
	const moreDropdownRef = useRef<HTMLDivElement>(null);
	
	{/* Close dropdowns when clicking outside */}
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				moreDropdownRef.current &&
				!moreDropdownRef.current.contains(event.target as Node)
			) {
				setShowMoreDropdown(false);
			}
			if (
				walletDropdownRef.current &&
				!walletDropdownRef.current.contains(event.target as Node)
			) {
				setShowWalletDropdown(false);
			}
			if (
				langDropdownRef.current &&
				!langDropdownRef.current.contains(event.target as Node)
			) {
				setShowLangDropdown(false);
			}
		}
		if (showMoreDropdown || showWalletDropdown || showLangDropdown) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showMoreDropdown, showWalletDropdown, showLangDropdown]);

	const [input1, onChangeInput1] = useState('');
	const [input2, onChangeInput2] = useState('');
	const [input3, onChangeInput3] = useState('');
	const [input4, onChangeInput4] = useState('');
	return (
		<div className="flex flex-col bg-black min-h-screen">
			<div className="self-stretch">
				{/* Header */}
                {/* Desktop header: show on xl and up */}
                <div className="hidden xl:flex justify-between items-start self-stretch bg-zinc-900 py-3.5 px-4">
                    {/* Left: Logo and nav */}
                    <div className="flex shrink-0 items-start gap-8">
                        <RiverbitLogo />
                        <DesktopNav />
                    </div>
                    {/* Right side (Balance, Points, Wallet, Language, Buttons) */}
					<DesktopNavRight
						balance="$27,345.12"
						points="1,250,000"
						language={language}
						setLanguage={setLanguage}
					/>
                </div>
				{/* Mobile header: show below xl */}
                <MobileHeader
                    balance="$27,345.12"
                    onDeposit={() => alert("Deposit pressed!")}
                    onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
                    />
                {/* Mobile Menu Drawer */}
                {mobileMenuOpen && (
                    <MobileMenu
                        isOpen={mobileMenuOpen}
                        onClose={() => setMobileMenuOpen(false)}
                        balance="$27,345.12"
                        points="1,250,000"
                        language={language}
						setLanguage={setLanguage}
                        />
                )}
				{/* Content */}
				<div className="flex flex-col self-stretch gap-2 mx-6">
					<div className="flex flex-col self-stretch py-12 lg:mx-20 gap-8">
						<div className="flex flex-col text-left items-start self-stretch gap-4">
							<span className="text-white text-3xl font-bold" >
								{"Announcements"}
							</span>
							{/* Description and System Status */}
							<div className="flex flex-col lg:flex-row gap-2 justify-between items-start self-stretch">
								<div className="flex flex-col shrink-0 items-center">
									<span className="text-[#8B949E] text-base" >
										{"System notifications and product updates"}
									</span>
								</div>
								<div className="flex max-md:flex-col shrink-0 items-start gap-2">
									<div className="flex shrink-0 items-center pr-1 gap-[11px]">
										<span className="text-[#8B949E] text-sm" >
											{"System Status:"}
										</span>
										<span className="text-[#2DA44E] text-sm font-bold" >
											{"Normal"}
										</span>
									</div>
									<div className="flex shrink-0 items-center gap-2">
										<span className="text-[#8B949E] text-sm" >
											{"Last Updated:"}
										</span>
										<span className="text-white text-sm" >
											{"2025-09-06"}
										</span>
									</div>
								</div>
							</div>
						</div>
						<div className="flex items-start self-stretch gap-3 flex-col xl:flex-row">
							<div className="flex flex-col basis-1/3 items-center gap-2.5 w-full">
								<div className="flex flex-col items-start bg-[#161B22] p-6 gap-4 rounded-lg border border-solid border-[#30363D] w-full">
									{/* Search bar */}
									<div className="w-full flex items-center bg-[#0D1117] rounded-md border border-solid border-[#30363D] px-4 py-3">
										<input
											type="text"
											placeholder="Search..."
											className="flex-1 bg-transparent text-[#ADAEBC] text-base outline-none"
										/>
										<img
											src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/ve4zl4a6_expires_30_days.png"
											className="w-4 h-6 rounded-md object-fill ml-2"
										/>
									</div>
									<span className="text-white text-lg font-bold" >
										{"Announcements"}
									</span>
									<div className="flex flex-col items-start gap-3">
										<span className="text-[#92318D] text-sm font-bold" >
											{"All"}
										</span>
										<span className="text-[#8B949E] text-sm" >
											{"Product Updates"}
										</span>
										<span className="text-[#8B949E] text-sm" >
											{"Maintenance Notices"}
										</span>
										<span className="text-[#8B949E] text-sm" >
											{"Events"}
										</span>
									</div>
								</div>
								<div className="w-full flex flex-col items-start bg-[#161B22] p-6 gap-4 rounded-lg border border-solid border-[#30363D]">
									<div className="flex flex-col items-center">
										<span className="text-white text-lg font-bold" >
											{"Contact Us"}
										</span>
									</div>
									<div className="w-full flex flex-col items-start gap-3">
										<div className="w-full flex items-center bg-[#0D1117] p-3 gap-3 rounded-lg">
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/46x3x7zg_expires_30_days.png"} 
												className="w-6 h-6 rounded-lg object-fill"
											/>
											<input
												placeholder={"Discord"}
												value={input1}
												onChange={(event)=>onChangeInput1(event.target.value)}
												className="text-white bg-transparent text-sm w-12 py-[3px] border-0"
											/>
										</div>
										<div className="w-full flex items-center bg-[#0D1117] p-3 gap-3 rounded-lg">
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/9fr0ws12_expires_30_days.png"} 
												className="w-6 h-6 rounded-lg object-fill"
											/>
											<input
												placeholder={"X"}
												value={input2}
												onChange={(event)=>onChangeInput2(event.target.value)}
												className="text-white bg-transparent text-sm w-2 py-[3px] border-0"
											/>
										</div>
										<div className="w-full flex items-center bg-[#0D1117] p-3 gap-3 rounded-lg">
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/5prdw6in_expires_30_days.png"} 
												className="w-6 h-6 rounded-lg object-fill"
											/>
											<input
												placeholder={"Telegram"}
												value={input3}
												onChange={(event)=>onChangeInput3(event.target.value)}
												className="text-white bg-transparent text-sm w-[59px] py-[3px] border-0"
											/>
										</div>
										<div className="w-full flex items-center bg-[#0D1117] p-3 gap-3 rounded-lg">
											<img
												src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/mjaepjda_expires_30_days.png"} 
												className="w-6 h-6 rounded-lg object-fill"
											/>
											<input
												placeholder={"GitHub"}
												value={input4}
												onChange={(event)=>onChangeInput4(event.target.value)}
												className="text-white bg-transparent text-sm w-[45px] py-[3px] border-0"
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="flex flex-col basis-2/3 w-full items-start bg-[#161B22] p-6 gap-4 rounded-lg border border-solid border-[#30363D]">
								<span className="text-white text-xl font-bold py-4 border-b border-solid border-[#30363D] w-full text-left" >
									{"Announcements List"}
								</span>
								{/* Announcement items */}
								<div className="w-full flex flex-col gap-8 text-left">
								{[
									{
									title: "RiverBit V2.0 Official Launch – Brand New Trading Engine Live",
									tag: "Major Update",
									date: "2025-09-06",
									description: "Enhanced performance and new features for better trading experience",
									},
									{
									title: "Foundation LP Pool Officially Open – Limited to 100 Seats",
									tag: "New Feature",
									date: "2025-09-05",
									description: "Exclusive access to high-yield liquidity provision opportunities",
									},
									{
									title: "System Maintenance Completed – Significant Performance Boost",
									tag: "Maintenance",
									date: "2025-09-04",
									description: "System optimization completed with improved speed and reliability",
									},
									{
									title: "Mid-Autumn Double Points Event – 7 Days Only",
									tag: "Event",
									date: "2025-09-03",
									description: "Limited time event offering double points on all trading activities",
									},
									{
									title: "Security Upgrade – Mandatory 2FA Enabled",
									tag: "Security",
									date: "2025-09-01",
									description: "Enhanced security measures now require two-factor authentication",
									},
									{
									title: "Major Referral System Update – 3-Level Structure Live",
									tag: "Feature Update",
									date: "2025-08-30",
									description: "New multi-tier referral system with increased rewards",
									},
									{
									title: "New Data Dashboard Launched – Real-Time Trading Monitoring",
									tag: "New Feature",
									date: "2025-08-28",
									description: "Advanced analytics dashboard for comprehensive trading insights",
									},
									{
									title: "New Data Dashboard Launched – Real-Time Trading Monitoring",
									tag: "New Feature",
									date: "2025-08-28",
									description: "Advanced analytics dashboard for comprehensive trading insights",
									},
									{
									title: "New Data Dashboard Launched – Real-Time Trading Monitoring",
									tag: "New Feature",
									date: "2025-08-28",
									description: "Advanced analytics dashboard for comprehensive trading insights",
									},
									{
									title: "New Data Dashboard Launched – Real-Time Trading Monitoring",
									tag: "New Feature",
									date: "2025-08-28",
									description: "Advanced analytics dashboard for comprehensive trading insights",
									},
								].map((item, idx) => (
									<div
									key={idx}
									className="flex flex-1 flex-col xl:flex-row justify-between bg-[#0D1117] p-4 rounded-lg border border-[#30363D] min-w-[250px]"
									>
									<div className="flex flex-col">
										<span className="text-white text-lg font-bold mb-2">{item.title}</span>
										<div className="flex items-center gap-4 mb-2">
										<button
											className="flex flex-col shrink-0 items-start bg-[#30363D] text-left py-1 px-2 rounded border-0"
											onClick={() => alert("Pressed!")}
										>
											<span className="text-[#8B949E] text-xs font-bold">{item.tag}</span>
										</button>
										<span className="text-[#8B949E] text-sm">{`Date: ${item.date}`}</span>
										</div>
										<span className="text-[#8B949E] text-sm">{item.description}</span>
									</div>
									<div className="flex flex-col items-start mt-2">
										<span className="text-[#92318D] text-sm font-bold cursor-pointer">{"View Details"}</span>
									</div>
									</div>
								))}
								</div>

								<div className="flex justify-between items-start self-stretch flex-col lg:flex-row gap-4 mt-4	">
									<div className="flex flex-col shrink-0 items-center">
										<span className="text-[#8B949E] text-sm" >
											{"Showing 10 of 23 announcements"}
										</span>
									</div>
									<div className="flex shrink-0 items-start gap-2">
										<button className="flex flex-col shrink-0 items-start bg-transparent text-left py-2.5 px-[18px] rounded-lg border border-solid border-[#30363D]"
											onClick={()=>alert("Pressed!")}>
											<span className="text-[#E6EDF3] text-base font-bold" >
												{"Previous"}
											</span>
										</button>
										<button className="flex flex-col shrink-0 items-start bg-[#92318D] text-left py-2.5 px-[18px] rounded-lg border-0"
											onClick={()=>alert("Pressed!")}>
											<span className="text-white text-base font-bold" >
												{"Next"}
											</span>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		</div>
	)
}

export default Announcement