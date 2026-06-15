import {
  catalogLevels,
  defaultCatalogSort,
  sortOptions,
  type CatalogLevel,
  type CatalogSort
} from './catalogFilters'
import { catalogAllCategory } from './types'
import type { CatalogCategory } from './types'

export type CatalogQueryState = {
  category: CatalogCategory
  level: CatalogLevel
  search: string
  sort: CatalogSort
}

export function normalizeCatalogCategory(
  value?: string,
  catalogCategories: CatalogCategory[] = [catalogAllCategory]
): CatalogCategory {
  if (!value) {
    return catalogAllCategory
  }

  return catalogCategories.find((item) => item.toLowerCase() === value.toLowerCase()) ?? catalogAllCategory
}

export function normalizeCatalogLevel(value?: string): CatalogLevel {
  if (!value) {
    return catalogAllCategory
  }

  return catalogLevels.find((item) => item.toLowerCase() === value.toLowerCase()) ?? catalogAllCategory
}

export function normalizeCatalogSort(value?: string): CatalogSort {
  if (!value) {
    return defaultCatalogSort
  }

  return sortOptions.find((item) => item.value === value)?.value ?? defaultCatalogSort
}

export function buildCatalogPath(filters: CatalogQueryState): string {
  const params = new URLSearchParams()
  const search = filters.search.trim()

  if (search) {
    params.set('q', search)
  }

  if (filters.category !== catalogAllCategory) {
    params.set('category', filters.category)
  }

  if (filters.level !== catalogAllCategory) {
    params.set('level', filters.level)
  }

  if (filters.sort !== defaultCatalogSort) {
    params.set('sort', filters.sort)
  }

  const query = params.toString()

  return query ? `/catalog?${query}` : '/catalog'
}
