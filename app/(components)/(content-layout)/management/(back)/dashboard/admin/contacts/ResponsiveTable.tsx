"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";

import { useState } from "react";


import SearchBar from "../../../../components/DataTableComponents/SearchBar";


import { DataTableViewOptions } from "../../../../components/DataTableComponents/DataTableViewOptions";
import { Button } from "../../../../components/ui/button";



import { ListFilter } from "lucide-react";
;

import DateFilters from "../../../../components/DataTableComponents/DateFilters";


import DateRangeFilter from "../../../../components/DataTableComponents/DateRangeFilter";



import { DataTablePagination } from "../../../../components/DataTableComponents/DataTablePagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export default function ResponsiveTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>([]);
  const [searchResults, setSearchResults] = useState(data);
  const [filteredData, setFilteredData] = useState(data);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isSearch, setIsSearch] = useState(true);

  const table = useReactTable({
    data: isSearch ? searchResults : filteredData,
    columns,
    state: { sorting, columnVisibility, rowSelection, columnFilters },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex-1 w-full">
          <SearchBar
            data={data}
            onSearch={setSearchResults}
            setIsSearch={setIsSearch}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <DateRangeFilter
            data={data}
            onFilter={setFilteredData}
            setIsSearch={setIsSearch}
          />
          <DateFilters
            data={data}
            onFilter={setFilteredData}
            setIsSearch={setIsSearch}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 px-2 sm:px-3">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-black w-48 sm:w-auto" align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Active</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {!header.isPlaceholder &&
                      flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-3">
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <div key={row.id} className="border rounded-lg p-4 shadow-sm bg-white">
              {row.getVisibleCells().map((cell) => (
                <div key={cell.id} className="flex justify-between py-2 border-b last:border-none">
                  <span className="text-xs text-gray-500">
                    {cell.column.columnDef.header as string}
                  </span>
                  <span className="text-sm font-medium text-right">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-10">No results.</div>
        )}
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}