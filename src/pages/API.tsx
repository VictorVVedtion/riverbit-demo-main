import {useEffect, useRef, useState} from "react";
import RiverbitLogo from "../components/RiverbitLogo";
import DesktopNav from "../components/DesktopNav";
import Footer from "../components/Footer";
import DesktopNavRight from "../components/DesktopNavRight";
import MobileHeader from "../components/MobileHeader";
import MobileMenu from "../components/MobileMenu";
const API = () => {
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
							<div className="flex flex-col items-center pb-[1px]">
								<span className="text-white text-3xl font-bold" >
									{"API Tools"}
								</span>
							</div>
							{/* Description and System Status */}
							<div className="flex flex-col lg:flex-row gap-2 justify-between items-start self-stretch">
								<div className="flex flex-col shrink-0 items-center">
									<span className="text-[#8B949E] text-base" >
										{"Developer tools and API management"}
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
						<div className="flex flex-col self-stretch gap-3">
							<div className="flex flex-col items-start self-stretch bg-[#161B22] p-6 gap-4 rounded-lg border border-solid border-[#30363D]">
								<span className="text-white text-lg font-bold" >
									{"Actions"}
								</span>
								<div className="flex flex-col lg:flex-row gap-4 w-full">
									<div className="w-full lg:w-1/4 flex flex-col p-8 gap-4 rounded-lg" style={{ backgroundColor: "#92318D" }}>
										<img
										src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/n9sykxhy_expires_30_days.png"
										className="h-7 rounded-lg object-fill mx-auto"
										/>
										<span className="text-white text-sm font-bold text-center">Create API Key</span>
									</div>

									<div className="w-full lg:w-1/4 flex flex-col p-8 gap-4 rounded-lg border border-[#30363D]" style={{ backgroundColor: "#0D1117" }}>
										<img
										src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/s5g8qhzh_expires_30_days.png"
										className="h-7 rounded-lg object-fill mx-auto"
										/>
										<span className="text-white text-sm font-bold text-center">View API Documentation</span>
									</div>

									<div className="w-full lg:w-1/4 flex flex-col p-8 gap-4 rounded-lg border border-[#30363D]" style={{ backgroundColor: "#0D1117" }}>
										<img
										src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/ayoovr7s_expires_30_days.png"
										className="h-7 rounded-lg object-fill mx-auto"
										/>
										<span className="text-white text-sm font-bold text-center">Download SDK</span>
									</div>

									<div className="w-full lg:w-1/4 flex flex-col p-8 gap-4 rounded-lg border border-[#30363D]" style={{ backgroundColor: "#0D1117" }}>
										<img
										src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/6m5u7q1n_expires_30_days.png"
										className="h-7 rounded-lg object-fill mx-auto"
										/>
										<span className="text-white text-sm font-bold text-center">Test Tools</span>
									</div>
								</div>
							</div>
							<div className="flex items-start self-stretch gap-3 xl:flex-row flex-col">
								<div className="flex basis-1/3 flex-col shrink-0 items-center gap-4 w-full">
									<div className="w-full flex flex-col items-start bg-[#161B22] p-6 gap-4 rounded-lg border border-solid border-[#30363D]">
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

										<span className="text-white text-lg font-bold " >
											{"API Key Management"}
										</span>
										<div className="flex flex-col items-start gap-3">
											<span className="text-[#92318D] text-sm font-bold" >
												{"All"}
											</span>
											<span className="text-[#8B949E] text-sm" >
												{"Active Keys"}
											</span>
											<span className="text-[#8B949E] text-sm" >
												{"Disabled Keys"}
											</span>
											<span className="text-[#8B949E] text-sm" >
												{"Paused Keys"}
											</span>
										</div>
									</div>
									<div className="w-full flex flex-col items-start bg-[#161B22] p-6 gap-4 rounded-lg border border-solid border-[#30363D]">
										<span className="text-white text-lg font-bold " >
											{"Usage Statistics"}
										</span>
										<div className="flex flex-col items-start gap-2 w-full">
											<div className="flex items-center w-full justify-between">
												<span className="text-[#8B949E] text-sm " >
													{"Requests Today:"}
												</span>
												<span className="text-white text-sm" >
													{"1,250"}
												</span>
											</div>
											<div className="flex items-center w-full justify-between">
												<span className="text-[#8B949E] text-sm " >
													{"Requests This Month:"}
												</span>
												<span className="text-white text-sm" >
													{"28,500"}
												</span>
											</div>
										</div>
									</div>
									<div className="w-full flex flex-col items-start bg-[#161B22] p-6 gap-4 rounded-lg border border-solid border-[#30363D]">
										<div className="flex flex-col items-center ">
											<span className="text-white text-lg font-bold" >
												{"Contact Us"}
											</span>
										</div>
										{/* Social Media Inputs */}
										<div className="flex flex-col items-start gap-3 w-full">
											<div className="flex items-center bg-[#0D1117] p-3 gap-3 rounded-lg w-full">
												<img
													src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/mmuf8gre_expires_30_days.png"} 
													className="w-6 h-6 rounded-lg object-fill"
												/>
												<input
													placeholder={"Discord"}
													value={input1}
													onChange={(event)=>onChangeInput1(event.target.value)}
													className="text-white bg-transparent text-sm w-12 py-[3px] border-0"
												/>
											</div>
											<div className="flex items-center bg-[#0D1117] p-3 gap-3 rounded-lg w-full">
												<img
													src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/yqwbptrv_expires_30_days.png"} 
													className="w-6 h-6 rounded-lg object-fill"
												/>
												<input
													placeholder={"X"}
													value={input2}
													onChange={(event)=>onChangeInput2(event.target.value)}
													className="text-white bg-transparent text-sm w-2 py-[3px] border-0"
												/>
											</div>
											<div className="flex items-center bg-[#0D1117] p-3 gap-3 rounded-lg w-full">
												<img
													src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/je4r14de_expires_30_days.png"} 
													className="w-6 h-6 rounded-lg object-fill"
												/>
												<input
													placeholder={"Telegram"}
													value={input3}
													onChange={(event)=>onChangeInput3(event.target.value)}
													className="text-white bg-transparent text-sm w-[59px] py-[3px] border-0"
												/>
											</div>
											<div className="flex items-center bg-[#0D1117] p-3 gap-3 rounded-lg w-full">
												<img
													src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/bj7y10zi_expires_30_days.png"} 
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
								<div className=" w-full flex flex-col basis-2/3 bg-[#161B22] p-6 gap-4 text-left rounded-lg border border-solid border-[#30363D]">
									<div className="text-left flex flex-col items-start self-stretch">
										<span className="text-white text-xl font-bold" >
											{"API Key Management"}
										</span>
									</div>
									<div className="overflow-x-auto w-full">
										<table className="min-w-full divide-y divide-zinc-700">
											<thead >
											<tr>
												{["Key ID", "Name", "Permissions", "Status", "Created On", "Last Used"].map((header) => (
												<th
													key={header}
													className="px-4 py-2 text-left text-sm font-bold text-[#8B949E]"
												>
													{header}
												</th>
												))}
											</tr>
											</thead>
											<tbody className="divide-y divide-zinc-700">
											{[
												{
												key: "RB_001",
												name: "Trading Bot",
												permissions: "Read, Trade, Withdraw",
												status: "Active",
												statusColor: "bg-[#2DA44E]",
												created: "2025-08-15",
												lastUsed: "2025-09-06 16:23",
												},
												{
												key: "RB_002",
												name: "Portfolio Tracker",
												permissions: "Read",
												status: "Active",
												statusColor: "bg-[#2DA44E]",
												created: "2025-08-10",
												lastUsed: "2025-09-06 15:45",
												},
												{
												key: "RB_003",
												name: "Risk Management",
												permissions: "Read, Trade",
												status: "Active",
												statusColor: "bg-[#2DA44E]",
												created: "2025-07-22",
												lastUsed: "2025-09-06 14:20",
												},
												{
												key: "RB_004",
												name: "Data Analysis",
												permissions: "Read",
												status: "Paused",
												statusColor: "bg-[#30363D]",
												created: "2025-07-05",
												lastUsed: "2025-08-28 11:30",
												},
												{
												key: "RB_005",
												name: "Arbitrage Bot",
												permissions: "Read, Trade",
												status: "Active",
												statusColor: "bg-[#2DA44E]",
												created: "2025-06-18",
												lastUsed: "2025-09-06 16:18",
												},
												{
												key: "RB_006",
												name: "Market Maker",
												permissions: "Read, Trade",
												status: "Active",
												statusColor: "bg-[#2DA44E]",
												created: "2025-06-01",
												lastUsed: "2025-09-06 16:25",
												},
												{
												key: "RB_007",
												name: "Order Management",
												permissions: "Read, Trade",
												status: "Disabled",
												statusColor: "bg-[#30363D]",
												created: "2025-05-10",
												lastUsed: "2025-08-15 09:45",
												},
											].map((item) => (
												<tr key={item.key}>
												<td className="px-4 py-2 text-white text-sm">{item.key}</td>
												<td className="px-4 py-2 text-white text-sm">{item.name}</td>
												<td className="px-4 py-2 text-[#8B949E] text-sm">{item.permissions}</td>
												<td className="px-4 py-2">
													<button
													className={`px-2 py-1 rounded text-white text-sm font-bold ${item.statusColor}`}
													onClick={() => alert("Pressed!")}
													>
													{item.status}
													</button>
												</td>
												<td className="px-4 py-2 text-[#8B949E] text-sm">{item.created}</td>
												<td className="px-4 py-2 text-[#8B949E] text-sm">{item.lastUsed}</td>
												</tr>
											))}
											</tbody>
										</table>
									</div>

									<div className="flex flex-col items-center self-stretch pt-6 pb-[25px] pl-6 mx-0.5">
										<span className="text-[#8B949E] text-sm" >
											{"Showing 7 of 7 API keys"}
										</span>
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

export default API