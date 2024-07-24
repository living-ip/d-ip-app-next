import React, {useState, useCallback} from 'react';
import {useRouter} from "next/router";
import {getCookie} from "cookies-next";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {NewLayout} from "@/components/NewLayout";
import {Switch} from "@/components/ui/switch"; // Add this import
import {
	addUserToProject,
	getChangesRules,
	getProjectUsers,
	getVotingRules,
	removeUserFromProject,
	updateChangesRules,
	updateProjectUserRole,
	updateVotingRules,
} from "@/lib/admin";
import {authStytchRequest} from "@/lib/stytch";
import {initializeStore, useStore} from "@/lib/store";
import {getUserProfile} from "@/lib/user";
import {getProjectSettings, updateProjectSettings} from "@/lib/settings";

const TIMEFRAMES = [
	{label: "1 hour", value: 1 * 60 * 60 * 1000},
	{label: "4 hours", value: 4 * 60 * 60 * 1000},
	{label: "8 hours", value: 8 * 60 * 60 * 1000},
	{label: "12 hours", value: 12 * 60 * 60 * 1000},
	{label: "1 day", value: 24 * 60 * 60 * 1000},
	{label: "3 days", value: 72 * 60 * 60 * 1000},
	{label: "7 days", value: 168 * 60 * 60 * 1000}
];

const ROLES = ["project_manager", "moderator", "editor", "voter", "viewer"];

export default function ManagementPanel({pid, changesRules, votingRules, initialUserList, initialNotifications}) {
	const router = useRouter();
	const [userRoles, currentProject] = useStore((state) => [state.userRoles, state.currentProject]);
	const [userList, setUserList] = useState(initialUserList);
	const [email, setEmail] = useState('');
	const [notificationsEnabled, setNotificationsEnabled] = useState(initialNotifications);

	const [rules, setRules] = useState(changesRules.map((rule, index) => ({
		start: rule.start,
		end: rule.end,
		timeframe: rule.time,
		isStartEditable: index !== 0,
		isEndEditable: index !== 2
	})));

	const [votingSettings, setVotingSettings] = useState({
		minimumVotes: votingRules.min_votes_required,
		positiveVotesPercentage: votingRules.min_votes_percentage * 100
	});

	const handleNotificationsToggle = async (enabled) => {
		setNotificationsEnabled(enabled);
		try {
			await updateProjectSettings(pid, {notifications: enabled}, getCookie("stytch_session_jwt"));
		} catch (error) {
			console.error("Failed to update notification settings:", error);
			// TODO: Add user-facing error message
			setNotificationsEnabled(!enabled); // Revert the state if the API call fails
		}
	};

	const handleRuleChange = useCallback((index, field, value) => {
		setRules(prevRules => prevRules.map((rule, i) =>
			i === index ? {...rule, [field]: value} : rule
		));
	}, []);

	const handleVotingSettingChange = useCallback((field, value) => {
		setVotingSettings(prev => ({...prev, [field]: value}));
	}, []);

	const saveChangeRuleChanges = async () => {
		const changeRulesData = rules.map(rule => ({
			start: rule.start,
			end: rule.end,
			time: rule.timeframe
		}));
		await updateChangesRules(pid, changeRulesData, getCookie("stytch_session_jwt"));
	};

	const saveVotingRuleChanges = async () => {
		const votingRulesData = {
			min_votes_required: votingSettings.minimumVotes,
			min_votes_percentage: votingSettings.positiveVotesPercentage / 100
		};
		await updateVotingRules(pid, votingRulesData, getCookie("stytch_session_jwt"));
	};

	const inviteUserToProject = async () => {
		try {
			const result = await addUserToProject(pid, email, getCookie("stytch_session_jwt"));
			if (result) {
				setEmail("");
				setUserList(prevList => [...prevList, result]);
			}
		} catch (error) {
			console.error("Failed to invite user:", error);
			// TODO: Add user-facing error message
		}
	};

	const handleRemoveUser = async (uid) => {
		try {
			const result = await removeUserFromProject(pid, uid, getCookie("stytch_session_jwt"));
			if (result) {
				setUserList(prevList => prevList.filter(user => user.uid !== uid));
			}
		} catch (error) {
			console.error("Failed to remove user:", error);
			// TODO: Add user-facing error message
		}
	};

	const handleRoleChange = async (uid, newRole) => {
		const user = userList.find(user => user.uid === uid);
		if (user.role === "admin") {
			console.log("Cannot change role of admin user");
			return;
		}

		try {
			const result = await updateProjectUserRole(pid, uid, newRole, getCookie("stytch_session_jwt"));
			if (result) {
				setUserList(prevList => prevList.map(user =>
					user.uid === uid ? {...user, role: newRole} : user
				));
			}
		} catch (error) {
			console.error("Failed to update user role:", error);
			// TODO: Add user-facing error message
		}
	};

	return (
		<NewLayout>
			<div className="max-w-4xl mx-auto p-8">
				<h1 className="text-3xl font-bold mb-6">Project Management Admin Panel</h1>

				<Section title="Edit Project">
					<Button onClick={() => router.push(`/projects/${pid}/edit`)}>Go to Edit Project page</Button>
				</Section>

				<Section title="Notifications">
					<div className="flex items-center space-x-2">
						<Switch
							checked={notificationsEnabled}
							onCheckedChange={handleNotificationsToggle}
							id="notifications-toggle"
						/>
						<label htmlFor="notifications-toggle" className="text-sm font-medium">
							Enable email notifications
						</label>
					</div>
				</Section>

				<Section title="Change Rules">
					{rules.map((rule, index) => (
						<RuleInput
							key={index}
							rule={rule}
							index={index}
							handleRuleChange={handleRuleChange}
						/>
					))}
					<Button className="mt-4" onClick={saveChangeRuleChanges}>Save Changes</Button>
				</Section>

				<Section title="Voting Rules">
					<VotingRulesInput
						votingSettings={votingSettings}
						handleVotingSettingChange={handleVotingSettingChange}
					/>
					<Button className="mt-4" onClick={saveVotingRuleChanges}>Save Changes</Button>
				</Section>

				<Section title="Invite User">
					<div className="flex items-center space-x-2">
						<Input
							placeholder="Email address"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Button onClick={inviteUserToProject}>Add User</Button>
					</div>
				</Section>

				<Section title="User Roles">
					<UserRolesTable
						userList={userList}
						userRoles={userRoles}
						currentProject={currentProject}
						handleRoleChange={handleRoleChange}
						handleRemoveUser={handleRemoveUser}
					/>
				</Section>
			</div>
		</NewLayout>
	);
}

const Section = ({title, children}) => (
	<section className="mb-6">
		<h2 className="text-xl font-semibold mb-4">{title}</h2>
		{children}
	</section>
);

const RuleInput = ({rule, index, handleRuleChange}) => (
	<div className="flex items-center space-x-2 mb-2">
		<Input
			type="number"
			className="w-[64px]"
			value={rule.start}
			onChange={(e) => handleRuleChange(index, 'start', e.target.value)}
			readOnly={!rule.isStartEditable}
		/>
		<span>to</span>
		<Input
			type="number"
			className="w-[64px]"
			value={rule.end}
			onChange={(e) => handleRuleChange(index, 'end', e.target.value)}
			readOnly={!rule.isEndEditable}
		/>
		<span>line changes will be available to vote on for</span>
		<Select
			onValueChange={(value) => handleRuleChange(index, 'timeframe', value)}
			defaultValue={rule.timeframe}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue/>
			</SelectTrigger>
			<SelectContent>
				{TIMEFRAMES.map(timeframe => (
					<SelectItem key={timeframe.value} value={timeframe.value}>
						{timeframe.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	</div>
);

const VotingRulesInput = ({votingSettings, handleVotingSettingChange}) => (
	<>
		<div className="mb-4">
			<label className="block mb-2" htmlFor="total-votes">
				Minimum number of total votes required for a change to be able to pass:
			</label>
			<Input
				id="total-votes"
				type="number"
				className="w-[64px]"
				value={votingSettings.minimumVotes}
				onChange={(e) => handleVotingSettingChange('minimumVotes', e.target.value)}
				min="1"
			/>
		</div>
		<div>
			<label className="block mb-2" htmlFor="positive-votes">
				What percentage of votes need to be positive for a change to be able to pass:
			</label>
			<Input
				id="positive-votes"
				type="number"
				className="w-[64px]"
				value={votingSettings.positiveVotesPercentage}
				onChange={(e) => handleVotingSettingChange('positiveVotesPercentage', e.target.value)}
				min="1"
				max="100"
			/>
		</div>
	</>
);

const UserRolesTable = ({userList, userRoles, currentProject, handleRoleChange, handleRemoveUser}) => (
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>Email</TableHead>
				<TableHead>Name</TableHead>
				<TableHead>Role</TableHead>
				<TableHead>Remove</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{userList.map(user => {
				const currentUserRole = userRoles.find((role) => role.project === currentProject)?.role.name;
				const canModifyUser = user.role !== "admin" && ROLES.indexOf(user.role) > ROLES.indexOf(currentUserRole);

				return (
					<TableRow key={user.email}>
						<TableCell className="font-medium">{user.email}</TableCell>
						<TableCell>{user.name}</TableCell>
						<TableCell>
							{canModifyUser ? (
								<Select onValueChange={(newRole) => handleRoleChange(user.uid, newRole)}>
									<SelectTrigger>
										<SelectValue>{user.role}</SelectValue>
									</SelectTrigger>
									<SelectContent>
										{ROLES.map(role => (
											<SelectItem key={role} value={role}>{role}</SelectItem>
										))}
									</SelectContent>
								</Select>
							) : (
								<div>{user.role}</div>
							)}
						</TableCell>
						<TableCell>
							<Button
								onClick={() => handleRemoveUser(user.uid)}
								disabled={!canModifyUser}
							>
								Remove
							</Button>
						</TableCell>
					</TableRow>
				);
			})}
		</TableBody>
	</Table>
);

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
	const {userProfile, roles} = await getUserProfile(session.user_id, sessionJWT);
	if (!userProfile) {
		return {
			redirect: {
				destination: "/onboard",
				permanent: false,
			},
		};
	}

	const {pid} = query;
	const [changesRules, votingRules, initialUserList, projectSettings] = await Promise.all([
		getChangesRules(pid, sessionJWT),
		getVotingRules(pid, sessionJWT),
		getProjectUsers(pid, sessionJWT),
		getProjectSettings(pid, sessionJWT)
	]);

	const zustandServerStore = initializeStore({
		userProfile,
		userRoles: roles,
		currentProject: pid,
	});

	return {
		props: {
			pid,
			changesRules: changesRules || [],
			votingRules: votingRules || {min_votes_required: 1, min_votes_percentage: 0.5},
			initialUserList: initialUserList || [],
			initialZustandState: JSON.parse(JSON.stringify(zustandServerStore.getState())),
			initialNotifications: projectSettings.settings.notifications || false
		}
	};
}