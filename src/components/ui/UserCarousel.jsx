import {faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";

export default function UserCarousel({users}) {
  return (
    <div className="flex mt-6 space-x-4 overflow-x-scroll">
      {users.map((user, index) => (
        <div key={index} className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full relative">
          <Avatar name={user}/>
        </div>
      ))}
    </div>
  )
}


const Avatar = ({ name }) => {
  const generateConsistentColour = str => {
    let hash = 0;
    for (let i = 0; i < str.length; i += 1) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = "#";
    for (let i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      colour += `00${value.toString(16)}`.slice(-2);
    }
    return colour;
  };

  return (
    <div>
      <div className="relative">
        <div
          className={"h-16 w-16 text-center text-white text-4xl rounded-full grid place-items-center overflow-hidden text-display-xs"}
          style={{
            backgroundColor: name
              ? generateConsistentColour(name)
              : generateConsistentColour("default"),
          }}
        >
          {name && name.length > 0 ? (
            name[0].toUpperCase()
          ) : (
            <FontAwesomeIcon icon={faUser} size={"xs"}/>
          )}
        </div>
      </div>
    </div>
  );
};