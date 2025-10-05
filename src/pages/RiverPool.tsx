import React, { useState, useRef, useEffect } from "react";
import RiverbitLogo from "../components/RiverbitLogo";
import DesktopNav from "../components/DesktopNav";
import DesktopNavRight from "../components/DesktopNavRight";
import PrimaryButton from "../components/Button/PrimaryButton";
import { SecondaryButton } from "../components/Button/SecondaryButton";
import PercentSlider from "../components/PercentSlider";
import Tabs from "../components/Tabs";
import Footer from "../components/Footer";
import Tips from "../components/Tips";
import MobileMenu from "../components/MobileMenu";
import MobileHeader from "../components/MobileHeader";
import Select from "../components/Select";
import StatusTag from "../components/StatusTag";

const RiverPool = () => {
	const [input1, onChangeInput1] = useState('');
	const [riverPoolTab, setRiverPoolTab] = useState("Foundation");
	const [depositWithdrawTab, setdepositWithdrawTab] = useState("Deposit");
	const [recordsTab, setRecordsTab] = useState("Records");
	const [timeRange, setTimeRange] = React.useState("All Time"); 

	// Assume a total amount for percent calculation
	const AMOUNT_TOTAL = 1000;

	// Calculate percent from input1 (amount)
	const percentValue = input1
		? Math.max(0, Math.min(100, Math.round((Number(input1) / AMOUNT_TOTAL) * 100)))
		: 0;

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
					<div className="flex flex-col self-stretch py-12 lg:mx-20 gap-8">
						<div className="flex items-start self-stretch border-b border-[#30363D] w-full">
							<div className="xl:max-w-1/4 w-full">
								<Tabs
                                            tabs={[
                                                "Foundation",
                                                "Main",
                                            ]}
                                            activeTab={riverPoolTab}
                                            onTabChange={setRiverPoolTab}
                                            />
							</div>
						</div>
						{/* Tab Content */}
						{riverPoolTab === "Foundation" && (
							<div className="flex flex-col self-stretch gap-4">
								<div className="flex flex-col self-stretch gap-8 w-full">
									<div className="w-full flex flex-col lg:flex-row justify-between items-start self-stretch gap-4">
										<div className="flex flex-col shrink-0 items-start gap-1">
											<span className="text-white text-3xl font-bold" >
												{"Foundation LP"}
											</span>
											<div className="flex items-center gap-2.5">
												<span className="text-[#8B949E] text-base" >
													{"0x•••abcd"}
												</span>
												<img
													src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/8y7btkl5_expires_30_days.png"} 
													className="w-3.5 h-5 object-fill"
												/>
											</div>
										</div>
										<div className="flex shrink-0 gap-2">
											<SecondaryButton size="medium" onClick={() => alert("Pressed!")}>Withdraw</SecondaryButton>
											<PrimaryButton size="medium" onClick={() => alert("Pressed!")}>Deposit</PrimaryButton>
										</div>
									</div>
									<div className="flex flex-col self-stretch gap-3">
										<div className="flex flex-col lg:flex-row items-start self-stretch gap-3">
											<div className="w-full flex lg:basis-1/4 flex-col items-start bg-[#161B22] py-6 rounded-md border border-solid border-[#30363D]">
												<span className="text-[#8B949E] text-sm mb-[7px] mx-6" >
													{"Total Value Locked (TVL)"}
												</span>
												<span className="text-white text-2xl font-bold mb-[3px] mx-6" >
													{"$8.8M"}
												</span>
											</div>
											<div className="w-full flex lg:basis-1/4 flex-col items-start bg-[#161B22] py-6 rounded-md border border-solid border-[#30363D]">
												<span className="text-[#8B949E] text-sm mb-[7px] mx-6" >
													{"Last Month’s Yield"}
												</span>
												<span className="text-[#2DA44E] text-2xl font-bold mb-[3px] mx-6" >
													{"385.2%"}
												</span>
											</div>
											<div className="w-full flex lg:basis-1/4 flex-col items-start bg-[#161B22] py-6 rounded-md border border-solid border-[#30363D]">
												<span className="text-[#8B949E] text-sm mb-[7px] mx-6" >
													{"Your Deposit"}
												</span>
												<span className="text-white text-2xl font-bold mb-[3px] mx-6" >
													{"$100,000"}
												</span>
											</div>
											<div className="w-full flex lg:basis-1/4 flex-col items-start bg-[#161B22] py-6 rounded-md border border-solid border-[#30363D]">
												<span className="text-[#8B949E] text-sm mb-[7px] mx-6" >
													{"Cumulative Earnings"}
												</span>
												<span className="text-white text-2xl font-bold mb-[3px] mx-6" >
													{"$104,000"}
												</span>
											</div>
										</div>
										<div className="w-full flex flex-col lg:flex-row items-start self-stretch gap-3">
											<div className="w-full flex lg:basis-2/3 flex-col bg-[#161B22] py-6 gap-[21px] rounded-md border border-solid border-[#30363D]">
												<div className="flex items-center self-stretch mx-6 justify-between text-left">
													<span className="w-full flex-1 text-white text-xl font-bold" >
														{"Account Value / PNL"}
													</span>
													<div className="relative">
														<Select
															value={timeRange}
															onChange={setTimeRange}
															options={["All Time", "1D", "1W", "1M", "1Y"].map((v) => ({ label: v, value: v }))}
															placeholder="Time Range"
															minWidth="min-w-32"
															/>
													</div>
												</div>
												<div className="self-stretch h-[300px] mx-6">
												</div>
												<div className="flex flex-col xl:flex-row justify-between items-start self-stretch mx-6">
													<div className="flex shrink-0 items-center pr-0.5 gap-2">
														<span className="text-[#8B949E] text-sm" >
															{"Deposit:"}
														</span>
														<span className="text-white text-sm" >
															{"100,000 USDC / Seat"}
														</span>
													</div>
													<div className="flex shrink-0 items-center pr-0.5 gap-2.5">
														<span className="text-[#8B949E] text-sm" >
															{"Lock-up:"}
														</span>
														<span className="text-white text-sm" >
															{"180 days"}
														</span>
													</div>
													<div className="flex shrink-0 items-center pr-0.5 gap-3.5">
														<span className="text-[#8B949E] text-sm" >
															{"Drawdown (DD):"}
														</span>
														<span className="text-red-400 text-sm" >
															{"10%"}
														</span>
													</div>
												</div>
											</div>
											<div className="w-full flex lg:basis-1/3 flex-col items-center bg-[#161B22] rounded-md border border-solid border-[#30363D]">
												<div className="relative w-full">
													<Tabs
														tabs={["Deposit", "Withdraw"]}
														activeTab={depositWithdrawTab}
														onTabChange={setdepositWithdrawTab}
													/>
												</div>
												
												<div className="flex flex-col items-start p-6 gap-[17px] w-full">
													<div className="flex items-center w-full justify-between">
														<span className="text-[#8B949E] text-sm " >
															{"Available Balance:"}
														</span>
														<span className="text-white text-sm font-bold" >
															{"$10,000"}
														</span>
													</div>
													{/* 價格輸入框 */}
													<div className="flex flex-col items-start gap-2 w-full">
														<div className="flex flex-col items-center pb-[1px]">
															<span className="text-[#9D9DAF] text-sm" >
																{"Amount"}
															</span>
														</div>
														{/* 金額輸入框與貨幣標籤 */}
														<div className="flex justify-between bg-zinc-950 py-[9px] px-3 rounded-sm border border-solid border-[#30363D] w-full ">
																<input
																	placeholder="0"
																	value={input1}
																	onChange={(e) => {
																		const value = Number(e.target.value.replace(/,/g, ""));
																		onChangeInput1(isNaN(value) ? "" : value.toString());
																	}}
																	className="w-full text-white bg-transparent text-base py-[3px] border-0"
																/>
																<div className="flex shrink-0 items-center bg-zinc-700 py-[7px] pl-2 pr-[7px] gap-1.5 rounded">
																	<span className="text-zinc-400 text-sm font-bold">USDC (Arbitrum)</span>
																	<img
																		src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/bvauf8h6_expires_30_days.png"
																		className="w-3 h-[15px] rounded-sm object-fill"
																	/>
																</div>
															</div>
																													{/* 滑桿與快捷百分比按鈕 */}
																													<PercentSlider
																value={percentValue}
																maxAmount={AMOUNT_TOTAL}
																onChangeAmount={onChangeInput1}
																/>
													</div>

													<Tips
														tips={[
															"Limited to 100 Seats – First Come, First Served",
															"Unlocks Automatically at Maturity T+1",
														]}
														/>

													<PrimaryButton size="large" onClick={() => alert("Pressed!")}>
														Deposit
													</PrimaryButton>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="flex flex-col items-start self-stretch py-4 rounded-lg border-l-4 border-solid border-fuchsia-800" 
									style={{
										background: "linear-gradient(180deg, #92318D33, #00000000)"
									}}>
									<span className="text-white text-base font-bold ml-5" >
										{"Seat #12 Activated"}
									</span>
									<span className="text-[#8B949E] text-sm ml-5" >
										{"Expected Value: 500,000 Points"}
									</span>
									<span className="text-[#8B949E] text-sm ml-5" >
										{"Earnings Start in 88 Days"}
									</span>
								</div>
								<div className="flex flex-col items-start self-stretch bg-[#161B22] py-[1px] rounded-md border border-solid border-[#30363D]">
									<span className="text-white text-2xl font-bold my-6 ml-[25px] mr-[1px]" >
										{"My Points History"}
									</span>
									<div className="overflow-x-auto w-full pb-6 px-6 mx-[1px]">
										<table className="min-w-full text-left border-collapse">
											<thead>
											<tr className="text-[#8B949E] text-sm font-bold border-b border-[#30363D]">
												<th className="py-4 px-4">Date</th>
												<th className="py-4 px-4">Earned Points</th>
												<th className="py-4 px-4">Cumulative Points</th>
												<th className="py-4 px-4">Value</th>
												<th className="py-4 px-4">Status</th>
												<th className="py-4 px-4">Notes</th>
											</tr>
											</thead>
											<tbody>
											{[
												{
												date: "2025-09-05",
												earnedPoints: "+0 Points",
												cumulativePoints: "0 Points",
												value: "$0",
												status: "Pending Launch",
												note: "No rewards before launch",
												},
												{
												date: "2025-09-04",
												earnedPoints: "+0 Points",
												cumulativePoints: "0 Points",
												value: "$0",
												status: "Pending Launch",
												note: "No rewards before launch",
												},
												{
												date: "2025-09-03",
												earnedPoints: "+0 Points",
												cumulativePoints: "0 Points",
												value: "$0",
												status: "Pending Launch",
												note: "No rewards before launch",
												},
											].map((row, idx) => (
												<tr key={idx} className="text-[#E6EDF3] text-sm border-b border-[#30363D]">
												<td className="py-4 px-4">{row.date}</td>
												<td className="py-4 px-4">{row.earnedPoints}</td>
												<td className="py-4 px-4">{row.cumulativePoints}</td>
												<td className="py-4 px-4">{row.value}</td>
												<td className="py-4 px-4">
													<StatusTag status={row.status} />
												</td>
												<td className="py-4 px-4">{row.note}</td>
												</tr>
											))}
											</tbody>
										</table>
									</div>

								</div>
								<div className="w-full self-stretch bg-[#161B22] rounded-md ">

									<div className="w-full border-b border-[#30363D] overflow-auto">
										<div className="xl:max-w-1/3 w-full">
											<Tabs
												tabs={[
													"Records",
													"Depositors",
													"Pool Positions",
													"Trade History",
												]}
												activeTab={recordsTab}
												onTabChange={setRecordsTab}
												/>
										</div>
									</div>
									{/* Tab Content */}
									{recordsTab === "Records" && (
										<div className="overflow-x-auto w-full py-4 px-6">
											<table className="min-w-full text-left border-collapse">
												<thead>
												<tr className="text-[#8B949E] text-sm font-bold border-b border-[#30363D]">
													<th className="py-3 px-4">Time</th>
													<th className="py-3 px-4">Type</th>
													<th className="py-3 px-4">Amount</th>
													<th className="py-3 px-4">Network</th>
													<th className="py-3 px-4">Tx</th>
													<th className="py-3 px-4">Status</th>
												</tr>
												</thead>
												<tbody>
												{[
													{
													time: "2025-09-01",
													type: "Foundation LP Deposit",
													amount: "$100,000",
													network: "Arbitrum",
													tx: "0x8a…9f",
													status: "Confirmed",
													statusColor: "#2DA44E",
													},
												].map((row, idx) => (
													<tr key={idx} className="text-sm border-b border-[#30363D]">
													<td className="py-4 px-4 text-[#E6EDF3]">{row.time}</td>
													<td className="py-4 px-4 text-[#E6EDF3]">{row.type}</td>
													<td className="py-4 px-4 text-[#E6EDF3]">{row.amount}</td>
													<td className="py-4 px-4 text-[#E6EDF3]">{row.network}</td>
													<td className="py-4 px-4 text-[#E6EDF3]">{row.tx}</td>
													<td className="py-4 px-4" >
														<StatusTag status={row.status} />
													</td>
													</tr>
												))}
												</tbody>
											</table>
										</div>
									)}
									{recordsTab === "Depositors" && (
										<div className="overflow-x-auto w-full py-4 px-6">
											<table className="min-w-full text-left border-collapse">
												<thead>
												<tr className="text-[#8B949E] text-sm font-bold border-b border-[#30363D]">
													<th className="py-3 px-4">Address</th>
													<th className="py-3 px-4">Seat</th>
													<th className="py-3 px-4">Value</th>
													<th className="py-3 px-4">Last Action</th>
												</tr>
												</thead>
												<tbody>
												{[
													{
													address: "0x67d…8e7",
													seat: "#12",
													value: "-",
													lastAction: "2025-09-01",
													},
													// add more rows here if needed
												].map((row, idx) => (
													<tr key={idx} className="text-sm border-b border-[#30363D]">
													<td className="py-4 px-4 text-[#E6EDF3]">{row.address}</td>
													<td className="py-4 px-4 text-[#E6EDF3]">{row.seat}</td>
													<td className="py-4 px-4 text-[#E6EDF3]">{row.value}</td>
													<td className="py-4 px-4 text-[#E6EDF3]">{row.lastAction}</td>
													</tr>
												))}
												</tbody>
											</table>
										</div>
									)}
									{recordsTab === "Pool Positions" && (
										<div className="overflow-x-auto w-full py-4 px-6">
											<table className="min-w-full text-left border-collapse">
												<thead>
												<tr className="text-[#8B949E] text-sm font-bold border-b border-[#30363D]">
													<th className="py-3 px-4">Asset</th>
													<th className="py-3 px-4">Direction</th>
													<th className="py-3 px-4">Size</th>
													<th className="py-3 px-4">Average Price</th>
													<th className="py-3 px-4">PnL</th>
												</tr>
												</thead>
												<tbody>
												{[
													{
													asset: "ETH",
													direction: "Long",
													size: "2.5",
													avgPrice: "$1,850",
													pnl: "$125",
													},
													// 可以加多行資料
												].map((row, idx) => (
													<tr key={idx} className="text-sm border-b border-[#30363D]">
													<td className="py-4 px-4 text-[#E6EDF3]">{row.asset}</td>
													<td className="py-4 px-4 text-[#E6EDF3]">{row.direction}</td>
													<td className="py-4 px-4 text-[#E6EDF3]">{row.size}</td>
													<td className="py-4 px-4 text-[#E6EDF3]">{row.avgPrice}</td>
													<td className="py-4 px-4 text-[#E6EDF3]">{row.pnl}</td>
													</tr>
												))}
												</tbody>
											</table>
										</div>
									)}
									{recordsTab === "Trade History" && (
										<div className="overflow-x-auto w-full py-4 px-6">
											<table className="min-w-full text-left border-collapse">
												<thead>
												<tr className="text-[#8B949E] text-sm font-bold border-b border-[#30363D]">
													<th className="py-3 px-4">Time</th>
													<th className="py-3 px-4">Order ID</th>
													<th className="py-3 px-4">Direction</th>
													<th className="py-3 px-4">Price</th>
													<th className="py-3 px-4">Amount</th>
												</tr>
												</thead>
												<tbody>
												{[
													{
													time: "2025-09-01 14:30",
													orderId: "#12345",
													direction: "Buy",
													price: "$1,850",
													amount: "0.5 ETH",
													},
													// 可以加更多行資料
												].map((row, idx) => (
													<tr key={idx} className="text-sm border-b border-[#30363D]">
													<td className="py-4 px-4 text-[#E6EDF3]">{row.time}</td>
													<td className="py-4 px-4 text-[#E6EDF3]">{row.orderId}</td>
													<td className="py-4 px-4 text-[#E6EDF3]">{row.direction}</td>
													<td className="py-4 px-4 text-[#E6EDF3]">{row.price}</td>
													<td className="py-4 px-4 text-[#E6EDF3]">{row.amount}</td>
													</tr>
												))}
												</tbody>
											</table>
										</div>
									)}
								</div>
							</div>
						)}
						{riverPoolTab === "Main" && (
							<div className="flex flex-col self-stretch gap-4">
								<div className="flex flex-col self-stretch gap-8 w-full">
									<div className="w-full flex flex-col lg:flex-row justify-between items-start self-stretch gap-4">
										<div className="flex flex-col shrink-0 items-start gap-1">
											<span className="text-white text-3xl font-bold" >
												{"Foundation LP"}
											</span>
											<div className="flex items-center gap-2.5">
												<span className="text-[#8B949E] text-base" >
													{"0x•••abcd"}
												</span>
												<img
													src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/8y7btkl5_expires_30_days.png"} 
													className="w-3.5 h-5 object-fill"
												/>
											</div>
										</div>
										<div className="flex shrink-0 gap-2">
											<SecondaryButton size="medium" onClick={() => alert("Pressed!")}>Withdraw</SecondaryButton>
											<PrimaryButton size="medium" onClick={() => alert("Pressed!")}>Deposit</PrimaryButton>
										</div>
									</div>
									<div className="flex flex-col self-stretch gap-3">
										<div className="flex flex-col lg:flex-row items-start self-stretch gap-3">
											<div className="w-full flex lg:basis-1/4 flex-col items-start bg-[#161B22] py-6 rounded-md border border-solid border-[#30363D]">
												<span className="text-[#8B949E] text-sm mb-[7px] mx-6" >
													{"Total Value Locked (TVL)"}
												</span>
												<span className="text-white text-2xl font-bold mb-[3px] mx-6" >
													{"$120.8M"}
												</span>
											</div>
											<div className="w-full flex lg:basis-1/4 flex-col items-start bg-[#161B22] py-6 rounded-md border border-solid border-[#30363D]">
												<span className="text-[#8B949E] text-sm mb-[7px] mx-6" >
													{"30-Day Annualised Yield"}
												</span>
												<span className="text-[#2DA44E] text-2xl font-bold mb-[3px] mx-6" >
													{"30%"}
												</span>
											</div>
											<div className="w-full flex lg:basis-1/4 flex-col items-start bg-[#161B22] py-6 rounded-md border border-solid border-[#30363D]">
												<span className="text-[#8B949E] text-sm mb-[7px] mx-6" >
													{"Your Deposit"}
												</span>
												<span className="text-white text-2xl font-bold mb-[3px] mx-6" >
													{"$5,000"}
												</span>
											</div>
											<div className="w-full flex lg:basis-1/4 flex-col items-start bg-[#161B22] py-6 rounded-md border border-solid border-[#30363D]">
												<span className="text-[#8B949E] text-sm mb-[7px] mx-6" >
													{"Cumulative Earnings"}
												</span>
												<span className="text-white text-2xl font-bold mb-[3px] mx-6" >
													{"$120"}
												</span>
											</div>
										</div>
										<div className="w-full flex flex-col lg:flex-row items-start self-stretch gap-3">
											<div className="w-full flex lg:basis-2/3 flex-col bg-[#161B22] py-6 gap-[21px] rounded-md border border-solid border-[#30363D]">
												<div className="flex items-center self-stretch mx-6 justify-between text-left">
													<span className="w-full flex-1 text-white text-xl font-bold" >
														{"Account Value / PNL"}
													</span>
													<div className="relative">
														<Select
															value={timeRange}
															onChange={setTimeRange}
															options={["All Time", "1D", "1W", "1M", "1Y"].map((v) => ({ label: v, value: v }))}
															placeholder="Time Range"
															minWidth="min-w-32"
															/>
													</div>
												</div>
												<div className="self-stretch h-[300px] mx-6">
												</div>
												<div className="flex flex-col xl:flex-row justify-between items-start self-stretch mx-6">
													<div className="flex shrink-0 items-center pr-0.5 gap-2">
														<span className="text-[#8B949E] text-sm" >
															{"Redemption: "}
														</span>
														<span className="text-white text-sm" >
															{"T+4 Settlement"}
														</span>
													</div>
													<div className="flex shrink-0 items-center pr-0.5 gap-2.5">
														<span className="text-[#8B949E] text-sm" >
															{"Daily Limit:"}
														</span>
														<span className="text-white text-sm" >
															{"15% TVL/day"}
														</span>
													</div>
													<div className="flex shrink-0 items-center pr-0.5 gap-3.5">
														<span className="text-[#8B949E] text-sm" >
															{"Cooling Period:"}
														</span>
														<span className="text-sm" >
															{"Off"}
														</span>
													</div>
												</div>
											</div>
											<div className="w-full flex lg:basis-1/3 flex-col items-center bg-[#161B22] rounded-md border border-solid border-[#30363D]">
												<div className="relative w-full">
													<Tabs
														tabs={["Deposit", "Withdraw"]}
														activeTab={depositWithdrawTab}
														onTabChange={setdepositWithdrawTab}
													/>
												</div>
												
												<div className="flex flex-col items-start p-6 gap-[17px] w-full">
													<div className="flex items-center w-full justify-between">
														<span className="text-[#8B949E] text-sm " >
															{"Available Balance:"}
														</span>
														<span className="text-white text-sm font-bold" >
															{"$10,000"}
														</span>
													</div>
													{/* 價格輸入框 */}
													<div className="flex flex-col items-start gap-2 w-full">
														<div className="flex flex-col items-center pb-[1px]">
															<span className="text-[#9D9DAF] text-sm" >
																{"Amount"}
															</span>
														</div>
														{/* 金額輸入框與貨幣標籤 */}
														<div className="flex justify-between bg-zinc-950 py-[9px] px-3 rounded-sm border border-solid border-[#30363D] w-full ">
																<input
																	placeholder="0"
																	value={input1}
																	onChange={(e) => {
																		const value = Number(e.target.value.replace(/,/g, ""));
																		onChangeInput1(isNaN(value) ? "" : value.toString());
																	}}
																	className="w-full text-white bg-transparent text-base py-[3px] border-0"
																/>
																<div className="flex shrink-0 items-center bg-zinc-700 py-[7px] pl-2 pr-[7px] gap-1.5 rounded">
																	<span className="text-zinc-400 text-sm font-bold">USDC (Arbitrum)</span>
																	<img
																		src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/bvauf8h6_expires_30_days.png"
																		className="w-3 h-[15px] rounded-sm object-fill"
																	/>
																</div>
															</div>
																													{/* 滑桿與快捷百分比按鈕 */}
																													<PercentSlider
																value={percentValue}
																maxAmount={AMOUNT_TOTAL}
																onChangeAmount={onChangeInput1}
																/>
													</div>


													<Tips
														tips={[
															"Deposit: T+0",
															"Withdraw: T+4",
															"Daily Redemption Limit: 15% TVL/day",
															"Optional Cooling Period: 24–72h",
														]}
														/>

													<PrimaryButton size="large" onClick={() => alert("Pressed!")}>
														Deposit
													</PrimaryButton>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="flex flex-col items-start self-stretch py-4 rounded-lg border-l-4 border-solid border-fuchsia-800" 
									style={{
										background: "linear-gradient(180deg, #92318D33, #00000000)"
									}}>
									<span className="text-white text-base font-bold ml-5" >
										{"Seat #12 Activated"}
									</span>
									<span className="text-[#8B949E] text-sm ml-5" >
										{"Expected Value: 500,000 Points"}
									</span>
									<span className="text-[#8B949E] text-sm ml-5" >
										{"Earnings Start in 88 Days"}
									</span>
								</div>
								<div className="flex flex-col items-start self-stretch bg-[#161B22] py-[1px] rounded-md border border-solid border-[#30363D]">
									<span className="text-white text-2xl font-bold my-6 ml-[25px] mr-[1px]" >
										{"My Points History"}
									</span>
									<div className="overflow-x-auto w-full pb-6 px-6 mx-[1px]">
										<table className="min-w-full text-left border-collapse">
											<thead>
											<tr className="text-[#8B949E] text-sm font-bold border-b border-[#30363D]">
												<th className="py-4 px-4">Date</th>
												<th className="py-4 px-4">Earned Points</th>
												<th className="py-4 px-4">Cumulative Points</th>
												<th className="py-4 px-4">Value</th>
												<th className="py-4 px-4">Status</th>
												<th className="py-4 px-4">Notes</th>
											</tr>
											</thead>
											<tbody>
											{[
												{
												date: "2025-09-05",
												earnedPoints: "+0 Points",
												cumulativePoints: "0 Points",
												value: "$0",
												status: "Pending Launch",
												note: "No rewards before launch",
												},
												{
												date: "2025-09-04",
												earnedPoints: "+0 Points",
												cumulativePoints: "0 Points",
												value: "$0",
												status: "Pending Launch",
												note: "No rewards before launch",
												},
												{
												date: "2025-09-03",
												earnedPoints: "+0 Points",
												cumulativePoints: "0 Points",
												value: "$0",
												status: "Pending Launch",
												note: "No rewards before launch",
												},
											].map((row, idx) => (
												<tr key={idx} className="text-[#E6EDF3] text-sm border-b border-[#30363D]">
												<td className="py-4 px-4">{row.date}</td>
												<td className="py-4 px-4">{row.earnedPoints}</td>
												<td className="py-4 px-4">{row.cumulativePoints}</td>
												<td className="py-4 px-4">{row.value}</td>
												<td className="py-4 px-4">
													<StatusTag status={row.status} />
												</td>
												<td className="py-4 px-4">{row.note}</td>
												</tr>
											))}
											</tbody>
										</table>
									</div>

								</div>
								<div className="w-full self-stretch bg-[#161B22] rounded-md ">

									<div className="w-full border-b border-[#30363D] overflow-auto">
										<div className="xl:max-w-1/3 w-full">
											<Tabs
												tabs={[
													"Records",
													"Depositors",
													"Pool Positions",
													"Trade History",
												]}
												activeTab={recordsTab}
												onTabChange={setRecordsTab}
												/>
										</div>
									</div>
									{/* Tab Content */}
									{recordsTab === "Records" && (
									<div className="overflow-x-auto w-full py-4 px-6">
										<table className="min-w-full text-left border-collapse">
										<thead>
											<tr className="text-[#8B949E] text-sm font-bold border-b border-[#30363D]">
											<th className="py-3 px-4">Time</th>
											<th className="py-3 px-4">Type</th>
											<th className="py-3 px-4">Amount</th>
											<th className="py-3 px-4">Network</th>
											<th className="py-3 px-4">Tx</th>
											<th className="py-3 px-4">Status</th>
											</tr>
										</thead>
										<tbody>
											{[
											{
												time: "2025-09-04",
												type: "Deposit",
												amount: "$5,000",
												network: "Arbitrum",
												tx: "0xab…cd",
												status: "Confirmed",
												statusColor: "#2DA44E",
											},
											{
												time: "2025-09-04",
												type: "Withdrawal",
												amount: "$1,500",
												network: "Arbitrum",
												tx: "0xff…22",
												status: "In Queue (T+4)",
												statusColor: "#DFA42F",
											},
											].map((row, idx) => (
											<tr key={idx} className="text-sm border-b border-[#30363D]">
												<td className="py-4 px-4 text-[#E6EDF3]">{row.time}</td>
												<td className="py-4 px-4 text-[#E6EDF3]">{row.type}</td>
												<td className="py-4 px-4 text-[#E6EDF3]">{row.amount}</td>
												<td className="py-4 px-4 text-[#E6EDF3]">{row.network}</td>
												<td className="py-4 px-4 text-[#E6EDF3]">{row.tx}</td>
												<td className="py-4 px-4">
												<StatusTag status={row.status} />
												</td>
											</tr>
											))}
										</tbody>
										</table>
									</div>
									)}

									{recordsTab === "Depositors" && (
									<div className="overflow-x-auto w-full py-4 px-6">
										<table className="min-w-full text-left border-collapse">
										<thead>
											<tr className="text-[#8B949E] text-sm font-bold border-b border-[#30363D]">
											<th className="py-3 px-4">Address</th>
											<th className="py-3 px-4">Shares</th>
											<th className="py-3 px-4">Value</th>
											<th className="py-3 px-4">Last Action</th>
											</tr>
										</thead>
										<tbody>
											{[
											{
												address: "0xaa1…bb2",
												shares: "12,345",
												value: "$23,456",
												lastAction: "2025-09-02",
											},
											].map((row, idx) => (
											<tr key={idx} className="text-sm border-b border-[#30363D]">
												<td className="py-4 px-4 text-[#E6EDF3]">{row.address}</td>
												<td className="py-4 px-4 text-[#E6EDF3]">{row.shares}</td>
												<td className="py-4 px-4 text-[#E6EDF3]">{row.value}</td>
												<td className="py-4 px-4 text-[#E6EDF3]">{row.lastAction}</td>
											</tr>
											))}
										</tbody>
										</table>
									</div>
									)}

									{recordsTab === "Pool Positions" && (
									<div className="overflow-x-auto w-full py-4 px-6">
										<table className="min-w-full text-left border-collapse">
										<thead>
											<tr className="text-[#8B949E] text-sm font-bold border-b border-[#30363D]">
											<th className="py-3 px-4">Asset</th>
											<th className="py-3 px-4">Direction</th>
											<th className="py-3 px-4">Size</th>
											<th className="py-3 px-4">Average Price</th>
											<th className="py-3 px-4">PnL</th>
											</tr>
										</thead>
										<tbody>
											{[
											{
												asset: "xAAPL",
												direction: "Short",
												size: "$0.8M",
												avgPrice: "227.80",
												pnl: "$-4,120",
											},
											].map((row, idx) => (
											<tr key={idx} className="text-sm border-b border-[#30363D]">
												<td className="py-4 px-4 text-[#E6EDF3]">{row.asset}</td>
												<td className="py-4 px-4 text-[#E6EDF3]">{row.direction}</td>
												<td className="py-4 px-4 text-[#E6EDF3]">{row.size}</td>
												<td className="py-4 px-4 text-[#E6EDF3]">{row.avgPrice}</td>
												<td className="py-4 px-4 text-[#E6EDF3]">{row.pnl}</td>
											</tr>
											))}
										</tbody>
										</table>
									</div>
									)}

									{recordsTab === "Trade History" && (
									<div className="overflow-x-auto w-full py-4 px-6">
										<table className="min-w-full text-left border-collapse">
										<thead>
											<tr className="text-[#8B949E] text-sm font-bold border-b border-[#30363D]">
											<th className="py-3 px-4">Time</th>
											<th className="py-3 px-4">Order ID</th>
											<th className="py-3 px-4">Direction</th>
											<th className="py-3 px-4">Price</th>
											<th className="py-3 px-4">Amount</th>
											</tr>
										</thead>
										<tbody>
											{[
											{
												time: "17:10",
												orderId: "0xc0…ff",
												direction: "Sell",
												price: "228.10",
												amount: "$120k",
											},
											].map((row, idx) => (
											<tr key={idx} className="text-sm border-b border-[#30363D]">
												<td className="py-4 px-4 text-[#E6EDF3]">{row.time}</td>
												<td className="py-4 px-4 text-[#E6EDF3]">{row.orderId}</td>
												<td className="py-4 px-4 text-[#E6EDF3]">{row.direction}</td>
												<td className="py-4 px-4 text-[#E6EDF3]">{row.price}</td>
												<td className="py-4 px-4 text-[#E6EDF3]">{row.amount}</td>
											</tr>
											))}
										</tbody>
										</table>
									</div>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
				<Footer />
			</div>
		</div>
	)
}

export default RiverPool