import React, {useState} from 'react';
import {Layout} from "@/components/ui/layout";
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import ConfirmationDialog from "@/components/simple/ConfirmationDialog";

export default function ManagementPanel({userList}) {
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
	const rule1Start = 1;
	const [rule1End, setRule1End] = useState(3);
	const [rule1Timeframe, setRule1Timeframe] = useState("24 hours");
	const [rule2Start, setRule2Start] = useState(4);
	const [rule2End, setRule2End] = useState(15);
	const [rule2Timeframe, setRule2Timeframe] = useState("24 hours");
	const [rule3Start, setRule3Start] = useState(16);
	const [rule3End, setRule3End] = useState(0);
	const [rule3Timeframe, setRule3Timeframe] = useState("24 hours");
	const [minimumVotes, setMinimumVotes] = useState(1);
	const [positiveVotesPercentage, setPositiveVotesPercentage] = useState(50);
	const [email, setEmail] = useState('');
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const roles = ["Project Manager", "Moderator", "Editor", "Voter", "Viewer"];

	const handleRule1EndChange = (e) => {
		setRule1End(e.target.value);
	}

	const handleRule1TimeframeChange = (e) => {
		setRule1Timeframe(e.target.value);
	}

	const handleRule2StartChange = (e) => {
		setRule2Start(e.target.value);
	}

	const handleRule2EndChange = (e) => {
		setRule2End(e.target.value);
	}

	const handleRule2TimeframeChange = (e) => {
		setRule2Timeframe(e.target.value);
	}

	const handleRule3StartChange = (e) => {
		setRule3Start(e.target.value);
	}

	const handleRule3TimeframeChange = (e) => {
		setRule3Timeframe(e.target.value);
	}

	const handleMinimumVotesChange = (e) => {
		setMinimumVotes(e.target.value);
	}

	const handlePositiveVotesPercentageChange = (e) => {
		setPositiveVotesPercentage(e.target.value);
	}

	const handleRoleChange = (email, newRole) => {
		console.log(`Role for user ${email} changed to ${newRole}`);
		updateUserRole(email, newRole);
	};

	function goToEditPage() {
		console.log("Navigating to Edit Project page");
		//TODO: Uncomment the following line after merge with edit page branch
		//router.push("/collections/[name]/edit");
	}

	function saveChangeRuleChanges() {
		console.log("Rule 1 start: ", rule1Start);
		console.log("Rule 1 end: ", rule1End);
		console.log("Rule 1 timeframe: ", rule1Timeframe);
		console.log("Rule 2 start: ", rule2Start);
		console.log("Rule 2 end: ", rule2End);
		console.log("Rule 2 timeframe: ", rule2Timeframe);
		console.log("Rule 3 start: ", rule3Start);
		console.log("Rule 3 timeframe: ", rule3Timeframe);

		const changeRulesData = {
			rule1: {
				rule1Start,
				rule1End,
				rule1Timeframe,
			},
			rule2: {
				rule2Start,
				rule2End,
				rule2Timeframe
			},
			rule3: {
				rule3Start,
				rule3Timeframe
			}
		};

		//TODO: Call API to save change rules
	}

	function saveVotingRuleChanges() {
		console.log("Saving minimum votes: ", minimumVotes);
		console.log("Saving positive votes percentage: ", positiveVotesPercentage);

		const votingRulesData = {
			minimumVotes,
			positiveVotesPercentage
		};

		//TODO: Call API to save voting rules
	}


	function checkEmailAddress() {
		console.log("Checking email address: ", email);
		//TODO: Implement email address check
		//TODO: If email is valid, set title and description with success message
		//TODO: If email is invalid, set title and description with error message
	}

	function updateUserRole(email, newRole) {
		console.log("Updating user role");
		//TODO: Replace with API call to update user role
		const user = userList.find(user => user.email === email);

		// If the user was found, update their role
		if (user) {
			user.role = newRole;
		}
	}

	return (
		<Layout>
			(
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
							<Input placeholder="1" type="number" className="w-[64px]" value="1" readOnly/>
							<span>to</span>
							<Input placeholder="3" type="number" className="w-[64px]" onChange={handleRule1EndChange}/>
							<span>line changes will be available to vote on for</span>
							<div className="w-[180px]">
								<Select onValueChange={handleRule1TimeframeChange}>
									<SelectTrigger id="timeframe1">
										<SelectValue placeholder="Select"/>
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
							<Input placeholder="4" type="number" className="w-[64px]" onChange={handleRule2StartChange}/>
							<span>to</span>
							<Input placeholder="15" type="number" className="w-[64px]" onChange={handleRule2EndChange}/>
							<span>line changes will be available to vote on for</span>
							<div className="w-[180px]">
								<Select onValueChange={handleRule2TimeframeChange}>
									<SelectTrigger id="timeframe1">
										<SelectValue placeholder="Select"/>
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
							<Input placeholder="16" type="number" className="w-[64px]" onChange={handleRule3StartChange}/>
							<div className="w-[180px]">
								<Select onValueChange={handleRule3TimeframeChange}>
									<SelectTrigger id="timeframe3">
										<SelectValue placeholder="Select"/>
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
						<Input id="total-votes" type="number" placeholder="1" min="1"
						       className="w-[64px]" onChange={handleMinimumVotesChange}/>
					</div>
					<div>
						<label className="block mb-2" htmlFor="positive-votes">
							What percentage of votes need to be positive for a change to be able to pass:
						</label>
						<Input id="positive-votes" type="number" placeholder="50" min="1"
						       className="w-[64px]" onChange={handlePositiveVotesPercentageChange}/>
					</div>
					<Button className="mt-4" onClick={saveVotingRuleChanges}>Save Changes</Button>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-4">Invite User</h2>
					<div className="flex items-center space-x-2">
						<Input placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)}/>
						<ConfirmationDialog title={title} description={description}>
							<Button onClick={checkEmailAddress}>Send Invite</Button>
						</ConfirmationDialog>
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
							{/*TODO: FIX ERROR - Roles do not update when changed*/}
							{userList.map(user => (
								<TableRow key={user.email}>
									<TableCell className="font-medium">{user.email}</TableCell>
									<TableCell>{user.name}</TableCell>
									<TableCell>
										<Select onValueChange={(newRole) => handleRoleChange(user.email, newRole)}>
											<SelectTrigger id="role">
												<SelectValue>{user.role}</SelectValue>
											</SelectTrigger>
											<SelectContent position="popper">
												{roles.map(role => (
													<SelectItem key={role} value={role}>{role}</SelectItem>
												))}
											</SelectContent>
										</Select>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</section>
			</div>
			)
		</Layout>
	);
}

export async function getServerSideProps() {
	//TODO: Update with correct API endpoint
	//const res = await fetch('/api/users');
	//const userList = await res.json();
	const userList = [
		{
			id: 1,
			name: 'John Doe',
			email: 'johndoe@example.com',
			role: 'Project Manager'
		},
		{
			id: 2,
			name: 'Jane Doe',
			email: 'janedoe@example.com',
			role: 'Moderator'
		},
		{
			id: 3,
			name: 'Alice Smith',
			email: 'alicesmith@example.com',
			role: 'Editor'
		},
		{
			id: 4,
			name: 'Bob Johnson',
			email: 'bobjohnson@example.com',
			role: 'Voter'
		},
		{
			id: 5,
			name: 'Charlie Brown',
			email: 'charliebrown@example.com',
			role: 'Viewer'
		},
	];

	return {
		props: {userList}
	};
}