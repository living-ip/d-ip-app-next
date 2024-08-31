import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const InvitesTable = ({invites}) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {invites.map(invite => (
                <TableRow key={invite.iid}>
                    <TableCell>{invite.email}</TableCell>
                    <TableCell>
                        {invite.accepted ? 'Accepted' : invite.rejected ? 'Rejected' : 'Pending'}
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);
