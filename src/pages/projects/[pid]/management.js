import React, {useEffect, useState} from 'react';
import {Layout} from "@/components/ui/layout";
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {useRouter} from "next/router";
import {
	addUserToProject,
	getChangesRules,
	getProjectUsers,
	getVotingRules,
	updateChangesRules,
	updateProjectUserRole,
	updateVotingRules
} from "@/lib/admin";
import {authStytchRequest} from "@/lib/stytch";
import {getCookie} from "cookies-next";
import {initializeStore, useStore} from "@/lib/store";
import {getUserProfile, getUserRoles} from "@/lib/user";

export default function ManagementPanel({pid, changesRules, votingRules, initialUserList}) {
	const router = useRouter();
	const [userRoles, currentProject] = useStore((state) => [state.userRoles, state.currentProject]);
	const timeframes = [
		{
			"label": "1 hour",
			"value": 1 * 60 * 60 * 1000  // 1 hour in milliseconds
		},
		{
			"label": "4 hours",
			"value": 4 * 60 * 60 * 1000  // 4 hours in milliseconds
		},
		{
			"label": "8 hours",
			"value": 8 * 60 * 60 * 1000  // 8 hours in milliseconds
		},
		{
			"label": "12 hours",
			"value": 12 * 60 * 60 * 1000  // 12 hours in milliseconds
		},
		{
			"label": "1 day",
			"value": 24 * 60 * 60 * 1000  // 1 day in milliseconds
		},
		{
			"label": "3 days",
			"value": 72 * 60 * 60 * 1000  // 3 days in milliseconds
		},
		{
			"label": "7 days",
			"value": 168 * 60 * 60 * 1000  // 7 days in milliseconds
		}
	]
	const [userList, setUserList] = useState(initialUserList);
	const rule1Start = changesRules[0].start;
	const [rule1End, setRule1End] = useState(changesRules[0].end);
	const [rule1Timeframe, setRule1Timeframe] = useState(changesRules[0].time);
	const [rule2Start, setRule2Start] = useState(changesRules[1].start);
	const [rule2End, setRule2End] = useState(changesRules[1].end);
	const [rule2Timeframe, setRule2Timeframe] = useState(changesRules[1].time);
	const [rule3Start, setRule3Start] = useState(changesRules[2].start);
	const rule3End = changesRules[2].end;
	const [rule3Timeframe, setRule3Timeframe] = useState(changesRules[2].time);
	const [minimumVotes, setMinimumVotes] = useState(votingRules.min_votes_required);
	const [positiveVotesPercentage, setPositiveVotesPercentage] = useState(votingRules.min_votes_percentage * 100);
	const [email, setEmail] = useState('');
	const roles = ["project_manager", "moderator", "editor", "voter", "viewer"];

	const handleRule1EndChange = (e) => {
		setRule1End(e.target.value);
	}

	const handleRule1TimeframeChange = (value) => {
		setRule1Timeframe(value);
	}

	const handleRule2StartChange = (e) => {
		setRule2Start(e.target.value);
	}

	const handleRule2EndChange = (e) => {
		setRule2End(e.target.value);
	}

	const handleRule2TimeframeChange = (value) => {
		setRule2Timeframe(value);
	}

	const handleRule3StartChange = (e) => {
		setRule3Start(e.target.value);
	}

	const handleRule3TimeframeChange = (value) => {
		setRule3Timeframe(value);
	}

	const handleMinimumVotesChange = (e) => {
		setMinimumVotes(e.target.value);
	}

	const handlePositiveVotesPercentageChange = (e) => {
		setPositiveVotesPercentage(e.target.value);
	}

	const handleRoleChange = async (uid, newRole) => {
		const user = userList.find(user => user.uid === uid);
		if (user.role === "admin") {
			console.log("Cannot change role of admin user");
			return;
		}

		const result = await updateProjectUserRole(pid, uid, newRole, getCookie("stytch_session_jwt"));
		if (!result) {
			return;
		}

		const updatedUserList = userList.map(user => {
			if (user.uid === uid) {
				return {...user, role: newRole};
			}
			return user;
		});
		setUserList(updatedUserList);
	};

	async function goToEditPage() {
		await router.push(`/projects/${pid}/edit`);
	}

	async function saveChangeRuleChanges() {
		console.log("Rule 1 start: ", rule1Start);
		console.log("Rule 1 end: ", rule1End);
		console.log("Rule 1 timeframe: ", rule1Timeframe);
		console.log("Rule 2 start: ", rule2Start);
		console.log("Rule 2 end: ", rule2End);
		console.log("Rule 2 timeframe: ", rule2Timeframe);
		console.log("Rule 3 start: ", rule3Start);
		console.log("Rule 3 timeframe: ", rule3Timeframe);

		const changeRulesData = [
			{
				start: rule1Start,
				end: rule1End,
				time: rule1Timeframe,
			},
			{
				start: rule2Start,
				end: rule2End,
				time: rule2Timeframe
			},
			{
				start: rule3Start,
				end: rule3End,
				time: rule3Timeframe
			}
		];

		await updateChangesRules(pid, changeRulesData, getCookie("stytch_session_jwt"));
	}

	async function saveVotingRuleChanges() {
		console.log("Saving minimum votes: ", minimumVotes);
		console.log("Saving positive votes percentage: ", positiveVotesPercentage);

		const votingRulesData = {
			min_votes_required: minimumVotes,
			min_votes_percentage: positiveVotesPercentage / 100
		};

		console.log(votingRulesData);
		await updateVotingRules(pid, votingRulesData, getCookie("stytch_session_jwt"));
	}


	async function inviteUserToProject() {
		const result = await addUserToProject(pid, email, getCookie("stytch_session_jwt"));
		if (!result) {
			return;
		}
		setEmail("");
		setUserList(userList.append(result));
	}

	return (
		<Layout>
			<div className="max-w-4xl mx-auto p-8">

				<h1 className="text-3xl font-bold mb-6">Project Management Admin Panel</h1>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-4">Edit Project</h2>
					<Button onClick={goToEditPage}>Go to Edit Project page</Button>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-4">Change Rules</h2>
					<div className="space-y-2">
						<div className="flex items-center space-x-2">
							<Input placeholder={rule1Start} type="number" className="w-[64px]" value={rule1Start} readOnly/>
							<span>to</span>
							<Input placeholder={rule1End} type="number" className="w-[64px]" value={rule1End}
							       onChange={handleRule1EndChange}/>
							<span>line changes will be available to vote on for</span>
							<div className="w-[180px]">
								<Select onValueChange={handleRule1TimeframeChange} defaultValue={rule1Timeframe}>
									<SelectTrigger id="timeframe1">
										<SelectValue/>
									</SelectTrigger>
									<SelectContent position="popper">
										{timeframes.map(timeframe => (
											<SelectItem key={timeframe.value} value={timeframe.value}>{timeframe.label}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<Input placeholder={rule2Start} type="number" className="w-[64px]" value={rule2Start}
							       onChange={handleRule2StartChange}/>
							<span>to</span>
							<Input placeholder={rule2End} type="number" className="w-[64px]" value={rule2End}
							       onChange={handleRule2EndChange}/>
							<span>line changes will be available to vote on for</span>
							<div className="w-[180px]">
								<Select onValueChange={handleRule2TimeframeChange} defaultValue={rule2Timeframe}>
									<SelectTrigger id="timeframe2">
										<SelectValue/>
									</SelectTrigger>
									<SelectContent position="popper">
										{timeframes.map(timeframe => (
											<SelectItem key={timeframe.value} value={timeframe.value}>{timeframe.label}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<span>More than</span>
							<Input placeholder={rule3Start} type="number" className="w-[64px]" value={rule3Start}
							       onChange={handleRule3StartChange}/>
							<div className="w-[180px]">
								<Select onValueChange={handleRule3TimeframeChange} defaultValue={rule3Timeframe}>
									<SelectTrigger id="timeframe3">
										<SelectValue/>
									</SelectTrigger>
									<SelectContent position="popper">
										{timeframes.map(timeframe => (
											<SelectItem key={timeframe.value} value={timeframe.value}>{timeframe.label}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
					<Button className="mt-4" onClick={saveChangeRuleChanges}>Save Changes</Button>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-4">Voting Rules</h2>
					<div className="mb-4">
						<label className="block mb-2" htmlFor="total-votes">
							Minimum number of total votes required for a change to be able to pass:
						</label>
						<Input id="total-votes" type="number" placeholder={votingRules.min_votes_required} min="1"
						       className="w-[64px]" onChange={handleMinimumVotesChange}/>
					</div>
					<div>
						<label className="block mb-2" htmlFor="positive-votes">
							What percentage of votes need to be positive for a change to be able to pass:
						</label>
						<Input id="positive-votes" type="number" placeholder={votingRules.min_votes_percentage * 100} min="1"
						       className="w-[64px]" onChange={handlePositiveVotesPercentageChange}/>
					</div>
					<Button className="mt-4" onClick={saveVotingRuleChanges}>Save Changes</Button>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-4">Invite User</h2>
					<div className="flex items-center space-x-2">
						<Input placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)}/>
						<Button onClick={inviteUserToProject}>Add User</Button>
					</div>
				</section>

				<section>
					<h2 className="text-xl font-semibold mb-4">User Roles</h2>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Email</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Role</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{userList.map(user => (
								<TableRow key={user.email}>
									<TableCell className="font-medium">{user.email}</TableCell>
									<TableCell>{user.name}</TableCell>
									<TableCell>
										{(user.role === "admin" || roles.indexOf(user.role) <= roles.indexOf(userRoles.find((role) => role.project === currentProject).role.name)) ? (
											<div>{user.role}</div>
											) : (
										<Select onValueChange={(newRole) => handleRoleChange(user.uid, newRole)}>
											<SelectTrigger id="role">
												<SelectValue>{user.role}</SelectValue>
											</SelectTrigger>
											<SelectContent position="popper">
												{roles.map(role => (
													<SelectItem key={role} value={role}>{role}</SelectItem>
												))}
											</SelectContent>
										</Select>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</section>
			</div>
		</Layout>
	);
}

export async function getServerSideProps({req, query}) {
	const {session} = await authStytchRequest(req);
	if (!session) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}
	const sessionJWT = req.cookies["stytch_session_jwt"];
	const {userProfile} = await getUserProfile(session.user_id, sessionJWT);
	if (!userProfile) {
    return {
      redirect: {
        destination: "/onboard",
        permanent: false,
      },
    };
  }

	const {pid} = query;
	const changesRules = await getChangesRules(pid, sessionJWT);
	const votingRules = await getVotingRules(pid, sessionJWT);
	const initialUserList = await getProjectUsers(pid, sessionJWT);
	if (!changesRules || !votingRules || !initialUserList) {
		return {
			redirect: {
				destination: `/projects/${pid}`,
				permanent: false,
			},
		};
	}

	const userRoles = await getUserRoles(session.user_id, sessionJWT);
  console.log("User Roles: ", userRoles);

  const zustandServerStore = initializeStore({
    userProfile,
    userRoles,
    currentProject: pid,
  });

	return {
		props: {
			pid,
			changesRules,
			votingRules,
			initialUserList,
			initialZustandState: JSON.parse(
        JSON.stringify(zustandServerStore.getState())
      ),
		}
	};
}
