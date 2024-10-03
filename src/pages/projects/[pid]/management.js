import React, { useCallback, useState } from 'react';
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Switch } from "@/components/ui/switch";
import { IoArrowBackOutline } from "react-icons/io5";
import {
    addUserToProject,
    cancelInvite,
    getChangesRules,
    getProjectAccessRequests,
    getProjectInvites,
    getProjectUsers,
    getVotingRules,
    removeUserFromProject,
    updateChangesRules,
    updateProjectUserRole,
    updateVotingRules,
    acceptAccessRequest,
    rejectAccessRequest,
} from "@/lib/admin";
import { initializeStore, useStore } from "@/lib/store";
import { getOwnUserProfile } from "@/lib/user";
import { getProjectSettings, updateProjectSettings } from "@/lib/settings";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/components/ui/use-toast";

import { Section } from '@/components/Section';
import { RuleInput } from '@/components/RuleInput';
import { VotingRulesInput } from '@/components/VotingRulesInput';
import { UserRolesTable } from '@/components/UserRolesTable';
import { InvitesTable } from '@/components/InvitesTable';
import { AccessRequestsTable } from '@/components/AccessRequestsTable';

const ROLES = ["project_manager", "moderator", "editor", "voter", "viewer"];

export default function ManagementPanel({
    pid,
    changesRules,
    votingRules,
    initialUserList,
    initialNotifications,
    initialInvites,
    initialAccessRequests
}) {
	const {toast} = useToast();
	const router = useRouter();
	const [userRoles, currentProject] = useStore((state) => [state.userRoles, state.currentProject]);
	const [userList, setUserList] = useState(initialUserList);
	const [email, setEmail] = useState('');
	const [newUserRole, setNewUserRole] = useState('viewer');
	const [notificationsEnabled, setNotificationsEnabled] = useState(initialNotifications);
	const [invites, setInvites] = useState(initialInvites);
	const [accessRequests, setAccessRequests] = useState(initialAccessRequests);

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
			await updateProjectSettings(pid, {notifications: enabled}, getAuthToken());
			toast({
				title: "Notification settings updated",
				description: enabled ? "Email notifications enabled" : "Email notifications disabled"
			});
		} catch (error) {
			console.error("Failed to update notification settings:", error);
			toast({
				title: "Error",
				description: "Failed to update notification settings. Please try again.",
				variant: "destructive"
			});
			setNotificationsEnabled(!enabled);
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
		try {
			const changeRulesData = rules.map(rule => ({
				start: rule.start,
				end: rule.end,
				time: rule.timeframe
			}));
			await updateChangesRules(pid, changeRulesData, getAuthToken());
			toast({
				title: "Change rules updated",
				description: "The changes have been saved successfully."
			});
		} catch (error) {
			console.error("Failed to update change rules:", error);
			toast({
				title: "Error",
				description: "Failed to update change rules. Please try again.",
				variant: "destructive"
			});
		}
	};

	const saveVotingRuleChanges = async () => {
		try {
			const votingRulesData = {
				min_votes_required: votingSettings.minimumVotes,
				min_votes_percentage: votingSettings.positiveVotesPercentage / 100
			};
			await updateVotingRules(pid, votingRulesData, getAuthToken());
			toast({
				title: "Voting rules updated",
				description: "The changes have been saved successfully."
			});
		} catch (error) {
			console.error("Failed to update voting rules:", error);
			toast({
				title: "Error",
				description: "Failed to update voting rules. Please try again.",
				variant: "destructive"
			});
		}
	};

	const inviteUserToProject = async () => {
		try {
			const result = await addUserToProject(pid, {
				email,
				role: newUserRole
			}, getAuthToken());
			if (result) {
				setEmail("");
				setNewUserRole("viewer");
				setInvites([...invites, result]);
				toast({
					title: "User Invited",
					description: "They'll receive an invite in their email shortly."
				});
			}
		} catch (error) {
			console.error("Failed to invite user:", error);
			toast({
				title: "Failed to add user",
				description: "An error occurred while adding the user. Please try again later.",
				variant: "destructive"
			});
		}
	};

	const handleRemoveUser = async (uid) => {
		try {
			const result = await removeUserFromProject(pid, uid, getAuthToken());
			if (result) {
				setUserList(prevList => prevList.filter(user => user.uid !== uid));
				toast({
					title: "User Removed",
					description: "All access removed. They can no longer access the project."
				});
			}
		} catch (error) {
			console.error("Failed to remove user:", error);
			toast({
				title: "Failed to remove user",
				description: "An error occurred while removing the user. Please try again later.",
				variant: "destructive"
			});
		}
	};

	const handleRoleChange = async (uid, newRole) => {
		const user = userList.find(user => user.uid === uid);
		if (user.role === "admin") {
			console.log("Cannot change role of admin user");
			return;
		}
		try {
			const result = await updateProjectUserRole(pid, uid, newRole, getAuthToken());
			if (result) {
				setUserList(prevList => prevList.map(user =>
					user.uid === uid ? {...user, role: newRole} : user
				));
				toast({
					title: "User Updated",
					description: `User role updated to ${newRole}`
				});
			}
		} catch (error) {
			console.error("Failed to update user role:", error);
			toast({
				title: "Failed to update user role",
				description: "An error occurred while updating the user. Please try again later.",
				variant: "destructive"
			});
		}
	};

	const handleAcceptAccessRequest = async (arid) => {
		try {
			await acceptAccessRequest(pid, arid, getAuthToken());
			setAccessRequests(prevRequests => prevRequests.filter(request => request.arid !== arid));
			toast({
				title: "Access Request Accepted",
				description: "The user has been granted access to the project."
			});
		} catch (error) {
			console.error("Failed to accept access request:", error);
			toast({
				title: "Error",
				description: "Failed to accept the access request. Please try again.",
				variant: "destructive"
			});
		}
	};

	const handleRejectAccessRequest = async (arid) => {
		try {
			await rejectAccessRequest(pid, arid, getAuthToken());
			setAccessRequests(prevRequests => prevRequests.filter(request => request.arid !== arid));
			toast({
				title: "Access Request Rejected",
				description: "The access request has been rejected."
			});
		} catch (error) {
			console.error("Failed to reject access request:", error);
			toast({
				title: "Error",
				description: "Failed to reject the access request. Please try again.",
				variant: "destructive"
			});
		}
	};

	return (
		<MainLayout>
			<div className="max-w-4xl mx-auto p-8">
				<div className="flex items-center gap-4 mb-6">
					<Button
						variant="outline"
						className="p-2.5 rounded-sm border border-gray-200 border-solid bg-white"
						onClick={() => router.push(`/projects/${pid}`)}
					>
						<IoArrowBackOutline className="w-4 h-4 cursor-pointer text-black"/>
					</Button>
					<h1 className="text-3xl font-bold">Project Management Admin Panel</h1>
				</div>

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
							className="flex-grow"
						/>
						<Select
							value={newUserRole}
							onValueChange={setNewUserRole}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select role"/>
							</SelectTrigger>
							<SelectContent>
								{ROLES.map(role => (
									<SelectItem key={role} value={role}>{role}</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button onClick={inviteUserToProject}>Add User</Button>
					</div>
				</Section>

				<Section title="Invites">
					<InvitesTable
						invites={invites}
					/>
				</Section>

				<Section title="Access Requests">
					<AccessRequestsTable
						accessRequests={accessRequests}
						handleAcceptAccessRequest={handleAcceptAccessRequest}
						handleRejectAccessRequest={handleRejectAccessRequest}
					/>
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
		</MainLayout>
	);
}


export async function getServerSideProps({req, query}) {
	const sessionJWT = req.cookies["x_d_jwt"];
	const {userProfile, roles} = await getOwnUserProfile(sessionJWT);
	if (!userProfile) {
		return {
			redirect: {
				destination: "/onboard",
				permanent: false,
			},
		};
	}

	const {pid} = query;
	const [
		changesRules,
		votingRules,
		initialUserList,
		projectSettings,
		projectInvites,
		accessRequests
	] = await Promise.all([
		getChangesRules(pid, sessionJWT),
		getVotingRules(pid, sessionJWT),
		getProjectUsers(pid, sessionJWT),
		getProjectSettings(pid, sessionJWT),
		getProjectInvites(pid, sessionJWT),
		getProjectAccessRequests(pid, sessionJWT)
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
			initialNotifications: projectSettings.settings.notifications || false,
			initialInvites: projectInvites.invites || [],
			initialAccessRequests: accessRequests.requests || []
		}
	};
}
