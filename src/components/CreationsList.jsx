import React, { useState, useEffect } from 'react';
import CreateCreationDialog from './CreateCreationDialog';
import { getCreationSubmissions } from '@/lib/creations';
import { useAuth } from '@/contexts/AuthContext';

const CreationsList = ({ projectId }) => {
  const [selectedCreation, setSelectedCreation] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const { jwt } = useAuth();

  const handleCreateCreation = (creationData) => {
    // Implement the creation logic here
    console.log('Creating new creation:', creationData);
  };

  useEffect(() => {
    if (selectedCreation) {
      fetchSubmissions();
    }
  }, [selectedCreation]);

  const fetchSubmissions = async () => {
    try {
      const response = await getCreationSubmissions(projectId, selectedCreation.id, jwt);
      setSubmissions(response.submissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  return (
    <div>
      <h1>Creations List</h1>
      <CreateCreationDialog onCreateCreation={handleCreateCreation} />
      
      {/* Display creations list here */}
      
      {selectedCreation && (
        <div>
          <h2>{selectedCreation.name}</h2>
          <div className="grid grid-cols-3 gap-4">
            {submissions.map((submission) => (
              <div key={submission.id} className="border p-4 rounded">
                <h3>Submission {submission.id}</h3>
                <p>{submission.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreationsList;
