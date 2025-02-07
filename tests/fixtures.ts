import { test as base } from '@playwright/test'
import { ShopPage } from '../pages/shop-page'

type MyFixtures = {
  shopPage: ShopPage
}

export const test = base.extend<MyFixtures>({
  shopPage: async ({ page }, use) => {
    const shopPage = new ShopPage(page)
    await use(shopPage)
  }
})

export { expect } from '@playwright/test'
