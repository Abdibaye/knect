"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Plus, Scroll, Inbox, Tv, Circle } from "lucide-react";

const featuredResearch = [
	{ title: "Advances in Renewable Energy", org: "Addis Ababa University" },
	{ title: "Quantum Computing", org: "University of California" },
	{ title: "Social Media Trends Among Students", org: "SciNews" },
];

const closingOpportunities = [
	{ title: "Graduate Research Fellowship", org: "Addis Ababa University" },
	{ title: "Tech Innovation Challenge", org: "Tech Innovation" },
];

const initialChannelsToFollow = [
	{ name: "Astu General" },
	{ name: "CSEC" },
];

export default function FollowSidebar() {
	const [followedChannels, setFollowedChannels] = useState<boolean[]>(
		new Array(initialChannelsToFollow.length).fill(false)
	);

	const toggleChannelFollow = (index: number) => {
		const updated = [...followedChannels];
		updated[index] = !updated[index];
		setFollowedChannels(updated);
	};

	return (
		<aside className="hidden lg:block fixed right-5 top-16 w-[20rem] p-4 space-y-4 z-20">
			{/* Featured research */}
			<section className="bg-card text-card-foreground border border-border p-4 rounded-xl shadow-sm">
				<div className="flex items-center justify-between mb-3">
					<h2 className="text-sm font-semibold">Featured research</h2>
					<span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">
						View all
					</span>
				</div>
				<ul className="space-y-2">
					{featuredResearch.map((item, i) => (
						<li key={i} className="flex items-start gap-2">
							<Scroll className="w-4 h-4 text-muted-foreground mt-0.5" />
							<div>
								<p className="text-sm font-medium leading-tight">
									{item.title}
								</p>
								<p className="text-xs text-muted-foreground">
									{item.org}
								</p>
							</div>
						</li>
					))}
				</ul>
			</section>

			{/* Opportunities closing soon */}
			<section className="bg-card text-card-foreground border border-border p-4 rounded-xl shadow-sm">
				<div className="flex items-center justify-between mb-3">
					<h2 className="text-sm font-semibold">Opportunities closing soon</h2>
					<span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">
						See more
					</span>
				</div>
				<ul className="space-y-2">
					{closingOpportunities.map((item, i) => (
						<li key={i} className="flex items-start gap-2">
							<Inbox className="w-4 h-4 text-muted-foreground mt-0.5" />
							<div>
								<p className="text-sm font-medium leading-tight">
									{item.title}
								</p>
								<p className="text-xs text-muted-foreground">
									{item.org}
								</p>
							</div>
						</li>
					))}
				</ul>
			</section>

			{/* Communities to follow */}
			<section className="bg-card text-card-foreground border border-border p-4 rounded-xl shadow-sm">
				<div className="flex items-center justify-between mb-3">
					<h2 className="text-sm font-semibold">Communities to follow</h2>
					<Tv className="w-4 h-4 text-muted-foreground" />
				</div>
				<ul className="space-y-3">
					{initialChannelsToFollow.map((channel, i) => {
						const following = followedChannels[i];
						return (
							<li key={i} className="flex justify-between items-center">
								<div className="flex items-center gap-2 min-w-0">
									<Avatar className="w-9 h-9">
										<AvatarImage
											src={"/csec.jpg"}
											alt={channel.name}
										/>
										<AvatarFallback>
											<Circle className="w-5 h-5" />
										</AvatarFallback>
									</Avatar>
									<p className="text-sm font-medium truncate">
										{channel.name}
									</p>
								</div>
								<Button
									onClick={() => toggleChannelFollow(i)}
									variant={following ? "default" : "secondary"}
									size="sm"
									aria-pressed={following}
									className="gap-1"
								>
									<Plus className="w-4 h-4" />
									{following ? "Following" : "Follow"}
								</Button>
							</li>
						);
					})}
				</ul>
			</section>
		</aside>
	);
}
