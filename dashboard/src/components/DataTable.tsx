"use client";

import * as React from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import NumberedPaginationDataTable from "./NumberedPaginationDataTable";

type DataType = "string" | "number" | "boolean";

interface DataTableProps {
	headers: string[];
	data: { [key: string]: any }[];
	tableName: string;
	filterHeader?: string;
}

const DataTable: React.FC<DataTableProps> = ({
	tableName,
	data,
	headers,
	filterHeader,
}) => {
	const columns: ColumnDef<{ [key: string]: DataType }>[] = headers.map(
		(header) => {
			const dataObj = data?.[0];
			const isNumberDataType =
				dataObj?.[header] && isNaN(dataObj[header]) === false;
			return {
				accessorKey: header,
				header: ({ column }) => {
					return isNumberDataType ? (
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
						>
							{header}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					) : (
						header
					);
				},
			};
		}
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const DEFAULT_RECORDS_PER_PAGE = 10;
	const [recordsPerPage, setRecordsPerPage] = React.useState(DEFAULT_RECORDS_PER_PAGE);
	const pageCount =
		Math.floor(data.length / recordsPerPage) + (data.length % recordsPerPage === 0 ? 0 : 1);
	console.log(pageCount, ": pageCount", recordsPerPage, ": recordsPerPage");
	const table = useReactTable({
		data,
		columns,
		pageCount,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
		// Backend doesn't have any pagination implemented yet
		// for now backend is sending all the data at once, the results are just paginated at Frontend
		rowCount: data.length,
	});

	return (
		<div className="w-full">
			{tableName}
			<div className="flex items-center py-4">
				{filterHeader && headers.includes(filterHeader) && (
					<Input
						placeholder={`Filter ${filterHeader}...`}
						value={
							(table.getColumn(filterHeader)?.getFilterValue() as string) ?? ""
						}
						onChange={(event) =>
							table.getColumn(filterHeader)?.setFilterValue(event.target.value)
						}
						className="max-w-sm"
					/>
				)}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							Columns <ChevronDown className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							{recordsPerPage} rows/page <ChevronDown className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					{(data.length > DEFAULT_RECORDS_PER_PAGE) && <DropdownMenuContent align="end">
						{[10, 25, 50].map((recordsSizeOption) => {
							if (data.length < recordsSizeOption) {
								return;
							}
							return (
								<DropdownMenuCheckboxItem
									key={`datatable-pagination-recordsperpage-${recordsSizeOption}`}
									className="capitalize"
									checked={recordsPerPage === recordsSizeOption}
									onCheckedChange={() =>
										setRecordsPerPage(recordsSizeOption)
									}
								>
									{recordsSizeOption}
								</DropdownMenuCheckboxItem>
							);
						})}
					</DropdownMenuContent>}
				</DropdownMenu>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<NumberedPaginationDataTable table={table} />
			</div>
		</div>
	);
};

export default DataTable;
