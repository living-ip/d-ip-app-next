import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TIMEFRAMES = [
    {label: "1 hour", value: 1 * 60 * 60 * 1000},
    {label: "4 hours", value: 4 * 60 * 60 * 1000},
    {label: "8 hours", value: 8 * 60 * 60 * 1000},
    {label: "12 hours", value: 12 * 60 * 60 * 1000},
    {label: "1 day", value: 24 * 60 * 60 * 1000},
    {label: "3 days", value: 72 * 60 * 60 * 1000},
    {label: "7 days", value: 168 * 60 * 60 * 1000}
];

export const RuleInput = ({rule, index, handleRuleChange}) => (
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
