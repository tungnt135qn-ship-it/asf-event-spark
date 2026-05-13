import { ReactNode, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Plus, Eye, Pencil, Trash2, Search } from "lucide-react";

export type CrudColumn<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
};

export function CrudListPage<T extends { id?: string | null }>({
  title,
  description,
  loading,
  rows,
  columns,
  searchPlaceholder = "Tìm kiếm…",
  searchAccessor,
  onCreate,
  onView,
  onEdit,
  onDelete,
  emptyText = "Chưa có dữ liệu.",
}: {
  title: string;
  description?: string;
  loading?: boolean;
  rows: T[];
  columns: CrudColumn<T>[];
  searchPlaceholder?: string;
  searchAccessor?: (row: T) => string;
  onCreate?: () => void;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => Promise<void> | void;
  emptyText?: string;
}) {
  const [q, setQ] = useState("");
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);

  const filtered = useMemo(() => {
    if (!q.trim() || !searchAccessor) return rows;
    const needle = q.toLowerCase();
    return rows.filter((r) => searchAccessor(r).toLowerCase().includes(needle));
  }, [q, rows, searchAccessor]);

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b">
        <div className="min-w-0">
          <h3 className="font-semibold text-base truncate">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {searchAccessor && (
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-7 h-9 w-[220px]"
              />
            </div>
          )}
          {onCreate && (
            <Button size="sm" onClick={onCreate}>
              <Plus className="mr-1 h-4 w-4" /> Tạo mới
            </Button>
          )}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c.key} className={c.className}>
                {c.header}
              </TableHead>
            ))}
            <TableHead className="w-[60px] text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center text-sm text-muted-foreground py-10">
                Đang tải…
              </TableCell>
            </TableRow>
          ) : filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center text-sm text-muted-foreground py-10">
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((row, idx) => (
              <TableRow key={row.id ?? idx}>
                {columns.map((c) => (
                  <TableCell key={c.key} className={c.className}>
                    {c.render(row)}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onView && (
                        <DropdownMenuItem onClick={() => onView(row)}>
                          <Eye className="mr-2 h-4 w-4" /> Xem
                        </DropdownMenuItem>
                      )}
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(row)}>
                          <Pencil className="mr-2 h-4 w-4" /> Sửa
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setPendingDelete(row)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Xoá
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xoá mục này?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động không thể hoàn tác. Dữ liệu sẽ bị xoá vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (pendingDelete && onDelete) {
                  await onDelete(pendingDelete);
                }
                setPendingDelete(null);
              }}
            >
              Xoá
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
