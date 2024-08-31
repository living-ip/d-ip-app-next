import React from 'react';
import { Input } from "@/components/ui/input";

export const VotingRulesInput = ({votingSettings, handleVotingSettingChange}) => (
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
