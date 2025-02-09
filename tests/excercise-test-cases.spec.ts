import { expect, test } from './fixtures'

type ShopConfig = {
  name: string
  baseUrl: string
  productSKU: string
  shopButtonLocator: string
  emptyCartMessageContainer: string
}

const shops: ShopConfig[] = [
  {
    name: 'Ploom UK',
    baseUrl: 'https://www.ploom.co.uk/en',
    productSKU: 'PLOOM-X-FRONT-PANEL',
    shopButtonLocator: 'text=Shop',
    emptyCartMessageContainer: 'You have no items in your'
  },
  {
    name: 'Ploom Poland',
    baseUrl: 'https://www.ploom.pl/pl',
    productSKU: '16155629',
    shopButtonLocator: 'text=Sklep',
    emptyCartMessageContainer:
      'W tym momencie Twój koszyk jest pusty.Minimalna kwota dla zamówienia to 0,01 zł'
  }
]

for (const shop of shops) {
  test.describe(`${shop.name} shop`, () => {
    test(`Test Case 1: Verify it is possible to add a product to the cart`, async ({
      shopPage
    }) => {
      await shopPage.addingProductToCart(shop.baseUrl, shop.shopButtonLocator, shop.productSKU)
    })

    test(`Test Case 2: Verify if it is possible to remove a product from the cart.`, async ({
      shopPage,
      page
    }) => {
      await test.step('Precondition - add a product to the cart', async () => {
        // Should be done by API request to add item to the cart in real project
        await shopPage.addingProductToCart(shop.baseUrl, shop.shopButtonLocator, shop.productSKU)
      })

      await shopPage.navigateToUrl(shop.baseUrl)

      await test.step('Open the cart', async () => {
        await shopPage.cartHeaderButton.click()
        await shopPage.checkoutButton.click()
      })

      await test.step('Remove the product from the cart', async () => {
        await shopPage.removeItemButton.click()
        await shopPage.confirmRemoveItemButton.click()
      })

      await test.step('Verify the cart is empty', async () => {
        await expect(page.getByText(shop.emptyCartMessageContainer)).toBeVisible()
      })
    })

    test(`Test Case 3: Verify no broken links/images on product page - ${shop.name}`, async ({
      shopPage
    }) => {
      await shopPage.navigateToUrl(shop.baseUrl)
      await shopPage.clickOnElement(shop.shopButtonLocator)

      await shopPage.openProductBySKU(shop.productSKU)

      await shopPage.validateLinksOnPage()
      await shopPage.verifyImagesReturnValidStatus()
    })
  })
}
