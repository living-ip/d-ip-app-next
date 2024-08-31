import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const ROLES = ["project_manager", "moderator", "editor", "voter", "viewer"];

export const UserRolesTable = ({userList, userRoles, currentProject, handleRoleChange, handleRemoveUser}) => (
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
