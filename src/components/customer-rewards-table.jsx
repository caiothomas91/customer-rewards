import useGet from "../services/useGet";
import {
	Typography,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	Paper,
	TableBody,
} from "@mui/material";

const transactionsUrl = "http://localhost:3001/transactions";

const getPositiveMonth = (month) => {
	if (month >= 0) return month;
	return month + 12;
};

const getMonthAndYear = (month) => {
	const year =
		month < 0 ? new Date().getFullYear() - 1 : new Date().getFullYear();

	return `${monthNames[getPositiveMonth(month)]} ${year}`;
};

const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const calculatePointsReducer = (total, amount) => {
	if (amount <= 50) return total;
	return amount > 100 ? (amount - 100) * 2 + 50 + total : amount - 50 + total;
};

const calculatePointsForCustomerMonth = (transactions, name, month) => {
	return transactions
		.filter(
			(transaction) =>
				transaction.name === name &&
				new Date(transaction.date).getMonth() === month
		)
		.map((transaction) => transaction.amount)
		.reduce(calculatePointsReducer, 0);
};

const createRow = (name, month1Points, month2Points, month3Points) => {
	return { name, month1Points, month2Points, month3Points };
};

const createRows = (transactionData) => {
	const rows = [];

	const uniqueNames = [
		...new Set(transactionData.map((transaction) => transaction.name)),
	];

	uniqueNames.forEach((name) => {
		const row = createRow(
			name,
			calculatePointsForCustomerMonth(
				transactionData,
				name,
				getPositiveMonth(new Date().getMonth() - 2)
			),
			calculatePointsForCustomerMonth(
				transactionData,
				name,
				getPositiveMonth(new Date().getMonth() - 1)
			),
			calculatePointsForCustomerMonth(
				transactionData,
				name,
				new Date().getMonth()
			)
		);

		row.totalPoints = row.month1Points + row.month2Points + row.month3Points;

		rows.push(row);
	});

	return rows;
};

export default function CustomerRewardsTable() {
	const { data, loading, error } = useGet(transactionsUrl);

	if (error)
		return <Typography variant='h3'>Sorry!! An error occured.</Typography>;
	if (loading) return <Typography variant='h3'>Loading...</Typography>;

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label='simple table'>
				<TableHead>
					<TableRow>
						<TableCell>Customer Name</TableCell>
						<TableCell align='right'>
							{getMonthAndYear(new Date().getMonth() - 2)}
						</TableCell>
						<TableCell align='right'>
							{getMonthAndYear(new Date().getMonth() - 1)}
						</TableCell>
						<TableCell align='right'>
							{getMonthAndYear(new Date().getMonth())}
						</TableCell>
						<TableCell align='right'>Total</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{createRows(data).map((row) => (
						<TableRow
							key={row.name}
							sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
						>
							<TableCell component='th' scope='row'>
								{row.name}
							</TableCell>
							<TableCell align='right'>{row.month1Points}</TableCell>
							<TableCell align='right'>{row.month2Points}</TableCell>
							<TableCell align='right'>{row.month3Points}</TableCell>
							<TableCell align='right'>{row.totalPoints}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
