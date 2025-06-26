import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAppContext } from "@/contexts/app-context";
import { useStore } from "@/lib/store";
import { useEffect } from "react";

export function RecordPagination() {
  const { offset, setOffset, searchResults, triggerFetch, fetchTrigger } =
    useStore();
  const { settings } = useAppContext();
  const limit =
    JSON.parse(settings?.[0]?.Value ?? "{}")?.max_fetch_limit ?? 200;

  const currentPage = offset / limit + 1;
  const hasPrevious = offset > 0;
  const hasNext = searchResults?.info?.more_records;

  useEffect(() => {
    if (currentPage && fetchTrigger) triggerFetch();
  }, [currentPage]);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={!hasPrevious}
            className={!hasPrevious ? "pointer-events-none opacity-50" : ""}
            onClick={(e) => {
              e.preventDefault();
              if (hasPrevious) setOffset(offset - limit);
            }}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink href="#" isActive>
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={!hasNext}
            className={!hasNext ? "pointer-events-none opacity-50" : ""}
            onClick={(e) => {
              e.preventDefault();
              if (hasNext) setOffset(offset + limit);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
