import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { Input, type InputHandle } from '../Input/Input';
import type { IconsTypes } from '../../constants/icons';
import type { TypeInputMessage } from '../../constants/input-component';
import type { TypeDropdownOptionItem } from '../../constants/dropdown-component';
import './Dropdown.css';

export interface DropdownLoadMorePayload {
  query: string;
}

export interface DropdownProps {
  leftIcon?: IconsTypes;
  label?: ReactNode;
  message?: TypeInputMessage;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  title?: string;
  /** Single value, or an array of values when `multiselect` is set */
  value: any;
  options: TypeDropdownOptionItem[];
  multiselect?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  infiniteScroll?: boolean;
  loading?: boolean;
  hasMore?: boolean;
  searchDebounceMs?: number;
  className?: string;
  style?: CSSProperties;
  /** Fires whenever the selection changes */
  onChange?: (value: any) => void;
  /**
   * Local-first search: typing filters the currently loaded `options` in memory.
   * This only fires (debounced by `searchDebounceMs`) when that local filter comes
   * up empty, so you can fall back to a remote fetch. Only relevant when `searchable`.
   */
  onSearchQuery?: (query: string) => void;
  /** Fires when scrolled near the bottom, and once on a closed -> open transition. Only when `infiniteScroll` is set. */
  onLoadMore?: (payload: DropdownLoadMorePayload) => void;
}

export const Dropdown = ({
  leftIcon,
  label,
  message,
  required = false,
  placeholder,
  disabled = false,
  title,
  value,
  options,
  multiselect = false,
  searchable = false,
  clearable = false,
  infiniteScroll = false,
  loading = false,
  hasMore = true,
  searchDebounceMs = 300,
  className = '',
  style,
  onChange,
  onSearchQuery,
  onLoadMore,
}: DropdownProps) => {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<InputHandle>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const clearSearchDebounce = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => clearSearchDebounce, [clearSearchDebounce]);

  const emitSearchQueryDebounced = useCallback(
    (query: string) => {
      if (!searchable) return;
      clearSearchDebounce();
      debounceTimeoutRef.current = setTimeout(() => {
        onSearchQuery?.(query.trim());
      }, searchDebounceMs);
    },
    [searchable, searchDebounceMs, onSearchQuery, clearSearchDebounce]
  );

  const resetSearchState = useCallback(() => {
    const hadQuery = searchValue.trim().length > 0;
    clearSearchDebounce();
    setSearchValue('');
    if (searchable && hadQuery) {
      onSearchQuery?.('');
    }
  }, [searchValue, searchable, onSearchQuery, clearSearchDebounce]);

  // Opening always refocuses the search field (so re-selecting options in multiselect
  // mode keeps the cursor there). Fetching page one only fires on a genuine closed ->
  // open transition, so re-selecting or re-clicking an already-open list doesn't
  // re-trigger a remote fetch.
  const setOpenState = useCallback(
    (next: boolean) => {
      if (disabled) return;
      setOpen((prevOpen) => {
        if (next) {
          window.setTimeout(() => searchInputRef.current?.focus(), 0);
          if (infiniteScroll && !prevOpen) {
            onLoadMore?.({ query: searchValue.trim() });
          }
        }
        return next;
      });
    },
    [disabled, infiniteScroll, onLoadMore, searchValue]
  );

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenState(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [setOpenState]);

  const getOptionLabelByValue = (val: any) =>
    options?.find((option) => option.value === val)?.label ?? '';

  const displayValue = useMemo(() => {
    if (searchable && open) return searchValue;

    if (multiselect) {
      const matched = (options || []).filter(
        (option) => Array.isArray(value) && value.includes(option.value)
      );
      return matched.map((option) => option.label).join(', ');
    }

    return getOptionLabelByValue(value);
  }, [searchable, open, searchValue, multiselect, options, value]);

  const hasValue = multiselect
    ? Array.isArray(value) && value.length > 0
    : value !== null && value !== undefined && value !== '';

  const showClearIcon = clearable && !disabled && hasValue;

  const rightIcon: IconsTypes = showClearIcon ? 'Close' : open ? 'ChevronUp' : 'ChevronDown';

  // Always filters the currently loaded options in memory first. When `searchable` is
  // off the field is read-only, so `searchValue` never changes and this is a no-op.
  // When a remote fallback (see `onSearchQuery`) replaces `options` with server
  // results, this re-applies harmlessly since those results already match the query.
  const filteredOptions = useMemo(() => {
    if (!options) return [];
    const query = searchValue.trim().toLowerCase();
    if (!query) return options;
    return options.filter((option) => option.label.toLowerCase().includes(query));
  }, [options, searchValue]);

  const isSelectedOption = (val: TypeDropdownOptionItem['value']) =>
    multiselect ? Array.isArray(value) && value.includes(val) : value === val;

  const clearValue = () => {
    if (disabled) return;
    onChange?.(multiselect ? [] : null);
    resetSearchState();
    setOpenState(false);
  };

  const handleAreaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenState(!open);
  };

  const handleRightIconClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Without this, the click bubbles up into the search area's own onClick
    // right after, which would immediately re-toggle the state we just set here.
    e.stopPropagation();

    if (showClearIcon) {
      clearValue();
      return;
    }
    setOpenState(!open);
  };

  const handleSearchInputChange = (val: string) => {
    if (!searchable || !open) return;
    setSearchValue(val);

    const query = val.trim().toLowerCase();
    const hasLocalMatch =
      query === '' || (options || []).some((option) => option.label.toLowerCase().includes(query));

    if (hasLocalMatch) {
      // Local results already satisfy the query — no need to hit the network.
      clearSearchDebounce();
    } else {
      emitSearchQueryDebounced(val);
    }
  };

  const handleSearchFocusChange = (focused: boolean) => {
    if (focused) setOpenState(true);
  };

  const handleOptionSelect = (optionValue: any) => {
    if (disabled) return;

    let nextValue: any;
    if (multiselect) {
      const current = Array.isArray(value) ? value : [];
      nextValue = current.includes(optionValue)
        ? current.filter((v: any) => v !== optionValue)
        : [...current, optionValue];
    } else {
      nextValue = optionValue;
    }

    onChange?.(nextValue);
    if (!searchable) setSearchValue('');
    setOpenState(multiselect);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      setOpenState(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    if (!infiniteScroll || !hasMore || loading) return;

    const target = e.currentTarget;
    const scrollThreshold = 50;
    const isNearBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight < scrollThreshold;

    if (isNearBottom) {
      onLoadMore?.({ query: searchValue.trim() });
    }
  };

  const wrapperClasses = ['custom-dropdown__component', open ? 'focused' : '', className]
    .filter(Boolean)
    .join(' ');

  const searchAreaClasses = [
    'dropdown-search__area',
    searchable ? 'searchable' : '',
    showClearIcon ? 'has-clear-icon' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={containerRef}
      id={id}
      className={wrapperClasses}
      style={style}
      onKeyDown={handleKeyDown}
    >
      <div className={searchAreaClasses} onClick={handleAreaClick}>
        <Input
          ref={searchInputRef}
          type="text"
          readOnly={!searchable}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          label={label}
          message={message}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          title={title}
          value={displayValue}
          onChange={handleSearchInputChange}
          onRightIconClick={handleRightIconClick}
          onFocusChange={handleSearchFocusChange}
        />
      </div>

      {open && (
        <div className="dropdown-options__area">
          <ul onScroll={handleScroll}>
            {filteredOptions.map((option) => {
              const optionId = `${id}-opt-${option.value}`;
              return (
                <li
                  key={option.value}
                  className={isSelectedOption(option.value) ? 'selected-option' : ''}
                >
                  <input
                    type={multiselect ? 'checkbox' : 'radio'}
                    id={optionId}
                    checked={isSelectedOption(option.value)}
                    onChange={() => handleOptionSelect(option.value)}
                  />
                  <label htmlFor={optionId}>{option.label}</label>
                </li>
              );
            })}

            {!loading && filteredOptions.length === 0 && (
              <li className="loading-indicator">
                <span>No options</span>
              </li>
            )}

            {infiniteScroll && loading && (
              <li className="loading-indicator">
                <span>Loading...</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
