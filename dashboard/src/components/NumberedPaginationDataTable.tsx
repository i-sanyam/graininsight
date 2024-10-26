import { Table } from "@tanstack/table-core";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "./ui/pagination";
import React from "react";

type ShadTable = Table<{ [key: string]: any }>;

const NumberedPaginationDataTable: React.FC<{ table: ShadTable, recordsPerPage: number }> = ({
    table,
    recordsPerPage,
}) => {
    const CustomPageNumbers: React.FC<{
        startIndex?: number;
        length?: number;
    }> = ({ startIndex = 0, length = 1 }) => {
        return (
            <>
                {Array.from({ length }).map((_, i) => {
                    return (
                        <PaginationItem key={i}>
                            <PaginationLink
                                onClick={() => setCurrentPageIndex(startIndex + i)}
                                isActive={currentPageIndex === startIndex + i}
                            >
                                {startIndex + i + 1}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
            </>
        );
    };
    function getWindowFirstIndex() {
        if (currentPageIndex - WINDOW_SIZE / 2 <= 0) {
            // at the beginning of the table
            return 1;
        }
        const proposedWindowFirstIndex = currentPageIndex - WINDOW_SIZE / 2;
        if (proposedWindowFirstIndex + WINDOW_SIZE >= pageCount) {
            // at the end of the table
            return pageCount - WINDOW_SIZE - 1;
        }
        return proposedWindowFirstIndex;
    }
    const pageCount = table.getPageCount();
    const WINDOW_SIZE = 8;

    const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
    React.useEffect(() => setCurrentPageIndex(0), [recordsPerPage]);
    React.useEffect(() => table.setPageIndex(currentPageIndex), [currentPageIndex]);

    const windowFirstIndex = getWindowFirstIndex();
    const tooManyPages = pageCount > WINDOW_SIZE;
    if (!tooManyPages) {
        return (
            <Pagination>
                <PaginationContent>
                    <CustomPageNumbers length={pageCount} />
                </PaginationContent>
            </Pagination>
        );
    }
    const mountedFirstIndex = 0;
    const mountedLastIndex = pageCount - 1;
    const windowLastIndex = windowFirstIndex + WINDOW_SIZE - 1;
    const showFirstElipsis = windowFirstIndex > 1;
    const showLastElipsis = windowLastIndex < mountedLastIndex - 1;
    return (
        <Pagination>
            <PaginationContent>
                {/* Mount the first page */}
                <CustomPageNumbers length={1} startIndex={mountedFirstIndex} />
                {showFirstElipsis && <PaginationEllipsis onClick={() => {
                    const newIndex = Math.max(windowFirstIndex - WINDOW_SIZE/2, 0);
                    setCurrentPageIndex(newIndex);
                }} />}
                <CustomPageNumbers length={WINDOW_SIZE} startIndex={windowFirstIndex} />
                {showLastElipsis && <PaginationEllipsis onClick={() => {
                    const newIndex = Math.min(windowLastIndex + WINDOW_SIZE/2 +1, mountedLastIndex);
                    setCurrentPageIndex(newIndex);
                }} />}
                {/* Mount the last page */}
                <CustomPageNumbers length={1} startIndex={mountedLastIndex} />
            </PaginationContent>
        </Pagination>
    );
};

export default NumberedPaginationDataTable;
