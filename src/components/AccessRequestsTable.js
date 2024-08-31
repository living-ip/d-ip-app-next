import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { acceptAccessRequest, rejectAccessRequest } from "@/lib/admin";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";

const ROLES = ["project_manager", "moderator", "editor", "voter", "viewer"];

const handleAccessRequest = async (role, pid, arid) => {
    if (role === "reject") {
        await rejectAccessRequest(pid, arid, getAuthToken());
        toast({
            title: "Access Request Rejected",
            description: "The access request has been rejected."
        });
    } else {
        await acceptAccessRequest(pid, arid, role, getAuthToken());
        toast({
            title: "Access Request Accepted",
            description: "The user has been granted access to the project."
        });
    }
}

export const AccessRequestsTable = ({accessRequests}) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Requested At</TableHead>
                <TableHead>Assign Role</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {accessRequests.map(request => (
                <TableRow key={request.arid}>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>{new Date(request.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                        <Select onValueChange={(role) => {
                            handleAccessRequest(role, request.project_id, request.arid)
                        }}>
                            <SelectTrigger>
                                <SelectValue></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {ROLES.map(role => (
                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                ))}
                                <SelectItem value={"reject"} className={"text-red-800"}>reject</SelectItem>
                            </SelectContent>
                        </Select>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);
