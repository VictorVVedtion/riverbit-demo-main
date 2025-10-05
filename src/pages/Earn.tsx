import { useEffect, useRef, useState } from "react";
import RiverbitLogo from "../components/RiverbitLogo";
import DesktopNav from "../components/DesktopNav";
import DesktopNavRight from "../components/DesktopNavRight";
import MobileHeader from "../components/MobileHeader";
import MobileMenu from "../components/MobileMenu";
import Footer from "../components/Footer";
const Earn = () => {
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
					<div className="flex flex-col items-start self-stretch py-12 lg:mx-20 gap-8">
						<span className="text-white text-3xl font-bold" >
							{"Earn Points"}
						</span>
						<div className="flex flex-col self-stretch gap-3">
							<div className="flex flex-col lg:flex-row w-full items-start self-stretch gap-2">
								{/* User Stats */}
								<div className="lg:basis-1/2 flex flex-col lg:flex-row w-full items-center gap-2">
									<div className="w-full flex flex-1 flex-col shrink-0 items-start bg-[#161B22] text-left py-4 gap-2 rounded-md border border-solid border-[#30363D]">
										<span className="text-[#8B949E] text-sm ml-[21px]">My Points</span>
										<span className="text-white text-2xl font-bold ml-[21px]">4,176</span>
									</div>
									<div className="w-full flex flex-1 flex-col shrink-0 items-start bg-[#161B22] text-left py-4 gap-2 rounded-md border border-solid border-[#30363D]">
										<span className="text-[#8B949E] text-sm ml-[21px]">Today's Points</span>
										<span className="text-[#2DA44E] text-2xl font-bold ml-[21px]">+855</span>
									</div>
									<div className="w-full flex flex-1 flex-col shrink-0 items-start bg-[#161B22] text-left py-4 gap-2 rounded-md border border-solid border-[#30363D]">
										<span className="text-[#8B949E] text-sm ml-[21px]">Current Rank</span>
										<span className="text-white text-2xl font-bold ml-[21px]">#1247</span>
									</div>
								</div>
								{/* Progress Bar */}
								<div className="lg:basis-1/2 w-full flex flex-1 flex-col bg-[#161B22] px-4 py-4 gap-2 rounded-md border border-solid border-[#30363D]">
									<div className="flex items-center self-stretch">
										<span className="flex-1 text-[#8B949E] text-sm text-left">Today’s Progress</span>
										<span className="text-[#B65EAF] text-sm">8.55%</span>
									</div>

									{/* Bar container */}
									<div className="w-full bg-[#30363D] rounded-[9999px] h-2.5">
										{/* Dynamic fill */}
										<div
										className="bg-[#92318D] h-2.5 rounded-[9999px]"
										style={{ width: "8.55%" }} // match percentage dynamically
										></div>
									</div>

									<div className="flex flex-col items-end self-stretch">
										<span className="text-[#8B949E] text-sm">855 / 10,000</span>
									</div>
								</div>

							</div>
							<div className="flex flex-col items-start self-stretch bg-[#161B22] py-[1px] rounded-md border border-solid border-[#30363D]">
								<span className="text-white text-2xl font-bold my-6 ml-[25px] mr-[1px]" >
									{"Points Leaderboard"}
								</span>
								{/* Table */}
								<div className="overflow-x-auto w-full py-4 px-6">
									<table className="min-w-full text-left border-collapse">
										<thead>
											<tr className="text-[#8B949E] text-sm font-bold border-b border-[#30363D]">
												<th className="py-3 px-2 w-12">Rank</th>
												<th className="py-3 px-2">Address</th>
												<th className="py-3 px-2 text-left lg:w-32">Points</th>
												<th className="py-3 px-2 text-right lg:w-32">24H Change</th>
											</tr>
										</thead>
										<tbody>
										{[
											{ rank: "1", address: "0x4f8e...2a1d", points: "3,521,087", change: "+12,847", changeColor: "#2DA44E" },
											{ rank: "2", address: "0x7a2f...9b3c", points: "2,847,392", change: "+12,847", changeColor: "#2DA44E" },
											{ rank: "3", address: "0x9c6b...7e4f", points: "2,193,746", change: "+12,847", changeColor: "#2DA44E" },
											{ rank: "4", address: "0x1a3e...8f2b", points: "1,872,459", change: "+12,847", changeColor: "#2DA44E" },
											{ rank: "5", address: "0x5d7c...4e9a", points: "1,634,281", change: "+8,392", changeColor: "#2DA44E" },
											{ rank: "6", address: "0x8b4f...1c6d", points: "1,401,928", change: "+15,739", changeColor: "#2DA44E" },
											{ rank: "7", address: "0x2e9a...7f3b", points: "1,287,456", change: "+6,284", changeColor: "#2DA44E" },
											{ rank: "8", address: "0x6c1d...9e4a", points: "1,158,372", change: "+11,947", changeColor: "#2DA44E" },
										].map((row, idx) => (
											<tr key={idx} className="border-b border-[#30363D] text-sm">
											<td className="py-2 px-2 text-white">{row.rank}</td>
											<td className="py-2 px-2 text-[#E0E0E0]">{row.address}</td>
											<td className="py-2 px-2 text-white text-left">{row.points}</td>
											<td className="py-2 px-2 text-right" style={{ color: row.changeColor }}>{row.change}</td>
											</tr>
										))}

										{/* Placeholder row for "..." */}
										<tr>
											<td colSpan={4} className="text-center text-[#8A91A0] py-2 text-sm">...</td>
										</tr>

										{/* Current user row */}
										<tr className="bg-[#92318D1A] border-2 border-solid border-[#92318D]">
											<td className="py-2 px-2 text-[#B65EAF]">1247</td>
											<td className="py-2 px-2 text-white">You</td>
											<td className="py-2 px-2 text-white text-left">4,176</td>
											<td className="py-2 px-2 text-[#2DA44E] text-right">+855</td>
										</tr>
										</tbody>
									</table>
								</div>

								<div className="flex items-center self-stretch p-4 justify-between">
									<span className="flex-1 text-[#8B949E] text-sm text-left" >
										{"Showing 10 of 24134"}
									</span>
									<div className="flex shrink-0 items-start gap-[17px]">
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
					<Footer />
				</div>
			</div>
		</div>
	)
}

export default Earn