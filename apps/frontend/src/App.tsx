import { domAnimation, LazyMotion } from "motion/react";
import { SonnerToaster } from "./components/ui/Toaster";
import { Router } from "./router";
import { useGlobalStore } from "./store/zustand/globalStore";

useGlobalStore.getState().actions.handleQueryListeners("add");

function App() {
	return (
		<LazyMotion features={domAnimation} strict={true}>
			<Router />

			<SonnerToaster />
		</LazyMotion>
	);
}

export default App;
