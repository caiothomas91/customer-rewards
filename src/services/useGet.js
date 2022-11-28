import { useState, useEffect } from "react";
import axios from "axios";

export default function useGet(url) {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function init() {
			try {
				const response = await axios.get(url);
				if (response.status === 200) {
					setData(response.data);
				} else {
					throw response;
				}
			} catch (e) {
				setError(e);
			} finally {
				setLoading(false);
			}
		}
		init();
	}, [url]);

	return { data, error, loading };
}
