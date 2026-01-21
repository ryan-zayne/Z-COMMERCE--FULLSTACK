import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/primitives/LoadingSpinner";
import { sessionQuery } from "@/store/react-query/queryFactory";

function ProtectionLayout() {
	const navigate = useNavigate();

	const sessionQueryResult = useQuery(sessionQuery());

	useEffect(() => {
		if (sessionQueryResult.isError) {
			toast.error("Unauthorized! Please sign in to continue");
			void navigate("/auth/signin");
		}
	}, [navigate, sessionQueryResult.isError]);

	if (sessionQueryResult.data) {
		return <Outlet />;
	}

	return <LoadingSpinner />;
}

export default ProtectionLayout;
