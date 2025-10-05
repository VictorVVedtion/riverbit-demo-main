import {useEffect, useRef, useState} from "react";
import RiverbitLogo from "../components/RiverbitLogo";
import DesktopNav from "../components/DesktopNav";
import DesktopNavRight from "../components/DesktopNavRight";
import MobileHeader from "../components/MobileHeader";
import MobileMenu from "../components/MobileMenu";
import Footer from "../components/Footer";
import ToggleWithText from "../components/ToggleWithText";
import Tabs from "../components/Tabs";
import { SecondaryButton } from "../components/Button/SecondaryButton";
import PrimaryButton from "../components/Button/PrimaryButton";
import StatusTag from "../components/StatusTag";
import Tips from "../components/Tips";
import AdjustCommissionRateModal from "../components/AdjustCommissionRateModal";
const Referral = () => {
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
	const [role, setRole] = useState("Candidate User");
	const [referralTab, setReferralTab] = useState("Direct Referrals");
	const [showAdjustCommissionRateModal, setShowAdjustCommissionRateModal] = useState(false); // 控制 modal 顯示
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
						<div className="flex flex-col xl:flex-row justify-between self-stretch gap-8">
							<div className="flex flex-1 flex-col items-start gap-2 w-full text-left">
								<span className="text-white text-2xl font-bold" >
									{"Referral Program"}
								</span>
								<span className="text-[#8B949E] text-base" >
									{"Earn commissions and points by referring new users to RiverBit"}
								</span>
							</div>
							{/* Role Toggle */}
							<div className="flex text-nowrap xl:items-end items-start overflow-auto">
								<ToggleWithText
									options={[
									"Candidate User",
									"C2C User",
									"Sub-Account",
									"Team Leader",
									"Foundation Team Leader",
									]}
									value={role}
									onChange={setRole}
								/>
							</div>
						</div>
						{/* Tab Content */}
						{role === "Foundation Team Leader" && (
						<div className="flex flex-col self-stretch gap-6">
							{/* Level Info / Dashboard */}
							<div className="text-left flex flex-col items-start self-stretch bg-[#161B22] p-4 gap-[17px] rounded-lg border border-solid border-[#30363D]">
								<span className="text-white text-lg font-bold" >
									{"Level Info / Dashboard"}
								</span>
								<div className="flex flex-col self-stretch gap-4">
									{/* Level Info */}
									{/* Four columns: Role, Commission Rate, Max Difference, Current Seat */}
									<div className="flex flex-col lg:flex-row items-start self-stretch gap-4">
										<div className="flex flex-1 flex-col items-start">
											<span className="text-[#8B949E] text-sm" >
												{"Role"}
											</span>
											<span className="text-white text-base" >
												{"Foundation Team Leader (Max Level)"}
											</span>
										</div>
										<div className="flex flex-1 flex-col items-start">
											<span className="text-[#8B949E] text-sm" >
												{"Commission Rate"}
											</span>
											<span className="text-[#92318D] text-base font-bold" >
												{"40%"}
											</span>
										</div>
										<div className="flex flex-1 flex-col items-start">
											<span className="text-[#8B949E] text-sm" >
												{"Max Difference"}
											</span>
											<span className="text-white text-sm" >
												{"Up to 40% (r2 ≤ r1 ≤ r0 ≤ 0.40)"}
											</span>
										</div>
										<div className="flex flex-1 flex-col items-start gap-1">
											<span className="text-[#8B949E] text-sm" >
												{"Current Seat"}
											</span>
											<span className="text-white text-sm" >
												{"#153"}
											</span>
										</div>
									</div>
									{/* Privileges and Withdraw */}
									<div className="flex flex-col lg:flex-row items-start self-stretch gap-4">
										{/* Privileges */}
										<div className="w-full flex flex-1 flex-col items-start bg-[#0D1117] p-4 gap-2 rounded-lg">
											<div className="flex flex-col items-center pb-[1px]">
												<span className="text-white text-sm font-bold" >
													{"Privileges:"}
												</span>
											</div>
											<div className="flex flex-col items-start self-stretch gap-1">
												<span className="text-[#8B949E] text-sm" >
													{"• Earn up to 40% commission"}
												</span>
												<span className="text-[#8B949E] text-sm" >
													{"• Instant Points 100,000"}
												</span>
												<span className="text-[#8B949E] text-sm" >
													{"• Today's Points 4,356"}
												</span>
											</div>
										</div>
										{/* Withdraw */}
										<div className="w-full flex flex-1 justify-between items-center bg-[#0D1117] p-4 rounded-lg">
											<div className="w-full flex flex-col items-start">
												<span className="text-[#8B949E] text-sm" >
													{"Net Commission Withdrawn"}
												</span>
												<span className="text-[#2DA44E] text-base font-bold" >
													{"$11,200"}
												</span>
											</div>
											<SecondaryButton size="small" onClick={() => alert("Withdraw pressed")}>
												Withdraw
											</SecondaryButton>
										</div>
									</div>
								</div>
							</div>
							<div className="flex flex-col self-stretch gap-3">
								{/* My Commission Summary */}
								<div className="flex flex-col items-start self-stretch gap-4">
									<span className="text-white text-lg font-bold" >
										{"My Commission Summary"}
									</span>
									<div className="flex flex-col xl:flex-row items-start self-stretch gap-4 text-left">
										<div className="w-full flex flex-1 flex-col items-start bg-[#161B22] py-6 rounded-md border border-solid border-[#30363D]">
											<span className="text-[#8B949E] text-sm mb-[7px] mx-6" >
												{"Rate"}
											</span>
											<span className="text-white text-2xl font-bold mb-[3px] mx-6" >
												{"40%"}
											</span>
										</div>
										<div className="w-full flex flex-1 flex-col items-start bg-[#161B22] py-6 rounded-md border border-solid border-[#30363D]">
											<span className="text-[#8B949E] text-sm mb-[7px] mx-[23px]" >
												{"Direct Referrals"}
											</span>
											<span className="text-white text-2xl font-bold mb-[3px] mx-[23px]" >
												{"2"}
											</span>
										</div>
										<div className="w-full flex flex-1 flex-col items-start bg-[#161B22] py-6 rounded-md border border-solid border-[#30363D]">
											<span className="text-[#8B949E] text-sm mb-[7px] mx-6" >
												{"Sub-Accounts"}
											</span>
											<span className="text-white text-2xl font-bold mb-[3px] mx-6" >
												{"2"}
											</span>
										</div>
										<div className="w-full flex flex-1 flex-col items-start bg-[#161B22] py-6 rounded-md border border-solid border-[#30363D]">
											<span className="text-[#8B949E] text-sm mb-[7px] mx-6" >
												{"Total Net Profit"}
											</span>
											<span className="text-[#2DA44E] text-2xl font-bold mb-[3px] mx-6" >
												{"$15,600"}
											</span>
										</div>
										<div className="w-full flex flex-1 flex-col items-start bg-[#161B22] py-6 rounded-md border border-solid border-[#30363D]">
											<span className="text-[#8B949E] text-sm mb-[7px] mx-6" >
												{"Total Earned Points"}
											</span>
											<span className="text-[#2DA44E] text-2xl font-bold mb-[3px] mx-6" >
												{"296.8K"}
											</span>
										</div>
										<div className="w-full flex flex-1 flex-col items-start bg-[#161B22] py-6 rounded-md border border-solid border-[#30363D]">
											<span className="text-[#8B949E] text-sm mb-[7px] mx-6" >
												{"Today Earned Points"}
											</span>
											<span className="text-[#2DA44E] text-2xl font-bold mb-[3px] mx-6" >
												{"$4,356"}
											</span>
										</div>
									</div>
								</div>
								{/* My Points and Rules */}
								<div className="w-full flex flex-col lg:flex-row items-start gap-4 text-left">
									<div className="flex flex-col flex-1 p-4 gap-4 bg-[#161B22] rounded-lg border border-[#30363D] w-full">
										<div className="flex flex-col items-start self-stretch gap-2">
											<span className="text-white text-lg font-bold" >
												{"My Points"}
											</span>
											<div className="flex flex-col self-stretch gap-4">
												<div className="flex items-start self-stretch gap-3">
													<div className="flex flex-1 items-center">
														<span className="text-[#8B949E] text-sm" >
															{"Total Earned:"}
														</span>
														<span className="text-white text-sm" >
															{"296.8K points"}
														</span>
													</div>
													<div className="flex flex-1 items-center">
														<span className="text-[#8B949E] text-sm" >
															{"Today:"}
														</span>
														<span className="text-[#2DA44E] text-sm mr-[75px]" >
															{"4,356 points ($435.6)"}
														</span>
													</div>
												</div>
												<div className="flex items-start self-stretch gap-3">
													<div className="flex flex-1 items-center">
														<span className="text-[#8B949E] text-sm" >
															{"Last 7 Days:"}
														</span>
														<span className="text-white text-sm" >
															{"30.5K (avg. 4.4K/day)"}
														</span>
													</div>
													<div className="flex flex-1 items-center gap-3.5">
														<span className="text-[#8B949E] text-sm" >
															{"Last 30 Days:"}
														</span>
														<span className="flex-1 text-white text-sm" >
															{"130.7K (avg. 4.4K/day)"}
														</span>
													</div>
												</div>
											</div>
										</div>
										<div className="flex flex-col items-start self-stretch bg-[#0D1117] p-4 gap-2 rounded">
											<span className="text-white text-sm font-bold" >
												{"Active Address Share (20%)"}
											</span>
											<span className="text-[#8B949E] text-sm" >
												{"My Active Addresses: 45 / Total: 2,250 (2.0%)"}
											</span>
											<span className="text-[#2DA44E] text-sm" >
												{"Earned Today: 871 points"}
											</span>
										</div>
										<div className="flex flex-col items-start self-stretch bg-[#0D1117] p-4 gap-2 rounded">
											<span className="text-white text-sm font-bold" >
												{"Trading Volume Share (80%)"}
											</span>
											<span className="text-[#8B949E] text-sm" >
												{"My Volume: $850K / Total: $12.8M (6.67%)"}
											</span>
											<span className="text-[#2DA44E] text-sm" >
												{"Earned Today: 3485 points"}
											</span>
										</div>
									</div>
									<div className="flex flex-col flex-1 p-4 gap-4 bg-[#161B22] rounded-lg border border-[#30363D] w-full">
										<span className="text-white text-lg font-bold w-full" >
											{"Points Rewards Rules"}
										</span>
										<div className="flex flex-col items-start self-stretch bg-[#0D1117] p-4 gap-2 rounded-lg">
											<span className="text-[#8B949E] text-sm w-full" >
												{"Instant Reward"}
											</span>
											<span className="text-white text-base font-bold w-full" >
												{"100,000 points ($10K)"}
											</span>
										</div>
										<div className="flex flex-col items-start self-stretch bg-[#0D1117] p-4 gap-2 rounded-lg">
											<span className="text-[#8B949E] text-sm" >
												{"Daily Pool"}
											</span>
											<span className="text-white text-base font-bold" >
												{"4% shared"}
											</span>
											<div className="flex flex-col items-start self-stretch gap-1">
												<div className="flex flex-col items-center pb-[1px]">
													<span className="text-white text-sm" >
														{"• 20% based on active addresses"}
													</span>
												</div>
												<div className="flex flex-col items-center pb-[1px]">
													<span className="text-white text-sm" >
														{"• 80% based on trading volume"}
													</span>
												</div>
												<div className="flex flex-col items-center pb-[1px]">
													<span className="text-white text-sm" >
														{"• Shared with Foundation Leaders"}
													</span>
												</div>
											</div>
										</div>
										<div className="flex flex-col items-start self-stretch gap-2">
											<span className="text-[#8B949E] text-sm" >
												{"Point Value:"}
											</span>
											<span className="text-white text-sm" >
												{"$0.10 each"}
											</span>
											<span className="text-[#92318D] text-sm" >
												{"Note: Standard Leaders share daily 4% pool but no instant rewards. Upgrade to Foundation Leader → unlock 100K points instantly."}
											</span>
										</div>
									</div>
								</div>
							</div>
							{/* Invitation Tools */}
							<div className="flex flex-col items-start self-stretch bg-[#161B22] p-4 gap-4 rounded-md border border-solid border-[#30363D]">
								<span className="text-white text-lg font-bold" >
									{"Invitation Tools"}
								</span>
								<div className="flex flex-col self-stretch gap-4">
									<div className="flex items-center self-stretch gap-2">
										<div className="bg-[#2DA44E] w-3 h-3 rounded-[9999px]">
										</div>
										<span className="text-[#2DA44E] text-base font-bold" >
											{"Status: Activated"}
										</span>
									</div>
									<div className="flex flex-col items-start self-stretch gap-2">
										<div className="flex flex-col items-center pb-[1px]">
											<span className="text-[#8B949E] text-sm" >
												{"Your Referral Link:"}
											</span>
										</div>
										{/* Input and Buttons */}
										<div className="flex flex-col md:flex-row items-start self-stretch gap-2 w-full">
											{/* Input */}
											<div className="flex flex-row w-full gap-4">
												<input
													placeholder="https://riverbit.com/ref/sub_0xdef456"
													value={input1}
													onChange={(event) => onChangeInput1(event.target.value)}
													className="w-full text-white bg-[#0D1117] text-sm py-4 px-4 rounded-md border border-solid border-[#30363D]"
												/>
												<PrimaryButton size="small" onClick={() => alert("Pressed")}>
												Copy
												</PrimaryButton>
											</div>
											
											{/* Buttons container */}
											<div className="flex flex-col md:flex-row w-full md:w-auto gap-2 text-nowrap">
												<SecondaryButton size="large" onClick={() => alert("Pressed")}>
												Generate QR
												</SecondaryButton>
												<PrimaryButton size="large" onClick={() => alert("Pressed")}>
												Share on Social
												</PrimaryButton>
												
											</div>
										</div>

									</div>
								</div>
							</div>
							{/* Team Stats and Team Management */}
							<div className="flex flex-col xl:flex-row items-start self-stretch gap-6">
								<div className="w-full flex flex-col lg:basis-1/3 items-start bg-[#161B22] p-4 gap-4 rounded-md border border-solid border-[#30363D]">
									<span className="text-white text-lg font-bold" >
										{"Team Stats"}
									</span>
									<div className="flex flex-col gap-2 w-full">
										<div className="flex items-center justify-between w-full">
											<span className="text-[#8B949E] text-base">Members:</span>
											<span className="text-white text-base font-bold">85</span>
										</div>

										<div className="flex items-center justify-between w-full">
											<span className="text-[#8B949E] text-base">Team Trading Volume:</span>
											<span className="text-white text-base font-bold">$3.2M</span>
										</div>

										<div className="flex items-center justify-between w-full">
											<span className="text-[#8B949E] text-base">Active Users (Last 3 Days):</span>
											<span className="text-white text-base font-bold">25</span>
										</div>

										<div className="flex items-center justify-between w-full">
											<span className="text-[#8B949E] text-base">Total Commission Earned:</span>
											<span className="text-[#2DA44E] text-base font-bold">$87,500</span>
										</div>

										<div className="flex items-center justify-between w-full">
											<span className="text-[#8B949E] text-base">Points Value:</span>
											<span className="text-[#2DA44E] text-base font-bold">$5.4K</span>
										</div>
									</div>

								</div>
								{/* Team Management */}
								<div className="w-full flex flex-col lg:basis-2/3 bg-[#161B22] py-4 px-4 gap-4 rounded-md border border-solid border-[#30363D]">
									<div className="flex flex-col lg:flex-row gap-4 items-start justify-between self-stretch">
										<span className="flex text-white text-lg font-bold text-left" >
											{"Team Management"}
										</span>
										<div className="flex flex-col md:flex-row w-full md:w-auto gap-4 text-nowrap">
											<SecondaryButton onClick={() => alert("Export CSV pressed")}>
												Export CSV
											</SecondaryButton>
											<PrimaryButton onClick={() => alert("Set Commission Rates pressed")}>
												Set Commission Rates
											</PrimaryButton>
										</div>
									</div>
									<div className="flex items-start self-stretch border-b border-[#30363D] w-full">
										{/* Tabs */}
										<div className="lg:max-w-2/3 w-full ">
										<Tabs
                                            tabs={[
                                                "Direct Referrals",
                                                "Sub-Accounts",
                                                "All Members",
                                            ]}
                                            activeTab={referralTab}
                                            onTabChange={setReferralTab}
                                            />
										</div>
									</div>
									{/* Tab Content */}
									{referralTab === "Direct Referrals" && (
										<div className="overflow-x-auto text-nowrap">
											{/* Team Table */}
											<table className="min-w-full text-sm text-left border-collapse ">
												<thead>
												<tr className="border-b border-[#30363D]">
													<th className="px-4 py-3 text-[#8B949E] font-bold">Address</th>
													<th className="px-4 py-3 text-[#8B949E] font-bold">Volume</th>
													<th className="px-4 py-3 text-[#8B949E] font-bold">Commission Rate</th>
													<th className="px-4 py-3 text-[#8B949E] font-bold">Your Earnings</th>
													<th className="px-4 py-3 text-[#8B949E] font-bold">Action</th>
												</tr>
												</thead>
												<tbody>
												{[
													{ address: "0x555...666", volume: "$85,000", rate: "40%", earnings: "$3,400" },
													{ address: "0x777...888", volume: "$50,000", rate: "30%", earnings: "$1,500" },
													{ address: "0x999...aaa", volume: "$25,000", rate: "20%", earnings: "$500" },
												].map((row, i) => (
													<tr key={i} className="border-b border-[#30363D]">
													<td className="px-4 py-3 text-white">{row.address}</td>
													<td className="px-4 py-3 text-white">{row.volume}</td>
													<td className="px-4 py-3 text-white">{row.rate}</td>
													<td className="px-4 py-3 text-[#2DA44E] font-bold">{row.earnings}</td>
													<td className="px-4 py-3 flex gap-2 text-nowrap">
														<PrimaryButton size="small" onClick={() => setShowAdjustCommissionRateModal(true)}>
														Set Rate
														</PrimaryButton>
														<SecondaryButton size="small" onClick={() => alert("Set Sub-acc pressed")}>
														Set Sub-acc
														</SecondaryButton>
													</td>
													</tr>
												))}
												</tbody>
											</table>
										</div>
									)}
									{referralTab === "Sub-Accounts" && (
										<div>
											<div className="overflow-x-auto flex flex-col gap-4">
												{/* Team Table */}
												<table className="text-nowrap min-w-full text-sm text-left border-collapse">
												<thead>
													<tr className="border-b border-[#30363D]">
													<th className="px-4 py-3 text-[#8B949E] font-bold">Address</th>
													<th className="px-4 py-3 text-[#8B949E] font-bold">Volume</th>
													<th className="px-4 py-3 text-[#8B949E] font-bold">Commission Rate</th>
													<th className="px-4 py-3 text-[#8B949E] font-bold">Your Earnings</th>
													<th className="px-4 py-3 text-[#8B949E] font-bold">Action</th>
													</tr>
												</thead>
												<tbody>
													{[
													{ address: "0x111...222", volume: "$180,000", rate: "35%", earnings: "5.0% ($900)" },
													{ address: "0x333...444", volume: "$120,000", rate: "30%", earnings: "10.0% ($1,200)" },
													].map((row, i) => (
													<tr key={i} className="border-b border-[#30363D]">
														<td className="px-4 py-3 text-white">{row.address}</td>
														<td className="px-4 py-3 text-white">{row.volume}</td>
														<td className="px-4 py-3 text-white">{row.rate}</td>
														<td className="px-4 py-3 text-[#2DA44E] font-bold">{row.earnings}</td>
														<td className="px-4 py-3 flex gap-2 text-nowrap">
														<PrimaryButton size="small"  onClick={() => setShowAdjustCommissionRateModal(true)}>
															Set Rate
														</PrimaryButton>
														</td>
													</tr>
													))}
												</tbody>
												</table>
											</div>
											<div className="w-full">
												<Tips
												iconUrl="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/1uh405kh_expires_30_days.png"
												tips={[
													"You can set a commission rate of up to 40% for sub-accounts, and the difference will be your earnings.",
												]}
												/>
											</div>
											
										</div>
									)}
									{referralTab === "All Members" && (
										<div className="overflow-x-auto text-nowrap">
											{/* Team Table */}
											<table className="min-w-full text-sm text-left border-collapse">
											<thead>
												<tr className="border-b border-[#30363D]">
												<th className="px-4 py-3 text-[#8B949E] font-bold">Address</th>
												<th className="px-4 py-3 text-[#8B949E] font-bold">Type</th>
												<th className="px-4 py-3 text-[#8B949E] font-bold">Volume</th>
												<th className="px-4 py-3 text-[#8B949E] font-bold">Commission Rate</th>
												<th className="px-4 py-3 text-[#8B949E] font-bold">Status</th>
												</tr>
											</thead>
											<tbody>
												{[
												{ address: "0xabc...123", type: "Direct User", volume: "$45,000", rate: "35%", status: "Active" },
												{ address: "0xdef...456", type: "Sub-Account", volume: "$125,000", rate: "30%", status: "Active" },
												{ address: "0x789...abc", type: "Sub-Account", volume: "$89,000", rate: "25%", status: "Active" },
												{ address: "0x456...def", type: "Direct User", volume: "$32,000", rate: "35%", status: "Active" },
												].map((row, i) => (
												<tr key={i} className="border-b border-[#30363D]">
													<td className="px-4 py-3 text-white">{row.address}</td>
													<td className="px-4 py-3 text-white">{row.type}</td>
													<td className="px-4 py-3 text-white">{row.volume}</td>
													<td className="px-4 py-3 text-white">{row.rate}</td>
													<td className="px-4 py-3 font-bold"><StatusTag status={row.status} /></td>
												</tr>
												))}
											</tbody>
											</table>
										</div>
									)}

								</div>
							</div>
						</div>
						)}
						{role === "Team Leader" && (
						<div className="flex flex-col self-stretch gap-6">
							{/* Level Info / Dashboard */}
							<div className="text-left flex flex-col items-start self-stretch bg-[#161B22] p-4 gap-[17px] rounded-lg border border-solid border-[#30363D]">
								<span className="text-white text-lg font-bold" >
									{"Level Info / Dashboard"}
								</span>
								<div className="flex flex-col self-stretch gap-4">
									{/* Level Info */}
									<div className="flex flex-col lg:flex-row items-start self-stretch gap-4">
										<div className="flex flex-1 flex-col items-start">
											<span className="text-[#8B949E] text-sm" >
												{"Role"}
											</span>
											<span className="text-white text-base" >
												{"Team Leader"}
											</span>
										</div>
										<div className="flex flex-1 flex-col items-start">
											<span className="text-[#8B949E] text-sm" >
												{"Commission Rate"}
											</span>
											<span className="text-[#92318D] text-base font-bold" >
												{"35%"}
											</span>
										</div>
										<div className="flex flex-1 flex-col items-start">
											<span className="text-[#8B949E] text-sm" >
												{"Max Difference"}
											</span>
											<span className="text-white text-sm" >
												{"Up to 40% (r2 ≤ r1 ≤ r0 ≤ 0.40)"}
											</span>
										</div>
									</div>
									{/* Privileges and Withdraw */}
									<div className="flex flex-col lg:flex-row items-start self-stretch gap-4">
										{/* Privileges */}
										<div className="w-full flex flex-1 flex-col items-start bg-[#0D1117] p-4 gap-2 rounded-lg">
											<div className="flex flex-col items-center pb-[1px]">
												<span className="text-white text-sm font-bold" >
													{"Privileges:"}
												</span>
											</div>
											<div className="flex flex-col items-start self-stretch gap-1">
												<span className="text-[#8B949E] text-sm" >
													{"You can set a commission rebate rate (≤35%) for your sub-accounts. The difference in rates will be your net profit! Build and manage your team with ease while earning more."}
												</span>
											</div>
										</div>
										{/* Withdraw */}
										<div className="w-full flex flex-1 justify-between items-center bg-[#0D1117] p-4 rounded-lg">
											<div className="w-full flex flex-col items-start">
												<span className="text-[#8B949E] text-sm" >
													{"Net Commission Withdrawn"}
												</span>
												<span className="text-[#2DA44E] text-base font-bold" >
													{"$6,200"}
												</span>
											</div>
											<SecondaryButton size="small" onClick={() => alert("Withdraw pressed")}>
												Withdraw
											</SecondaryButton>
										</div>
									</div>
								</div>
							</div>
							
							{/* Upgrade to Foundation Leader / Invitation Tools */}
							<div className="flex flex-col xl:flex-row items-start self-stretch gap-3">
								{/* Upgrade to Foundation Leader */}
								<div className="w-full flex flex-col bg-[#161B22] p-4 gap-4 rounded-lg border border-solid border-[#30363D]">
									<div className="flex flex-col items-start self-stretch gap-2">
										<span className="text-white text-lg font-bold" >
											{"Remain Progress to Foundation Leader"}
										</span>
										<span className="text-[#8B949E] text-sm" >
											{"Remaining Seats 847 / 1000"}
										</span>
									</div>
									{/* Progress Bars */}
									<div className="flex flex-col self-stretch gap-3 text-left">
										{/* Invited Users and Progress Bar */}
										<div className="flex flex-col self-stretch gap-1">
											<div className="flex items-center self-stretch">
											<span className="flex-1 text-[#8B949E] text-sm">Invited Users</span>
											<span className="text-white text-sm">85 / 100</span>
											</div>
											<div className="self-stretch bg-[#30363D] rounded-full h-2">
											<div
												className="bg-[#92318D] h-2 rounded-full"
												style={{ width: `${(85 / 100) * 100}%` }}
											/>
											</div>
										</div>

										{/* Team Volume and Progress Bar */}
										<div className="flex flex-col self-stretch gap-1">
											<div className="flex items-center self-stretch">
											<span className="flex-1 text-[#8B949E] text-sm">Team Volume</span>
											<span className="text-white text-sm">$3.2M / $5M</span>
											</div>
											<div className="self-stretch bg-[#30363D] rounded-full h-2">
											<div
												className="bg-[#92318D] h-2 rounded-full"
												style={{ width: `${(3.2 / 5) * 100}%` }}
											/>
											</div>
										</div>

										{/* Active Users and Progress Bar */}
										<div className="flex flex-col self-stretch gap-1">
											<div className="flex items-center self-stretch">
											<span className="flex-1 text-[#8B949E] text-sm">3-Day Active Users</span>
											<span className="text-[#92318D] text-sm">21 / 20</span>
											</div>
											<div className="self-stretch bg-[#30363D] rounded-full h-2">
											<div
												className="bg-[#92318D] h-2 rounded-full"
												style={{ width: `${Math.min((21 / 20) * 100, 100)}%` }}
											/>
											</div>
										</div>
									</div>


									{/* Upgrade Requirements */}
									<div className="text-left flex flex-col items-start self-stretch bg-[#0D1117] p-4 gap-2 rounded-lg">
										<div className="flex flex-col items-center">
											<span className="text-[#8B949E] text-sm" >
												{"Upgrade Requirements:"}
											</span>
										</div>
										<div className="flex flex-col items-start self-stretch ">
											<span className="text-white text-sm mt-0.5 mb-1.5" >
												{"• Invite 100+ users"}
											</span>
											<span className="text-white text-sm mt-0.5 mb-1.5" >
												{"• Team trading volume ≥ $5M"}
											</span>
											<span className="text-white text-sm my-0.5" >
												{"• 20+ active users for 3 consecutive days"}
											</span>
										</div>
										<span className="text-[#8B949E] text-sm " >
											{"Once all conditions met, you can apply for Foundation Leader!"}
										</span>
									</div>
									{/* Upgrade Hints */}
									<div className="w-full">
											<Tips
											iconUrl="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/1uh405kh_expires_30_days.png"
											tips={[
												"Upgrade unlocks 100K points instantly",
											]}
											/>
										</div>
								</div>
								{/* Invitation Tools */}
								<div className="w-full flex flex-col items-start self-stretch bg-[#161B22] p-4 gap-4 rounded-md border border-solid border-[#30363D]">
									<span className="text-white text-lg font-bold" >
										{"Invitation Tools"}
									</span>
									<div className="flex flex-col self-stretch gap-4">
										<div className="flex items-center self-stretch gap-2">
											<div className="bg-[#2DA44E] w-3 h-3 rounded-[9999px]">
											</div>
											<span className="text-[#2DA44E] text-base font-bold" >
												{"Status: Activated"}
											</span>
										</div>
										<div className="flex flex-col items-start self-stretch gap-2">
											<div className="flex flex-col items-center pb-[1px]">
												<span className="text-[#8B949E] text-sm" >
													{"Your Referral Link:"}
												</span>
											</div>
											{/* Input and Buttons */}
											<div className="flex flex-col items-start self-stretch gap-2 w-full">
												{/* Input */}
												<div className="flex flex-row w-full gap-4">
													<input
														placeholder="https://riverbit.com/ref/sub_0xdef456"
														value={input1}
														onChange={(event) => onChangeInput1(event.target.value)}
														className="w-full text-white bg-[#0D1117] text-sm py-4 px-4 rounded-md border border-solid border-[#30363D]"
													/>
													<PrimaryButton size="small" onClick={() => alert("Pressed")}>
													Copy
													</PrimaryButton>
												</div>
												
												{/* Buttons container */}
												<div className="flex flex-col md:flex-row w-full md:w-auto gap-2 text-nowrap">
													<SecondaryButton size="large" onClick={() => alert("Pressed")}>
													Generate QR
													</SecondaryButton>
													<PrimaryButton size="large" onClick={() => alert("Pressed")}>
													Share on Social
													</PrimaryButton>
													
												</div>
											</div>

										</div>
									</div>
								</div>
							</div>

							{/* My Commission Summary and My Points and Rules */}
							<div className="flex flex-col self-stretch gap-3">
								{/* My Commission Summary */}
								<div className="flex flex-col items-start self-stretch gap-4">
									<span className="text-white text-lg font-bold" >
										{"My Commission Summary"}
									</span>
									<div className="flex flex-col xl:flex-row items-start self-stretch gap-4 text-left">
										<div className="w-full flex flex-1 flex-col items-start bg-[#161B22] py-6 rounded-md border border-solid border-[#30363D]">
											<span className="text-[#8B949E] text-sm mb-[7px] mx-6" >
												{"Rate"}
											</span>
											<span className="text-white text-2xl font-bold mb-[3px] mx-6" >
												{"35%"}
											</span>
										</div>
										<div className="w-full flex flex-1 flex-col items-start bg-[#161B22] py-6 rounded-md border border-solid border-[#30363D]">
											<span className="text-[#8B949E] text-sm mb-[7px] mx-[23px]" >
												{"Direct Referrals"}
											</span>
											<span className="text-white text-2xl font-bold mb-[3px] mx-[23px]" >
												{"2"}
											</span>
										</div>
										<div className="w-full flex flex-1 flex-col items-start bg-[#161B22] py-6 rounded-md border border-solid border-[#30363D]">
											<span className="text-[#8B949E] text-sm mb-[7px] mx-6" >
												{"Sub-Accounts"}
											</span>
											<span className="text-white text-2xl font-bold mb-[3px] mx-6" >
												{"2"}
											</span>
										</div>
										<div className="w-full flex flex-1 flex-col items-start bg-[#161B22] py-6 rounded-md border border-solid border-[#30363D]">
											<span className="text-[#8B949E] text-sm mb-[7px] mx-6" >
												{"Total Net Profit"}
											</span>
											<span className="text-[#2DA44E] text-2xl font-bold mb-[3px] mx-6" >
												{"$8,750"}
											</span>
										</div>
									</div>
								</div>
								{/* My Points and Rules */}
								<div className="w-full flex flex-col lg:flex-row items-start gap-4 text-left">
									<div className="flex flex-col flex-1 p-4 gap-4 bg-[#161B22] rounded-lg border border-[#30363D] w-full">
										<div className="flex flex-col items-start self-stretch gap-2">
											<span className="text-white text-lg font-bold" >
												{"My Points"}
											</span>
											<div className="flex flex-col self-stretch gap-4">
												<div className="flex items-start self-stretch gap-3">
													<div className="flex flex-1 items-center">
														<span className="text-[#8B949E] text-sm" >
															{"Total Earned:"}
														</span>
														<span className="text-white text-sm" >
															{"54.0K points"}
														</span>
													</div>
													<div className="flex flex-1 items-center">
														<span className="text-[#8B949E] text-sm" >
															{"Today:"}
														</span>
														<span className="text-[#2DA44E] text-sm mr-[75px]" >
															{"900 points ($90)"}
														</span>
													</div>
												</div>
												<div className="flex items-start self-stretch gap-3">
													<div className="flex flex-1 items-center">
														<span className="text-[#8B949E] text-sm" >
															{"Last 7 Days:"}
														</span>
														<span className="text-white text-sm" >
															{"6.3K (avg. 900/day)"} 
														</span>
													</div>
													<div className="flex flex-1 items-center gap-3.5">
														<span className="text-[#8B949E] text-sm" >
															{"Last 30 Days:"}
														</span>
														<span className="flex-1 text-white text-sm" >
															{"27.0K (avg. 900/day)"}
														</span>
													</div>
												</div>
											</div>
										</div>
										<div className="flex flex-col items-start self-stretch bg-[#0D1117] p-4 gap-2 rounded">
											<span className="text-white text-sm font-bold" >
												{"Active Address Share (20%)"}
											</span>
											<span className="text-[#8B949E] text-sm" >
												{"My Active Addresses: 18 / Total: 240 (7.5%)"}
											</span>
											<span className="text-[#2DA44E] text-sm" >
												{"Earned Today: 300 points"}
											</span>
										</div>
										<div className="flex flex-col items-start self-stretch bg-[#0D1117] p-4 gap-2 rounded">
											<span className="text-white text-sm font-bold" >
												{"Trading Volume Share (80%)"}
											</span>
											<span className="text-[#8B949E] text-sm" >
												{"My Volume: $480K / Total: $12.8M (3.75%)"}
											</span>
											<span className="text-[#2DA44E] text-sm" >
												{"Earned Today: 600 points"}
											</span>
										</div>
									</div>
									<div className="flex flex-col flex-1 p-4 gap-4 bg-[#161B22] rounded-lg border border-[#30363D] w-full">
										<span className="text-white text-lg font-bold w-full" >
											{"Points Rewards Rules"}
										</span>
										<div className="flex flex-col items-start self-stretch bg-[#0D1117] p-4 gap-2 rounded-lg">
											<span className="text-[#8B949E] text-sm" >
												{"Daily Points Pool: 4% shared with Team Leaders"}
											</span>
											<div className="flex flex-col items-start self-stretch gap-1">
												<div className="flex flex-col items-center pb-[1px]">
													<span className="text-white text-sm" >
														{"• 20% based on active addresses"}
													</span>
												</div>
												<div className="flex flex-col items-center pb-[1px]">
													<span className="text-white text-sm" >
														{"• 80% based on trading volume"}
													</span>
												</div>
												<div className="flex flex-col items-center pb-[1px]">
													<span className="text-white text-sm" >
														{"• Shared with Foundation Leaders"}
													</span>
												</div>
											</div>
										</div>
										<div className="flex flex-col items-start self-stretch gap-2">
											<span className="text-[#8B949E] text-sm" >
												{"Point Value:"}
											</span>
											<span className="text-white text-sm" >
												{"$0.10 each"}
											</span>
											<span className="text-[#92318D] text-sm" >
												{"Note: Standard Leaders share daily 4% pool but no instant rewards. Upgrade to Foundation Leader → unlock 100K points instantly."}
											</span>
										</div>
									</div>
								</div>
							</div>
							{/* Team Stats and Team Management */}
							<div className="flex flex-col xl:flex-row items-start self-stretch gap-6">
								<div className="w-full flex flex-col lg:basis-1/3 items-start bg-[#161B22] p-4 gap-4 rounded-md border border-solid border-[#30363D]">
									<span className="text-white text-lg font-bold" >
										{"Team Stats"}
									</span>
									<div className="flex flex-col gap-2 w-full">
										<div className="flex items-center justify-between w-full">
											<span className="text-[#8B949E] text-base">Members:</span>
											<span className="text-white text-base font-bold">120</span>
										</div>

										<div className="flex items-center justify-between w-full">
											<span className="text-[#8B949E] text-base">Team Trading Volume:</span>
											<span className="text-white text-base font-bold">$6.8M</span>
										</div>

										<div className="flex items-center justify-between w-full">
											<span className="text-[#8B949E] text-base">Active Users (Last 3 Days):</span>
											<span className="text-white text-base font-bold">25</span>
										</div>

										<div className="flex items-center justify-between w-full">
											<span className="text-[#8B949E] text-base">Total Commission Earned:</span>
											<span className="text-[#2DA44E] text-base font-bold">$15,600</span>
										</div>

										<div className="flex items-center justify-between w-full">
											<span className="text-[#8B949E] text-base">Points Value:</span>
											<span className="text-[#2DA44E] text-base font-bold">$29.7K</span>
										</div>
									</div>

								</div>
								{/* Team Management */}
								<div className="w-full flex flex-col lg:basis-2/3 bg-[#161B22] py-4 px-4 gap-4 rounded-md border border-solid border-[#30363D]">
									<div className="flex flex-col lg:flex-row gap-4 items-start justify-between self-stretch">
										<span className="flex text-white text-lg font-bold text-left" >
											{"Team Management"}
										</span>
										<div className="flex flex-col md:flex-row w-full md:w-auto gap-4 text-nowrap">
											<SecondaryButton onClick={() => alert("Export CSV pressed")}>
												Export CSV
											</SecondaryButton>
											<PrimaryButton onClick={() => alert("Set Commission Rates pressed")}>
												Set Commission Rates
											</PrimaryButton>
										</div>
									</div>
									<div className="flex items-start self-stretch border-b border-[#30363D] w-full">
										{/* Tabs */}
										<div className="lg:max-w-2/3 w-full ">
										<Tabs
                                            tabs={[
                                                "Direct Referrals",
                                                "Sub-Accounts",
                                                "All Members",
                                            ]}
                                            activeTab={referralTab}
                                            onTabChange={setReferralTab}
                                            />
										</div>
									</div>
									{/* Tab Content */}
									{referralTab === "Direct Referrals" && (
									<div className="overflow-x-auto text-nowrap">
										{/* Team Table */}
										<table className="min-w-full text-sm text-left border-collapse">
										<thead>
											<tr className="border-b border-[#30363D]">
											<th className="px-4 py-3 text-[#8B949E] font-bold">Address</th>
											<th className="px-4 py-3 text-[#8B949E] font-bold">Volume</th>
											<th className="px-4 py-3 text-[#8B949E] font-bold">Commission Rate</th>
											<th className="px-4 py-3 text-[#8B949E] font-bold">Action</th>
											</tr>
										</thead>
										<tbody>
											{[
											{ address: "0xdef…789", volume: "$45,000", rate: "35%", action: "Set as Sub-Account" },
											{ address: "0x456…def", volume: "$32,000", rate: "35%", action: "Set as Sub-Account" },
											].map((row, i) => (
											<tr key={i} className="border-b border-[#30363D]">
												<td className="px-4 py-3 text-white">{row.address}</td>
												<td className="px-4 py-3 text-white">{row.volume}</td>
												<td className="px-4 py-3 text-white">{row.rate}</td>
												<td className="px-4 py-3 flex gap-2 text-nowrap">
												<SecondaryButton size="small" onClick={() => alert(row.action)}>
													{row.action}
												</SecondaryButton>
												</td>
											</tr>
											))}
										</tbody>
										</table>
									</div>
									)}

									{referralTab === "Sub-Accounts" && (
									<div>
										<div className="overflow-x-auto flex flex-col gap-4">
										{/* Team Table */}
										<table className="text-nowrap min-w-full text-sm text-left border-collapse">
											<thead>
											<tr className="border-b border-[#30363D]">
												<th className="px-4 py-3 text-[#8B949E] font-bold">Address</th>
												<th className="px-4 py-3 text-[#8B949E] font-bold">Volume</th>
												<th className="px-4 py-3 text-[#8B949E] font-bold">Commission Rate</th>
												<th className="px-4 py-3 text-[#8B949E] font-bold">Your Earnings</th>
												<th className="px-4 py-3 text-[#8B949E] font-bold">Action</th>
											</tr>
											</thead>
											<tbody>
											{[
												{ address: "0x123…456", volume: "$125,000", rate: "30%", earnings: "Net: 5.0%", action: "Set Rate" },
												{ address: "0x789…abc", volume: "$89,000", rate: "25%", earnings: "Net: 10.0%", action: "Set Rate" },
											].map((row, i) => (
												<tr key={i} className="border-b border-[#30363D]">
												<td className="px-4 py-3 text-white">{row.address}</td>
												<td className="px-4 py-3 text-white">{row.volume}</td>
												<td className="px-4 py-3 text-white">{row.rate}</td>
												<td className="px-4 py-3 text-[#2DA44E] font-bold">{row.earnings}</td>
												<td className="px-4 py-3 flex gap-2 text-nowrap">
													<PrimaryButton size="small"  onClick={() => setShowAdjustCommissionRateModal(true)}>
													{row.action}
													</PrimaryButton>
												</td>
												</tr>
											))}
											</tbody>
										</table>
										</div>
										<div className="w-full">
										<Tips
											iconUrl="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/1uh405kh_expires_30_days.png"
											tips={[
											"You can set up to 35% commission for sub-accounts. The difference will be your earnings.",
											]}
										/>
										</div>
									</div>
									)}

									{referralTab === "All Members" && (
									<div className="overflow-x-auto text-nowrap">
										{/* Team Table */}
										<table className="min-w-full text-sm text-left border-collapse">
										<thead>
											<tr className="border-b border-[#30363D]">
											<th className="px-4 py-3 text-[#8B949E] font-bold">Address</th>
											<th className="px-4 py-3 text-[#8B949E] font-bold">Type</th>
											<th className="px-4 py-3 text-[#8B949E] font-bold">Volume</th>
											<th className="px-4 py-3 text-[#8B949E] font-bold">Commission Rate</th>
											<th className="px-4 py-3 text-[#8B949E] font-bold">Status</th>
											</tr>
										</thead>
										<tbody>
											{[
											{ address: "0xabc…123", type: "Direct Referral", volume: "$45,000", rate: "35%", status: "Active" },
											{ address: "0xdef…456", type: "Sub-Account", volume: "$125,000", rate: "30%", status: "Active" },
											{ address: "0x789…abc", type: "Sub-Account", volume: "$89,000", rate: "25%", status: "Active" },
											{ address: "0x456…def", type: "Direct Referral", volume: "$32,000", rate: "35%", status: "Active" },
											].map((row, i) => (
											<tr key={i} className="border-b border-[#30363D]">
												<td className="px-4 py-3 text-white">{row.address}</td>
												<td className="px-4 py-3 text-white">{row.type}</td>
												<td className="px-4 py-3 text-white">{row.volume}</td>
												<td className="px-4 py-3 text-white">{row.rate}</td>
												<td className="px-4 py-3 font-bold">
												<StatusTag status={row.status} />
												</td>
											</tr>
											))}
										</tbody>
										</table>
									</div>
									)}


								</div>
							</div>
						</div>
						)}
						{role === "Sub-Account" && (
						<div className="flex flex-col self-stretch gap-6">
							{/* Level Info / Dashboard */}
							<div className="text-left flex flex-col items-start self-stretch bg-[#161B22] p-4 gap-[17px] rounded-lg border border-solid border-[#30363D]">
								<span className="text-white text-lg font-bold" >
									{"Level Info / Dashboard"}
								</span>
								<div className="flex flex-col self-stretch gap-4">
									{/* Level Info */}
									<div className="flex flex-col lg:flex-row items-start self-stretch gap-4">
										<div className="flex flex-1 flex-col items-start">
											<span className="text-[#8B949E] text-sm" >
												{"Role"}
											</span>
											<span className="text-white text-base" >
												{"Sub-Account"}
											</span>
										</div>
										<div className="flex flex-1 flex-col items-start">
											<span className="text-[#8B949E] text-sm" >
												{"Commission Rate"}
											</span>
											<span className="text-[#92318D] text-base font-bold" >
												{"15%"}
											</span>
										</div>
										<div className="flex flex-1 flex-col items-start">
											<span className="text-[#8B949E] text-sm" >
												{"Max Rate You Can Assign:"}
											</span>
											<span className="text-[#92318D] text-base font-bold" >
												{"12%"}
											</span>
										</div>
										<div className="flex flex-1 flex-col items-start">
											<span className="text-[#8B949E] text-sm" >
												{"Max Difference"}
											</span>
											<span className="text-white text-sm" >
												{"Up to 40% (r2 ≤ r1 ≤ r0 ≤ 0.40)"}
											</span>
										</div>
									</div>
									{/* Privileges and Withdraw */}
									<div className="flex flex-col lg:flex-row items-start self-stretch gap-4">
										{/* Privileges */}
										<div className="w-full flex flex-1 flex-col items-start bg-[#0D1117] p-4 gap-2 rounded-lg">
											<div className="flex flex-col items-center pb-[1px]">
												<span className="text-white text-sm font-bold" >
													{"Privileges:"}
												</span>
											</div>
											<div className="flex flex-col items-start self-stretch gap-1">
												<span className="text-[#8B949E] text-sm" >
													{"After upgrading to a Sub-Account, you can invite trading users and set their commission rebate rate (up to 12%). The difference becomes your net profit!"}
												</span>
											</div>
										</div>
										{/* Withdraw */}
										<div className="w-full flex flex-1 justify-between items-center bg-[#0D1117] p-4 rounded-lg">
											<div className="w-full flex flex-col items-start">
												<span className="text-[#8B949E] text-sm" >
													{"Net Commission Withdrawn"}
												</span>
												<span className="text-[#2DA44E] text-base font-bold" >
													{"$2,850"}
												</span>
											</div>
											<SecondaryButton size="small" onClick={() => alert("Withdraw pressed")}>
												Withdraw
											</SecondaryButton>
										</div>
									</div>
								</div>
							</div>
							
							{/* Upgrade to Team Leader / Invitation Tools */}
							<div className="flex flex-col xl:flex-row items-start self-stretch gap-3">
								{/* Upgrade to Team Leader */}
								<div className="w-full flex flex-col bg-[#161B22] p-4 gap-4 rounded-lg border border-solid border-[#30363D]">
									<div className="flex flex-col items-start self-stretch gap-2">
										<span className="text-white text-lg font-bold" >
											{"Remain Progress to Team Leader"}
										</span>
									</div>
									{/* Progress Bars */}
									<div className="flex flex-col self-stretch gap-3 text-left">
										{/* Invited Users and Progress Bar */}
										<div className="flex flex-col self-stretch gap-1">
											<div className="flex items-center self-stretch">
											<span className="flex-1 text-[#8B949E] text-sm">Invited Users</span>
											<span className="text-white text-sm">15 / 20</span>
											</div>
											<div className="self-stretch bg-[#30363D] rounded-full h-2">
											<div
												className="bg-[#92318D] h-2 rounded-full"
												style={{ width: `${(15 / 20) * 100}%` }}
											/>
											</div>
										</div>

										{/* Team Volume and Progress Bar */}
										<div className="flex flex-col self-stretch gap-1">
											<div className="flex items-center self-stretch">
											<span className="flex-1 text-[#8B949E] text-sm">Team Volume</span>
											<span className="text-white text-sm">$680.0K / 1.0M</span>
											</div>
											<div className="self-stretch bg-[#30363D] rounded-full h-2">
											<div
												className="bg-[#92318D] h-2 rounded-full"
												style={{ width: `${(680.0 / 1000) * 100}%` }}
											/>
											</div>
										</div>
									</div>


									{/* Upgrade Requirements */}
									<div className="text-left flex flex-col items-start self-stretch bg-[#0D1117] p-4 gap-2 rounded-lg">
										<div className="flex flex-col items-center">
											<span className="text-[#8B949E] text-sm" >
												{"Upgrade Requirements:"}
											</span>
										</div>
										<div className="flex flex-col items-start self-stretch ">
											<span className="text-white text-sm mt-0.5 mb-1.5" >
												{"• Invite 20 users"}
											</span>
											<span className="text-white text-sm mt-0.5 mb-1.5" >
												{"• Team trading volume ≥ $1,000,000 USD."}
											</span>
										</div>
										<span className="text-[#8B949E] text-sm " >
											{"Once all conditions met, you can apply for Team Leader!"}
										</span>
									</div>
								</div>
								{/* Invitation Tools */}
								<div className="w-full flex flex-col items-start self-stretch bg-[#161B22] p-4 gap-4 rounded-md border border-solid border-[#30363D]">
									<span className="text-white text-lg font-bold" >
										{"Invitation Tools"}
									</span>
									<div className="flex flex-col self-stretch gap-4">
										<div className="flex items-center self-stretch gap-2">
											<div className="bg-[#2DA44E] w-3 h-3 rounded-[9999px]">
											</div>
											<span className="text-[#2DA44E] text-base font-bold" >
												{"Status: Activated"}
											</span>
										</div>
										<div className="flex flex-col items-start self-stretch gap-2">
											<div className="flex flex-col items-center pb-[1px]">
												<span className="text-[#8B949E] text-sm" >
													{"Your Referral Link:"}
												</span>
											</div>
											{/* Input and Buttons */}
											<div className="flex flex-col items-start self-stretch gap-2 w-full">
												{/* Input */}
												<div className="flex flex-row w-full gap-4">
													<input
														placeholder="https://riverbit.com/ref/sub_0xdef456"
														value={input1}
														onChange={(event) => onChangeInput1(event.target.value)}
														className="w-full text-white bg-[#0D1117] text-sm py-4 px-4 rounded-md border border-solid border-[#30363D]"
													/>
													<PrimaryButton size="small" onClick={() => alert("Pressed")}>
													Copy
													</PrimaryButton>
												</div>
												
												{/* Buttons container */}
												<div className="flex flex-col md:flex-row w-full md:w-auto gap-2 text-nowrap">
													<SecondaryButton size="large" onClick={() => alert("Pressed")}>
													Generate QR
													</SecondaryButton>
													<PrimaryButton size="large" onClick={() => alert("Pressed")}>
													Share on Social
													</PrimaryButton>
												</div>
												{/* Tips */}
												<div className="w-full">
													<Tips
														iconUrl="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/1uh405kh_expires_30_days.png"
														tips={[
														"You can set a different commission rate for each invited user, up to 12%.",
														]}
													/>
												</div>
											</div>

										</div>
									</div>
								</div>
							</div>

							{/* My Commission Summary and My Points and Rules */}
							<div className="flex flex-col self-stretch gap-3">
								{/* My Commission Summary */}
								<div className="flex flex-col items-start self-stretch gap-4">
									<span className="text-white text-lg font-bold" >
										{"My Commission Summary"}
									</span>
									<div className="flex flex-col xl:flex-row items-start self-stretch gap-4 text-left">
										<div className="w-full flex flex-1 flex-col items-start bg-[#161B22] py-6 rounded-md border border-solid border-[#30363D]">
											<span className="text-[#8B949E] text-sm mb-[7px] mx-6" >
												{"Rate"}
											</span>
											<span className="text-white text-2xl font-bold mb-[3px] mx-6" >
												{"15%"}
											</span>
										</div>
										<div className="w-full flex flex-1 flex-col items-start bg-[#161B22] py-6 rounded-md border border-solid border-[#30363D]">
											<span className="text-[#8B949E] text-sm mb-[7px] mx-6" >
												{"Total Net Profit"}
											</span>
											<span className="text-[#2DA44E] text-2xl font-bold mb-[3px] mx-6" >
												{"$1,250"}
											</span>
										</div>
									</div>
								</div>
							</div>
							{/* Team Stats and Team Management */}
							<div className="flex flex-col xl:flex-row items-start self-stretch gap-6">
								<div className="w-full flex flex-col lg:basis-1/3 items-start bg-[#161B22] p-4 gap-4 rounded-md border border-solid border-[#30363D]">
									<span className="text-white text-lg font-bold" >
										{"Team Stats"}
									</span>
									<div className="flex flex-col gap-2 w-full">
										<div className="flex items-center justify-between w-full">
											<span className="text-[#8B949E] text-base">Members:</span>
											<span className="text-white text-base font-bold">5</span>
										</div>

										<div className="flex items-center justify-between w-full">
											<span className="text-[#8B949E] text-base">Team Trading Volume:</span>
											<span className="text-white text-base font-bold">$100K</span>
										</div>

										<div className="flex items-center justify-between w-full">
											<span className="text-[#8B949E] text-base">Active Users (Last 3 Days):</span>
											<span className="text-white text-base font-bold">5</span>
										</div>

										<div className="flex items-center justify-between w-full">
											<span className="text-[#8B949E] text-base">Total Commission Earned:</span>
											<span className="text-[#2DA44E] text-base font-bold">$2,850</span>
										</div>

										<div className="flex items-center justify-between w-full">
											<span className="text-[#8B949E] text-base">Points Value:</span>
											<span className="text-[#2DA44E] text-base font-bold">$28.5K</span>
										</div>
									</div>

								</div>
								{/* Team Management */}
								<div className="w-full flex flex-col lg:basis-2/3 bg-[#161B22] py-4 px-4 gap-4 rounded-md border border-solid border-[#30363D]">
									<div className="flex flex-col lg:flex-row gap-4 items-start justify-between self-stretch">
										<span className="flex text-white text-lg font-bold text-left" >
											{"Team Management"}
										</span>
										<div className="flex flex-col md:flex-row w-full md:w-auto gap-4 text-nowrap">
											<SecondaryButton onClick={() => alert("Export CSV pressed")}>
												Export CSV
											</SecondaryButton>
											<PrimaryButton onClick={() => alert("Set Commission Rates pressed")}>
												Set Commission Rates
											</PrimaryButton>
										</div>
									</div>
									{/* Team Table */}
									<div>
										<div className="overflow-x-auto flex flex-col gap-4">
										<table className="text-nowrap min-w-full text-sm text-left border-collapse">
											<thead>
											<tr className="border-b border-[#30363D]">
												<th className="px-4 py-3 text-[#8B949E] font-bold">Address</th>
												<th className="px-4 py-3 text-[#8B949E] font-bold">Volume</th>
												<th className="px-4 py-3 text-[#8B949E] font-bold">Commission Rate</th>
												<th className="px-4 py-3 text-[#8B949E] font-bold">Your Earnings</th>
												<th className="px-4 py-3 text-[#8B949E] font-bold">Action</th>
											</tr>
											</thead>
											<tbody>
											{[
												{ address: "0x123...789", volume: "$45,000", rate: "8%", earnings: "$360", action: "Set Rate" },
												{ address: "0x456...abc", volume: "$32,000", rate: "10%", earnings: "$320", action: "Set Rate" },
												{ address: "0x789...def", volume: "$28,000", rate: "12%", earnings: "$336", action: "Set Rate" },
											].map((row, i) => (
												<tr key={i} className="border-b border-[#30363D]">
												<td className="px-4 py-3 text-white">{row.address}</td>
												<td className="px-4 py-3 text-white">{row.volume}</td>
												<td className="px-4 py-3 text-white">{row.rate}</td>
												<td className="px-4 py-3 text-[#2DA44E] font-bold">{row.earnings}</td>
												<td className="px-4 py-3 flex gap-2 text-nowrap">
													<PrimaryButton size="small" onClick={() => setShowAdjustCommissionRateModal(true)}>
													{row.action}
													</PrimaryButton>
												</td>
												</tr>
											))}
											</tbody>
										</table>
										</div>
										<div className="w-full">
										<Tips
											iconUrl="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/1uh405kh_expires_30_days.png"
											tips={[
											"You can set a commission rate for invited users (≤12%), and the difference will be your net earnings. For example, with a base commission of 15%, if you set 12% for the user, you earn 3% net profit. Sub-accounts can flexibly set commission rates, helping you achieve the best balance of earnings.",
											]}
										/>
										</div>
									</div>


								</div>
							</div>
						</div>
						)}
						{role === "C2C User" && (
						<div className="flex flex-col self-stretch gap-6">
							{/* Level Info / Dashboard */}
							<div className="text-left flex flex-col items-start self-stretch bg-[#161B22] p-4 gap-[17px] rounded-lg border border-solid border-[#30363D]">
								<span className="text-white text-lg font-bold" >
									{"Level Info / Dashboard"}
								</span>
								<div className="flex flex-col self-stretch gap-4">
									{/* Level Info */}
									<div className="flex flex-col lg:flex-row items-start self-stretch gap-4">
										<div className="flex flex-1 flex-col items-start">
											<span className="text-[#8B949E] text-sm" >
												{"Role"}
											</span>
											<span className="text-white text-base" >
												{"C2C User"}
											</span>
										</div>
										<div className="flex flex-1 flex-col items-start">
											<span className="text-[#8B949E] text-sm" >
												{"Commission Rate"}
											</span>
											<span className="text-[#92318D] text-base font-bold" >
												{"10%"}
											</span>
										</div>
										<div className="flex flex-1 flex-col items-start">
											<span className="text-[#8B949E] text-sm" >
												{"Max Rate You Can Assign:"}
											</span>
											<span className="text-[#92318D] text-base font-bold" >
												{"12%"}
											</span>
										</div>
										<div className="flex flex-1 flex-col items-start">
											<span className="text-[#8B949E] text-sm" >
												{"Max Difference"}
											</span>
											<span className="text-white text-sm" >
												{"Up to 40% (r2 ≤ r1 ≤ r0 ≤ 0.40)"}
											</span>
										</div>
									</div>
									{/* Privileges and Withdraw */}
									<div className="flex flex-col lg:flex-row items-start self-stretch gap-4">
										{/* Privileges */}
										<div className="w-full flex flex-1 flex-col items-start bg-[#0D1117] p-4 gap-2 rounded-lg">
											<div className="flex flex-col items-center pb-[1px]">
												<span className="text-white text-sm font-bold" >
													{"Privileges:"}
												</span>
											</div>
											<div className="flex flex-col items-start self-stretch gap-1">
												<span className="text-[#8B949E] text-sm" >
													{"For every invited user’s trades, you earn 10% of their transaction fees as commission!"}
												</span>
											</div>
										</div>
										{/* Withdraw */}
										<div className="w-full flex flex-1 justify-between items-center bg-[#0D1117] p-4 rounded-lg">
											<div className="w-full flex flex-col items-start">
												<span className="text-[#8B949E] text-sm" >
													{"Net Commission Withdrawn"}
												</span>
												<span className="text-[#2DA44E] text-base font-bold" >
													{"$1,250"}
												</span>
											</div>
											<SecondaryButton size="small" onClick={() => alert("Withdraw pressed")}>
												Withdraw
											</SecondaryButton>
										</div>
									</div>
								</div>
							</div>
							
							{/* Upgrade to Team Leader / Invitation Tools */}
							<div className="flex flex-col xl:flex-row items-start self-stretch gap-3">
								{/* Upgrade to Team Leader */}
								<div className="w-full flex flex-col bg-[#161B22] p-4 gap-4 rounded-lg border border-solid border-[#30363D]">
									<div className="flex flex-col items-start self-stretch gap-2">
										<span className="text-white text-lg font-bold" >
											{"Remain Progress to Team Leader"}
										</span>
									</div>
									{/* Progress Bars */}
									<div className="flex flex-col self-stretch gap-3 text-left">
										{/* Invited Users and Progress Bar */}
										<div className="flex flex-col self-stretch gap-1">
											<div className="flex items-center self-stretch">
											<span className="flex-1 text-[#8B949E] text-sm">Invited Users</span>
											<span className="text-white text-sm">12 / 20</span>
											</div>
											<div className="self-stretch bg-[#30363D] rounded-full h-2">
											<div
												className="bg-[#92318D] h-2 rounded-full"
												style={{ width: `${(12 / 20) * 100}%` }}
											/>
											</div>
										</div>

										{/* Team Volume and Progress Bar */}
										<div className="flex flex-col self-stretch gap-1">
											<div className="flex items-center self-stretch">
											<span className="flex-1 text-[#8B949E] text-sm">Team Volume</span>
											<span className="text-white text-sm">$450.0K / 1.0M</span>
											</div>
											<div className="self-stretch bg-[#30363D] rounded-full h-2">
											<div
												className="bg-[#92318D] h-2 rounded-full"
												style={{ width: `${(450.0 / 1000) * 100}%` }}
											/>
											</div>
										</div>
									</div>


									{/* Upgrade Requirements */}
									<div className="text-left flex flex-col items-start self-stretch bg-[#0D1117] p-4 gap-2 rounded-lg">
										<div className="flex flex-col items-center">
											<span className="text-[#8B949E] text-sm" >
												{"Upgrade Requirements:"}
											</span>
										</div>
										<div className="flex flex-col items-start self-stretch ">
											<span className="text-white text-sm mt-0.5 mb-1.5" >
												{"• Invite 20 users"}
											</span>
											<span className="text-white text-sm mt-0.5 mb-1.5" >
												{"• Team trading volume ≥ $1,000,000 USD."}
											</span>
										</div>
										<span className="text-[#8B949E] text-sm " >
											{"Once all conditions met, you can apply for Team Leader!"}
										</span>
									</div>
								</div>
								{/* Invitation Tools */}
								<div className="w-full flex flex-col items-start self-stretch bg-[#161B22] p-4 gap-4 rounded-md border border-solid border-[#30363D]">
									<span className="text-white text-lg font-bold" >
										{"Invitation Tools"}
									</span>
									<div className="flex flex-col self-stretch gap-4">
										<div className="flex items-center self-stretch gap-2">
											<div className="bg-[#2DA44E] w-3 h-3 rounded-[9999px]">
											</div>
											<span className="text-[#2DA44E] text-base font-bold" >
												{"Status: Activated"}
											</span>
										</div>
										<div className="flex flex-col items-start self-stretch gap-2">
											<div className="flex flex-col items-center pb-[1px]">
												<span className="text-[#8B949E] text-sm" >
													{"Your Referral Link:"}
												</span>
											</div>
											{/* Input and Buttons */}
											<div className="flex flex-col items-start self-stretch gap-2 w-full">
												{/* Input */}
												<div className="flex flex-row w-full gap-4">
													<input
														placeholder="https://riverbit.com/ref/0xabc123"
														value={input1}
														onChange={(event) => onChangeInput1(event.target.value)}
														className="w-full text-white bg-[#0D1117] text-sm py-4 px-4 rounded-md border border-solid border-[#30363D]"
													/>
													<PrimaryButton size="small" onClick={() => alert("Pressed")}>
													Copy
													</PrimaryButton>
												</div>
												
												{/* Buttons container */}
												<div className="flex flex-col md:flex-row w-full md:w-auto gap-2 text-nowrap">
													<SecondaryButton size="large" onClick={() => alert("Pressed")}>
													Generate QR
													</SecondaryButton>
													<PrimaryButton size="large" onClick={() => alert("Pressed")}>
													Share on Social
													</PrimaryButton>
												</div>
												{/* Tips */}
												<div className="w-full">
													<Tips
														iconUrl="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/1uh405kh_expires_30_days.png"
														tips={[
														"As a C2C user, you earn 10% commission rebates on trading fees — and your invited users also share in the rewards!",
														]}
													/>
												</div>
											</div>

										</div>
									</div>
								</div>
							</div>

							{/* My Commission Summary and My Points and Rules */}
							<div className="flex flex-col self-stretch gap-3">
								{/* My Commission Summary */}
								<div className="flex flex-col items-start self-stretch gap-4">
									<span className="text-white text-lg font-bold" >
										{"My Commission Summary"}
									</span>
									<div className="flex flex-col xl:flex-row items-start self-stretch gap-4 text-left">
										<div className="w-full flex flex-1 flex-col items-start bg-[#161B22] py-6 rounded-md border border-solid border-[#30363D]">
											<span className="text-[#8B949E] text-sm mb-[7px] mx-6" >
												{"Rate"}
											</span>
											<span className="text-white text-2xl font-bold mb-[3px] mx-6" >
												{"10%"}
											</span>
										</div>
										<div className="w-full flex flex-1 flex-col items-start bg-[#161B22] py-6 rounded-md border border-solid border-[#30363D]">
											<span className="text-[#8B949E] text-sm mb-[7px] mx-6" >
												{"Trading Volume"}
											</span>
											<span className="text-white text-2xl font-bold mb-[3px] mx-6" >
												{"75.0K"}
											</span>
										</div>
										<div className="w-full flex flex-1 flex-col items-start bg-[#161B22] py-6 rounded-md border border-solid border-[#30363D]">
											<span className="text-[#8B949E] text-sm mb-[7px] mx-6" >
												{"Total Net Profit"}
											</span>
											<span className="text-[#2DA44E] text-2xl font-bold mb-[3px] mx-6" >
												{"$1,250"}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						)}
						{role === "Candidate User" && (
						<div className="flex flex-col self-stretch gap-6">
							{/* Level Info / Dashboard */}
							<div className="text-left flex flex-col items-start self-stretch bg-[#161B22] p-4 gap-[17px] rounded-lg border border-solid border-[#30363D]">
								<span className="text-white text-lg font-bold" >
									{"Level Info / Dashboard"}
								</span>
								<div className="flex flex-col self-stretch gap-4">
									{/* Level Info */}
									<div className="flex flex-col lg:flex-row items-start self-stretch gap-4">
										<div className="flex flex-1 flex-col items-start">
											<span className="text-[#8B949E] text-sm" >
												{"Role"}
											</span>
											<span className="text-white text-base" >
												{"Candidate User"}
											</span>
										</div>
										<div className="flex flex-1 flex-col items-start">
											<span className="text-[#8B949E] text-sm" >
												{"Commission Rate"}
											</span>
											<span className="text-[#92318D] text-base font-bold" >
												{"-"}
											</span>
										</div>
										<div className="flex flex-1 flex-col items-start">
											<span className="text-[#8B949E] text-sm" >
												{"Max Difference"}
											</span>
											<span className="text-white text-sm" >
												{"Up to 40% (r2 ≤ r1 ≤ r0 ≤ 0.40)"}
											</span>
										</div>
									</div>
								</div>
							</div>
							
							<div className="text-left flex flex-col items-start self-stretch bg-[#161B22] p-4 gap-4 rounded-lg border border-solid border-[#30363D]">
								<span className="w-full *:text-white text-lg font-bold" >
									{"Remain Progress to C2C User"}
								</span>
								<div className="flex flex-col self-stretch gap-2 mb-4">
									<div className="flex items-center self-stretch">
										<span className="text-left flex-1 text-[#8B949E] text-sm" >
											{"Trading Volume"}
										</span>
										<span className="text-white text-sm" >
											{"$35,000.00 / 50,000.00"}
										</span>
									</div>
									<div className="self-stretch bg-[#30363D] rounded-[9999px]">
										<div
											className="bg-[#92318D] h-2 rounded-full"
											style={{ width: `${(35000 / 50000) * 100}%` }}
										/>
									</div>
								</div>
								{/* Upgrade Requirements */}
								{/* Tips */}
								<div className="w-full">
									<Tips
										title="Upgrade Requirements:"
										tips={[
										"Once you reach $50,000 in trading volume, you will automatically receive an invitation link and start earning 10% commission rebates on trading fees.",
										]}
									/>
								</div>
							</div>
						</div>
						)}
						{/* End of Tab Content */}
					</div>
				</div>
				{showAdjustCommissionRateModal && (
					<div className="w-full fixed inset-0 z-50 flex items-center justify-center bg-black/60">
						<div
						className="relative w-full h-full md:w-[500px] md:h-auto md:rounded-xl flex flex-col justify-center"
						style={{ maxWidth: "100vw", maxHeight: "100vh" }}
						>
						{/* Modal Content */}
						<AdjustCommissionRateModal 
							commissionRate={30}
							userAddress="0x555…666"
							onClose={() => setShowAdjustCommissionRateModal(false)} />
						</div>
					</div>
				)}
				<Footer />
			</div>
		</div>
	)
}

export default Referral