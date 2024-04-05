import React from 'react';
import {Layout} from "@/components/ui/layout";
import {ProjectManagementAdminPanel} from "@/components/project-management-admin-panel";
const AdminPanel = ( {userList} ) => {
  return (
    <Layout>
      <ProjectManagementAdminPanel userList={userList}/>
    </Layout>
  );
};

export default AdminPanel;

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