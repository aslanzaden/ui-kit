import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../Icon/Icon';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Input } from '../Input/Input';
import { Badge } from '../Badge/Badge';
import colors from '../../constants/colors';
import type { IconsTypes } from '../../constants/icons';
import type { BadgeVariant } from '../Badge/Badge.types';
import type {
  TableAction,
  TableColumn,
  TableOptions,
  TablePage,
  TableStatusTransition,
} from '../../constants/table-component';
import './DataTable.css';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DEFAULT_ROWS_PER_PAGE_OPTIONS = [10, 15, 20];

function normalizeColumns(columns: TableColumn[]): TableColumn[] {
  return (columns || []).map((c) => {
    const key = c.key;
    const isIdColumn = key === 'id';
    return {
      key,
      label: c.label ?? key,
      type: c.type,
      minWidth: c.minWidth,
      sortable: !!c.sortable,
      // 'id' is always hidden regardless of what the caller passes
      visibility: isIdColumn ? false : (c.visibility ?? true),
      align: c.align ?? 'left',
      enumStates: c.enumStates,
      states: c.states,
      inputConfig: c.inputConfig,
      buttonConfig: c.buttonConfig,
    };
  });
}

const DEFAULT_BOOLEAN_STATES = {
  truthy: { type: 'icon' as const, value: 'CircleCheck' as IconsTypes, color: 'success' as const },
  falsy: { type: 'icon' as const, value: 'CircleMinus' as IconsTypes, color: 'muted_foreground' as const },
};

function resolveBooleanState(value: any, col: TableColumn) {
  const isTruthy = !!value;
  const fallback = isTruthy ? DEFAULT_BOOLEAN_STATES.truthy : DEFAULT_BOOLEAN_STATES.falsy;
  const override = isTruthy ? col.states?.truthy : col.states?.falsy;
  const merged = { ...fallback, ...(override || {}) };
  const resolvedValue = merged.value ?? (isTruthy ? 'components.table.truthy' : 'components.table.falsy');

  return {
    type: merged.type === 'text' ? ('text' as const) : ('icon' as const),
    value: resolvedValue,
    color: merged.color ?? fallback.color,
  };
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return dateString;
  }
}

// ─── Props ───────────────────────────────────────────────────────────────────

export interface DataTableProps {
  data: any[];
  page: TablePage;
  columns: TableColumn[];
  tableOptions?: TableOptions;
  actions?: TableAction[];
  /** Uncontrolled by default; pass + `onSelectedRowsChange` to control it */
  selectedRows?: number[];
  search?: string;
  statusTransitions?: TableStatusTransition[];
  statusFieldKey?: string;
  /** Keyed by rowId -> colKey -> value; controlled only (no internal fallback) */
  inputValues?: Record<number, Record<string, string | number>>;
  /** i18n helper – defaults to identity. Some keys are called with interpolation params. */
  t?: (key: string, params?: Record<string, any>) => string;
  additionalFilters?: ReactNode;
  headerActions?: ReactNode;
  onExecuteAction?: (payload: { action: string; rowId: number }) => void;
  onGetActions?: (rowId: number) => void;
  onChangePage?: (payload: { page: number; perPage: number }) => void;
  onViewItem?: (rowId: number) => void;
  onAddItem?: () => void;
  onSearchItem?: (input: string) => void;
  onSelectedRowsChange?: (rows: number[]) => void;
  onBulkStatusChange?: (payload: { status: string; rowIds: number[] }) => void;
  onInputValuesChange?: (values: Record<number, Record<string, string | number>>) => void;
  onCellClick?: (payload: { key: string; value: any; row: any; event: ReactMouseEvent }) => void;
}

export const DataTable = ({
  data,
  page,
  columns,
  tableOptions,
  actions,
  selectedRows: selectedRowsProp,
  search,
  statusTransitions,
  statusFieldKey = 'status',
  inputValues,
  t = (k) => k,
  additionalFilters,
  headerActions,
  onExecuteAction,
  onGetActions,
  onChangePage,
  onViewItem,
  onAddItem,
  onSearchItem,
  onSelectedRowsChange,
  onBulkStatusChange,
  onInputValuesChange,
  onCellClick,
}: DataTableProps) => {
  // Normalize table options so the render can rely on defaults even when the prop is missing/partial
  const tableOptionsResolved = useMemo<TableOptions>(
    () => ({
      rowsPerPageOptions: DEFAULT_ROWS_PER_PAGE_OPTIONS,
      selectionType: 'checkbox',
      searchable: true,
      isActionable: true,
      canAddItems: true,
      fullWidth: false,
      ...(tableOptions || {}),
    }),
    [tableOptions]
  );

  const rowsPerPageOptions = tableOptionsResolved.rowsPerPageOptions ?? DEFAULT_ROWS_PER_PAGE_OPTIONS;
  const selectionType = tableOptionsResolved.selectionType ?? 'checkbox';

  const [searchInput, setSearchInput] = useState(() => search ?? '');
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstSearchEffect = useRef(true);

  // Internal selection state; synced with the `selectedRows` prop if provided
  const [internalSelectedRows, setInternalSelectedRows] = useState<number[]>(() =>
    Array.isArray(selectedRowsProp) ? [...selectedRowsProp] : []
  );

  const setSelectedRows = useCallback(
    (val: number[]) => {
      const next = Array.isArray(val) ? [...val] : [];
      setInternalSelectedRows(next);
      onSelectedRowsChange?.(next);
    },
    [onSelectedRowsChange]
  );

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(page.current ?? 0);
  const isFirstPageEffect = useRef(true);

  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null);
  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0 });
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);

  const columnsList = useMemo(() => normalizeColumns(columns), [columns]);

  // Initialized once from the initial columns (matches the source: columns don't
  // change dynamically at runtime for a data table)
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    normalizeColumns(columns).forEach((c) => {
      initial[c.key] = c.key === 'id' ? false : (c.visibility ?? true);
    });
    return initial;
  });

  // A transition is only shown if ALL selected rows have a current status that allows it
  const availableStatusTransitions = useMemo<TableStatusTransition[]>(() => {
    if (!statusTransitions || statusTransitions.length === 0) return [];
    if (internalSelectedRows.length === 0) return [];

    const selectedRowsData = data.filter((row) => internalSelectedRows.includes(row.id));
    const currentStatuses = selectedRowsData.map((row) => row[statusFieldKey]);

    return statusTransitions.filter((transition) =>
      currentStatuses.every((currentStatus) => transition.validFromStatuses.includes(currentStatus))
    );
  }, [statusTransitions, internalSelectedRows, data, statusFieldKey]);

  const toggleColumn = (key: string) => {
    if (key === 'id') return;
    setColumnVisibility((prev) => {
      const isVisible = !!prev[key];
      const visibleCount = Object.values(prev).filter(Boolean).length;
      if (isVisible && visibleCount <= 1) return prev; // never hide the last visible data column
      return { ...prev, [key]: !isVisible };
    });
  };

  const openActionMenu = (btn: HTMLElement, rowId: number) => {
    onGetActions?.(rowId);
    const rect = btn.getBoundingClientRect();
    const menuWidth = 180; // approximate menu width

    let left = rect.right - menuWidth;
    if (left < 8) left = 8;
    if (left + menuWidth > window.innerWidth - 8) left = window.innerWidth - menuWidth - 8;

    // The menu renders with `position: fixed`, which is already viewport-relative —
    // do NOT add window.scrollX/scrollY here, that math is for `position: absolute`.
    setMenuCoords({ top: rect.top, left });
    setActionMenuOpen(rowId);
  };

  const toggleActionMenu = (event: ReactMouseEvent, rowId: number) => {
    const btn = event.currentTarget as HTMLElement;

    if (actionMenuOpen === rowId) {
      setActionMenuOpen(null);
      return;
    }

    if (actionMenuOpen !== null) {
      setActionMenuOpen(null);
      // let the close animation finish before opening the new menu
      setTimeout(() => openActionMenu(btn, rowId), 150);
    } else {
      openActionMenu(btn, rowId);
    }
  };

  const visibleDataColumnCount = useMemo(
    () => Object.values(columnVisibility).filter(Boolean).length,
    [columnVisibility]
  );

  const visibleColumnCount = useMemo(() => {
    const hasSelectionColumn = selectionType !== 'simple' ? 1 : 0;
    const hasActionsColumn = tableOptionsResolved.isActionable ? 1 : 0;
    return hasSelectionColumn + visibleDataColumnCount + hasActionsColumn;
  }, [selectionType, visibleDataColumnCount, tableOptionsResolved.isActionable]);

  // Sorts whatever page of `data` the parent handed over. The actual page-slicing
  // happens server-side (see the `page` prop) — this only sorts on top of it.
  const paginatedData = useMemo(() => {
    const sorted = [...data];
    if (sortColumn && sortDirection) {
      sorted.sort((a: any, b: any) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        let comparison = 0;
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal;
        } else {
          comparison = String(aVal).localeCompare(String(bVal));
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }
    return sorted;
  }, [data, sortColumn, sortDirection]);

  const totalPages = (page.total ?? 0) - 1;

  const allSelected =
    paginatedData.length > 0 && paginatedData.every((row: any) => internalSelectedRows.includes(row.id));

  const colorMode: 'dark' | 'light' =
    typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
  const colorUtilities = colors[colorMode];

  // ─── Selection ───────────────────────────────────────────────────────────

  const toggleAllRows = () => {
    if (selectionType === 'radio') return; // radio doesn't support select-all

    const pageIds = paginatedData.map((row: any) => row.id);
    if (allSelected) {
      setSelectedRows(internalSelectedRows.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedRows(Array.from(new Set([...internalSelectedRows, ...pageIds])));
    }
  };

  const toggleRow = (rowId: number) => {
    if (selectionType === 'simple') return;

    if (selectionType === 'radio') {
      setSelectedRows([rowId]);
      return;
    }

    const exists = internalSelectedRows.includes(rowId);
    setSelectedRows(
      exists ? internalSelectedRows.filter((id) => id !== rowId) : [...internalSelectedRows, rowId]
    );
  };

  const isRowSelected = (rowId: number): boolean => internalSelectedRows.includes(rowId);

  const clearSelection = () => setSelectedRows([]);

  // ─── Sorting & pagination ────────────────────────────────────────────────

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      // Cycle through: asc -> desc -> null (default)
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const previousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const goToFirstPage = () => setCurrentPage(0);
  const goToLastPage = () => setCurrentPage(totalPages);

  const handleRowsPerPageChange = (perPage: number) => {
    setCurrentPage(0);
    onChangePage?.({ page: 0, perPage });
  };

  // ─── Actions & bulk status ───────────────────────────────────────────────

  const handleAction = (action: string, rowId: number) => {
    onExecuteAction?.({ action, rowId });
    setActionMenuOpen(null);
  };

  const handleAdd = () => onAddItem?.();

  const handleBulkStatusChange = (status: string) => {
    onBulkStatusChange?.({ status, rowIds: internalSelectedRows });
  };

  // ─── Input-column values (fully controlled by the parent; no internal fallback) ──

  const getInputValue = (rowId: number, colKey: string, rowValue?: string | number | null): string | number => {
    const stored = inputValues?.[rowId]?.[colKey];
    if (stored !== undefined) return stored;
    return rowValue ?? '';
  };

  const setInputValue = (rowId: number, colKey: string, rawValue: string | number | null) => {
    const col = columnsList.find((c) => c.key === colKey);
    const strVal = rawValue == null ? '' : String(rawValue);
    const value: string | number =
      col?.inputConfig?.inputType === 'number' && strVal !== '' ? Number(strVal) : strVal;

    const current = inputValues ?? {};
    onInputValuesChange?.({
      ...current,
      [rowId]: { ...(current[rowId] ?? {}), [colKey]: value },
    });
  };

  const isInputDisabled = (col: TableColumn, row: any): boolean => {
    if (col.inputConfig?.disabled === undefined) return false;
    if (typeof col.inputConfig.disabled === 'function') return col.inputConfig.disabled(row);
    return !!col.inputConfig.disabled;
  };

  const isButtonDisabled = (col: TableColumn, row: any): boolean => {
    if (col.buttonConfig?.disabled === undefined) return false;
    if (typeof col.buttonConfig.disabled === 'function') return col.buttonConfig.disabled(row);
    return !!col.buttonConfig.disabled;
  };

  const getButtonCellLabel = (col: TableColumn): string => col.buttonConfig?.label ?? col.label ?? col.key;

  const handleButtonCellClick = (event: ReactMouseEvent, col: TableColumn, row: any) => {
    onCellClick?.({ key: col.key, value: row[col.key], row, event });
  };

  // ─── Cell rendering ──────────────────────────────────────────────────────

  const renderCell = (col: TableColumn, row: any): ReactNode => {
    const rawValue = row[col.key];

    if ((rawValue == null || rawValue === '') && col.type !== 'input' && col.type !== 'button') {
      return <span className="data-table__no-data">{t('components.table.no_data')}</span>;
    }

    if (col.type === 'boolean') {
      const resolved = resolveBooleanState(rawValue, col);
      return (
        <span className="data-table__boolean">
          {resolved.type === 'icon' ? (
            <Icon
              iconName={resolved.value as IconsTypes}
              color={resolved.color}
              className="data-table__boolean-icon"
            />
          ) : (
            <span style={{ color: colorUtilities[resolved.color] }}>{t(resolved.value as string)}</span>
          )}
        </span>
      );
    }

    if (col.type === 'enum' && col.enumStates) {
      const match = col.enumStates.find((s) => s.value === rawValue);
      return (
        <Badge variant={match?.color as BadgeVariant | undefined}>
          {t(String(match?.label ?? rawValue))}
        </Badge>
      );
    }

    if (col.type === 'date') {
      return formatDate(rawValue);
    }

    if (col.type === 'input') {
      return (
        // Stop row-level events so clicking/typing inside the input doesn't
        // trigger row selection or the dblclick "view" navigation
        <div
          className="data-table__cell-input-wrapper"
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            style={{ margin: 0 }}
            type={col.inputConfig?.inputType ?? 'text'}
            placeholder={col.inputConfig?.placeholder}
            min={col.inputConfig?.min}
            max={col.inputConfig?.max}
            disabled={isInputDisabled(col, row)}
            autoComplete="off"
            value={String(getInputValue(row.id, col.key, rawValue))}
            onChange={(val) => setInputValue(row.id, col.key, val)}
          />
        </div>
      );
    }

    if (col.type === 'button') {
      const isIconOnly = !!col.buttonConfig?.icon && !(col.buttonConfig?.label ?? '').trim();
      return (
        <div
          className="data-table__cell-button-wrapper"
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
        >
          {isIconOnly ? (
            <IconButton
              iconName={col.buttonConfig?.icon}
              disabled={isButtonDisabled(col, row)}
              aria-label={t(getButtonCellLabel(col))}
              onClick={(e) => handleButtonCellClick(e, col, row)}
            />
          ) : (
            <Button
              leftIcon={col.buttonConfig?.icon}
              mode={col.buttonConfig?.mode ?? 'text'}
              disabled={isButtonDisabled(col, row)}
              onClick={(e) => handleButtonCellClick(e, col, row)}
            >
              {t(getButtonCellLabel(col))}
            </Button>
          )}
        </div>
      );
    }

    return (
      <span
        onClick={(e) => {
          e.stopPropagation();
          onCellClick?.({ key: col.key, value: rawValue, row, event: e });
        }}
      >
        {rawValue}
      </span>
    );
  };

  // ─── Outside click / visibility / scroll handling ───────────────────────

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target.closest('.data-table__action-menu') && !target.closest('.data-table__dropdown-menu')) {
        setActionMenuOpen(null);
      }
      if (!target.closest('.data-table__columns') && !target.closest('.data-table__dropdown-menu')) {
        setShowColumnsMenu(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setShowColumnsMenu(false);
        setActionMenuOpen(null);
      }
    };

    const handleWindowBlur = () => {
      setShowColumnsMenu(false);
      setActionMenuOpen(null);
    };

    const handleScroll = () => setActionMenuOpen(null);

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  useEffect(
    () => () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    },
    []
  );

  // Sync currentPage from the parent-controlled page prop
  useEffect(() => {
    setCurrentPage(page.current ?? 0);
  }, [page.current]);

  // Notify the parent when currentPage changes locally — skips the initial mount so
  // mounting the table doesn't immediately fire a spurious changePage callback
  useEffect(() => {
    if (isFirstPageEffect.current) {
      isFirstPageEffect.current = false;
      return;
    }
    if (currentPage !== page.current) {
      onChangePage?.({ page: currentPage, perPage: page.perPage ?? rowsPerPageOptions[0] });
    }
  }, [currentPage]);

  // Sync internal selection when the parent-controlled selectedRows prop changes
  useEffect(() => {
    setInternalSelectedRows(Array.isArray(selectedRowsProp) ? [...selectedRowsProp] : []);
  }, [selectedRowsProp]);

  // Sync searchInput when the parent updates the search prop
  useEffect(() => {
    setSearchInput(search ?? '');
  }, [search]);

  // Emit a debounced search event when the input changes — skips the initial mount
  useEffect(() => {
    if (isFirstSearchEffect.current) {
      isFirstSearchEffect.current = false;
      return;
    }
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      onSearchItem?.(searchInput.trim());
    }, 300);
  }, [searchInput]);

  // ─── Render ──────────────────────────────────────────────────────────────

  const wrapperClasses = ['data-table', tableOptionsResolved.fullWidth ? 'data-table--full-width' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses}>
      <div className="data-table__header">
        <div className="data-table__filters">
          {additionalFilters}
          {tableOptionsResolved.searchable && (
            <Input
              className="data-table__search"
              type="search"
              placeholder={t('components.table.search_placeholder')}
              value={searchInput}
              onChange={setSearchInput}
            />
          )}
          <div className="data-table__columns">
            <Button
              className="data-table__button"
              mode="secondary"
              onClick={() => setShowColumnsMenu((prev) => !prev)}
            >
              <Icon iconName="Columns3" color="foreground" size="1.3rem" />
            </Button>
            {showColumnsMenu && (
              <div className="data-table__dropdown-menu">
                <div className="data-table__dropdown-content">
                  {columnsList
                    .filter((c) => c.key !== 'id')
                    .map((col) => (
                      <label
                        key={col.key}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}
                      >
                        <input
                          type="checkbox"
                          checked={!!columnVisibility[col.key]}
                          disabled={!!columnVisibility[col.key] && visibleDataColumnCount <= 1}
                          onChange={() => toggleColumn(col.key)}
                        />
                        <span style={{ textTransform: 'capitalize' }}>{t(col.label ?? col.key)}</span>
                      </label>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="data-table__header-actions">
          {headerActions}
          {tableOptionsResolved.canAddItems && (
            <Button leftIcon="CirclePlus" mode="main" onClick={handleAdd}>
              {t('components.table.add')}
            </Button>
          )}
        </div>
      </div>

      {/* Teleported action menu (renders at body level so it always appears on top) */}
      {actionMenuOpen !== null &&
        createPortal(
          <div
            className="data-table__dropdown-menu"
            style={{ position: 'fixed', top: menuCoords.top, left: menuCoords.left }}
          >
            {!actions || actions.length === 0 ? (
              <div className="data-table__dropdown-item data-table__dropdown-item--empty">
                <span className="data-table__no-data">{t('components.table.actions_empty')}</span>
              </div>
            ) : (
              actions.map((action) => (
                <div
                  key={action.value}
                  className="data-table__dropdown-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    action.call?.();
                    handleAction(action.value, actionMenuOpen!);
                  }}
                >
                  <Button
                    mode="text"
                    leftIcon={action.icon}
                    iconColor={action.mode === 'danger' ? 'destructive' : undefined}
                  >
                    <span className={action.mode === 'danger' ? 'data-table__dropdown-item-label--danger' : undefined}>
                      {t(action.label)}
                    </span>
                  </Button>
                </div>
              ))
            )}
          </div>,
          document.body
        )}

      <div className="data-table__content">
        <div className="data-table__table-wrapper">
          <table className="data-table__table">
            <thead className="data-table__thead">
              <tr className="data-table__row data-table__row--header">
                {selectionType !== 'simple' && (
                  <th className="data-table__th data-table__th--checkbox">
                    {selectionType === 'checkbox' ? (
                      <input
                        type="checkbox"
                        className="data-table__checkbox"
                        checked={allSelected}
                        onChange={toggleAllRows}
                      />
                    ) : (
                      <div style={{ width: 20 }} />
                    )}
                  </th>
                )}
                {columnsList.map(
                  (col) =>
                    columnVisibility[col.key] && (
                      <th
                        key={col.key}
                        className={['data-table__th', col.sortable ? 'data-table__th--sortable' : '']
                          .filter(Boolean)
                          .join(' ')}
                        style={{
                          minWidth: col.minWidth
                            ? typeof col.minWidth === 'number'
                              ? `${col.minWidth}px`
                              : col.minWidth
                            : undefined,
                          textAlign: col.align ?? 'left',
                        }}
                        onClick={() => col.sortable && handleSort(col.key)}
                      >
                        <div className="data-table__th-content">
                          <span>{t(col.label ?? col.key)}</span>
                          {col.sortable && (
                            <svg
                              className={[
                                'data-table__sort-icon',
                                sortColumn === col.key ? 'data-table__sort-icon--active' : '',
                                sortColumn === col.key && sortDirection === 'desc'
                                  ? 'data-table__sort-icon--desc'
                                  : '',
                              ]
                                .filter(Boolean)
                                .join(' ')}
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M7 10l5 5 5-5z" />
                            </svg>
                          )}
                        </div>
                      </th>
                    )
                )}
                {tableOptionsResolved.isActionable && (
                  <th className="data-table__th data-table__th--actions" />
                )}
              </tr>
            </thead>
            <tbody className="data-table__tbody">
              {paginatedData.map((row: any) => (
                <tr
                  key={row.id}
                  className="data-table__row"
                  onDoubleClick={() => onViewItem?.(row.id)}
                >
                  {selectionType !== 'simple' && (
                    <td className="data-table__td data-table__td--checkbox">
                      <input
                        type={selectionType === 'radio' ? 'radio' : 'checkbox'}
                        className="data-table__checkbox"
                        name={selectionType === 'radio' ? 'row-selection' : undefined}
                        checked={isRowSelected(row.id)}
                        onChange={() => toggleRow(row.id)}
                      />
                    </td>
                  )}
                  {columnsList.map(
                    (col) =>
                      columnVisibility[col.key] && (
                        <td key={col.key} className="data-table__td" style={{ textAlign: col.align ?? 'left' }}>
                          {renderCell(col, row)}
                        </td>
                      )
                  )}
                  {tableOptionsResolved.isActionable && (
                    <td className="data-table__td data-table__td--actions">
                      <div className="data-table__action-menu" onClick={(e) => toggleActionMenu(e, row.id)}>
                        <Icon iconName="Ellipsis" color="foreground" />
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr className="data-table__row">
                  <td colSpan={visibleColumnCount} className="data-table__td data-table__td--empty">
                    {t('components.table.no_data')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {paginatedData.length > 0 && !tableOptionsResolved.hidePagination && (
          <div className="data-table__pagination">
            {internalSelectedRows.length > 0 && selectionType === 'checkbox' && (
              <div className="data-table__selection-bar">
                <div className="data-table__selection-count">
                  {internalSelectedRows.length} {t('components.table.selected')}
                </div>

                <div className="data-table__selection-actions-wrapper">
                  <div className="data-table__selection-actions">
                    {availableStatusTransitions.map((status) => (
                      <button
                        key={status.value}
                        type="button"
                        className={`data-table__status-button data-table__status-button--${status.mode || 'default'}`}
                        onClick={() => handleBulkStatusChange(status.value)}
                      >
                        {status.icon && <Icon iconName={status.icon} size="1rem" />}
                        {t(status.label)}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="data-table__selection-clear"
                  onClick={clearSelection}
                  aria-label={t('components.table.clear_selection')}
                >
                  <Icon iconName="Close" size="0.8rem" />
                </button>
              </div>
            )}

            {selectionType === 'checkbox' && (
              <div className="data-table__pagination-info">
                {t('components.table.selection_info', {
                  selected: internalSelectedRows.length,
                  total: (page.total ?? 0) * (page.perPage ?? 0),
                })}
              </div>
            )}

            <div className="data-table__pagination-controls">
              <div className="data-table__pagination-rows">
                <label htmlFor="rows-per-page" className="data-table__pagination-label">
                  {t('components.table.rows_per_page')}
                </label>
                <select
                  id="rows-per-page"
                  className="data-table__pagination-select"
                  value={page.perPage ?? rowsPerPageOptions[0]}
                  onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                >
                  {rowsPerPageOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="data-table__pagination-page">
                {t('components.table.page_info', { current: currentPage + 1, total: totalPages + 1 })}
              </div>

              <div className="data-table__pagination-buttons">
                <button
                  type="button"
                  className="data-table__pagination-button"
                  onClick={goToFirstPage}
                  disabled={currentPage === 0}
                >
                  <Icon iconName="ChevronsLeft" color="foreground" size="0.8rem" />
                </button>
                <button
                  type="button"
                  className="data-table__pagination-button"
                  onClick={previousPage}
                  disabled={currentPage === 0}
                >
                  <Icon iconName="ChevronLeft" color="foreground" size="1rem" />
                </button>
                <button
                  type="button"
                  className="data-table__pagination-button"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  <Icon iconName="ChevronRight" color="foreground" size="1rem" />
                </button>
                <button
                  type="button"
                  className="data-table__pagination-button"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                >
                  <Icon iconName="ChevronsRight" color="foreground" size="1rem" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
