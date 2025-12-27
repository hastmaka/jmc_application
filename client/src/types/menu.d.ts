import type {ReactNode} from "react";
import type {MenuItemProps} from './menu-item'

/**
 * EzMenu Props
 *
 * Two modes:
 * - Local: Pass `ITEMS` array directly
 * - Remote: Pass `url` to fetch from API
 *
 * @example Local mode
 * ```tsx
 * <EzMenu
 *   ITEMS={[{label: 'Edit', onClick: handleEdit}, {label: 'Delete'}]}
 *   target={<IconDots />}
 *   onItemClick={(item) => console.log(item.label)}
 * />
 * ```
 *
 * @example Remote mode
 * ```tsx
 * <EzMenu
 *   url="v1/asset/status"
 *   iterator={{label: 'status_name', value: 'status_id'}}
 *   target={<Button>Select Status</Button>}
 *   custom
 *   onItemClick={(item) => handleSelect(item.value)}
 * />
 * ```
 */
export type MenuProps = {
    /**
     * Array of menu items for local mode.
     * Either ITEMS or url is required.
     */
    ITEMS?: MenuItemProps[],

    /**
     * The trigger element that opens the menu.
     * Can be an icon, button, or any ReactNode.
     */
    target?: ReactNode,

    /**
     * Callback fired when any menu item is clicked.
     * Receives the full item object: {label, value, ...}
     */
    onItemClick?: (item: any) => void,

    /**
     * Size of the EzActionIcon wrapper.
     * Only applies when `custom` is false.
     */
    size?: number,

    /**
     * Tooltip text shown on hover of the target.
     * Wraps target in EzActionIcon.Tooltip.
     */
    tooltip?: string,

    /**
     * API endpoint to fetch menu items from (remote mode).
     * Either ITEMS or url is required.
     * @example 'v1/asset/service_type'
     */
    url?: string,

    /**
     * If true, renders target as-is without EzActionIcon wrapper.
     * Use when target is already a styled component (e.g., Button).
     * @default false
     */
    custom?: boolean,

    /**
     * Maps API response fields to label/value for remote mode.
     * Defaults to {label: 'asset_option_name', value: 'asset_option_id'}
     * @example {label: 'car_name', value: 'car_id'}
     */
    iterator?: Record<string, string>,

    /**
     * If true, always fetches fresh data from URL.
     * If false, uses cached data from AppController.stores.
     * Call AppController.invalidateStore(url) to clear cache after CRUD operations.
     * @default false
     */
    alwaysFetch?: boolean,

    /**
     * Additional Mantine Menu props (trigger, position, offset, etc.)
     * @see https://mantine.dev/core/menu/
     */
    [key: string]: any
}