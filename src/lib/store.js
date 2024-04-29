import {createStore, useStore as useZustandStore} from "zustand";
import {createContext, useContext} from "react";

const getDefaultInitialState = () => ({
	userProfile: undefined,
	userRoles: [],
	currentProject: undefined,
	invalidPermissionsDialogOpen: false,
});

const zustandContext = createContext(null);
export const Provider = zustandContext.Provider;
export const useStore = (selector) => {
	const store = useContext(zustandContext);
	if (!store) throw new Error("Store is missing the provider");
	return useZustandStore(store, selector);
};

export const initializeStore = (preloadedState) => {
	return createStore((set, get) => ({
		...getDefaultInitialState(),
		...preloadedState,
		setUserProfile: (userProfile) => set({userProfile}),
		setUserRoles: (userRoles) => set({userRoles}),
		setCurrentProject: (currentProject) => set({currentProject}),
		setInvalidPermissionsDialogOpen: (invalidPermissionsDialogOpen) =>
			set({invalidPermissionsDialogOpen}),
	}));
};
