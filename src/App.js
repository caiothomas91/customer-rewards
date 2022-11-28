import { Typography } from "@mui/material";
import CustomerRewardsTable from "./components/customer-rewards-table";

function App() {
	return (
		<div className='App'>
			<Typography variant='h2' mx='auto'>
				Customer Rewards Points
			</Typography>
			<CustomerRewardsTable />
		</div>
	);
}

export default App;
