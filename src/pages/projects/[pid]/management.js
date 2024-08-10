import React, { useCallback, useState } from 'react';
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NewLayout } from "@/components/NewLayout";
import { Switch } from "@/components/ui/switch";
import {
  addUserToProject,
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
  cancelInvite,
  resendInvite,
} from "@/lib/admin";
import { initializeStore, useStore } from "@/lib/store";
import { getUserProfile } from "@/lib/user";
import { getProjectSettings, updateProjectSettings } from "@/lib/settings";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/components/ui/use-toast";

const TIMEFRAMES = [
  { label: "1 hour", value: 1 * 60 * 60 * 1000 },
  { label: "4 hours", value: 4 * 60 * 60 * 1000 },
  { label: "8 hours", value: 8 * 60 * 60 * 1000 },
  { label: "12 hours", value: 12 * 60 * 60 * 1000 },
  { label: "1 day", value: 24 * 60 * 60 * 1000 },
  { label: "3 days", value: 72 * 60 * 60 * 1000 },
  { label: "7 days", value: 168 * 60 * 60 * 1000 }
];

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
  const { toast } = useToast();
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
      await updateProjectSettings(pid, { notifications: enabled }, getAuthToken());
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
      i === index ? { ...rule, [field]: value } : rule
    ));
  }, []);

  const handleVotingSettingChange = useCallback((field, value) => {
    setVotingSettings(prev => ({ ...prev, [field]: value }));
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
          user.uid === uid ? { ...user, role: newRole } : user
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

  const handleCancelInvite = async (iid) => {
    try {
      await cancelInvite(pid, iid, getAuthToken());
      setInvites(prevInvites => prevInvites.filter(invite => invite.iid !== iid));
      toast({
        title: "Invite Cancelled",
        description: "The invitation has been cancelled successfully."
      });
    } catch (error) {
      console.error("Failed to cancel invite:", error);
      toast({
        title: "Error",
        description: "Failed to cancel the invitation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleResendInvite = async (iid) => {
    try {
      await resendInvite(pid, iid, getAuthToken());
      toast({
        title: "Invite Resent",
        description: "The invitation has been resent successfully."
      });
    } catch (error) {
      console.error("Failed to resend invite:", error);
      toast({
        title: "Error",
        description: "Failed to resend the invitation. Please try again.",
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
              className="flex-grow"
            />
            <Select
              value={newUserRole}
              onValueChange={setNewUserRole}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select role" />
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
            handleCancelInvite={handleCancelInvite}
            handleResendInvite={handleResendInvite}
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

        <Section title="Access Requests">
          <AccessRequestsTable
            accessRequests={accessRequests}
            handleAcceptAccessRequest={handleAcceptAccessRequest}
            handleRejectAccessRequest={handleRejectAccessRequest}
          />
        </Section>
      </div>
    </NewLayout>
  );
}

const Section = ({ title, children }) => (
  <section className="mb-6">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </section>
);

const RuleInput = ({ rule, index, handleRuleChange }) => (
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
        <SelectValue />
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

const VotingRulesInput = ({ votingSettings, handleVotingSettingChange }) => (
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

const UserRolesTable = ({ userList, userRoles, currentProject, handleRoleChange, handleRemoveUser }) => (
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

const InvitesTable = ({ invites, handleCancelInvite, handleResendInvite }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Email</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {invites.map(invite => (
        <TableRow key={invite.iid}>
          <TableCell>{invite.email}</TableCell>
          <TableCell>
            {invite.accepted ? 'Accepted' : invite.rejected ? 'Rejected' : 'Pending'}
          </TableCell>
          <TableCell>
            {!invite.accepted && !invite.rejected && (
              <>
                <Button onClick={() => handleCancelInvite(invite.iid)} className="mr-2">
                  Cancel
                </Button>
                <Button onClick={() => handleResendInvite(invite.iid)}>
                  Resend
                </Button>
              </>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const AccessRequestsTable = ({ accessRequests, handleAcceptAccessRequest, handleRejectAccessRequest }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Email</TableHead>
        <TableHead>Requested At</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {accessRequests.map(request => (
        <TableRow key={request.arid}>
          <TableCell>{request.email}</TableCell>
          <TableCell>{new Date(request.created_at).toLocaleString()}</TableCell>
          <TableCell>
            <Button onClick={() => handleAcceptAccessRequest(request.arid)} className="mr-2">
              Accept
            </Button>
            <Button onClick={() => handleRejectAccessRequest(request.arid)} variant="destructive">
              Reject
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export async function getServerSideProps({ req, query }) {
  const sessionJWT = req.cookies["x_d_jwt"];
  const { userProfile, roles } = await getUserProfile("TODO", sessionJWT);
  if (!userProfile) {
    return {
      redirect: {
        destination: "/onboard",
        permanent: false,
      },
    };
  }

  const { pid } = query;
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
      votingRules: votingRules || { min_votes_required: 1, min_votes_percentage: 0.5 },
      initialUserList: initialUserList || [],
      initialZustandState: JSON.parse(JSON.stringify(zustandServerStore.getState())),
      initialNotifications: projectSettings.settings.notifications || false,
      initialInvites: projectInvites.invites || [],
      initialAccessRequests: accessRequests.requests || []
    }
  };
}