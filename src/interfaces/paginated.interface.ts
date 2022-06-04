export interface Paginated<T> {
  items: T[];
  page: number;
  total_pages: number;
  per_page: number;
  total_items_count: number;
}
